import React from 'react';
import { Button } from '../ui/Button';
import { theme } from '../../config/theme';

export const LootboxCard = ({ type, stock, maxStock, price, gradient, borderColor, description, onOpenBox }) => (
  <div className={`${gradient} rounded-2xl p-6 border-2 ${borderColor}`}>
    <div className={`text-xs ${theme.colors.text.secondary} font-mono mb-4`}>Stock: {stock}/{maxStock}</div>
    <div className="h-40 bg-white/30 rounded-xl mb-4"></div>
    <h3 className={`text-xl font-bold mb-2 ${theme.colors.text.primary}`}>{type} Lootbox</h3>
    <p className={`text-sm mb-4 ${theme.colors.text.secondary}`}>{description}</p>
    <div className="flex items-center justify-between mb-4">
      <span className={`${theme.colors.text.secondary} text-sm`}>Price</span>
      <span className={`text-xl font-bold ${theme.colors.text.primary}`}>{price} SUI</span>
    </div>
    <Button variant="primary" className="w-full" onClick={onOpenBox}>Open Box</Button>
  </div>
);