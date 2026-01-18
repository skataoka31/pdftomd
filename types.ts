
import React from 'react';

export interface AnalysisResult {
  markdown: string;
  fileName: string;
}

export enum AppStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  COMPLETED = 'completed',
  ERROR = 'error'
}

export interface WindowProps {
  title: string;
  onClose?: () => void;
  // Fix: Added React import to resolve React.ReactNode namespace error
  children: React.ReactNode;
}
