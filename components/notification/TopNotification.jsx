'use client'

import { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

const TopNotification = ({ 
  message, 
  type = 'success', 
  duration = 3000, 
  onClose,
  isVisible = false 
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Small delay to ensure smooth animation
      const showTimer = setTimeout(() => {
        setShow(true);
      }, 50);

      // Auto close after duration
      const closeTimer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose && onClose();
    }, 400); // Wait for animation to complete
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="w-4 h-4 text-white" />;
      case 'error':
        return <FaTimesCircle className="w-4 h-4 text-white" />;
      case 'warning':
        return <FaExclamationTriangle className="w-4 h-4 text-white" />;
      case 'info':
        return <FaInfoCircle className="w-4 h-4 text-white" />;
      default:
        return <FaCheckCircle className="w-4 h-4 text-white" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 border-green-700';
      case 'error':
        return 'bg-red-600 border-red-700';
      case 'warning':
        return 'bg-amber-600 border-amber-700';
      case 'info':
        return 'bg-slate-600 border-slate-700';
      default:
        return 'bg-green-600 border-green-700';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] pointer-events-none">
      <div className="flex justify-center pt-3 px-4">
        <div 
          className={`${getStyles()} border rounded-md shadow-lg transform transition-all duration-400 ease-out pointer-events-auto ${
            show 
              ? 'translate-y-0 opacity-100 scale-100' 
              : '-translate-y-6 opacity-0 scale-95'
          }`}
          style={{
            minWidth: '240px',
            maxWidth: '320px',
          }}
        >
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center space-x-2">
              {getIcon()}
              <p className="text-white font-medium text-xs leading-4">
                {message}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="flex-shrink-0 p-0.5 hover:bg-white/20 rounded-full transition-colors duration-200 ml-2"
            >
              <MdClose className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNotification; 