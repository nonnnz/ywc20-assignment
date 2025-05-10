"use client";

import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import Fuse from 'fuse.js';
import { SearchInput } from './search-input';
import { SearchResults } from './search-results';
import { SearchHistory } from './search-history';
import { Celebration } from './celebration';
import { Applicant, SearchResult } from '@/lib/types';
import { fetchAllApplicants } from '@/lib/api';
import { createSearchIndex, performSearch, addToSearchHistory } from '@/lib/search-utils';
import { useDebounce } from '@/hooks/use-debounce';
import { ResultsLoader } from '../ui/results-loader';

export default function SearchSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const resultCardRef = useRef<HTMLDivElement>(null);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  const { data: applicants, isLoading, error } = useQuery({
    queryKey: ['applicants'],
    queryFn: fetchAllApplicants,
    staleTime: 60 * 60 * 1000,
  });
  
  const searchIndexRef = useRef<Fuse<Applicant> | null>(null);
  
  // Initialize search index when applicants data is available
  useEffect(() => {
    if (applicants && applicants.length > 0) {
      searchIndexRef.current = createSearchIndex(applicants);
    }
  }, [applicants]);
  
  // Handle search when query changes
  useEffect(() => {
    if (!searchIndexRef.current) {
      setSearchResults([]);
      return;
    }
    
    if (!debouncedSearchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    // // Always reset selectedApplicant when searching
    // setSelectedApplicant(null);
    
    const results = performSearch(searchIndexRef.current, debouncedSearchQuery);
    setSearchResults(results);
    
    if (results.length > 0) {
      setShowResults(true);
      setShowHistory(false);
    } else {
      setShowResults(true); // Show "no results found" message
    }
  }, [debouncedSearchQuery]);
  
  // Handle clicks outside the search container
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setShowHistory(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    
    // Reset selected applicant when input changes
    // if (selectedApplicant && value !== `${selectedApplicant.firstName} ${selectedApplicant.lastName}`) {
    //   setSelectedApplicant(null);
    // }
    
    if (value.trim()) {
      setShowResults(true);
      setShowHistory(false);
    } else {
      setShowHistory(true);
      setShowResults(false);
    }
  };
  
  const handleInputFocus = () => {
    console.log('Input focused');
    // Reset selected applicant when focusing on input
    if (searchQuery.trim()) {
      setShowResults(true);
    } else {
      setShowHistory(true);
    }
    setSelectedApplicant(null);
  };
  
  const handleSelectResult = (applicant: Applicant) => {
    console.log(applicant);
    if (selectedApplicant) {
      setSelectedApplicant(null);
    }
    setSelectedApplicant(applicant);
    setShowResults(false);
    setShowHistory(false);
    setSearchQuery(`${applicant.firstName} ${applicant.lastName}`);
    addToSearchHistory(`${applicant.firstName} ${applicant.lastName}`);
  };
  
  const handleSelectHistoryItem = (query: string) => {

    setSearchQuery(query);
    
    // When selecting from history, immediately perform search 
    // to find and display the applicant
    if (searchIndexRef.current) {
      const results = performSearch(searchIndexRef.current, query);
      setSearchResults(results);
      
      // If we have results, select the first one
      if (results.length > 0) {
        setSelectedApplicant(results[0].applicant);
      } else {
        setSelectedApplicant(null);
        setShowResults(true); // Show "no results found"
      }
    }
  };
  
  if (isLoading) {
    return <ResultsLoader />;
  }
  
  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive">Error loading applicants data. Please try again later.</p>
      </div>
    );
  }
  
  return (
    <div ref={searchContainerRef} className="relative w-full">
      <div className="mb-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold">ตรวจสอบสถานะการสมัคร</h2>
        <p className="text-sm text-muted-foreground/80 mb-2">(Check Your Application Status)</p>
        <p className="text-muted-foreground">
          กรอกชื่อหรือหมายเลขอ้างอิงเพื่อตรวจสอบว่าคุณได้รับการคัดเลือกหรือไม่
        </p>
        <p className="text-sm text-muted-foreground/80">(Enter your name or reference number to see if you&apos;ve been selected)</p>
      </div>
      
      <SearchInput
        value={searchQuery}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder="ค้นหาด้วยชื่อหรือหมายเลขอ้างอิง..."
      />
      
      {showResults && searchResults.length > 0 && !selectedApplicant && (
        <SearchResults
          results={searchResults}
          onSelectResult={handleSelectResult}
        />
      )}
      
      {showHistory && !searchQuery.trim() && (
        <SearchHistory onSelectItem={handleSelectHistoryItem} />
      )}
      
      {selectedApplicant && (
        <>
          <div
            ref={resultCardRef}
            className="mt-8 p-6 glass-card gradient-border rounded-[var(--radius)] shadow-lg"
          >
            <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-[hsl(var(--chart-2))]">
              ผลการสมัคร
              <span className="text-sm text-muted-foreground/80"> (Application Result)</span>
            </h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">คุณ </span>
                {selectedApplicant.firstName} {selectedApplicant.lastName}
              </p>
              <p>
                <span className="font-medium">เลขประจำตัวผู้เข้าสัมภาษณ์:</span>
                <span className="text-sm text-muted-foreground/80">(Interview Ref No.)</span>{' '}
                {selectedApplicant.interviewRefNo}
              </p>
              <div className="mt-6 p-4 bg-primary/10 backdrop-blur-lg border border-primary/20 rounded-md">
                <p className="font-bold text-2xl bg-clip-text bg-gradient-to-r from-primary to-[hsl(var(--chart-2))]">
                  ยินดีด้วย! 🎉
                </p>
                <p className="text-sm text-muted-foreground/80">(Congratulations!)</p>
                <div className="flex items-center gap-2">
                  <p className="text-foreground">ผ่านเข้ารอบสัมภาษณ์ สาขา</p>
                  <p className="text-foreground font-bold capitalize">{selectedApplicant.major.replace('_', ' ')} 🤩</p>
                </div>
                <p className="text-foreground font-bold" >Young Webmaster Camp 20</p>
                <p className="text-sm text-muted-foreground/80 capitalize">(You have passed to the interview round in the department of {selectedApplicant.major.replace('_', ' ')} 🤩)</p>
                <p className="text-sm mt-2 text-muted-foreground">
                  กรุณาตรวจแนะนำเพิ่มเติมเกี่ยวกับการสัมภาษณ์และวันเวลาที่กำหนด
                </p>
                <p className="text-sm text-muted-foreground/80">(Please check your email for further instructions and details about the camp.)</p>
              </div>
            </div>
          </div>
          <Celebration targetRef={resultCardRef} />
          
        </>
      )}
      
      {showResults && searchQuery.trim() && searchResults.length === 0 && !selectedApplicant && (
        <div className="mt-4 p-4 glass-card gradient-border rounded-[var(--radius)]">
          <p className="font-medium">ไม่พบผลลัพธ์</p>
          <p className="text-sm text-muted-foreground/80">(No results found)</p>
          <p className="text-sm text-muted-foreground">
            กรุณาตรวจสอบการสะกดหรือลองใช้คำค้นหาอื่น
          </p>
          <p className="text-sm text-muted-foreground/80">(Please check your spelling or try a different search term.)</p>
        </div>
      )}
    </div>
  );
}