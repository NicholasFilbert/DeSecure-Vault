import React, { useState, useEffect, useRef } from 'react';

const Popup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'medium',
  position = 'center',
  showCloseButton = true,
  closeOnEscape = true,
  closeOnOverlayClick = true,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when popup is open
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = ''; // Restore scrolling
    };
  }, [isOpen, onClose, closeOnEscape]);

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (closeOnOverlayClick && popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose, closeOnOverlayClick]);

  // Size class mapping
  const sizeClasses: Record<string, string> = {
    small: 'w-sm',
    medium: 'w-lg',
    large: 'w-2xl',
  };

  // Position class mapping
  const positionClasses: Record<string, string> = {
    center: 'items-center',
    top: 'items-start pt-16',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-dark/15 backdrop-blur-sm transition-opacity duration-300 ease-in-out p-4 overflow-y-auto">
      <div className={`flex ${positionClasses[position] || 'items-center'}`}>
        <div
          ref={popupRef}
          className={`${sizeClasses[size]} bg-[var(--bg-card)] rounded-lg shadow-xl border border-[var(--border-color)] transition-all duration-300 transform scale-100`}
        >
          <div className="flex justify-between items-center p-4 border-b border-[var(--border-color)]">
            <h3 className="text-lg font-semibold text-[var(--text-light)]">{title}</h3>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-[var(--text-muted)] hover:text-[var(--text-light)] transition-colors cursor-pointer"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>

          <div className="p-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Popup;