import React, { useState } from 'react';
import Layout from './components/Layout';
import PatientList from './components/PatientList';
import PatientForm from './components/PatientForm';
import PatientDetails from './components/PatientDetails';
import VisitsPage from './components/VisitsPage';
import { PatientOut } from './types/api';
import { apiService } from './services/api';

// Определяем все возможные состояния отображения (страницы)
type ViewState = 
  | { type: 'patients' }
  | { type: 'visits' }
  | { type: 'createPatient' }
  | { type: 'patientDetails'; patient: PatientOut; visitId?: number };

function App() {
  // Основное состояние, которое управляет тем, что видит пользователь
  const [viewState, setViewState] = useState<ViewState>({ type: 'patients' });

  // Вычисляем, какая кнопка в боковом меню должна быть активной
  const currentPage = viewState.type === 'patientDetails' || viewState.type === 'createPatient' 
    ? 'patients' 
    : viewState.type;

  // Обработчик навигации для бокового меню
  const handleNavigate = (page: string) => {
    setViewState({ type: page as any });
  };

  // Переход на страницу создания нового пациента
  const handleCreatePatient = () => {
    setViewState({ type: 'createPatient' });
  };

  // Вызывается после успешного создания пациента в PatientForm
  const handlePatientCreated = (patient: PatientOut) => {
    // Автоматически создаем для нового пациента визит
    apiService.createVisit({ patient_id: patient.id })
      .then(result => {
        // и переходим на страницу деталей этого пациента с новым визитом
        setViewState({ type: 'patientDetails', patient, visitId: result.visit_id });
      })
      .catch(error => {
        console.error('Error creating visit:', error);
        // Даже если визит создать не удалось, все равно открываем пациента
        setViewState({ type: 'patientDetails', patient });
      });
  };

  // Вызывается при выборе пациента из списка на главной странице
  const handleSelectPatient = async (patient: PatientOut) => {
    try {
      // Ищем последний визит для этого пациента
      const visits = await apiService.listVisits({ patient_id: patient.id, limit: 1 });
      let visitId = visits.length > 0 ? visits[0].id : undefined;
      
      // Если визитов нет, создаем новый
      if (!visitId) {
        const result = await apiService.createVisit({ patient_id: patient.id });
        visitId = result.visit_id;
      }
      
      // Переходим на страницу деталей пациента
      setViewState({ type: 'patientDetails', patient, visitId });
    } catch (error) {
      console.error('Error handling patient selection:', error);
      setViewState({ type: 'patientDetails', patient });
    }
  };

  // Вызывается при выборе визита со страницы "Визиты"
  const handleSelectVisit = (patient: PatientOut, visitId: number) => {
    setViewState({ type: 'patientDetails', patient, visitId });
  };

  // Функция-роутер, которая решает, какой компонент отображать
  const renderContent = () => {
    switch (viewState.type) {
      case 'patients':
        return (
          <div className="p-6">
            <PatientList
              onSelectPatient={handleSelectPatient}
              onCreatePatient={handleCreatePatient}
            />
          </div>
        );
      
      case 'visits':
        return (
          <div className="p-6">
            <VisitsPage onSelectVisit={handleSelectVisit} />
          </div>
        );
      
      case 'createPatient':
        return (
          <div className="p-6">
            <PatientForm
              onSubmit={handlePatientCreated}
              onCancel={() => setViewState({ type: 'patients' })}
            />
          </div>
        );
      
      case 'patientDetails':
        return (
          <PatientDetails
            patient={viewState.patient}
            visitId={viewState.visitId}
            onBack={() => setViewState({ type: 'patients' })}
          />
        );
    }
  };

  // Основная разметка приложения
  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderContent()}
    </Layout>
  );
}

export default App;
