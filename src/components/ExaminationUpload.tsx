import React, { useState, useCallback } from 'react';
import { apiService } from '../services/api';
import { Upload, File, Image, X, CheckCircle } from 'lucide-react';

interface ExaminationUploadProps {
  visitId: number;
  onUploadComplete: () => void;
}

const ExaminationUpload: React.FC<ExaminationUploadProps> = ({ visitId, onUploadComplete }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadData, setUploadData] = useState({
    examinationName: '',
    resultText: '',
    file: null as File | null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadData({ ...uploadData, file: e.dataTransfer.files[0] });
    }
  }, [uploadData]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadData({ ...uploadData, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.file || !uploadData.examinationName) return;

    setIsLoading(true);
    
    try {
      await apiService.uploadExamination(
        visitId,
        uploadData.examinationName,
        uploadData.file,
        uploadData.resultText
      );
      
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setUploadData({ examinationName: '', resultText: '', file: null });
        onUploadComplete();
      }, 2000);
    } catch (error) {
      console.error('Error uploading examination:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-6 w-6 text-blue-500" />;
    }
    return <File className="h-6 w-6 text-gray-500" />;
  };

  if (uploadSuccess) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Обследование загружено</h3>
          <p className="text-sm text-gray-600">Файл успешно загружен и обработан системой.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Загрузка результатов обследования</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Тип обследования
          </label>
          <input
            type="text"
            value={uploadData.examinationName}
            onChange={(e) => setUploadData({ ...uploadData, examinationName: e.target.value })}
            placeholder="МРТ, Рентген, УЗИ, Анализ крови..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Файл обследования
          </label>
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
              dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-center">
              {uploadData.file ? (
                <div className="flex items-center justify-center space-x-3">
                  {getFileIcon(uploadData.file)}
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{uploadData.file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(uploadData.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadData({ ...uploadData, file: null })}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Нажмите для выбора файла</span> или перетащите сюда
                  </div>
                  <p className="text-xs text-gray-500">
                    Поддерживаются изображения, PDF и другие медицинские файлы
                  </p>
                </>
              )}
            </div>
            
            <input
              type="file"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*,.pdf,.doc,.docx"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Текстовое описание результатов (опционально)
          </label>
          <textarea
            value={uploadData.resultText}
            onChange={(e) => setUploadData({ ...uploadData, resultText: e.target.value })}
            rows={3}
            placeholder="Дополнительные заметки о результатах обследования..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!uploadData.file || !uploadData.examinationName || isLoading}
            className="flex items-center space-x-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-md transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>{isLoading ? 'Загрузка...' : 'Загрузить обследование'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExaminationUpload;