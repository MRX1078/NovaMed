import { 
  PatientCreateIn, 
  PatientOut, 
  VisitCreateIn, 
  VisitOut, 
  AnamnesisIn, 
  ExamResultOut, 
  PredictionsOut 
} from '../types/api';

// Mock data storage
let mockPatients: PatientOut[] = [
  {
    id: 1,
    date_of_birth: '1985-03-15',
    recorded_age: 39,
    sex: 'male',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    date_of_birth: '1992-07-22',
    recorded_age: 32,
    sex: 'female',
    created_at: '2024-01-16T14:20:00Z'
  },
  {
    id: 3,
    date_of_birth: '1978-11-08',
    recorded_age: 46,
    sex: 'male',
    created_at: '2024-01-17T09:15:00Z'
  },
  {
    id: 4,
    date_of_birth: '1995-05-30',
    recorded_age: 29,
    sex: 'female',
    created_at: '2024-01-18T16:45:00Z'
  }
];

let mockVisits: VisitOut[] = [
  {
    id: 1,
    patient_id: 1,
    doctor_id: 'dr_001',
    status: 'completed',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    patient_id: 2,
    doctor_id: 'dr_002',
    status: 'in_progress',
    created_at: '2024-01-16T14:20:00Z'
  },
  {
    id: 3,
    patient_id: 3,
    doctor_id: 'dr_001',
    status: 'pending',
    created_at: '2024-01-17T09:15:00Z'
  },
  {
    id: 4,
    patient_id: 4,
    doctor_id: 'dr_003',
    status: 'in_progress',
    created_at: '2024-01-18T16:45:00Z'
  },
  {
    id: 5,
    patient_id: 1,
    doctor_id: 'dr_002',
    status: 'completed',
    created_at: '2024-01-20T11:00:00Z'
  }
];

let mockAnamnesis: Map<number, AnamnesisIn> = new Map([
  [1, {
    general: { age: 39, sex: 'male' },
    genetic: { 
      has_family_history: true, 
      details: 'Семейная история сердечно-сосудистых заболеваний у отца' 
    },
    lifestyle: {
      smoking: { yes: true, years: 15 },
      alcohol: 'Умеренное употребление',
      activity: 'Низкая физическая активность',
      diet: ['Высокое содержание жиров', 'Недостаток овощей']
    },
    past_conditions: ['Гипертония', 'Повышенный холестерин'],
    surgeries_traumas: ['Аппендэктомия в 2010'],
    medications: ['Лизиноприл 10мг', 'Аторвастатин 20мг'],
    allergies: ['Пенициллин'],
    complaints: ['Боли в груди при физической нагрузке', 'Одышка', 'Усталость']
  }],
  [2, {
    general: { age: 32, sex: 'female' },
    genetic: { 
      has_family_history: false, 
      details: '' 
    },
    lifestyle: {
      smoking: { yes: false, years: 0 },
      alcohol: 'Не употребляет',
      activity: 'Регулярные занятия спортом',
      diet: ['Сбалансированное питание']
    },
    past_conditions: [],
    surgeries_traumas: [],
    medications: [],
    allergies: [],
    complaints: ['Головные боли', 'Нарушения сна', 'Повышенная тревожность']
  }]
]);

let mockExaminations: Map<number, ExamResultOut[]> = new Map([
  [1, [
    {
      id: 1,
      examination_name: 'ЭКГ',
      s3_path: '/mock/ecg_patient_1.pdf',
      result_text: 'Синусовый ритм, признаки гипертрофии левого желудочка',
      result_data: { heart_rate: 78, rhythm: 'sinus', abnormalities: ['LVH'] },
      created_at: '2024-01-15T11:00:00Z'
    },
    {
      id: 2,
      examination_name: 'Анализ крови',
      s3_path: '/mock/blood_test_patient_1.pdf',
      result_text: 'Повышенный уровень холестерина, нормальный уровень глюкозы',
      result_data: { cholesterol: 6.2, glucose: 5.1, hemoglobin: 145 },
      created_at: '2024-01-15T11:30:00Z'
    }
  ]],
  [2, [
    {
      id: 3,
      examination_name: 'МРТ головного мозга',
      s3_path: '/mock/mri_brain_patient_2.dcm',
      result_text: 'Структурных изменений не выявлено',
      result_data: { findings: 'normal', contrast: false },
      created_at: '2024-01-16T15:00:00Z'
    }
  ]]
]);

