"use client";

import { useEffect, useState } from 'react';
import { Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchHistoryItem } from '@/lib/types';
import { getSearchHistory, clearSearchHistory } from '@/lib/search-utils';

interface SearchHistoryProps {
  onSelectItem: (query: string) => void;
}

export function SearchHistory({ onSelectItem }: SearchHistoryProps) {
  const [historyItems, setHistoryItems] = useState<SearchHistoryItem[]>([]);
  
  // Load search history on mount
  useEffect(() => {
    setHistoryItems(getSearchHistory());
  }, []);
  
  // Format relative time
  const formatRelativeTime = (timestamp: number): string => {
    const now = Date.now();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };
  
  // Handle clear history
  const handleClearHistory = () => {
    clearSearchHistory();
    setHistoryItems([]);
  };
  
  if (historyItems.length === 0) {
    return null;
  }
  
  return (
    <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg">
      <div className="flex items-center justify-between p-2 border-b border-border">
        <p className="text-sm font-medium">Recent Searches</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearHistory}
          className="h-8 px-2 text-xs"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Clear
        </Button>
      </div>
      <ul className="py-1">
        {historyItems.map((item, index) => (
          <li
            key={index}
            className="cursor-pointer hover:bg-muted transition-colors duration-150"
            onClick={() => onSelectItem(item.query)}
          >
            <div className="p-2 flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-2 text-muted-foreground" />
                <span>{item.query}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(item.timestamp)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}