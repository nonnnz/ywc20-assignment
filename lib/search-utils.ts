import Fuse from 'fuse.js';
import { Applicant, SearchHistoryItem, SearchResult } from './types';

// Constants
const MAX_SEARCH_HISTORY = 5;
const MAX_SEARCH_RESULTS = 5;
const SEARCH_HISTORY_KEY = 'webmaster-camp-search-history';

// Fuse.js options for fuzzy search
const fuseOptions = {
  keys: [
    { name: 'firstName', weight: 0.3 },
    { name: 'lastName', weight: 0.3 },
    { name: 'interviewRefNo', weight: 0.4 },
    { name: 'fullName', weight: 0.5 }
  ],
  threshold: 0.3,
  includeScore: true,
  ignoreLocation: true,
  shouldSort: true,
};


/**
 * Creates a new Fuse instance for searching applicants
 */
export function createSearchIndex(applicants: Applicant[]): Fuse<Applicant> {
    // Add full name as a virtual key for searching
    const applicantsWithFullName = applicants.map(applicant => ({
      ...applicant,
      fullName: `${applicant.firstName} ${applicant.lastName}`
    }));
    
    return new Fuse(applicantsWithFullName, fuseOptions);
  }

/**
 * Performs a search using Fuse.js
 */
export function performSearch(
  searchIndex: Fuse<Applicant>,
  query: string
): SearchResult[] {
  if (!query.trim()) return [];
  
  const results = searchIndex.search(query);
  
  return results
    .slice(0, MAX_SEARCH_RESULTS)
    .map(result => ({
      applicant: result.item,
      score: result.score || 0,
    }));
}

/**
 * Normalizes search text
 */
export function normalizeSearchText(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

/**
 * Gets search history from localStorage
 */
export function getSearchHistory(): SearchHistoryItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting search history:', error);
    return [];
  }
}

/**
 * Adds a search query to history
 */
export function addToSearchHistory(query: string): void {
  if (typeof window === 'undefined' || !query.trim()) return;
  
  try {
    const normalizedQuery = normalizeSearchText(query);
    const history = getSearchHistory();
    
    // Remove if already exists
    const filteredHistory = history.filter(
      item => normalizeSearchText(item.query) !== normalizedQuery
    );
    
    // Add new search to the beginning
    const newHistory = [
      { query: normalizedQuery, timestamp: Date.now() },
      ...filteredHistory,
    ].slice(0, MAX_SEARCH_HISTORY);
    
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Error adding to search history:', error);
  }
}

/**
 * Clears the search history
 */
export function clearSearchHistory(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error('Error clearing search history:', error);
  }
}