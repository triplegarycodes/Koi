import React from "react";
import { View, StyleSheet, Pressable, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useAppStorage } from "@/hooks/useAppStorage";
import { Spacing, BorderRadius, ThemePresets, KoiColors } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ThemeCardProps {
  themeId: string;
  isSelected: boolean;
  onSelect: () => void;
}

function AnimatedParticle({ color, delay }: { color: string; delay: number }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.6);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      translateY.value = withRepeat(
        withTiming(-20, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      opacity.value = withRepeat(
        withTiming(0.2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        { backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
}

function ThemeCard({ themeId, isSelected, onSelect }: ThemeCardProps) {
  const preset = ThemePresets[themeId as keyof typeof ThemePresets];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSpring(0.95, { damping: 15 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15 });
    }, 100);
    onSelect();
  };

  if (!preset) return null;

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.themeCard, animatedStyle]}
    >
      <LinearGradient
        colors={[preset.waterColor, preset.secondaryColor]}
        style={[
          styles.themeCardGradient,
          isSelected && styles.themeCardSelected,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.themeCardContent}>
          <View style={[styles.koiShape, { backgroundColor: preset.koiColor }]} />
          <AnimatedParticle color={preset.particleColor} delay={0} />
          <AnimatedParticle color={preset.particleColor} delay={500} />
          <AnimatedParticle color={preset.particleColor} delay={1000} />
        </View>
        {isSelected ? (
          <View style={styles.selectedIndicator}>
            <Feather name="check" size={16} color="#FFFFFF" />
          </View>
        ) : null}
      </LinearGradient>
      <ThemedText type="body" style={styles.themeName}>
        {preset.name}
      </ThemedText>
      {isSelected ? (
        <ThemedText type="small" style={styles.currentLabel}>
          Current
        </ThemedText>
      ) : null}
    </AnimatedPressable>
  );
}

export default function ThemesScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { selectedTheme, setSelectedTheme } = useAppStorage();

  const themeKeys = Object.keys(ThemePresets);

  const handleSelectTheme = (themeId: string) => {
    setSelectedTheme(themeId);
  };

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <ThemeCard
      themeId={item}
      isSelected={item === selectedTheme}
      onSelect={() => handleSelectTheme(item)}
    />
  );

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: Spacing.xl,
        paddingBottom: tabBarHeight + Spacing["5xl"] + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      data={themeKeys}
      renderItem={renderItem}
      keyExtractor={(item) => item}
      numColumns={2}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.header}>
          <ThemedText type="h3">Pick your vibe</ThemedText>
          <ThemedText type="body" style={styles.subtitle}>
            Select a water theme for your breaks
          </ThemedText>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.xl,
  },
  subtitle: {
    opacity: 0.7,
    marginTop: Spacing.xs,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  themeCard: {
    width: "48%",
  },
  themeCardGradient: {
    height: 140,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    overflow: "hidden",
  },
  themeCardSelected: {
    borderWidth: 3,
    borderColor: KoiColors.primary,
  },
  themeCardContent: {
    flex: 1,
    padding: Spacing.md,
    position: "relative",
  },
  koiShape: {
    width: 40,
    height: 18,
    borderRadius: 18,
    position: "absolute",
    top: "40%",
    left: "30%",
    transform: [{ rotate: "15deg" }],
  },
  particle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: "absolute",
  },
  selectedIndicator: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: KoiColors.streak,
    alignItems: "center",
    justifyContent: "center",
  },
  themeName: {
    fontWeight: "600",
  },
  currentLabel: {
    color: KoiColors.primary,
    marginTop: 2,
  },
});
