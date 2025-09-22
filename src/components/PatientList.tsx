import React, { useState, useEffect } from 'react';
import { PatientOut, VisitOut } from '../types/api';
import { apiService } from '../services/api';
import { User, Calendar, Plus, Eye } from 'lucide-react';

interface PatientListProps {
  onSelectPatient: (patient: PatientOut) => void;
  onCreatePatient: () => void;
}

const PatientList: React.FC<PatientListProps> = ({ onSelectPatient, onCreatePatient }) => {
  const [visits, setVisits] = useState<VisitOut[]>([]);
  const [patients, setPatients] = useState<Map<number, PatientOut>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVisits();
  }, []);

  const loadVisits = async () => {
    try {
      const visitsData = await apiService.listVisits({ limit: 50 });
      setVisits(visitsData);

      // Load patient data for each visit
      const patientMap = new Map<number, PatientOut>();
      for (const visit of visitsData) {
        if (!patientMap.has(visit.patient_id)) {
          try {
            const patient = await apiService.getPatient(visit.patient_id);
            patientMap.set(visit.patient_id, patient);
          } catch (error) {
            console.error(`Error loading patient ${visit.patient_id}:`, error);
          }
        }
      }
      setPatients(patientMap);
    } catch (error) {
      console.error('Error loading visits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  const getPatientAge = (patient: PatientOut) => {
    if (patient.recorded_age) return `${patient.recorded_age} лет`;
    if (patient.date_of_birth) {
      const birth = new Date(patient.date_of_birth);
      const today = new Date();
      const age = today.getFullYear() - birth.getFullYear();
      return `${age} лет`;
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Пациенты и визиты</h2>
          <button
            onClick={onCreatePatient}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Новый пациент</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {visits.length === 0 ? (
          <div className="text-center py-8">
            <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">Пока нет пациентов в системе</p>
            <button
              onClick={onCreatePatient}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Создать первого пациента
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {visits.map((visit) => {
              const patient = patients.get(visit.patient_id);
              if (!patient) return null;

              return (
                <div key={visit.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <User className="h-10 w-10 text-gray-400" />
                      </div>
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
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-sm text-gray-600">{getPatientAge(patient)}</p>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>Визит: {formatDate(visit.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectPatient(patient)}
                      className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Открыть</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;