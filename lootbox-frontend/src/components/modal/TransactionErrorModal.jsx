import React, { useState, useEffect } from 'react';
import { X, AlertCircle, XCircle, RefreshCw } from 'lucide-react';

export const TransactionErrorModal = ({ isOpen, onClose, onRetry, errorType = 'rejected' }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
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

  const handleRetry = () => {
    handleClose();
    setTimeout(() => {
      onRetry();
    }, 300);
  };

  if (!isOpen) return null;

  const errorMessages = {
    rejected: {
      title: 'Transaction Rejected',
      message: 'You rejected the transaction in your wallet.',
      icon: XCircle,
      iconColor: 'text-orange-500',
      bgGradient: 'from-orange-50 to-red-50',
    },
    failed: {
      title: 'Transaction Failed',
      message: 'The transaction failed to process. Please try again.',
      icon: AlertCircle,
      iconColor: 'text-red-500',
      bgGradient: 'from-red-50 to-pink-50',
    },
    insufficient: {
      title: 'Insufficient Balance',
      message: 'You don\'t have enough SUI to complete this transaction.',
      icon: AlertCircle,
      iconColor: 'text-yellow-500',
      bgGradient: 'from-yellow-50 to-orange-50',
    },
    network: {
      title: 'Network Error',
      message: 'Unable to connect to the network. Please check your connection.',
      icon: AlertCircle,
      iconColor: 'text-purple-500',
      bgGradient: 'from-purple-50 to-pink-50',
    },
  };

  const error = errorMessages[errorType] || errorMessages.failed;
  const Icon = error.icon;

  return (
    <div 
      className={`fixed inset-0 bg-black flex items-center justify-center z-50 transition-all duration-300 ${
        isAnimating ? 'bg-opacity-60' : 'bg-opacity-0'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden transition-all duration-300 transform ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className={`bg-gradient-to-br ${error.bgGradient} p-6 border-b border-gray-200`}>
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="p-8 text-center space-y-6">
          {/* Error Icon with Animation */}
          <div className="flex justify-center">
            <div className="relative">
              <div className={`w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center animate-shake`}>
                <Icon className={`w-12 h-12 ${error.iconColor}`} />
              </div>
              {/* Pulse effect */}
              <div className={`absolute inset-0 w-20 h-20 rounded-full ${error.iconColor.replace('text', 'bg')} opacity-20 animate-ping`}></div>
            </div>
          </div>

          {/* Error Title */}
          <h2 className="text-2xl font-bold text-gray-800">{error.title}</h2>

          {/* Error Message */}
          <p className="text-gray-600">{error.message}</p>

          {/* Additional Info Box */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-500 text-left">
              {errorType === 'rejected' && (
                <>
                  <span className="font-semibold text-gray-700">What happened?</span>
                  <br />
                  The transaction was cancelled before it could be submitted to the blockchain.
                </>
              )}
              {errorType === 'failed' && (
                <>
                  <span className="font-semibold text-gray-700">What happened?</span>
                  <br />
                  The transaction was submitted but failed during processing. Your funds are safe.
                </>
              )}
              {errorType === 'insufficient' && (
                <>
                  <span className="font-semibold text-gray-700">What happened?</span>
                  <br />
                  Your wallet doesn't have enough SUI to cover the transaction cost and gas fees.
                </>
              )}
              {errorType === 'network' && (
                <>
                  <span className="font-semibold text-gray-700">What happened?</span>
                  <br />
                  There was a problem connecting to the Sui network. Please try again in a moment.
                </>
              )}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {errorType !== 'insufficient' && (
              <button
                onClick={handleRetry}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
            )}
            <button
              onClick={handleClose}
              className="w-full bg-gray-100 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-200 transition-all"
            >
              {errorType === 'insufficient' ? 'Add Funds' : 'Back to Shop'}
            </button>
          </div>

          {/* Help Text */}
          <p className="text-xs text-gray-400">
            Need help? Check your wallet or contact support.
          </p>
        </div>

        <style jsx>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}</style>
      </div>
    </div>
  );
};
