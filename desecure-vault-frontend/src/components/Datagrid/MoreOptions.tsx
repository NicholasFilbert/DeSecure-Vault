'use client'

import { faEllipsisV, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState, useRef, useEffect } from 'react'

const MoreOptions = ({
  id,
  detailContent,
  data
}: {
  id: string,
  detailContent: Array<{
    label: string,
    action: (id: string, data: any) => void,
    icon: IconDefinition,
  }>,
  data: any
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hasItem = detailContent.filter(item => !item.type || item.type === data.type).length > 0;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const openMore = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={menuRef}>
      {hasItem && (
        <button
          onClick={openMore}
          className="p-1 rounded-full w-8 h-8 cursor-pointer hover:bg-gray-200 transition-colors ml-auto block"
        >
          <FontAwesomeIcon icon={faEllipsisV} className="text-gray-500" />
        </button>
      )}

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-dark rounded-md shadow-lg z-10 border border-gray-200">
          <div className="py-1">
            {detailContent.map((item, index) => {
              if (!!item.type && item.type !== data.type)
                return null

              return (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    item.action(id, data);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-primary/20 cursor-pointer"
                >
                  {item.icon && (
                    <FontAwesomeIcon icon={item.icon} className="me-3" />
                  )}
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoreOptions