import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { RarityBadge } from '../ui/RarityBadge';
import { theme } from '../../config/theme';

export const NFTCard = ({ id, rarity, name, boxType, baseValue, estMarket, image }) => (
  <Card className="overflow-hidden">
    <div className="relative">
      <span className="absolute top-3 left-3 z-10">
        <RarityBadge rarity={rarity} />
      </span>
      <span className={`absolute top-3 right-3 ${theme.colors.background.card} ${theme.colors.text.primary} text-xs px-3 py-1 rounded-full font-bold`}>
        {id}
      </span>
      <div className={`h-64 ${image} p-6 flex items-center justify-center`}>
        {/* NFT Image Placeholder */}
      </div>
    </div>
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-bold ${theme.colors.text.primary}`}>{name}</h3>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{boxType}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
        <div>
          <div className={`${theme.colors.text.muted} text-xs`}>Base Value</div>
          <div className={`font-semibold ${theme.colors.text.primary}`}>{baseValue}</div>
        </div>
        <div>
          <div className={`${theme.colors.text.muted} text-xs`}>Est. Market</div>
          <div className={`font-semibold ${theme.colors.text.primary}`}>{estMarket}</div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="primary" className="flex-1">List (Sell)</Button>
        <Button variant="secondary" className="flex-1">Return (Burn)</Button>
      </div>
    </div>
  </Card>
);
