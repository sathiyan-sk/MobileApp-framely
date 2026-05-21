import React, { createContext, useContext, useRef, useState } from 'react';
import { Animated } from 'react-native';

type ScrollContextType = {
  scrollY: Animated.Value;
  isNavBarVisible: boolean;
  setNavBarVisible: (visible: boolean) => void;
  onScroll: (event: any) => void;
};

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isNavBarVisible, setNavBarVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollDirection = useRef<'up' | 'down' | null>(null);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        const scrollDiff = currentScrollY - lastScrollY.current;

        // Only react to significant scroll movements (threshold: 5px)
        if (Math.abs(scrollDiff) < 5) return;

        // Determine scroll direction
        const newDirection = scrollDiff > 0 ? 'down' : 'up';

        // Only update if direction actually changed
        if (newDirection !== scrollDirection.current) {
          scrollDirection.current = newDirection;

          // Hide nav bar when scrolling down, show when scrolling up
          // Also show if we're near the top (within 100px)
          if (newDirection === 'down' && currentScrollY > 100) {
            setNavBarVisible(false);
          } else if (newDirection === 'up' || currentScrollY < 50) {
            setNavBarVisible(true);
          }
        }

        lastScrollY.current = currentScrollY;
      },
    }
  );

  return (
    <ScrollContext.Provider
      value={{
        scrollY,
        isNavBarVisible,
        setNavBarVisible,
        onScroll,
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