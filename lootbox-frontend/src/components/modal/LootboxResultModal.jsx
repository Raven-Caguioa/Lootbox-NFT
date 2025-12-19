import React, { useState, useEffect } from 'react';
import { X, Loader2, Sparkles, Check } from 'lucide-react';

export const LootboxResultModal = ({ isOpen, onClose, nftResult, rarity }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [stage, setStage] = useState('processing'); // 'processing', 'revealing', 'result'
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setStage('processing');
      
      // Simulate transaction processing
      setTimeout(() => {
        setStage('revealing');
      }, 2000);
      
      // Show result
      setTimeout(() => {
        setStage('result');
        generateConfetti();
      }, 3500);
    } else {
      setStage('processing');
      setConfetti([]);
    }
  }, [isOpen]);

  const generateConfetti = () => {
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
    }));
    setConfetti(newConfetti);
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  if (!isOpen) return null;

  const getRarityColor = (rarity) => {
    const colors = {
      common: 'from-gray-400 to-gray-600',
      rare: 'from-blue-400 to-blue-600',
      'super rare': 'from-purple-400 to-purple-600',
      'super super rare': 'from-pink-400 to-pink-600',
      'ultra rare': 'from-yellow-400 to-orange-600',
      'legend rare': 'from-red-400 via-pink-500 to-purple-600',
    };
    return colors[rarity?.toLowerCase()] || colors.common;
  };

  const rarityGradient = getRarityColor(rarity);

  return (
    <div 
      className={`fixed inset-0 bg-black flex items-center justify-center z-50 transition-all duration-300 ${
        isAnimating ? 'bg-opacity-70' : 'bg-opacity-0'
      }`}
      onClick={stage === 'result' ? handleClose : undefined}
    >
      <div 
        className={`bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden transition-all duration-300 transform relative ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Confetti Animation */}
        {stage === 'result' && confetti.map((item) => (
          <div
            key={item.id}
            className="absolute w-2 h-2 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full animate-fall"
            style={{
              left: `${item.left}%`,
              top: '-10px',
              animationDelay: `${item.delay}s`,
              animationDuration: `${item.duration}s`,
            }}
          />
        ))}

        {/* Close button - only show on result stage */}
        {stage === 'result' && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all z-10"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        )}

        <div className="p-8">
          {/* Processing Stage */}
          {stage === 'processing' && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <Loader2 className="w-16 h-16 text-purple-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Processing Transaction</h2>
              <p className="text-gray-600">Please confirm the transaction in your wallet...</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Waiting for confirmation</span>
              </div>
            </div>
          )}

          {/* Revealing Stage */}
          {stage === 'revealing' && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl animate-pulse"></div>
                  <Sparkles className="w-12 h-12 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Opening Lootbox...</h2>
              <p className="text-gray-600">Revealing your NFT!</p>
            </div>
          )}

          {/* Result Stage */}
          {stage === 'result' && (
            <div className="text-center space-y-6 animate-fadeIn">
              <h2 className="text-3xl font-bold text-gray-800">You got ....</h2>
              
              {/* NFT Image Container */}
              <div className={`mx-auto w-48 h-48 bg-gradient-to-br ${rarityGradient} rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform`}>
                {nftResult?.image ? (
                  <img src={nftResult.image} alt={nftResult.name} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <div className="text-white text-2xl font-bold">NFT IMG</div>
                )}
              </div>

              {/* NFT Details */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-800">
                  {nftResult?.name || 'NFT Name'} 
                  <span className="text-lg text-gray-600"> ({rarity || 'Rare'})</span>
                </h3>
                <p className="text-sm text-gray-500">Id: #{nftResult?.id || '####'}</p>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold py-4 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg"
              >
                Confirm
              </button>

              <p className="text-xs text-gray-500 italic">
                The outer bg color changes based on the rarity
              </p>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes fall {
            to {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
            }
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-fall {
            animation: fall linear infinite;
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
};