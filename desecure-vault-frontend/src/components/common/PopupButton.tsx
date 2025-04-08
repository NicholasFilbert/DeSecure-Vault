'use client'

import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, ReactNode } from 'react'
import Popup from './Popup'

const PopupButton: React.FC<PopupButtonProps> = ({
  icon,
  label = 'Button',
  popupTitle,
  children,
  size = 'medium',
  position = 'center',
  action,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  showCancelButton = true
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleOpen = () => {
    setIsOpen(true)
    if (action) {
      action()
    }
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    setIsOpen(false)
  }

  return (
    <>
      <button className="btn btn-primary" onClick={handleOpen}>
        {icon && <FontAwesomeIcon icon={icon} />}
        <span>{label}</span>
      </button>

      <Popup
        isOpen={isOpen}
        onClose={handleClose}
        title={popupTitle}
        size={size}
        position={position}
      >
        <div>
          <div className="mb-4">
            {children}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            {showCancelButton && (
              <button onClick={handleClose} className="btn btn-outline">
                {cancelText}
              </button>
            )}
            <button onClick={handleConfirm} className="btn btn-primary">
              {confirmText}
            </button>
          </div>
        </div>
      </Popup>
    </>
  )
}

export default PopupButton