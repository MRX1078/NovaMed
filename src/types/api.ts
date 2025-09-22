// API Types based on OpenAPI schema
export interface PatientCreateIn {
  date_of_birth?: string;
  recorded_age?: number;
  sex?: 'male' | 'female' | 'other';
}

export interface PatientOut {
  id: number;
  date_of_birth?: string;
  recorded_age?: number;
  sex?: 'male' | 'female' | 'other';
  created_at: string;
}

export interface VisitCreateIn {
  patient_id: number;
  doctor_id?: string;
}

export interface VisitOut {
  id: number;
  patient_id: number;
  doctor_id?: string;
  status: string;
  created_at: string;
}

export interface General {
  age?: number;
  sex?: 'male' | 'female' | 'other';
}

export interface Smoking {
  yes?: boolean;
  years?: number;
}

export interface Lifestyle {
  smoking?: Smoking;
  alcohol?: string;
  activity?: string;
  diet?: string[];
}

export interface Genetic {
  has_family_history?: boolean;
  details?: string;
}

export interface AnamnesisIn {
  general?: General;
  genetic?: Genetic;
  lifestyle?: Lifestyle;
  past_conditions?: string[];
  surgeries_traumas?: string[];
  medications?: string[];
  allergies?: string[];
  complaints?: string[];
}

export interface ExamResultOut {
  id: number;
  examination_name: string;
  s3_path: string;
  result_text?: string;
  result_data: Record<string, any>;
  created_at: string;
}

export interface DiagnosisSuggestionOut {
  disease_name: string;
  probability: number;
  rationale?: string;
}

export interface ReferralSuggestionOut {
  specialty: string;
  note?: string;
}

export interface PredictionsOut {
  suggestions: DiagnosisSuggestionOut[];
  referrals: ReferralSuggestionOut[];
}