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
    velocityY.current = currentVelocityY;

    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }

    if (currentScrollY <= 0) {
      if (!isNavBarVisible) setNavBarVisible(true);
      lastScrollY.current = currentScrollY;
      scrollDirection.current = null;
      return;
    }

    const scrollDiff = currentScrollY - lastScrollY.current;
    if (Math.abs(scrollDiff) < 3) return;

    const newDirection = scrollDiff > 0 ? 'down' : 'up';
    const shouldHide =
      newDirection === 'down' &&
      currentScrollY > 80 &&
      (Math.abs(scrollDiff) > 8 || Math.abs(currentVelocityY) > 0.5);
    const shouldShow =
      newDirection === 'up' ||
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

    hideTimeout.current = setTimeout(() => {
      if (currentScrollY > 80 && !isNavBarVisible) setNavBarVisible(true);
    }, 1500);
  }, [isNavBarVisible]);

  React.useEffect(() => {
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  return (
    <ScrollContext.Provider value={{ scrollY, isNavBarVisible, setNavBarVisible, onScroll, resetNavBar }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) throw new Error('useScroll must be used within ScrollProvider');
  return context;
};