'use client'

import React, { useState } from 'react'
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
  onClose = () => {},
  confirmText = 'Confirm',
  confirmTextColor = 'primary',
  cancelText = 'Cancel',
  cancelTextColor = 'outline',
  showCancelButton = true,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true)

  const handleOpen = () => {
    setIsOpen(true)
    if (action) {
      action()
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    onClose();
  }

  const handleConfirm = async () => {
    let confirm = true
    if (onConfirm) {
      confirm = await onConfirm() ?? true
    }

    if(confirm)
      setIsOpen(false)
  }

  return (
    <>
      {/* <button className="btn btn-primary" onClick={handleOpen}>
        {icon && <FontAwesomeIcon icon={icon} />}
        <span>{label}</span>
      </button> */}

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
              <button onClick={handleClose} className={`btn btn-${cancelTextColor}`}>
                {cancelText}
              </button>
            )}
            <button onClick={handleConfirm} className={`btn btn-${confirmTextColor}`}>
              {confirmText}
            </button>
          </div>
        </div>
      </Popup>
    </>
  )
}

export default PopupButton