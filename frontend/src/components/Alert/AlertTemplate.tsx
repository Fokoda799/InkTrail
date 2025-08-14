// components/AlertTemplate.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

interface AlertTemplateProps {
  message: React.ReactNode;
  options: {
    type: 'info' | 'success' | 'error';
    timeout?: number;
  };
  style?: React.CSSProperties;
  close: () => void;
}

const typeStyles = {
  info: {
    icon: <FiInfo className="w-5 h-5" />,
    bg: 'bg-gradient-to-r from-amber-50 to-orange-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
    bar: 'bg-gradient-to-r from-amber-500 to-orange-500',
    hover: 'hover:bg-amber-100/30',
  },
  success: {
    icon: <FiCheckCircle className="w-5 h-5" />,
    bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
    border: 'border-green-200',
    text: 'text-green-800',
    iconBg: 'bg-gradient-to-br from-green-400 to-emerald-500',
    bar: 'bg-gradient-to-r from-green-500 to-emerald-500',
    hover: 'hover:bg-green-100/30',
  },
  error: {
    icon: <FiAlertTriangle className="w-5 h-5" />,
    bg: 'bg-gradient-to-r from-red-50 to-rose-50',
    border: 'border-red-200',
    text: 'text-red-800',
    iconBg: 'bg-gradient-to-br from-red-400 to-rose-500',
    bar: 'bg-gradient-to-r from-red-500 to-rose-500',
    hover: 'hover:bg-red-100/30',
  },
};

const AlertTemplate: React.FC<AlertTemplateProps> = ({ style, options, message, close }) => {
  const { type, timeout = 5000 } = options;
  const styles = typeStyles[type] || typeStyles.info;

  const [progress, setProgress] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => close(), 250);
  }, [close]);

  useEffect(() => {
    const interval = 50; // smoother progress bar animation
    const increment = (interval / timeout) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev + increment >= 100) {
          clearInterval(timer);
          handleClose();
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [timeout, handleClose]);

  return (
    <div
      style={style}
      className={`relative overflow-hidden transition-all duration-300 ease-out mb-3 ml-3 pointer-events-auto
        ${isClosing ? 'opacity-0 scale-95 translate-y-2' : 'opacity-100 scale-100'}`}
    >
      <div
        className={`flex items-center gap-4 px-6 py-4 rounded-xl shadow-lg border 
          ${styles.bg} ${styles.border} ${styles.text} backdrop-blur-md bg-opacity-80`}
      >
        <div className={`p-2 ${styles.iconBg} rounded-full text-white flex-shrink-0 shadow-inner`}>
          {styles.icon}
        </div>
        <span className="flex-1 text-sm font-medium leading-relaxed">{message}</span>
        <button
          onClick={handleClose}
          className={`p-1.5 rounded-full z-10 transition-all duration-200 flex-shrink-0 active:scale-90 ${styles.hover}`}
          aria-label="Close alert"
        >
          <AiOutlineClose className="w-4 h-4 opacity-70 hover:opacity-100" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100/50 overflow-hidden rounded-b pointer-events-none">
        <div
          className={`h-full ${styles.bar} transition-[width] duration-50 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>

    </div>
  );
};

export default AlertTemplate;
