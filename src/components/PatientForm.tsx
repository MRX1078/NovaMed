import React, { useState } from 'react';
import { PatientCreateIn } from '../types/api';
import { apiService } from '../services/api';
import { Save, X } from 'lucide-react';

interface PatientFormProps {
  onSubmit: (patient: any) => void;
  onCancel: () => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<PatientCreateIn>({
    date_of_birth: '',
    recorded_age: undefined,
    sex: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const patient = await apiService.createPatient(formData);
      onSubmit(patient);
    } catch (error) {
      console.error('Error creating patient:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Новый пациент</h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Дата рождения
            </label>
            <input
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Возраст (лет)
            </label>
            <input
              type="number"
              value={formData.recorded_age || ''}
              onChange={(e) => setFormData({ ...formData, recorded_age: parseInt(e.target.value) || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Введите возраст"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Пол
          </label>
          <select
            value={formData.sex || ''}
            onChange={(e) => setFormData({ ...formData, sex: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">Выберите пол</option>
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
            <option value="other">Другой</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>{isLoading ? 'Сохранение...' : 'Сохранить'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;