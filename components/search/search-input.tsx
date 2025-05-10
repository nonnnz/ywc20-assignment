"use client";

import { Search, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  onFocus,
  placeholder = "Search..."
}: SearchInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={onFocus}
        placeholder={placeholder}
        aria-label="Search applicants"
        className="pl-10 pr-10 py-6 text-base shadow-sm bg-background border-input"
      />
      
      {value && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            aria-label="Clear search"
            className="h-8 w-8"
          >
            <XCircle className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </Button>
        </div>
      )}
    </div>
  );
}