import React, { useState, useEffect } from 'react';
import { VisitOut, PatientOut } from '../types/api';
import { apiService } from '../services/api';
import { User, Calendar, Eye } from 'lucide-react';

interface VisitsPageProps {
  onSelectVisit: (patient: PatientOut, visitId: number) => void;
}

const VisitsPage: React.FC<VisitsPageProps> = ({ onSelectVisit }) => {
  const [visits, setVisits] = useState<VisitOut[]>([]);
  const [patients, setPatients] = useState<Map<number, PatientOut>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const visitsData = await apiService.listVisits({ limit: 50 });
      setVisits(visitsData);

      // Создаем уникальный список ID пациентов для загрузки
      const patientIds = [...new Set(visitsData.map(v => v.patient_id))];
      const patientPromises = patientIds.map(id => apiService.getPatient(id));
      const patientsData = await Promise.all(patientPromises);
      
      const patientMap = new Map<number, PatientOut>();
      patientsData.forEach(p => patientMap.set(p.id, p));
      
      setPatients(patientMap);
    } catch (err) {
      console.error('Failed to load visits or patients:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU');
  };

  const getPatientAge = (patient: PatientOut) => {
    if (patient.recorded_age) return `${patient.recorded_age} лет`;
    if (patient.date_of_birth) {
      const birth = new Date(patient.date_of_birth);
      const today = new Date();
      return `${today.getFullYear() - birth.getFullYear()} лет`;
    }
    return 'Возраст не указан';
  };

  const getSexLabel = (sex?: string) => {
    switch (sex) {
      case 'male': return 'М';
      case 'female': return 'Ж';
      default: return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Все визиты</h2>
        </div>

        <div className="p-6 space-y-4">
          {visits.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <p>В системе еще не зарегистрировано ни одного визита.</p>
            </div>
          ) : (
            visits.map(visit => {
              const patient = patients.get(visit.patient_id);
              if (!patient) return null; // Не рендерим визит, если пациент не загрузился

              return (
                <div key={visit.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <User className="h-10 w-10 text-gray-400 flex-shrink-0" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium text-gray-900">
                            Пациент #{patient.id}
                          </h3>
                          {patient.sex && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {getSexLabel(patient.sex)}
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(visit.status)}`}>
                            {visit.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <span>{getPatientAge(patient)}</span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Визит от {formatDate(visit.created_at)}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectVisit(patient, visit.id)}
                      className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>К пациенту</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitsPage;
