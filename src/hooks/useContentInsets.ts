import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BOTTOM_NAV, CONTENT_PADDING } from '../constants/layout';

/**
 * Custom hook to calculate proper content insets
 * 
 * This hook provides consistent bottom padding calculations for ScrollViews
 * to ensure content is never hidden behind the bottom navigation bar.
 * 
 * @param options Configuration options
 * @param options.hasBottomNav Whether the screen has a bottom navigation bar (default: true)
 * @param options.extraBottomSpacing Additional spacing below content (default: 0)
 * @returns Object with calculated padding values
 */
export function useContentInsets(options?: {
  hasBottomNav?: boolean;
  extraBottomSpacing?: number;
}) {
  const insets = useSafeAreaInsets();
  const hasBottomNav = options?.hasBottomNav ?? true;
  const extraBottomSpacing = options?.extraBottomSpacing ?? 0;

  // Calculate the total height of the bottom nav (bar + safe area inset)
  const bottomNavHeight = hasBottomNav
    ? BOTTOM_NAV.BAR_HEIGHT + Math.max(insets.bottom, 10)
    : 0;

  // Calculate the total bottom padding needed for content
  const contentBottomPadding =
    bottomNavHeight + BOTTOM_NAV.CONTENT_SPACING + extraBottomSpacing;

  // Ensure minimum padding even when nav is hidden
  const safeBottomPadding = Math.max(
    contentBottomPadding,
    CONTENT_PADDING.MIN_BOTTOM
  );

  return {
    // Safe area insets
    insets,
    
    // Bottom nav measurements
    bottomNavHeight,
    
    // Content padding
    contentBottomPadding: safeBottomPadding,
    
    // Convenience values
    contentHorizontalPadding: CONTENT_PADDING.HORIZONTAL,
    contentTopPadding: CONTENT_PADDING.VERTICAL,
  };
}
