'use client'

import React from 'react'
import PopupButton from './PopupButton'

const DialogPopup: React.FC<DialogPopupProps> = ({
  icon,
  label,
  popupTitle,
  message,
  size = 'small',
  position = 'center',
  action,
  onConfirm,
  onClose = () => {},
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  showCancelButton = true,
  type = 'info'
}) => {
  // Type-based styling
  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'error':
        return 'danger';
      case 'success':
        return 'success';
      case 'info':
      default:
        return 'text-primary';
    }
  }

  const handleConfirm = () => {
    if (onConfirm) {
      const result = onConfirm();
      
      if (result instanceof Promise) {
        return result;
      }
      
      return true;
    }
    return true;
  };

  const dialogContent = (
    <div className="flex flex-col">
      {/* Message content */}
      <div className="mb-4 text-[var(--text-medium)]">
        {typeof message === 'string' ? (
          <p className="text-[var(--text-medium)]">{message}</p>
        ) : (
          message
        )}
      </div>
    </div>
  );

  return (
    <PopupButton
      icon={icon}
      label={label}
      popupTitle={popupTitle}
      size={size}
      position={position}
      action={action}
      onConfirm={handleConfirm}
      onClose={onClose}
      confirmText={confirmText}
      confirmTextColor={getTypeStyles()}
      cancelText={cancelText}
      showCancelButton={showCancelButton}
      children={dialogContent}
    />
  );
};

export default DialogPopup