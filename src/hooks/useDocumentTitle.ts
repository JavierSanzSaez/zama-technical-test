import { useEffect } from 'react';
import { PAGE_TITLES } from '../constants';

/**
 * Custom hook to dynamically update the document title
 * @param pageTitle - The title for the current page
 * @param useFullTitle - Whether to include the app name in the title (default: true)
 */
export const useDocumentTitle = (pageTitle: string, useFullTitle: boolean = true) => {
  useEffect(() => {
    const title = useFullTitle ? PAGE_TITLES.getFullTitle(pageTitle) : pageTitle;
    document.title = title;
    
    return () => {
      document.title = 'Zama API Dashboard';
    };
  }, [pageTitle, useFullTitle]);
};

/**
 * Hook variant that uses predefined page titles from constants
 * @param page - Key from PAGE_TITLES constants
 */
export const usePageTitle = (page: keyof Omit<typeof PAGE_TITLES, 'getFullTitle'>) => {
  const pageTitle = PAGE_TITLES[page];
  useDocumentTitle(pageTitle);
};

/**
 * Hook for custom titles not in the constants
 * @param customTitle - Any custom title string
 */
export const useCustomTitle = (customTitle: string) => {
  useDocumentTitle(customTitle);
};