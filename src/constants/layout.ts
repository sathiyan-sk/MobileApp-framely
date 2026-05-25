/**
 * Layout Constants
 * 
 * Centralizes all layout-related measurements for the app.
 * This ensures consistency across all screens and makes it easy to adjust spacing.
 */

// Bottom Navigation Bar
export const BOTTOM_NAV = {
  // The height of the bar itself (without safe area insets)
  BAR_HEIGHT: 70,
  // Extra padding to add below content for breathing room
  CONTENT_SPACING: 30,
  // Border radius of the bar
  BORDER_RADIUS: 28,
  // Horizontal padding around the bar
  HORIZONTAL_PADDING: 12,
} as const;

// Top Safe Area
export const TOP_SAFE_AREA = {
  // Whether to apply top safe area by default
  APPLY_BY_DEFAULT: true,
  // Edges to apply safe area to
  DEFAULT_EDGES: ['top'] as const,
} as const;

// ScrollView Content Padding
export const CONTENT_PADDING = {
  // Horizontal padding for main content
  HORIZONTAL: 20,
  // Vertical padding for main content
  VERTICAL: 8,
  // Minimum bottom padding when nav bar is hidden
  MIN_BOTTOM: 100,
} as const;

// Screen-specific overrides (if needed)
export const SCREEN_OVERRIDES = {
  // Screens that need extra bottom spacing
  CREATE_EVENT: {
    EXTRA_BOTTOM_SPACING: 80, // For the fixed action bar at bottom
  },
} as const;
