'use client'

// Dropdown.tsx
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, IconDefinition } from '@fortawesome/free-solid-svg-icons';

// Define types for dropdown items
interface DropdownItemBase {
  icon?: IconDefinition;
  label: string;
  id: string;
}

// For items that just execute a function
interface DropdownItemWithAction extends DropdownItemBase {
  type: 'action';
  onClick: () => void;
  component?: never;
}

// For items that open a popup component
interface DropdownItemWithComponent extends DropdownItemBase {
  type: 'component';
  component: React.ReactNode;
  onClick?: never;
}

type DropdownItem = DropdownItemWithAction | DropdownItemWithComponent;

interface DropdownProps {
  buttonText: string;
  buttonIcon?: IconDefinition;
  items: DropdownItem[];
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  dropdownItemClassName?: string;
  position?: 'left' | 'right';
}

const Dropdown: React.FC<DropdownProps> = ({
  buttonText,
  buttonIcon,
  items,
  className = '',
  buttonClassName = '',
  dropdownClassName = '',
  dropdownItemClassName = '',
  position = 'left'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeComponentId, setActiveComponentId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setActiveComponentId(null);
    }
  };

  const handleItemClick = (item: DropdownItem) => {
    if (item.type === 'action' && item.onClick) {
      item.onClick();
    } else if (item.type === 'component') {
      setActiveComponentId(item.id);
    }
    setIsOpen(false);
  };

  const positionClass = position === 'right' ? 'right-0' : 'left-0';

  // Find the active component to render
  const activeComponent = activeComponentId
    ? items.find(item => item.type === 'component' && item.id === activeComponentId)?.component
    : null;

  return (
    <div className={`relative z-25 inline-block ${className}`} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`flex items-center cursor-pointer space-x-2 ${buttonClassName || 'bg-primary hover:bg-primary-dark px-4 py-2 rounded'}`}
        type="button"
      >
        {buttonIcon && <span className="mr-2"><FontAwesomeIcon icon={buttonIcon} /></span>}
        <span>{buttonText}</span>
        <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
      </button>

      {isOpen && !activeComponentId && (
        <div className={`absolute ${positionClass} mt-2 z-10 min-w-[180px] rounded-md shadow-lg ${dropdownClassName || 'bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700'}`}>
          <ul className="py-1">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  className={`w-full cursor-pointer text-left px-4 py-2 flex items-center ${dropdownItemClassName || 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                >
                  {item.icon && <span className="mr-2"><FontAwesomeIcon icon={item.icon}/></span>}
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeComponentId && (
        <>
          {activeComponent}
        </>
      )}

      {/* {activeComponentId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            {activeComponent}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Dropdown;