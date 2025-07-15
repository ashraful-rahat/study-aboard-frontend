import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useRef,
  useEffect,
} from "react";
import { motion } from "framer-motion"; // ✅ Make sure framer-motion is installed

// --- Context for Select State ---
interface SelectContextType {
  value: string;
  onValueChange: (newValue: string) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  placeholder?: string;
}

const SelectContext = createContext<SelectContextType | undefined>(undefined);

const useSelect = () => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("useSelect must be used within a SelectProvider");
  }
  return context;
};

// --- Select Component ---
interface SelectProps {
  children: ReactNode;
  value: string;
  onValueChange: (newValue: string) => void;
  placeholder?: string;
}

export const Select = ({
  children,
  value,
  onValueChange,
  placeholder,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const contextValue: SelectContextType = {
    value,
    onValueChange,
    isOpen,
    setIsOpen,
    placeholder,
  };

  return (
    <SelectContext.Provider value={contextValue}>
      {children}
    </SelectContext.Provider>
  );
};

// --- SelectTrigger Component ---
interface SelectTriggerProps {
  children: ReactNode;
  className?: string;
}

export const SelectTrigger = ({
  children,
  className = "",
}: SelectTriggerProps) => {
  const { isOpen, setIsOpen } = useSelect();
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);

  return (
    <button
      ref={triggerRef}
      className={`flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${className}`}
      onClick={() => setIsOpen((prev: boolean) => !prev)}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
    >
      {children}
      <svg
        className={`ml-2 h-4 w-4 transition-transform duration-200 ${
          isOpen ? "rotate-180" : ""
        }`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
};

// --- SelectValue Component ---
interface SelectValueProps {
  children?: ReactNode;
}

export const SelectValue = ({ children }: SelectValueProps) => {
  const { value, placeholder } = useSelect();
  return (
    <span className={value ? "text-gray-900" : "text-gray-500"}>
      {value || placeholder || children}
    </span>
  );
};

// --- SelectContent Component ---
interface SelectContentProps {
  children: ReactNode;
  className?: string;
}

export const SelectContent = ({
  children,
  className = "",
}: SelectContentProps) => {
  const { isOpen } = useSelect();
  const contentRef = useRef<HTMLDivElement>(null);
  const [positionStyle, setPositionStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (isOpen && contentRef.current) {
      const trigger = contentRef.current.parentElement?.querySelector("button");
      if (trigger) {
        const triggerRect = trigger.getBoundingClientRect();
        setPositionStyle({
          position: "absolute",
          top: `${triggerRect.bottom + window.scrollY + 8}px`,
          left: `${triggerRect.left + window.scrollX}px`,
          width: `${triggerRect.width}px`,
          zIndex: 50,
        });
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      ref={contentRef}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`bg-white border border-gray-200 rounded-md shadow-lg py-1 mt-2 max-h-60 overflow-y-auto ${className}`}
      style={positionStyle}
      role="listbox"
    >
      {children}
    </motion.div>
  );
};

// --- SelectItem Component ---
interface SelectItemProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export const SelectItem = ({
  value,
  children,
  className = "",
}: SelectItemProps) => {
  const { onValueChange, setIsOpen, value: selectedValue } = useSelect();

  const handleClick = useCallback(() => {
    onValueChange(value);
    setIsOpen(false);
  }, [value, onValueChange, setIsOpen]);

  const isSelected = selectedValue === value;

  return (
    <div
      className={`px-4 py-2 cursor-pointer text-gray-800 hover:bg-gray-100 transition-colors duration-150 ${
        isSelected ? "bg-indigo-50 text-indigo-700 font-medium" : ""
      } ${className}`}
      onClick={handleClick}
      role="option"
      aria-selected={isSelected}
    >
      {children}
    </div>
  );
};
