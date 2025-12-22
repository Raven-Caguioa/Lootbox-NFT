import React from 'react';
import { Wallet, Package, LogOut } from 'lucide-react';
import { ConnectButton, useCurrentAccount, useDisconnectWallet, useSuiClientQuery } from '@mysten/dapp-kit';
import { Button } from '../ui/Button';
import { theme } from '../../config/theme';
import { convertMistToSui } from '../../config/contracts';

export const Header = ({ currentPage, setCurrentPage }) => {
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();

  // Fetch user's SUI balance
  const { data: balance } = useSuiClientQuery(
    'getBalance',
    {
      owner: currentAccount?.address,
      coinType: '0x2::sui::SUI',
    },
    {
      enabled: !!currentAccount,
      refetchInterval: 10000, // Refetch every 10 seconds
    }
  );

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'collection', label: 'My Collection' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'treasury', label: 'Treasury' }
  ];

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balanceData) => {
    if (!balanceData?.totalBalance) return '0.00';
    const sui = convertMistToSui(balanceData.totalBalance);
    return sui.toFixed(4);
  };

  return (
    <header className={`${theme.colors.background.card}/80 backdrop-blur-sm ${theme.colors.border.default} border-b sticky top-0 z-50`}>
      <div className={`${theme.spacing.container} py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className={`w-8 h-8 bg-gradient-to-br ${theme.colors.primary.from} ${theme.colors.primary.to} rounded-lg flex items-center justify-center`}>
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold ${theme.colors.text.primary}`}>SuiLoot</span>
          </div>
          
          <nav className="flex items-center gap-8">
            {navItems.slice(1).map(item => (
              <button 
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`font-medium transition-colors ${
                  currentPage === item.id ? theme.colors.primary.text : `${theme.colors.text.secondary} hover:text-gray-900`
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {currentAccount ? (
              <>
                <div className="text-right">
                  <div className={`text-xs ${theme.colors.text.muted}`}>Balance</div>
                  <div className={`text-sm font-semibold ${theme.colors.text.secondary}`}>
                    {formatBalance(balance)} SUI
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="primary" className="flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    {formatAddress(currentAccount.address)}
                  </Button>
                  <button
                    onClick={() => disconnect()}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Disconnect Wallet"
                  >
                    <LogOut className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </>
            ) : (
              <ConnectButton 
                className="!bg-gradient-to-r !from-purple-600 !to-pink-600 !text-white !font-semibold !px-6 !py-2 !rounded-lg hover:!from-purple-700 hover:!to-pink-700 !transition-all"
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};