/**
 * useResponsive Hook
 * 
 * Provides responsive breakpoint information and viewport type.
 */

import { useState, useEffect } from 'react';
import { 
  BREAKPOINTS, 
  Breakpoint, 
  getBreakpoint, 
  getViewportType, 
  ViewportType,
  isAtLeast 
} from '../theme';

export interface ResponsiveState {
  /** Current viewport width */
  width: number;
  /** Current viewport height */
  height: number;
  /** Current breakpoint name */
  breakpoint: Breakpoint;
  /** Viewport type (mobile/tablet/desktop) */
  viewportType: ViewportType;
  /** Check if viewport is at least a certain breakpoint */
  isAtLeast: (bp: Breakpoint) => boolean;
  /** Convenience checks */
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export const useResponsive = (): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>(() => {
    // Default to desktop for SSR
    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const height = typeof window !== 'undefined' ? window.innerHeight : 768;
    const breakpoint = getBreakpoint(width);
    const viewportType = getViewportType(width);

    return {
      width,
      height,
      breakpoint,
      viewportType,
      isAtLeast: (bp: Breakpoint) => isAtLeast(width, bp),
      isMobile: viewportType === 'mobile',
      isTablet: viewportType === 'tablet',
      isDesktop: viewportType === 'desktop',
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const breakpoint = getBreakpoint(width);
      const viewportType = getViewportType(width);

      setState({
        width,
        height,
        breakpoint,
        viewportType,
        isAtLeast: (bp: Breakpoint) => isAtLeast(width, bp),
        isMobile: viewportType === 'mobile',
        isTablet: viewportType === 'tablet',
        isDesktop: viewportType === 'desktop',
      });
    };

    // Set initial state
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return state;
};

export default useResponsive;
