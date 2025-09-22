import React, { useState } from 'react';
import { PatientOut } from '../types/api';
import { User, FileText, Upload, Brain, ArrowLeft } from 'lucide-react';
import AnamnesisForm from './AnamnesisForm';
import ExaminationUpload from './ExaminationUpload';
import PredictionResults from './PredictionResults';

interface PatientDetailsProps {
  patient: PatientOut;
  visitId?: number;
  onBack: () => void;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ patient, visitId, onBack }) => {
  const [activeTab, setActiveTab] = useState('anamnesis');

  if (!visitId) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Пациент #{patient.id}</h2>
          <p className="text-gray-600">Не удалось создать или найти визит для этого пациента.</p>
          <button
            onClick={onBack}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  const patientAge = patient.recorded_age || 
    (patient.date_of_birth ? new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear() : 'Не указан');

  const sexLabel = patient.sex === 'male' ? 'Мужской' : 
                  patient.sex === 'female' ? 'Женский' : 
                  patient.sex === 'other' ? 'Другой' : 'Не указан';

  const tabs = [
    { id: 'anamnesis', label: 'Анамнез', icon: FileText },
    { id: 'examinations', label: 'Обследования', icon: Upload },
    { id: 'predictions', label: 'ИИ Диагностика', icon: Brain },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Back button and patient info */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Вернуться к списку</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4">
          <User className="h-12 w-12 text-gray-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Пациент #{patient.id}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
              <span>Возраст: {patientAge}</span>
              <span>Пол: {sexLabel}</span>
              <span>Дата регистрации: {new Date(patient.created_at).toLocaleDateString('ru-RU')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'anamnesis' && (
            <AnamnesisForm
              visitId={visitId}
              onSubmit={() => {
                // Optionally switch to predictions tab after submitting
                setActiveTab('predictions');
              }}
            />
          )}
          
          {activeTab === 'examinations' && (
            <ExaminationUpload
              visitId={visitId}
              onUploadComplete={() => {
                // Refresh or show success
              }}
            />
          )}
          
          {activeTab === 'predictions' && (
            <PredictionResults visitId={visitId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
