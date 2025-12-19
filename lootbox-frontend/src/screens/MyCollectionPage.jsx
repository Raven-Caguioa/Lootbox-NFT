import React from 'react';
import { NFTCard } from '../components/cards/NFTCard';
import { theme } from '../config/theme';

export const MyCollectionPage = ({ collectionTab, setCollectionTab }) => {
  const nfts = [
    { id: '#404', rarity: 'SSR - SUPER', name: 'Cyber', boxType: 'Silver Box', baseValue: '0.001 SUI', estMarket: '0.85 SUI', image: 'bg-gradient-to-br from-orange-900 to-black' },
    { id: '#151', rarity: 'C - COMMON', name: 'Bronze', boxType: 'Bronze Box', baseValue: '0.001 SUI', estMarket: '0.002 SUI', image: 'bg-gradient-to-br from-blue-400 to-purple-600' },
    { id: '#089', rarity: 'UR - ULTRA', name: 'Golden', boxType: 'Gold Box', baseValue: '0.001 SUI', estMarket: '150.0 SUI', image: 'bg-gradient-to-br from-purple-900 to-black' },
  ];

  return (
    <>
      <div className={theme.spacing.section}>
        <h1 className={`text-3xl font-bold ${theme.colors.text.primary} mb-2`}>My Collection</h1>
        <p className={`${theme.colors.text.secondary} mb-6`}>Manage your assets. List for sale or return to pool for instant liquidity.</p>
        
        <div className="flex gap-2 mb-6">
          {['all', 'listed', 'rare'].map(tab => (
            <button 
              key={tab}
              onClick={() => setCollectionTab(tab)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                collectionTab === tab 
                  ? `${theme.colors.primary.bg} ${theme.colors.primary.text}` 
                  : `bg-gray-100 ${theme.colors.text.secondary} hover:bg-gray-200`
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {nfts.map(nft => (
            <NFTCard key={nft.id} {...nft} />
          ))}
        </div>
      </div>
    </>
  );
};