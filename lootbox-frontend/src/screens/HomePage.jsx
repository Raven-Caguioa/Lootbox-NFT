import React from 'react';
import { Wallet, Recycle, BarChart3, DollarSign, Package, ArrowRight } from 'lucide-react';
import { StatCard } from '../components/cards/StatCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RarityBadge } from '../components/ui/RarityBadge';
import { LootboxCard } from '../components/cards/LootboxCard';
import { NFTCard } from '../components/cards/NFTCard';
import { theme } from '../config/theme';

export const HomePage = ({ setCurrentPage }) => {
  // Sample data for previews
  const recentPulls = [
    { id: '#127', rarity: 'RARE', name: 'Storm Caller', type: 'Bronze Box' },
    { id: '#284', rarity: 'UR - ULTRA', name: 'Golden Argis', type: 'Gold Box' },
    { id: '#652', rarity: 'SSR - SUPER', name: 'Void Reaper', type: 'Silver Box' },
    { id: '#889', rarity: 'C - COMMON', name: 'Iron Dagger', type: 'Bronze Box' },
  ];

  const featuredLootboxes = [
    {
      type: "Bronze",
      stock: 412,
      maxStock: 500,
      price: "0.01",
      gradient: "bg-gradient-to-br from-yellow-50 to-orange-50",
      borderColor: "border-yellow-200",
      description: "High chance for Common & Rare. Small chance for Legendary"
    },
    {
      type: "Gold",
      stock: 84,
      maxStock: 300,
      price: "0.1",
      gradient: "bg-gradient-to-br from-yellow-100 to-yellow-200",
      borderColor: "border-yellow-400",
      description: "Premium tier. Highest odds for UR and LR drops."
    }
  ];

  const featuredNFTs = [
    { id: '#404', rarity: 'SSR - SUPER', name: 'Cyber', boxType: 'Silver Box', baseValue: '0.001 SUI', estMarket: '0.85 SUI', image: 'bg-gradient-to-br from-orange-900 to-black' },
    { id: '#089', rarity: 'UR - ULTRA', name: 'Golden', boxType: 'Gold Box', baseValue: '0.001 SUI', estMarket: '150.0 SUI', image: 'bg-gradient-to-br from-purple-900 to-black' },
  ];

  const featuredListings = [
    { name: 'Neon Blade', rarity: 'SSR', id: '#889', seller: '0x7b...9a21', price: '49.9 SUI', bg: 'bg-gradient-to-br from-pink-400 to-purple-600' },
    { name: 'Void Walker', rarity: 'Rare', id: '#214', seller: '0x4c...11ff', price: '2.5 SUI', bg: 'bg-gradient-to-br from-red-400 to-orange-600' },
  ];

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Treasury Balance" 
          value="4,291.5 SUI" 
          subtitle="+12.5% this week" 
          icon={Wallet} 
          iconColor="text-purple-500" 
        />
        <StatCard 
          title="Total Recycled" 
          value="842 NFTs" 
          subtitle="Returned to pool" 
          icon={Recycle} 
          iconColor="text-green-500" 
        />
        <StatCard 
          title="Market Volume" 
          value="12,405 SUI" 
          subtitle="Total secondary sales" 
          icon={BarChart3} 
          iconColor="text-blue-500" 
        />
        <StatCard 
          title="Fees Collected" 
          value="1,240.5 SUI" 
          subtitle="10% protocol revenue" 
          icon={DollarSign} 
          iconColor="text-yellow-500" 
        />
      </div>

      {/* Recent Pulls */}
      <Card className={theme.spacing.section}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-xl font-bold ${theme.colors.text.primary} flex items-center gap-2`}>
              <Package className="w-5 h-5 text-purple-500" />
              Recent Pulls
            </h2>
            <p className={`text-sm ${theme.colors.text.muted}`}>Live feed of newly minted NFTs</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 font-medium">Live</span>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {recentPulls.map((item, idx) => (
            <div key={idx} className="min-w-[200px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold ${theme.colors.text.muted}`}>{item.id}</span>
                <RarityBadge rarity={item.rarity} />
              </div>
              <h3 className={`font-bold ${theme.colors.text.primary} mb-1`}>{item.name}</h3>
              <p className={`text-xs ${theme.colors.text.muted}`}>{item.type}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Featured Lootboxes Preview */}
      <div className={theme.spacing.section}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${theme.colors.text.primary}`}>Featured Lootboxes</h2>
            <p className={`${theme.colors.text.secondary}`}>Try your luck with our most popular boxes</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setCurrentPage('shop')}
            className="flex items-center gap-2"
          >
            View All Boxes
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {featuredLootboxes.map((box, idx) => (
            <LootboxCard key={idx} {...box} />
          ))}
        </div>
      </div>

      {/* My Collection Preview */}
      <div className={theme.spacing.section}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${theme.colors.text.primary}`}>My Collection</h2>
            <p className={`${theme.colors.text.secondary}`}>Your most valuable NFTs</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setCurrentPage('collection')}
            className="flex items-center gap-2"
          >
            View Full Collection
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {featuredNFTs.map(nft => (
            <NFTCard key={nft.id} {...nft} />
          ))}
        </div>
      </div>

      {/* Marketplace Preview */}
      <div className={theme.spacing.section}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className={`text-2xl font-bold ${theme.colors.text.primary}`}>Hot Marketplace Listings</h2>
            <p className={`${theme.colors.text.secondary}`}>Trending NFTs for sale</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setCurrentPage('marketplace')}
            className="flex items-center gap-2"
          >
            Browse Marketplace
            <ArrowRight className="w-4 h-4" />
          </Button>
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
              {featuredListings.map((item, idx) => (
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