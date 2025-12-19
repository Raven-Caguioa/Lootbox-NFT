import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RarityBadge } from '../components/ui/RarityBadge';
import { theme } from '../config/theme';

export const MarketplacePage = () => {
  const listings = [
    { name: 'Neon Blade', rarity: 'SSR', id: '#889', seller: '0x7b...9a21', price: '49.9 SUI', bg: 'bg-gradient-to-br from-pink-400 to-purple-600' },
    { name: 'Void Walker', rarity: 'Rare', id: '#214', seller: '0x4c...11ff', price: '2.5 SUI', bg: 'bg-gradient-to-br from-red-400 to-orange-600' },
    { name: 'Rusty Dagger', rarity: 'Common', id: '#441', seller: '0x9a...ee42', price: '0.02 SUI', bg: 'bg-gradient-to-br from-gray-400 to-gray-600' },
  ];

  return (
    <>
      <div className={theme.spacing.section}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${theme.colors.text.primary} mb-2`}>Marketplace</h1>
            <p className={theme.colors.text.secondary}>Buy directly from other players. 10% fee goes to the community pool.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme.colors.text.muted}`} />
              <input 
                type="text" 
                placeholder="Search items..." 
                className={`pl-10 pr-4 py-2 border ${theme.colors.border.default} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${theme.colors.text.secondary} uppercase`}>Item</th>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${theme.colors.text.secondary} uppercase`}>Rarity</th>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${theme.colors.text.secondary} uppercase`}>ID</th>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${theme.colors.text.secondary} uppercase`}>Seller</th>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${theme.colors.text.secondary} uppercase`}>Price</th>
                <th className={`px-6 py-4 text-left text-xs font-semibold ${theme.colors.text.secondary} uppercase`}>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {listings.map((item, idx) => (
                <tr key={idx} className={theme.colors.background.cardHover + ' transition-colors'}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${item.bg} rounded-lg`}></div>
                      <span className={`font-medium ${theme.colors.text.primary}`}>{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <RarityBadge rarity={item.rarity} />
                  </td>
                  <td className={`px-6 py-4 ${theme.colors.text.secondary} font-mono text-sm`}>{item.id}</td>
                  <td className={`px-6 py-4 ${theme.colors.text.secondary} font-mono text-sm`}>{item.seller}</td>
                  <td className={`px-6 py-4 font-bold ${theme.colors.text.primary}`}>{item.price}</td>
                  <td className="px-6 py-4">
                    <Button variant="primary">Buy</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
};