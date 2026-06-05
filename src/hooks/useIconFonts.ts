import { useFonts } from 'expo-font';

export function useIconFonts() {
  const [loaded] = useFonts({
    // Example: load any fonts if needed
  });

  return loaded;
}