import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

type ScrollContextType = {
  scrollY: Animated.Value;
  isNavBarVisible: boolean;
  setNavBarVisible: (visible: boolean) => void;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  resetNavBar: () => void;
};

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

// Improved scroll behavior similar to YouTube
// - Hides nav bar when scrolling down
// - Shows nav bar when scrolling up
// - Always shows at top of page
// - Smooth transitions with velocity consideration
export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isNavBarVisible, setNavBarVisible] = useState(true);
  const lastScrollY = useRef(0);
  const velocityY = useRef(0);
  const scrollDirection = useRef<'up' | 'down' | null>(null);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  const resetNavBar = useCallback(() => {
    setNavBarVisible(true);
    lastScrollY.current = 0;
    scrollDirection.current = null;
  }, []);

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const currentVelocityY = event.nativeEvent.velocity?.y || 0;
    
    // Update velocity for smoother detection
    velocityY.current = currentVelocityY;
    
    // Clear any pending hide timeout
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }

    // If at the very top, always show nav bar
    if (currentScrollY <= 0) {
      if (!isNavBarVisible) {
        setNavBarVisible(true);
      }
      lastScrollY.current = currentScrollY;
      scrollDirection.current = null;
      return;
    }

    // Calculate scroll difference
    const scrollDiff = currentScrollY - lastScrollY.current;

    // Ignore very small movements to prevent jittery behavior
    if (Math.abs(scrollDiff) < 3) {
      return;
    }

    // Determine scroll direction
    const newDirection = scrollDiff > 0 ? 'down' : 'up';

    // YouTube-like behavior:
    // 1. Hide when scrolling down with enough momentum (past threshold)
    // 2. Show when scrolling up with any momentum
    // 3. Consider velocity for more responsive feel
    
    const shouldHide = newDirection === 'down' && 
                      currentScrollY > 80 && 
                      (Math.abs(scrollDiff) > 8 || Math.abs(currentVelocityY) > 0.5);
    
    const shouldShow = newDirection === 'up' || 
                      currentScrollY < 40 ||
                      (newDirection !== scrollDirection.current && newDirection === 'up');

    if (shouldHide && isNavBarVisible) {
      setNavBarVisible(false);
      scrollDirection.current = 'down';
    } else if (shouldShow && !isNavBarVisible) {
      setNavBarVisible(true);
      scrollDirection.current = 'up';
    } else if (newDirection !== scrollDirection.current) {
      scrollDirection.current = newDirection;
    }

    lastScrollY.current = currentScrollY;

    // Show nav bar after user stops scrolling (like YouTube)
    hideTimeout.current = setTimeout(() => {
      // Only show if we're not at the very bottom and scrolling has stopped
      if (currentScrollY > 80 && !isNavBarVisible) {
        // User stopped scrolling, show nav bar
        setNavBarVisible(true);
      }
    }, 1500); // Show after 1.5 seconds of no scrolling
  }, [isNavBarVisible]);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, []);

  return (
    <ScrollContext.Provider
      value={{
        scrollY,
        isNavBarVisible,
        setNavBarVisible,
        onScroll,
        resetNavBar,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScroll must be used within ScrollProvider');
  }
  return context;
};