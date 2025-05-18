
import React, { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react"; 
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";

interface SearchInputDebouncedProps {
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  delay?: number;
}

export const SearchInputDebounced = ({
  value: externalValue,
  onChange,
  isLoading = false,
  placeholder = "Buscar...",
  className = "",
  delay = 500
}: SearchInputDebouncedProps) => {
  // Local state for immediate UI feedback
  const [localValue, setLocalValue] = useState(externalValue);

  // Create debounced function
  const debouncedOnChange = React.useMemo(
    () => debounce((value: string) => onChange(value), delay),
    [onChange, delay]
  );

  // Update local value when external value changes
  useEffect(() => {
    setLocalValue(externalValue);
  }, [externalValue]);

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue); // Update local state immediately for UI
    debouncedOnChange(newValue); // Debounce the actual onChange call
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`pl-10 pr-10 ${className}`}
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Loader2 className="animate-spin h-4 w-4 text-gray-400" />
        </div>
      )}
    </div>
  );
};
