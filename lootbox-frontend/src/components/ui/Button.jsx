import React from 'react';
import { theme } from '../../config/theme';

export const Button = ({ children, variant = 'primary', size = 'md', onClick, className = '' }) => {
  const variants = {
    primary: `bg-gradient-to-r ${theme.colors.primary.from} ${theme.colors.primary.to} text-white hover:shadow-lg`,
    secondary: `${theme.colors.primary.bg} ${theme.colors.primary.text} ${theme.colors.primary.hover}`,
    outline: `border-2 ${theme.colors.border.default} ${theme.colors.text.primary} hover:bg-gray-50`
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2',
    lg: 'px-8 py-3'
  };

  return (
    <button 
      onClick={onClick}
      className={`${variants[variant]} ${sizes[size]} rounded-lg font-medium transition-all ${className}`}
    >
      {children}
    </button>
  );
};