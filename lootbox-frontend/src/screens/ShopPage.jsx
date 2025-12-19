import React, { useState } from 'react';
import { LootboxCard } from '../components/cards/LootboxCard';
import { LootboxModal } from '../components/modal/LootboxModal';
import { LootboxResultModal } from '../components/modal/LootboxResultModal';
import { TransactionErrorModal } from '../components/modal/TransactionErrorModal';
import { theme } from '../config/theme';

export const ShopPage = () => {
  const [lootboxModalOpen, setLootboxModalOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [selectedLootbox, setSelectedLootbox] = useState(null);
  const [errorType, setErrorType] = useState('rejected');
  const [nftResult, setNftResult] = useState(null);

  const handleOpenModal = (lootboxData) => {
    setSelectedLootbox(lootboxData);
    setLootboxModalOpen(true);
  };

  const handleOpenLootbox = async () => {
    // Close the lootbox selection modal
    setLootboxModalOpen(false);

    try {
      // Simulate wallet transaction
      // In production, replace this with actual wallet integration
      const simulateTransaction = () => {
        return new Promise((resolve, reject) => {
          // Simulate random outcomes for demo
          const random = Math.random();
          
          setTimeout(() => {
            if (random > 0.7) {
              // 30% chance of error
              if (random > 0.85) {
                reject({ type: 'rejected' });
              } else if (random > 0.8) {
                reject({ type: 'insufficient' });
              } else {
                reject({ type: 'failed' });
              }
            } else {
              // 70% chance of success
              resolve({
                name: 'Cosmic Dragon',
                id: Math.floor(Math.random() * 9999),
                image: null,
                rarity: ['Common', 'Rare', 'Super Rare', 'Ultra Rare', 'Legend Rare'][
                  Math.floor(Math.random() * 5)
                ],
              });
            }
          }, 1000);
        });
      };

      // Show result modal immediately (it will show "Processing" stage)
      setResultModalOpen(true);

      // Wait for transaction
      const result = await simulateTransaction();
      
      // Set NFT result (modal will automatically progress to reveal and result stages)
      setNftResult(result);

    } catch (error) {
      // Close result modal if it's open
      setResultModalOpen(false);
      
      // Show error modal
      setErrorType(error.type || 'failed');
      setErrorModalOpen(true);
    }
  };

  const handleRetryTransaction = () => {
    // Reopen the lootbox modal to try again
    setLootboxModalOpen(true);
  };

  const handleCloseResultModal = () => {
    setResultModalOpen(false);
    setNftResult(null);
  };

  return (
    <>
      <div className={theme.spacing.section}>
        <h1 className={`text-3xl font-bold ${theme.colors.text.primary} mb-2`}>Lootbox Shop</h1>
        <p className={`${theme.colors.text.secondary} mb-6`}>
          Mint new NFTs or try your luck with the recycled pool.
        </p>
        
        <div className="flex items-center justify-end mb-6">
          <span className={`text-sm ${theme.colors.text.muted} flex items-center gap-2`}>
            <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
            Provably fair randomness
          </span>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <LootboxCard 
            type="Bronze"
            stock={412}
            maxStock={500}
            price="0.01"
            gradient="bg-gradient-to-br from-yellow-50 to-orange-50"
            borderColor="border-yellow-200"
            description="High chance for Common & Rare. Small chance for Legendary"
            onOpenBox={() => handleOpenModal({
              type: "Bronze",
              stock: 412,
              maxStock: 500,
              price: "0.01",
              gradient: "bg-gradient-to-br from-yellow-50 to-orange-50",
              borderColor: "border-yellow-200"
            })}
          />
          <LootboxCard 
            type="Silver"
            stock={289}
            maxStock={500}
            price="0.05"
            gradient="bg-gradient-to-br from-gray-50 to-gray-100"
            borderColor="border-gray-300"
            description="Balanced odds. Better chance for SR and SSR tiers."
            onOpenBox={() => handleOpenModal({
              type: "Silver",
              stock: 289,
              maxStock: 500,
              price: "0.05",
              gradient: "bg-gradient-to-br from-gray-50 to-gray-100",
              borderColor: "border-gray-300"
            })}
          />
          <LootboxCard 
            type="Gold"
            stock={84}
            maxStock={300}
            price="0.1"
            gradient="bg-gradient-to-br from-yellow-100 to-yellow-200"
            borderColor="border-yellow-400"
            description="Premium tier. Highest odds for UR and LR drops."
            onOpenBox={() => handleOpenModal({
              type: "Gold",
              stock: 84,
              maxStock: 300,
              price: "0.1",
              gradient: "bg-gradient-to-br from-yellow-100 to-yellow-200",
              borderColor: "border-yellow-400"
            })}
          />
          <LootboxCard 
            type="Recycled"
            stock={842}
            maxStock={999}
            price="0.005"
            gradient="bg-gradient-to-br from-green-50 to-emerald-50"
            borderColor="border-green-300"
            description="Contains NFTs returned by other players. Discounted price."
            onOpenBox={() => handleOpenModal({
              type: "Recycled",
              stock: 842,
              maxStock: 999,
              price: "0.005",
              gradient: "bg-gradient-to-br from-green-50 to-emerald-50",
              borderColor: "border-green-300"
            })}
          />
        </div>
      </div>

      {/* Modals */}
      <LootboxModal
        isOpen={lootboxModalOpen}
        onClose={() => setLootboxModalOpen(false)}
        lootboxData={selectedLootbox}
        onOpenLootbox={handleOpenLootbox}
      />

      <LootboxResultModal
        isOpen={resultModalOpen}
        onClose={handleCloseResultModal}
        nftResult={nftResult}
        rarity={nftResult?.rarity}
      />

      <TransactionErrorModal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        onRetry={handleRetryTransaction}
        errorType={errorType}
      />
    </>
  );
};