// Mock predictions
const mockPredictions: Map<number, PredictionsOut> = new Map([
  [1, {
    suggestions: [
      {
        disease_name: 'Ишемическая болезнь сердца',
        probability: 0.85,
        rationale: 'Высокая вероятность на основе: семейной истории сердечно-сосудистых заболеваний, курения в течение 15 лет, болей в груди при нагрузке, результатов ЭКГ показывающих гипертрофию левого желудочка'
      },
      {
        disease_name: 'Артериальная гипертензия',
        probability: 0.92,
        rationale: 'Очень высокая вероятность: уже диагностированная гипертония в анамнезе, принимает Лизиноприл, факторы риска включают курение и низкую физическую активность'
      },
      {
        disease_name: 'Дислипидемия',
        probability: 0.78,
        rationale: 'Высокая вероятность: повышенный холестерин в анализах крови (6.2 ммоль/л), принимает статины, диета с высоким содержанием жиров'
      }
    ],
    referrals: [
      {
        specialty: 'Кардиолог',
        note: 'Консультация кардиолога для оценки сердечно-сосудистого риска и коррекции терапии'
      },
      {
        specialty: 'Стресс-тест',
        note: 'Нагрузочная проба для оценки функционального состояния сердца'
      },
      {
        specialty: 'Эхокардиография',
        note: 'УЗИ сердца для оценки структуры и функции миокарда'
      }
    ]
  }],
  [2, {
    suggestions: [
      {
        disease_name: 'Мигрень',
        probability: 0.72,
        rationale: 'Вероятный диагноз на основе: характерных головных болей у молодой женщины, отсутствия структурных изменений на МРТ, сопутствующих нарушений сна'
      },
      {
        disease_name: 'Тревожное расстройство',
        probability: 0.65,
        rationale: 'Возможный диагноз: повышенная тревожность, нарушения сна, головные боли напряжения'
      },
      {
        disease_name: 'Синдром хронической усталости',
        probability: 0.45,
        rationale: 'Низкая вероятность: некоторые симптомы совпадают, но нет характерной длительной усталости'
      }
    ],
    referrals: [
      {
        specialty: 'Невролог',
        note: 'Консультация невролога для дифференциальной диагностики головных болей'
      },
      {
        specialty: 'Психотерапевт',
        note: 'Консультация для работы с тревожностью и нарушениями сна'
      },
      {
        specialty: 'Дневник головной боли',
        note: 'Ведение дневника для выявления триггеров головных болей'
      }
    ]
  }]
]);

