import React, { useState, useRef, useEffect } from 'react';
import { useSlate } from 'slate-react';
import { addMarkData, activeMark } from '../../utils/SlateUtilityFunctions';
import './FontSize.css';

const FontSize = () => {
  const editor = useSlate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [customSize, setCustomSize] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef(null);

  // Predefined font sizes in pixels
  const fontSizes = [
    { label: '8px', value: '8px' },
    { label: '10px', value: '10px' },
    { label: '12px', value: '12px' },
    { label: '14px', value: '14px' },
    { label: '16px', value: '16px' },
    { label: '18px', value: '18px' },
    { label: '20px', value: '20px' },
    { label: '24px', value: '24px' },
    { label: '28px', value: '28px' },
    { label: '32px', value: '32px' },
    { label: '36px', value: '36px' },
    { label: '40px', value: '40px' },
    { label: '48px', value: '48px' },
    { label: '56px', value: '56px' },
    { label: '64px', value: '64px' },
    { label: '72px', value: '72px' },
  ];

  // Get current font size
  const currentSize = activeMark(editor, 'fontSize');
  
  // Convert current size to display format
  const getDisplaySize = () => {
    if (!currentSize || currentSize === 'normal') return '16';
    
    // Check if it's one of the old format sizes
    const oldSizeMap = {
      small: '12',
      normal: '16',
      medium: '28',
      huge: '40'
    };
    
    if (oldSizeMap[currentSize]) {
      return oldSizeMap[currentSize];
    }
    
    // Extract numeric value from px string
    const match = currentSize.match(/(\d+)/);
    return match ? match[1] : '16';
  };

  const handleSizeChange = (size: any) => {
    addMarkData(editor, { format: 'fontSize', value: size });
    setShowDropdown(false);
  };

  const handleCustomSize = (e: any) => {
    e.preventDefault();
    const size = parseInt(customSize);
    if (size && size >= 8 && size <= 200) {
      handleSizeChange(`${size}px`);
      setCustomSize('');
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showDropdown]);

  return (
    <div className="font-size-picker" ref={dropdownRef}>
      <button
        className="font-size-button"
        onClick={() => setShowDropdown(!showDropdown)}
        onMouseDown={(e) => e.preventDefault()}
      >
        <span className="font-size-value">{getDisplaySize()}</span>
        <span className="font-size-arrow">▼</span>
      </button>

      {showDropdown && (
        <div className="font-size-dropdown">
          <div className="font-size-list">
            {fontSizes.map((size) => (
              <div
                key={size.value}
                className={`font-size-option ${currentSize === size.value ? 'active' : ''}`}
                onClick={() => handleSizeChange(size.value)}
                onMouseDown={(e) => e.preventDefault()}
              >
                {size.label}
              </div>
            ))}
          </div>
          
          <div className="custom-size-section">
            <form onSubmit={handleCustomSize}>
              <input
                type="number"
                placeholder="Custom"
                value={customSize}
                onChange={(e) => setCustomSize(e.target.value)}
                min="8"
                max="200"
                className="custom-size-input"
              />
              <button type="submit" className="custom-size-btn">
                OK
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FontSize;