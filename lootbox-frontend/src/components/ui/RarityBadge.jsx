import React from 'react';
import { theme } from '../../config/theme';

export const RarityBadge = ({ rarity }) => {
  const rarityColors = {
    'COMMON': theme.colors.rarity.common,
    'RARE': theme.colors.rarity.rare,
    'SSR - SUPER': theme.colors.rarity.super,
    'SSR': theme.colors.rarity.super,
    'UR - ULTRA': theme.colors.rarity.ultra,
    'C - COMMON': theme.colors.rarity.common
  };

  return (
    <span className={`text-[10px] px-2 py-1 rounded font-bold ${rarityColors[rarity] || theme.colors.rarity.common}`}>
      {rarity}
    </span>
  );
};