// Utility function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockApiService {
  private async request<T>(data: T, delayMs: number = 500): Promise<T> {
    await delay(delayMs);
    return data;
  }

  // Patients
  async createPatient(data: PatientCreateIn): Promise<PatientOut> {
    const newId = Math.max(...mockPatients.map(p => p.id)) + 1;
    const newPatient: PatientOut = {
      id: newId,
      date_of_birth: data.date_of_birth,
      recorded_age: data.recorded_age,
      sex: data.sex,
      created_at: new Date().toISOString()
    };
    mockPatients.push(newPatient);
    return this.request(newPatient);
  }

  async getPatient(patientId: number): Promise<PatientOut> {
    const patient = mockPatients.find(p => p.id === patientId);
    if (!patient) {
      throw new Error(`Patient ${patientId} not found`);
    }
    return this.request(patient);
  }

  // Visits
  async createVisit(data: VisitCreateIn): Promise<{ visit_id: number }> {
    const newId = Math.max(...mockVisits.map(v => v.id)) + 1;
    const newVisit: VisitOut = {
      id: newId,
      patient_id: data.patient_id,
      doctor_id: data.doctor_id,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    mockVisits.push(newVisit);
    return this.request({ visit_id: newId });
  }

  async listVisits(params?: {
    limit?: number;
    offset?: number;
    patient_id?: number;
  }): Promise<VisitOut[]> {
    let filteredVisits = [...mockVisits];
    
    if (params?.patient_id) {
      filteredVisits = filteredVisits.filter(v => v.patient_id === params.patient_id);
    }
    
    // Sort by created_at descending
    filteredVisits.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    const offset = params?.offset || 0;
    const limit = params?.limit || 50;
    
    return this.request(filteredVisits.slice(offset, offset + limit));
  }

  async getVisit(visitId: number): Promise<VisitOut> {
    const visit = mockVisits.find(v => v.id === visitId);
    if (!visit) {
      throw new Error(`Visit ${visitId} not found`);
    }
    return this.request(visit);
  }

  // Anamnesis
  async uploadAnamnesis(visitId: number, data: AnamnesisIn): Promise<{ anamnesis_id: number }> {
    mockAnamnesis.set(visitId, data);
    return this.request({ anamnesis_id: visitId });
  }

  async getAnamnesis(visitId: number): Promise<AnamnesisIn> {
    const anamnesis = mockAnamnesis.get(visitId);
    if (!anamnesis) {
      throw new Error(`Anamnesis for visit ${visitId} not found`);
    }
    return this.request(anamnesis);
  }

  // Examinations
  async uploadExamination(
    visitId: number,
    examinationName: string,
    file: File,
    resultText?: string,
    resultData?: string
  ): Promise<{ s3_path: string; visit_examination_id: number }> {
    const newId = Date.now(); // Simple ID generation
    const s3Path = `/mock/${file.name}_${newId}`;
    
    // Add to mock examinations
    const currentExams = mockExaminations.get(visitId) || [];
    const newExam: ExamResultOut = {
      id: newId,
      examination_name: examinationName,
      s3_path: s3Path,
      result_text: resultText,
      result_data: resultData ? JSON.parse(resultData) : { filename: file.name, size: file.size },
      created_at: new Date().toISOString()
    };
    
    currentExams.push(newExam);
    mockExaminations.set(visitId, currentExams);
    
    return this.request({ s3_path: s3Path, visit_examination_id: newId }, 1000);
  }

  async listExaminations(visitId: number): Promise<ExamResultOut[]> {
    const examinations = mockExaminations.get(visitId) || [];
    return this.request(examinations);
  }

  // Predictions
  async predict(visitId: number): Promise<PredictionsOut> {
    // Check if anamnesis exists
    const anamnesis = mockAnamnesis.get(visitId);
    if (!anamnesis) {
      throw new Error('Анамнез не найден. Заполните анамнез перед получением прогноза.');
    }

    // Get existing prediction or generate a generic one
    let prediction = mockPredictions.get(visitId);
    
    if (!prediction) {
      // Generate a basic prediction based on anamnesis
      prediction = this.generatePredictionFromAnamnesis(anamnesis);
    }
    
    return this.request(prediction, 2000); // Longer delay to simulate AI processing
  }

  private generatePredictionFromAnamnesis(anamnesis: AnamnesisIn): PredictionsOut {
    const suggestions: any[] = [];
    const referrals: any[] = [];

    // Simple rule-based prediction generation
    if (anamnesis.lifestyle?.smoking?.yes) {
      suggestions.push({
        disease_name: 'Хроническая обструктивная болезнь легких',
        probability: 0.6,
        rationale: 'Риск ХОБЛ повышен из-за курения'
      });
      referrals.push({
        specialty: 'Пульмонолог',
        note: 'Консультация пульмонолога для оценки функции легких'
      });
    }

    if (anamnesis.complaints?.some(c => c.toLowerCase().includes('головн'))) {
      suggestions.push({
        disease_name: 'Головная боль напряжения',
        probability: 0.7,
        rationale: 'Жалобы на головные боли'
      });
      referrals.push({
        specialty: 'Невролог',
        note: 'Консультация невролога для дифференциальной диагностики'
      });
    }

    if (anamnesis.genetic?.has_family_history) {
      suggestions.push({
        disease_name: 'Наследственная предрасположенность',
        probability: 0.5,
        rationale: 'Семейная история заболеваний требует внимания'
      });
    }

    // Default suggestions if nothing specific found
    if (suggestions.length === 0) {
      suggestions.push({
        disease_name: 'Требуется дополнительное обследование',
        probability: 0.3,
        rationale: 'Недостаточно данных для точного прогноза'
      });
      referrals.push({
        specialty: 'Терапевт',
        note: 'Консультация терапевта для общей оценки состояния'
      });
    }

    return { suggestions, referrals };
  }
}

export const mockApiService = new MockApiService();