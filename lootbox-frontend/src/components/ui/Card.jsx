import React from 'react';
import { theme } from '../../config/theme';

export const Card = ({ children, className = '' }) => (
  <div className={`${theme.colors.background.card} rounded-2xl ${theme.spacing.card} shadow-sm ${theme.colors.border.light} border ${className}`}>
    {children}
  </div>
);
