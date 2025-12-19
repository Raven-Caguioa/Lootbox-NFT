import React from 'react';
import { Card } from '../ui/Card';
import { theme } from '../../config/theme';

export const StatCard = ({ title, value, subtitle, icon: Icon, iconColor }) => (
  <Card>
    <div className="flex items-center justify-between mb-2">
      <span className={`${theme.colors.text.muted} text-sm`}>{title}</span>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
    <div className={`text-3xl font-bold ${theme.colors.text.primary} mb-1`}>{value}</div>
    <div className={`text-xs ${theme.colors.text.muted}`}>{subtitle}</div>
  </Card>
);