import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { HomePage } from './screens/HomePage';
import { ShopPage } from './screens/ShopPage';
import { MyCollectionPage } from './screens/MyCollectionPage';
import { MarketplacePage } from './screens/MarketplacePage';
import { TreasuryPage } from './screens/TreasuryPage';
import { theme } from './config/theme';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [collectionTab, setCollectionTab] = useState('all');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'shop':
        return <ShopPage />;
      case 'collection':
        return <MyCollectionPage collectionTab={collectionTab} setCollectionTab={setCollectionTab} />;
      case 'marketplace':
        return <MarketplacePage />;
      case 'treasury':
        return <TreasuryPage />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className={theme.colors.background.main + ' min-h-screen'}>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className={`${theme.spacing.container} py-8`}>
        {renderPage()}
      </main>
    </div>
  );
};

export default App;