'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'

const Button: React.FC<ButtonProps> = ({
  icon,
  label,
  tooltip,
  action,
  className = ''
}) => {
  return (
    <>
      <button onClick={action} title={tooltip} className={`btn btn-primary ${className}`}>
        {icon && <FontAwesomeIcon
          icon={icon}
        />}
        {label}
      </button>

    </>
  )
}

export default Button