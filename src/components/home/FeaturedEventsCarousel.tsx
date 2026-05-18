import React, { useRef, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ViewToken,
} from "react-native";
import { Colors } from "@/src/constants/colors";
import FeaturedEventCard from "./FeaturedEventCard";

type FeaturedEvent = {
  id: string;
  badge: string;
  title: string;
  location: string;
  date: string;
  status: string;
  pics: string;
  image: string;
};

type Props = {
  events: FeaturedEvent[];
  // Card width — pass the available width from the parent (screen width minus horizontal padding).
  itemWidth: number;
};

// Horizontal, paginated carousel of featured events.
// Swipe right/left snaps to the next/previous event; dots reflect the active index.
export default function FeaturedEventsCarousel({ events, itemWidth }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList<FeaturedEvent>>(null);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
  ).current;

  // Fallback for web — onViewableItemsChanged is unreliable there.
  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(e.nativeEvent.contentOffset.x / itemWidth);
      if (idx !== activeIndex) setActiveIndex(idx);
    },
    [activeIndex, itemWidth],
  );

  return (
    <View style={styles.wrapper} testID="featured-events-carousel">
      <FlatList
        ref={listRef}
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FeaturedEventCard {...item} width={itemWidth} />
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth}
        snapToAlignment="start"
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          length: itemWidth,
          offset: itemWidth * index,
          index,
        })}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      <View style={styles.dots}>
        {events.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 16 },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F2C5D2",
  },
  dotActive: {
    width: 18,
    backgroundColor: Colors.primary,
  },
});