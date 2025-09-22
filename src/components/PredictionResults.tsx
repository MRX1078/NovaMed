import React, { useState, useEffect } from 'react';
import { PredictionsOut } from '../types/api';
import { apiService } from '../services/api';
import { Brain, AlertTriangle, TrendingUp, FileText, Loader } from 'lucide-react';

interface PredictionResultsProps {
  visitId: number;
}

const PredictionResults: React.FC<PredictionResultsProps> = ({ visitId }) => {
  const [predictions, setPredictions] = useState<PredictionsOut | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiService.predict(visitId);
      setPredictions(result);
    } catch (err) {
      setError('Ошибка при получении прогнозов. Убедитесь, что анамнез заполнен.');
      console.error('Prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 0.7) return 'text-red-600 bg-red-50';
    if (probability >= 0.4) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getProbabilityIcon = (probability: number) => {
    if (probability >= 0.7) return <AlertTriangle className="h-4 w-4" />;
    if (probability >= 0.4) return <TrendingUp className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">ИИ Диагностика</h3>
        </div>
        
        {!predictions && (
          <button
            onClick={handlePredict}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md transition-colors"
          >
            {isLoading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Brain className="h-4 w-4" />
            )}
            <span>{isLoading ? 'Анализ...' : 'Получить прогноз'}</span>
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-8">
          <Loader className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-sm text-gray-600">Анализ данных пациента с помощью ИИ...</p>
        </div>
      )}

      {predictions && (
        <div className="space-y-6">
          {/* Diagnosis Suggestions */}
          {predictions.suggestions.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Предполагаемые диагнозы</h4>
              <div className="space-y-3">
                {predictions.suggestions.map((suggestion, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{suggestion.disease_name}</h5>
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getProbabilityColor(suggestion.probability)}`}>
                        {getProbabilityIcon(suggestion.probability)}
                        <span>{(suggestion.probability * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    
                    {suggestion.rationale && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                        {suggestion.rationale}
                      </p>
                    )}
                    
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            suggestion.probability >= 0.7 ? 'bg-red-500' :
                            suggestion.probability >= 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${suggestion.probability * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Referral Suggestions */}
          {predictions.referrals.length > 0 && (
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Рекомендуемые обследования</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {predictions.referrals.map((referral, index) => (
                  <div key={index} className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-blue-900">{referral.specialty}</h5>
                        {referral.note && (
                          <p className="text-sm text-blue-700 mt-1">{referral.note}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {predictions.suggestions.length === 0 && predictions.referrals.length === 0 && (
            <div className="text-center py-8">
              <Brain className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">
                Недостаточно данных для формирования прогноза. 
                Добавьте больше информации в анамнез или результаты обследований.
              </p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t">
            <button
              onClick={handlePredict}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
            >
              <Brain className="h-4 w-4" />
              <span>Обновить прогноз</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionResults;