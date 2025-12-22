import React from 'react';
import { Button } from '../ui/Button';
import { theme } from '../../config/theme';

export const LootboxCard = ({ 
  type, 
  stock, 
  maxStock, 
  price, 
  gradient, 
  borderColor, 
  description, 
  onOpenBox,
  disabled = false 
}) => {
  const isSoldOut = stock === 0;
  const isDisabled = disabled || isSoldOut;
  
  return (
    <div className={`${gradient} rounded-2xl p-6 border-2 ${borderColor} ${isDisabled ? 'opacity-60' : ''} transition-opacity`}>
      <div className={`text-xs ${theme.colors.text.secondary} font-mono mb-4`}>
        Stock: <span className={isSoldOut ? 'text-red-600 font-bold' : ''}>{stock}/{maxStock}</span>
      </div>
      <div className="h-40 bg-white/30 rounded-xl mb-4 flex items-center justify-center">
        {isDisabled && (
          <span className="text-gray-500 font-semibold">
            {isSoldOut ? 'SOLD OUT' : 'COMING SOON'}
          </span>
        )}
      </div>
      <h3 className={`text-xl font-bold mb-2 ${theme.colors.text.primary}`}>{type} Lootbox</h3>
      <p className={`text-sm mb-4 ${theme.colors.text.secondary}`}>{description}</p>
      <div className="flex items-center justify-between mb-4">
        <span className={`${theme.colors.text.secondary} text-sm`}>Price</span>
        <span className={`text-xl font-bold ${theme.colors.text.primary}`}>{price} SUI</span>
      </div>
      <Button 
        variant="primary" 
        className="w-full" 
        onClick={onOpenBox}
        disabled={isDisabled}
      >
        {isSoldOut ? 'Sold Out' : 'Open Box'}
      </Button>
    </div>
  );
};