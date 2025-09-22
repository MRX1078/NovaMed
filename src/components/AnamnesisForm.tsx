import React, { useState } from 'react';
import { AnamnesisIn } from '../types/api';
import { apiService } from '../services/api';
import { Save, Plus, Trash2 } from 'lucide-react';

interface AnamnesisFormProps {
  visitId: number;
  initialData?: AnamnesisIn;
  onSubmit: (data: AnamnesisIn) => void;
}

const AnamnesisForm: React.FC<AnamnesisFormProps> = ({ visitId, initialData, onSubmit }) => {
  const [formData, setFormData] = useState<AnamnesisIn>(initialData || {
    general: { age: undefined, sex: undefined },
    genetic: { has_family_history: false, details: '' },
    lifestyle: {
      smoking: { yes: false, years: undefined },
      alcohol: '',
      activity: '',
      diet: []
    },
    past_conditions: [],
    surgeries_traumas: [],
    medications: [],
    allergies: [],
    complaints: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const addArrayItem = (field: keyof AnamnesisIn, value: string) => {
    if (!value.trim()) return;
    
    const currentArray = (formData[field] as string[]) || [];
    setFormData({
      ...formData,
      [field]: [...currentArray, value.trim()]
    });
  };

  const removeArrayItem = (field: keyof AnamnesisIn, index: number) => {
    const currentArray = (formData[field] as string[]) || [];
    setFormData({
      ...formData,
      [field]: currentArray.filter((_, i) => i !== index)
    });
  };

  const ArrayInput: React.FC<{ 
    field: keyof AnamnesisIn; 
    label: string; 
    placeholder: string 
  }> = ({ field, label, placeholder }) => {
    const [inputValue, setInputValue] = useState('');
    const items = (formData[field] as string[]) || [];

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="space-y-2">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addArrayItem(field, inputValue);
                  setInputValue('');
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                addArrayItem(field, inputValue);
                setInputValue('');
              }}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md">
              <span className="flex-1 text-sm">{item}</span>
              <button
                type="button"
                onClick={() => removeArrayItem(field, index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await apiService.uploadAnamnesis(visitId, formData);
      onSubmit(formData);
    } catch (error) {
      console.error('Error uploading anamnesis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Анамнез пациента</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Information */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Общие данные</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Возраст</label>
              <input
                type="number"
                value={formData.general?.age || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  general: { ...formData.general, age: parseInt(e.target.value) || undefined }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Пол</label>
              <select
                value={formData.general?.sex || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  general: { ...formData.general, sex: e.target.value as any }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Выберите пол</option>
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
                <option value="other">Другой</option>
              </select>
            </div>
          </div>
        </div>

        {/* Genetic Information */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Генетический анамнез</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="family_history"
                checked={formData.genetic?.has_family_history || false}
                onChange={(e) => setFormData({
                  ...formData,
                  genetic: { ...formData.genetic, has_family_history: e.target.checked }
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="family_history" className="ml-2 text-sm text-gray-700">
                Семейная история заболеваний
              </label>
            </div>
            {formData.genetic?.has_family_history && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Детали</label>
                <textarea
                  value={formData.genetic?.details || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    genetic: { ...formData.genetic, details: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Опишите семейную историю заболеваний..."
                />
              </div>
            )}
          </div>
        </div>

        {/* Lifestyle */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Образ жизни</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="smoking"
                  checked={formData.lifestyle?.smoking?.yes || false}
                  onChange={(e) => setFormData({
                    ...formData,
                    lifestyle: {
                      ...formData.lifestyle,
                      smoking: { ...formData.lifestyle?.smoking, yes: e.target.checked }
                    }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="smoking" className="ml-2 text-sm text-gray-700">Курение</label>
              </div>
              {formData.lifestyle?.smoking?.yes && (
                <input
                  type="number"
                  placeholder="Количество лет курения"
                  value={formData.lifestyle?.smoking?.years || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    lifestyle: {
                      ...formData.lifestyle,
                      smoking: { ...formData.lifestyle?.smoking, years: parseInt(e.target.value) || undefined }
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Алкоголь</label>
              <input
                type="text"
                value={formData.lifestyle?.alcohol || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  lifestyle: { ...formData.lifestyle, alcohol: e.target.value }
                })}
                placeholder="Употребление алкоголя"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Физическая активность</label>
              <input
                type="text"
                value={formData.lifestyle?.activity || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  lifestyle: { ...formData.lifestyle, activity: e.target.value }
                })}
                placeholder="Уровень физической активности"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Medical History Arrays */}
        <div className="space-y-6">
          <ArrayInput
            field="past_conditions"
            label="Перенесенные заболевания"
            placeholder="Введите заболевание"
          />
          
          <ArrayInput
            field="surgeries_traumas"
            label="Операции и травмы"
            placeholder="Введите операцию или травму"
          />
          
          <ArrayInput
            field="medications"
            label="Принимаемые препараты"
            placeholder="Введите препарат"
          />
          
          <ArrayInput
            field="allergies"
            label="Аллергии"
            placeholder="Введите аллерген"
          />
          
          <ArrayInput
            field="complaints"
            label="Жалобы"
            placeholder="Введите жалобу"
          />
        </div>

        <div className="flex justify-end pt-6 border-t">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center space-x-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>{isLoading ? 'Сохранение...' : 'Сохранить анамнез'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnamnesisForm;