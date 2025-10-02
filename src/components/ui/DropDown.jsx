import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

const Dropdown = ({ trigger, children, align = 'right', className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger || (
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-light rounded-lg hover:bg-neutral-800 transition-colors">
            <span>Options</span>
            <ChevronDown size={16} className={clsx('transition-transform', isOpen && 'rotate-180')} />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className={clsx(
            'absolute top-full mt-2 w-56 bg-primary-light border border-neutral-800 rounded-lg shadow-card z-50 overflow-hidden',
            align === 'left' ? 'left-0' : 'right-0',
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({ children, onClick, icon: Icon, className }) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-primary-dark transition-colors flex items-center gap-2',
        className
      )}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

export const DropdownDivider = () => {
  return <div className="h-px bg-neutral-800 my-1" />;
};

Dropdown.Item = DropdownItem;
Dropdown.Divider = DropdownDivider;

export default Dropdown;