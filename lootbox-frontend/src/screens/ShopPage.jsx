import React, { useState, useEffect } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { LootboxCard } from '../components/cards/LootboxCard';
import { LootboxModal } from '../components/modal/LootboxModal';
import { LootboxResultModal } from '../components/modal/LootboxResultModal';
import { TransactionErrorModal } from '../components/modal/TransactionErrorModal';
import { theme } from '../config/theme';
import { CONTRACTS } from '../config/contracts';
import { 
  fetchLootboxV1Data, 
  calculateTotalStock,
  calculateMaxStockV1 
} from '../services/lootboxService';
import { fetchPoolData } from '../services/poolService';
import { getRarityColorClass, RARITY_NAMES } from '../services/nftService';

export const ShopPage = () => {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [lootboxModalOpen, setLootboxModalOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [selectedLootbox, setSelectedLootbox] = useState(null);
  const [errorType, setErrorType] = useState('rejected');
  const [nftResult, setNftResult] = useState(null);
  
  // Blockchain data
  const [lootboxData, setLootboxData] = useState(null);
  const [poolData, setPoolData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch lootbox and pool data on mount
  useEffect(() => {
    fetchBlockchainData();
    const interval = setInterval(fetchBlockchainData, 15000); // Refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const fetchBlockchainData = async () => {
    try {
      setLoading(true);
      
      // Fetch Bronze V1 lootbox data
      const bronzeData = await fetchLootboxV1Data(suiClient, CONTRACTS.LOOTBOXES.BRONZE_V1);
      setLootboxData(bronzeData);
      
      // Fetch pool data
      const pool = await fetchPoolData(suiClient);
      setPoolData(pool);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blockchain data:', error);
      setLoading(false);
    }
  };

  const handleOpenModal = (lootboxDisplayData) => {
    setSelectedLootbox(lootboxDisplayData);
    setLootboxModalOpen(true);
  };

  const handleOpenLootbox = async () => {
    if (!currentAccount) {
      alert('Please connect your wallet first!');
      return;
    }

    setLootboxModalOpen(false);

    try {
      // Show processing modal
      setResultModalOpen(true);
      setNftResult(null);

      // Create transaction
      const tx = new Transaction();
      
      // Split coin for exact payment
      const [coin] = tx.splitCoins(tx.gas, [lootboxData.priceInMist]);
      
      // Call open_lootbox
      tx.moveCall({
        target: `${CONTRACTS.PACKAGE_ID}::lootbox::open_lootbox`,
        arguments: [
          tx.object(CONTRACTS.LOOTBOXES.BRONZE_V1),
          tx.object(CONTRACTS.POOL_ID),
          coin,
          tx.object(CONTRACTS.RANDOM_OBJECT),
        ],
      });

      // Execute transaction
      signAndExecuteTransaction(
        {
          transaction: tx,
          chain: 'sui:testnet',
        },
        {
          onSuccess: async (result) => {
            console.log('Transaction successful:', result);
            
            try {
              // Wait a bit for the transaction to be processed
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              // Extract NFT from transaction
              const createdObjects = result.effects?.created?.filter(
                (obj) => obj.owner && typeof obj.owner === 'object' && 'AddressOwner' in obj.owner
              );

              if (createdObjects && createdObjects.length > 0) {
                const nftId = createdObjects[0].reference.objectId;
                
                // Fetch the full NFT object
                const nftObject = await suiClient.getObject({
                  id: nftId,
                  options: { showContent: true },
                });

                const fields = nftObject.data?.content?.fields;
                
                if (fields) {
                  setNftResult({
                    name: fields.name,
                    id: fields.sequential_id,
                    image: fields.image_url || null,
                    rarity: fields.rarity,
                    rarityName: RARITY_NAMES[fields.rarity] || 'Unknown',
                  });
                }
              }

              // Refresh data after successful transaction
              await fetchBlockchainData();
            } catch (extractError) {
              console.error('Error extracting NFT:', extractError);
              // Still show a success message even if we can't extract the NFT details
              setNftResult({
                name: 'NFT Minted',
                id: '???',
                image: null,
                rarity: 0,
                rarityName: 'Success',
              });
            }
          },
          onError: (error) => {
            console.error('Transaction error:', error);
            
            // Close result modal
            setResultModalOpen(false);
            
            // Determine error type
            let errorType = 'failed';
            const errorMessage = error.message?.toLowerCase() || '';
            
            if (errorMessage.includes('user rejected') || errorMessage.includes('rejected')) {
              errorType = 'rejected';
            } else if (errorMessage.includes('insufficient') || errorMessage.includes('balance')) {
              errorType = 'insufficient';
            } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
              errorType = 'network';
            }
            
            setErrorType(errorType);
            setErrorModalOpen(true);
          },
        }
      );

    } catch (error) {
      console.error('Transaction setup error:', error);
      
      // Close result modal if open
      setResultModalOpen(false);
      
      setErrorType('failed');
      setErrorModalOpen(true);
    }
  };

  const handleRetryTransaction = () => {
    setLootboxModalOpen(true);
  };

  const handleCloseResultModal = () => {
    setResultModalOpen(false);
    setNftResult(null);
  };

  // Calculate display data
  const totalStock = lootboxData ? calculateTotalStock(lootboxData.stocks) : 0;
  const maxStock = calculateMaxStockV1();
  const price = lootboxData?.price?.toFixed(3) || '0.000';

  return (
    <>
      <div className={theme.spacing.section}>
        <h1 className={`text-3xl font-bold ${theme.colors.text.primary} mb-2`}>Lootbox Shop</h1>
        <p className={`${theme.colors.text.secondary} mb-6`}>
          Mint new NFTs or try your luck with the recycled pool.
        </p>
        
        <div className="flex items-center justify-between mb-6">
          <span className={`text-sm ${theme.colors.text.muted} flex items-center gap-2`}>
            <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
            Provably fair randomness
          </span>
          
          {poolData && (
            <span className={`text-sm ${theme.colors.text.muted}`}>
              Treasury Pool: <span className="font-bold text-purple-600">{poolData.balance.toFixed(2)} SUI</span>
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-6">
            {/* Bronze Lootbox - Connected to blockchain */}
            <LootboxCard 
              type="Bronze"
              stock={totalStock}
              maxStock={maxStock}
              price={price}
              gradient="bg-gradient-to-br from-yellow-50 to-orange-50"
              borderColor="border-yellow-200"
              description="High chance for Common & Rare. Small chance for Legendary"
              onOpenBox={() => handleOpenModal({
                type: "Bronze",
                stock: totalStock,
                maxStock: maxStock,
                price: price,
                gradient: "bg-gradient-to-br from-yellow-50 to-orange-50",
                borderColor: "border-yellow-200",
                stocks: lootboxData?.stocks,
                priceInMist: lootboxData?.priceInMist,
              })}
              disabled={totalStock === 0 || !currentAccount}
            />

            {/* Placeholder lootboxes (not yet deployed) */}
            <LootboxCard 
              type="Silver"
              stock={0}
              maxStock={500}
              price="0.050"
              gradient="bg-gradient-to-br from-gray-50 to-gray-100"
              borderColor="border-gray-300"
              description="Coming soon..."
              onOpenBox={() => alert('Silver lootbox not yet deployed')}
              disabled={true}
            />
            
            <LootboxCard 
              type="Gold"
              stock={0}
              maxStock={300}
              price="0.100"
              gradient="bg-gradient-to-br from-yellow-100 to-yellow-200"
              borderColor="border-yellow-400"
              description="Coming soon..."
              onOpenBox={() => alert('Gold lootbox not yet deployed')}
              disabled={true}
            />
            
            <LootboxCard 
              type="Recycled"
              stock={poolData?.recycledNFTCount || 0}
              maxStock={999}
              price="0.005"
              gradient="bg-gradient-to-br from-green-50 to-emerald-50"
              borderColor="border-green-300"
              description="Contains NFTs returned by other players. Discounted price."
              onOpenBox={() => alert('Recycled lootbox opening coming soon')}
              disabled={true}
            />
          </div>
        )}

        {!currentAccount && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
            <p className="text-yellow-800 font-medium">
              Please connect your wallet to open lootboxes
            </p>
          </div>
        )}
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
        rarity={nftResult ? nftResult.rarityName : undefined}
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