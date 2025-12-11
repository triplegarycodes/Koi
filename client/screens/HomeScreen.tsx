import React from "react";
import { View, StyleSheet, ScrollView, Pressable, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
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
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { useAppStorage } from "@/hooks/useAppStorage";
import { Spacing, BorderRadius, ThemePresets, KoiColors } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface BreakButtonProps {
  duration: number;
  label: string;
  onPress: () => void;
}

function BreakButton({ duration, label, onPress }: BreakButtonProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.95, { damping: 15 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15 });
    }, 100);
    onPress();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.breakButton, { backgroundColor: theme.surface }, animatedStyle]}
    >
      <ThemedText type="h4" style={styles.breakButtonDuration}>
        {duration}s
      </ThemedText>
      <ThemedText type="small" style={styles.breakButtonLabel}>
        {label}
      </ThemedText>
    </AnimatedPressable>
  );
}

function ThemePreviewCard({ themeId, isSelected }: { themeId: string; isSelected: boolean }) {
  const { theme } = useTheme();
  const preset = ThemePresets[themeId as keyof typeof ThemePresets];
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const scale = useSharedValue(1);
  const shimmer = useSharedValue(0);

  React.useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.95, { damping: 15 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15 });
    }, 100);
    navigation.navigate("BreakScene", { duration: 60, themeId });
  };

  if (!preset) return null;

  return (
    <AnimatedPressable onPress={handlePress} style={[styles.themePreviewCard, animatedStyle]}>
      <LinearGradient
        colors={[preset.waterColor, preset.secondaryColor]}
        style={styles.themePreviewGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.themePreviewContent}>
          <View style={[styles.previewKoi, { backgroundColor: preset.koiColor }]} />
          <View style={[styles.previewParticle, { backgroundColor: preset.particleColor }]} />
          <View style={[styles.previewParticle2, { backgroundColor: preset.particleColor }]} />
        </View>
        {isSelected ? (
          <View style={styles.selectedBadge}>
            <Feather name="check" size={12} color="#FFFFFF" />
          </View>
        ) : null}
      </LinearGradient>
      <ThemedText type="small" style={styles.themePreviewName}>
        {preset.name}
      </ThemedText>
    </AnimatedPressable>
  );
}

function StreakCard({ currentStreak, totalBreaks }: { currentStreak: number; totalBreaks: number }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.streakCard, { backgroundColor: theme.surface }]}>
      <View style={styles.streakContent}>
        <View style={styles.streakItem}>
          <View style={[styles.streakIcon, { backgroundColor: KoiColors.streak + "20" }]}>
            <Feather name="zap" size={20} color={KoiColors.streak} />
          </View>
          <View>
            <ThemedText type="h3" style={styles.streakNumber}>
              {currentStreak}
            </ThemedText>
            <ThemedText type="small" style={styles.streakLabel}>
              day streak
            </ThemedText>
          </View>
        </View>
        <View style={styles.streakDivider} />
        <View style={styles.streakItem}>
          <View style={[styles.streakIcon, { backgroundColor: KoiColors.primary + "20" }]}>
            <Feather name="droplet" size={20} color={KoiColors.primary} />
          </View>
          <View>
            <ThemedText type="h3" style={styles.streakNumber}>
              {totalBreaks}
            </ThemedText>
            <ThemedText type="small" style={styles.streakLabel}>
              total breaks
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { selectedTheme, streakData, isLoading } = useAppStorage();

  const handleBreakPress = (duration: number) => {
    navigation.navigate("BreakScene", { duration, themeId: selectedTheme });
  };

  const themeKeys = Object.keys(ThemePresets);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: tabBarHeight + Spacing["5xl"] + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroSection}>
        <ThemedText type="h3" style={styles.heroTitle}>
          Ready to drift?
        </ThemedText>
        <ThemedText type="body" style={styles.heroSubtitle}>
          Pick a quick break length
        </ThemedText>
      </View>

      <View style={styles.breakButtons}>
        <BreakButton
          duration={30}
          label="quick"
          onPress={() => handleBreakPress(30)}
        />
        <BreakButton
          duration={60}
          label="normal"
          onPress={() => handleBreakPress(60)}
        />
        <BreakButton
          duration={180}
          label="deep"
          onPress={() => handleBreakPress(180)}
        />
      </View>

      {!isLoading ? (
        <StreakCard
          currentStreak={streakData.currentStreak}
          totalBreaks={streakData.totalBreaks}
        />
      ) : null}

      <View style={styles.themesSection}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Recent themes
        </ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.themesScroll}
        >
          {themeKeys.slice(0, 4).map((themeKey) => (
            <ThemePreviewCard
              key={themeKey}
              themeId={themeKey}
              isSelected={themeKey === selectedTheme}
            />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    marginBottom: Spacing["2xl"],
  },
  heroTitle: {
    marginBottom: Spacing.xs,
  },
  heroSubtitle: {
    opacity: 0.7,
  },
  breakButtons: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing["2xl"],
  },
  breakButton: {
    flex: 1,
    paddingVertical: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  breakButtonDuration: {
    color: KoiColors.primary,
    marginBottom: Spacing.xs,
  },
  breakButtonLabel: {
    opacity: 0.7,
  },
  streakCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing["2xl"],
  },
  streakContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  streakItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  streakIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  streakNumber: {
    marginBottom: -4,
  },
  streakLabel: {
    opacity: 0.7,
  },
  streakDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#334155",
  },
  themesSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
  },
  themesScroll: {
    gap: Spacing.md,
  },
  themePreviewCard: {
    width: 120,
    alignItems: "center",
  },
  themePreviewGradient: {
    width: 120,
    height: 100,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    overflow: "hidden",
  },
  themePreviewContent: {
    flex: 1,
    padding: Spacing.md,
  },
  previewKoi: {
    width: 20,
    height: 10,
    borderRadius: 10,
    position: "absolute",
    top: 30,
    left: 40,
  },
  previewParticle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: "absolute",
    top: 20,
    right: 20,
    opacity: 0.6,
  },
  previewParticle2: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: "absolute",
    bottom: 30,
    left: 20,
    opacity: 0.4,
  },
  selectedBadge: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: KoiColors.streak,
    alignItems: "center",
    justifyContent: "center",
  },
  themePreviewName: {
    textAlign: "center",
  },
});
