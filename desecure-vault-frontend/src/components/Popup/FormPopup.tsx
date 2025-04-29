'use client'

import React, { useState } from 'react'
import PopupButton from './PopupButton'
import { faUser } from '@fortawesome/free-solid-svg-icons'

const FormPopup: React.FC<FormPopupProps> = ({
  icon,
  label = 'Button',
  popupTitle,
  fields,
  size = 'medium',
  position = 'center',
  action,
  onConfirm,
  onClose = () => {},
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  showCancelButton = true,
}) => {
  const initializeFormData = () => {
    const data: Record<string, string> = {};
    fields.forEach(field => {
      data[field.name] = field.defaultValue?.toString() || '';
    });
    return data;
  };

  const initializeErrorState = () => {
    const errorState: Record<string, string> = {};
    fields.forEach(field => {
      errorState[field.name] = '';
    });
    return errorState;
  };

  const [formData, setFormData] = useState<Record<string, string>>(initializeFormData());
  const [errors, setErrors] = useState<Record<string, string>>(initializeErrorState());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    fields.forEach(field => {
      const value = formData[field.name];

      // Skip validation if field is not required and empty
      if (!field.required && (!value || value.trim() === '')) {
        return;
      }

      // Required field validation
      if (field.required && (!value || value.trim() === '')) {
        newErrors[field.name] = `${field.label} is required`;
        valid = false;
        return;
      }

      // Email validation
      if (field.type === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
        newErrors[field.name] = 'Please enter a valid email address';
        valid = false;
        return;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if(validateForm()) {
      const confirm = onConfirm?.(formData);
      if(typeof confirm === 'boolean')
        return confirm
    
      if(confirm instanceof Promise) {
        const resolved = await confirm
        if(typeof resolved === 'boolean')
          return resolved
      }

      return true
    }
    return false
  };

  const children = (
    <>
      {fields.map((field) => {
        const currentError = errors[field.name];

        return (
          <div key={field.name} className="mb-4">
            <label
              htmlFor={field.name}
              className="block text-sm font-medium mb-1"
            >
              {field.label}
              {field.required && <span className="text-danger ml-1">*</span>}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={field.onChange || handleChange}
              onBlur={field.onBlur}
              required={field.required}
              disabled={field.disabled}
              readOnly={field.readOnly}
              autoComplete={field.autoComplete}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary ${currentError ? 'border-danger-border' : 'border-gray-300'
                } ${field.disabled ? 'bg-gray-100 text-gray-500' : ''} ${field.className || ''}`}
            />
            {currentError && (
              <p className="mt-1 text-sm text-danger-border">{currentError}</p>
            )}
            {!currentError && field.helperText && (
              <p className="mt-1 text-sm text-gray-500">{field.helperText}</p>
            )}
          </div>
        );
      })}
    </>
  )

  return (
    <PopupButton
      icon={icon}
      label={label}
      popupTitle={popupTitle}
      size={size}
      position={position}
      action={action}
      onConfirm={handleSubmit}
      onClose={onClose}
      confirmText={confirmText}
      cancelText={cancelText}
      showCancelButton={showCancelButton}
      children={children}
    />
  )

};


export default FormPopup