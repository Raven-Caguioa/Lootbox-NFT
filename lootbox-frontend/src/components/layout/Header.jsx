import React from 'react';
import { Wallet, Package } from 'lucide-react';
import { Button } from '../ui/Button';
import { theme } from '../../config/theme';

export const Header = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'collection', label: 'My Collection' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'treasury', label: 'Treasury' }
  ];

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
            <div className="text-right">
              <div className={`text-xs ${theme.colors.text.muted}`}>Balance</div>
              <div className={`text-sm font-semibold ${theme.colors.text.secondary}`}>142.08 SUI</div>
            </div>
            <Button variant="primary" className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              0x4a...8992
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};