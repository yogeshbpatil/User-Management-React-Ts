import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-success';
      case 'error':
        return 'bg-danger';
      case 'info':
        return 'bg-info';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div 
      className={`toast show position-fixed top-0 end-0 m-3 ${getBackgroundColor()} text-white`}
      style={{ zIndex: 9999, minWidth: '300px' }}
      role="alert"
    >
      <div className="toast-header">
        <strong className="me-auto">
          {type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info'}
        </strong>
        <button 
          type="button" 
          className="btn-close" 
          onClick={onClose}
        ></button>
      </div>
      <div className="toast-body">
        {message}
      </div>
    </div>
  );
};

export default Toast;