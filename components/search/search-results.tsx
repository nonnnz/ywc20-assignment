"use client";

import { useEffect, useRef } from 'react';
import { animate, createScope, Scope, stagger } from 'animejs';
import { SearchResult, MajorType } from '@/lib/types';

interface SearchResultsProps {
  results: SearchResult[];
  onSelectResult: (applicant: SearchResult['applicant']) => void;
}

// Helper function to get color for major
const getMajorColor = (major: MajorType): string => {
  switch (major) {
    case 'web_design':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'web_programming':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    case 'web_content':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'web_marketing':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }
};

const getMajorDisplayName = (major: MajorType): string => {
  switch (major) {
    case 'web_design':
      return 'Web Design';
    case 'web_programming':
      return 'Web Programming';
    case 'web_content':
      return 'Web Content';
    case 'web_marketing':
      return 'Web Marketing';
    default:
      return major;
  }
};

export function SearchResults({ results, onSelectResult }: SearchResultsProps) {
  const resultsRef = useRef<HTMLDivElement>(null);
  const scope = useRef<Scope>(null);
  
  // Animation when results mount
  useEffect(() => {
    scope.current = createScope().add(() => {
      if (resultsRef.current) {
        animate(resultsRef.current.children, {
          translateY: [20, 0],
          opacity: [0, 1],
          duration: 400,
          ease: 'out(2)', // 'easeOutQuad' equivalent
          delay: stagger(50),
        });
      }
    });

    return () => scope.current?.revert();
  }, [results]);
  
  return (
    <div
      ref={resultsRef}
      className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg overflow-hidden"
    >
      <ul className="py-1 divide-y divide-border">
        {results.map(({ applicant }) => (
          <li
            key={applicant.interviewRefNo}
            className="cursor-pointer hover:bg-muted transition-colors duration-150"
            onClick={() => onSelectResult(applicant)}
          >
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {applicant.firstName} {applicant.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Ref: {applicant.interviewRefNo}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getMajorColor(applicant.major)}`}>
                  {getMajorDisplayName(applicant.major)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}