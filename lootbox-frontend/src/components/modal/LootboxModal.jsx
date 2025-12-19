import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export const LootboxModal = ({ isOpen, onClose, lootboxData, onOpenLootbox }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  if (!isOpen || !lootboxData) return null;

  const { type, price, stock, maxStock, gradient, borderColor } = lootboxData;

  const rarityData = [
    { name: 'Common NFT', percentage: '50%', stocks: '498/500 Stocks' },
    { name: 'Rare', percentage: '25%', stocks: '125/500 Stocks' },
    { name: 'Super Rare', percentage: '15%', stocks: '75/500 Stocks' },
    { name: 'Super Super Rare', percentage: '7%', stocks: '35/500 Stocks' },
    { name: 'Ultra Rare', percentage: '2.5%', stocks: '12/500 Stocks' },
    { name: 'Legend Rare', percentage: '0.5%', stocks: '2/500 Stocks' },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % 3);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + 3) % 3);
  };

  return (
    <div 
      className={`fixed inset-0 bg-black flex items-center justify-center z-50 py-8 px-4 transition-all duration-300 ${
        isAnimating ? 'bg-opacity-60' : 'bg-opacity-0'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`bg-white rounded-2xl w-full max-w-6xl max-h-full overflow-y-auto shadow-2xl transition-all duration-300 transform ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`${gradient} border-b ${borderColor} p-6 relative`}>
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white bg-opacity-80 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{type} Lootbox</h2>
              <p className="text-sm text-gray-600">Open to reveal your NFT</p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Left Side - Image Carousel */}
            <div className="space-y-4">
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 aspect-square flex items-center justify-center border-2 border-gray-200">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl mb-4 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-white" />
                  </div>
                  <p className="text-gray-600 text-sm">Preview of available NFTs</p>
                </div>
                
                {/* Carousel Controls */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* Image Indicators */}
              <div className="flex justify-center gap-2">
                {[0, 1, 2].map((index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentImageIndex === index
                        ? 'bg-purple-600 w-6'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              <div className="text-center text-sm text-gray-500">
                Viewing example NFT {currentImageIndex + 1} of 3
              </div>
            </div>

            {/* Right Side - Stats and Purchase */}
            <div className="space-y-6">
              {/* Current Stocks */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3">Current Stocks</h3>
                <div className="space-y-2">
                  {rarityData.map((rarity, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700 flex-1">{rarity.name}</span>
                      <span className="text-gray-600 font-medium mx-4">{rarity.percentage}</span>
                      <span className="text-gray-600 font-medium">{rarity.stocks}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock Progress */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">Remaining Stock</span>
                  <span className="text-sm font-bold text-purple-600">{stock}/{maxStock}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full transition-all"
                    style={{ width: `${(stock / maxStock) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Price Display */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Price per box</p>
                  <p className="text-4xl font-bold text-gray-800">{price} SUI</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={onOpenLootbox}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Open Lootbox
                </button>
                <button
                  onClick={handleClose}
                  className="w-full bg-gray-100 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-200 transition-all"
                >
                  Back to Shop
                </button>
              </div>

              {/* Info Text */}
              <p className="text-xs text-center text-gray-500">
                Each lootbox guarantees one NFT. Odds are transparent and verifiable on-chain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};