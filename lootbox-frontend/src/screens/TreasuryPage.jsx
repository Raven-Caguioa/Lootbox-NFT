import React from 'react';
import { TrendingUp, Package, DollarSign, Recycle, ExternalLink } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { theme } from '../config/theme';

export const TreasuryPage = () => {
  const transactions = [
    { type: 'Box Sale', amount: '+0.05 SUI', time: '2 mins ago', status: 'completed' },
    { type: 'Marketplace Fee', amount: '+4.99 SUI', time: '5 mins ago', status: 'completed' },
    { type: 'NFT Recycled', amount: '-0.85 SUI', time: '12 mins ago', status: 'completed' },
    { type: 'Box Sale', amount: '+0.01 SUI', time: '18 mins ago', status: 'completed' },
  ];

  return (
    <>
      <div className={theme.spacing.section}>
        <h1 className={`text-3xl font-bold ${theme.colors.text.primary} mb-2`}>Treasury</h1>
        <p className={`${theme.colors.text.secondary} mb-8`}>Track protocol revenue, community pool, and treasury operations.</p>

        {/* Treasury Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card>
            <h3 className={`text-sm ${theme.colors.text.muted} mb-2`}>Total Treasury</h3>
            <p className={`text-3xl font-bold ${theme.colors.text.primary} mb-2`}>4,291.5 SUI</p>
            <p className="text-sm text-green-500 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +12.5% this week
            </p>
          </Card>
          <Card>
            <h3 className={`text-sm ${theme.colors.text.muted} mb-2`}>Community Pool</h3>
            <p className={`text-3xl font-bold ${theme.colors.text.primary} mb-2`}>2,840.3 SUI</p>
            <p className={`text-sm ${theme.colors.text.muted}`}>Available for rewards</p>
          </Card>
          <Card>
            <h3 className={`text-sm ${theme.colors.text.muted} mb-2`}>Protocol Revenue</h3>
            <p className={`text-3xl font-bold ${theme.colors.text.primary} mb-2`}>1,451.2 SUI</p>
            <p className={`text-sm ${theme.colors.text.muted}`}>All-time earnings</p>
          </Card>
        </div>

        {/* Revenue Breakdown */}
        <Card className="mb-8">
          <h3 className={`text-xl font-bold ${theme.colors.text.primary} mb-6`}>Revenue Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={`font-semibold ${theme.colors.text.primary}`}>Lootbox Sales</p>
                  <p className={`text-sm ${theme.colors.text.muted}`}>Direct minting revenue</p>
                </div>
              </div>
              <p className={`text-xl font-bold ${theme.colors.text.primary}`}>2,840.5 SUI</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={`font-semibold ${theme.colors.text.primary}`}>Marketplace Fees</p>
                  <p className={`text-sm ${theme.colors.text.muted}`}>10% on secondary sales</p>
                </div>
              </div>
              <p className={`text-xl font-bold ${theme.colors.text.primary}`}>1,240.5 SUI</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Recycle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={`font-semibold ${theme.colors.text.primary}`}>Recycling Revenue</p>
                  <p className={`text-sm ${theme.colors.text.muted}`}>NFT returns to pool</p>
                </div>
              </div>
              <p className={`text-xl font-bold ${theme.colors.text.primary}`}>210.5 SUI</p>
            </div>
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-bold ${theme.colors.text.primary}`}>Recent Transactions</h3>
            <button className={`${theme.colors.primary.text} font-medium flex items-center gap-2 hover:underline`}>
              View All
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {transactions.map((tx, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className={`font-semibold ${theme.colors.text.primary}`}>{tx.type}</p>
                  <p className={`text-sm ${theme.colors.text.muted}`}>{tx.time}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${tx.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount}
                  </p>
                  <p className={`text-xs ${theme.colors.text.muted}`}>{tx.status}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
};