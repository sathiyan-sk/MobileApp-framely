import { useScroll } from '@/src/context/ScrollContext';
import { useContentInsets } from '@/src/hooks/useContentInsets';
import React, { ReactNode } from 'react';
import {
    ScrollView,
    ScrollViewProps,
    StyleSheet,
    ViewStyle,
} from 'react-native';
/**
 * SafeScrollView
 * 
 * A wrapper around ScrollView that automatically handles:
 * - Bottom padding for bottom navigation bar
 * - Safe area insets
 * - Scroll-based navigation bar hide/show
 * - Consistent content padding
 * 
 * This ensures all screens have consistent spacing and no content is hidden.
 */

interface SafeScrollViewProps extends Omit<ScrollViewProps, 'contentContainerStyle'> {
  /** Children to render inside the ScrollView */
  children: ReactNode;
  
  /** Whether this screen has a bottom navigation bar (default: true) */
  hasBottomNav?: boolean;
  
  /** Additional bottom spacing if needed (e.g., for fixed action bars) */
  extraBottomSpacing?: number;
  
  /** Whether to apply horizontal padding (default: true) */
  applyHorizontalPadding?: boolean;
  
  /** Whether to apply top padding (default: true) */
  applyTopPadding?: boolean;
  
  /** Custom content container style (will be merged with calculated padding) */
  customContentStyle?: ViewStyle;
  
  /** Whether to enable scroll-based nav bar hide/show (default: true) */
  enableNavBarAnimation?: boolean;
}

export function SafeScrollView({
  children,
  hasBottomNav = true,
  extraBottomSpacing = 0,
  applyHorizontalPadding = true,
  applyTopPadding = true,
  customContentStyle,
  enableNavBarAnimation = true,
  ...scrollViewProps
}: SafeScrollViewProps) {
  const {
    contentBottomPadding,
    contentHorizontalPadding,
    contentTopPadding,
  } = useContentInsets({ hasBottomNav, extraBottomSpacing });
  
  const { onScroll } = useScroll();

  const contentContainerStyle: ViewStyle = {
    paddingBottom: contentBottomPadding,
    paddingHorizontal: applyHorizontalPadding ? contentHorizontalPadding : 0,
    paddingTop: applyTopPadding ? contentTopPadding : 0,
    ...customContentStyle,
  };

  return (
    <ScrollView
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
      onScroll={enableNavBarAnimation ? onScroll : undefined}
      scrollEventThrottle={enableNavBarAnimation ? 16 : undefined}
      {...scrollViewProps}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Add any common styles here if needed
});
