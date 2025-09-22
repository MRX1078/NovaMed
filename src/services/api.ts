import { 
  PatientCreateIn, 
  PatientOut, 
  VisitCreateIn, 
  VisitOut, 
  AnamnesisIn, 
  ExamResultOut, 
  PredictionsOut 
} from '../types/api';
import { mockApiService } from './mockApi';

// 1. Указываем полный URL вашего API
const API_BASE = 'https://176.109.105.255.sslip.io/api'; 

// 2. Отключаем моки, чтобы использовать реальный API
const USE_MOCK_API = false;

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    
    // Для отладки можно выводить в консоль, какой запрос выполняется
    console.log(`Requesting: ${options.method || 'GET'} ${url}`);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      // Попробуем получить текст ошибки от сервера для лучшей диагностики
      const errorBody = await response.text();
      console.error('API Error Response:', errorBody);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Patients
  async createPatient(data: PatientCreateIn): Promise<PatientOut> {
    if (USE_MOCK_API) {
      return mockApiService.createPatient(data);
    }
    return this.request('/v1/clinical/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPatient(patientId: number): Promise<PatientOut> {
    if (USE_MOCK_API) {
      return mockApiService.getPatient(patientId);
    }
    return this.request(`/v1/clinical/patients/${patientId}`);
  }

  // Visits
  async createVisit(data: VisitCreateIn): Promise<{ visit_id: number }> {
    if (USE_MOCK_API) {
      return mockApiService.createVisit(data);
    }
    return this.request('/v1/clinical/visits', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async listVisits(params?: {
    limit?: number;
    offset?: number;
    patient_id?: number;
  }): Promise<VisitOut[]> {
    if (USE_MOCK_API) {
      return mockApiService.listVisits(params);
    }
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    if (params?.patient_id) searchParams.set('patient_id', params.patient_id.toString());
    
    return this.request(`/v1/clinical/visits?${searchParams.toString()}`);
  }

  async getVisit(visitId: number): Promise<VisitOut> {
    if (USE_MOCK_API) {
      return mockApiService.getVisit(visitId);
    }
    return this.request(`/v1/clinical/visits/${visitId}`);
  }

  // Anamnesis
  async uploadAnamnesis(visitId: number, data: AnamnesisIn): Promise<{ anamnesis_id: number }> {
    if (USE_MOCK_API) {
      return mockApiService.uploadAnamnesis(visitId, data);
    }
    return this.request(`/v1/clinical/visits/${visitId}/anamnesis`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAnamnesis(visitId: number): Promise<AnamnesisIn> {
    if (USE_MOCK_API) {
      return mockApiService.getAnamnesis(visitId);
    }
    return this.request(`/v1/clinical/visits/${visitId}/anamnesis`);
  }

  // Examinations
  async uploadExamination(
    visitId: number,
    examinationName: string,
    file: File,
    resultText?: string,
    resultData?: string
  ): Promise<{ s3_path: string; visit_examination_id: number }> {
    if (USE_MOCK_API) {
      return mockApiService.uploadExamination(visitId, examinationName, file, resultText, resultData);
    }
    
    const formData = new FormData();
    formData.append('examination_name', examinationName);
    formData.append('file', file);
    if (resultText) formData.append('result_text', resultText);
    if (resultData) formData.append('result_data', resultData);

    const url = `${API_BASE}/v1/clinical/visits/${visitId}/examinations`;
    console.log(`Requesting: POST ${url}`);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      // 'Content-Type' не указываем, браузер сам установит правильный с boundary для multipart/form-data
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('API Error Response:', errorBody);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async listExaminations(visitId: number): Promise<ExamResultOut[]> {
    if (USE_MOCK_API) {
      return mockApiService.listExaminations(visitId);
    }
    return this.request(`/v1/clinical/visits/${visitId}/examinations`);
  }

  // Predictions
  async predict(visitId: number): Promise<PredictionsOut> {
    if (USE_MOCK_API) {
      return mockApiService.predict(visitId);
    }
    return this.request(`/v1/clinical/visits/${visitId}/predict`, {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();
