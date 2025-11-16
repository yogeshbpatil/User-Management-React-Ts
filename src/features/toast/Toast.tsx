import React, { useEffect } from 'react';
import { useTypedSelector, useTypedDispatch } from '../../hooks/index';
import { hideToast } from '../../store/slices/toastSlice';

const Toast: React.FC = () => {
  const dispatch = useTypedDispatch();
  const { message, type, visible } = useTypedSelector((state: any) => state.toast);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      // No cleanup needed when not visible
      return;
    }
  }, [visible, dispatch]);

  if (!visible) return null;

  const getBackgroundColor = (): string => {
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
          onClick={() => dispatch(hideToast())}
        ></button>
      </div>
      <div className="toast-body">
        {message}
      </div>
    </div>
  );
};

export default Toast;
