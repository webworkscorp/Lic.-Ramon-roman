import React from 'react';

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface FormData {
  name: string;
  reason: string;
}