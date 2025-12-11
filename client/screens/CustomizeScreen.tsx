import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
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
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useTheme } from "@/hooks/useTheme";
import { useAppStorage, CustomTheme } from "@/hooks/useAppStorage";
import { Spacing, BorderRadius, KoiColors } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const WATER_COLORS = [
  { id: "teal", color: "#2DD4BF", name: "Teal" },
  { id: "indigo", color: "#1E3A8A", name: "Indigo" },
  { id: "seafoam", color: "#6EE7B7", name: "Seafoam" },
  { id: "cyan", color: "#67E8F9", name: "Cyan" },
  { id: "jade", color: "#4ADE80", name: "Jade" },
  { id: "slate", color: "#475569", name: "Slate" },
];

const KOI_COLORS = [
  { id: "orange", color: "#F97316", name: "Orange" },
  { id: "white", color: "#FAFAFA", name: "White" },
  { id: "black", color: "#1E293B", name: "Black" },
  { id: "pink", color: "#FB7185", name: "Pink" },
  { id: "gold", color: "#FBBF24", name: "Gold" },
  { id: "teal", color: "#2DD4BF", name: "Teal" },
];

interface ColorSwatchProps {
  color: string;
  isSelected: boolean;
  onSelect: () => void;
}

function ColorSwatch({ color, isSelected, onSelect }: ColorSwatchProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.9, { damping: 15 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15 });
    }, 100);
    onSelect();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.colorSwatch, { backgroundColor: color }, animatedStyle]}
    >
      {isSelected ? (
        <View style={styles.swatchCheck}>
          <Feather name="check" size={14} color="#FFFFFF" />
        </View>
      ) : null}
    </AnimatedPressable>
  );
}

interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  leftLabel: string;
  rightLabel: string;
}

function CustomSlider({ value, onValueChange, leftLabel, rightLabel }: SliderProps) {
  const { theme } = useTheme();
  const positions = [0, 0.25, 0.5, 0.75, 1];

  return (
    <View style={styles.sliderContainer}>
      <ThemedText type="small" style={styles.sliderLabel}>
        {leftLabel}
      </ThemedText>
      <View style={[styles.sliderTrack, { backgroundColor: theme.surface }]}>
        {positions.map((pos) => (
          <Pressable
            key={pos}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onValueChange(pos);
            }}
            style={[
              styles.sliderDot,
              {
                left: `${pos * 100}%`,
                backgroundColor: pos <= value ? KoiColors.primary : theme.surfaceElevated,
              },
            ]}
          />
        ))}
        <Animated.View
          style={[
            styles.sliderThumb,
            { left: `${value * 100}%`, backgroundColor: KoiColors.primary },
          ]}
        />
        <View
          style={[
            styles.sliderFill,
            { width: `${value * 100}%`, backgroundColor: KoiColors.primary },
          ]}
        />
      </View>
      <ThemedText type="small" style={styles.sliderLabel}>
        {rightLabel}
      </ThemedText>
    </View>
  );
}

function LivePreview({ customTheme }: { customTheme: CustomTheme }) {
  const koiX = useSharedValue(40);
  const koiY = useSharedValue(50);
  const particleY = useSharedValue(0);

  useEffect(() => {
    koiX.value = withRepeat(
      withTiming(60, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    koiY.value = withRepeat(
      withTiming(60, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    particleY.value = withRepeat(
      withTiming(-30, { duration: 2000, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
  }, []);

  const koiStyle = useAnimatedStyle(() => ({
    left: `${koiX.value}%`,
    top: `${koiY.value}%`,
  }));

  const particleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: particleY.value }],
  }));

  const darkerWaterColor = adjustColorBrightness(customTheme.waterColor, -30);

  return (
    <View style={styles.previewContainer}>
      <LinearGradient
        colors={[customTheme.waterColor, darkerWaterColor]}
        style={styles.previewGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View
          style={[
            styles.previewKoi,
            { backgroundColor: customTheme.koiColor },
            koiStyle,
          ]}
        />
        {customTheme.particleEnabled ? (
          <>
            <Animated.View
              style={[
                styles.previewParticle,
                { backgroundColor: customTheme.waterColor, opacity: 0.6 },
                particleStyle,
                { left: "20%", bottom: "30%" },
              ]}
            />
            <Animated.View
              style={[
                styles.previewParticle,
                { backgroundColor: customTheme.waterColor, opacity: 0.4 },
                particleStyle,
                { left: "70%", bottom: "40%" },
              ]}
            />
          </>
        ) : null}
      </LinearGradient>
    </View>
  );
}

function adjustColorBrightness(color: string, amount: number): string {
  const hex = color.replace("#", "");
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export default function CustomizeScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { customTheme, setCustomTheme, setSelectedTheme } = useAppStorage();
  const [localTheme, setLocalTheme] = useState<CustomTheme>(customTheme);
  const saveScale = useSharedValue(1);

  useEffect(() => {
    setLocalTheme(customTheme);
  }, [customTheme]);

  const saveAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveScale.value }],
  }));

  const handleSave = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    saveScale.value = withSpring(0.95, { damping: 15 });
    setTimeout(() => {
      saveScale.value = withSpring(1, { damping: 15 });
    }, 100);
    await setCustomTheme(localTheme);
    await setSelectedTheme("custom");
  };

  const updateTheme = (updates: Partial<CustomTheme>) => {
    setLocalTheme((prev) => ({ ...prev, ...updates }));
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={{ flex: 1, backgroundColor: theme.backgroundRoot }}
      contentContainerStyle={{
        paddingTop: Spacing.xl,
        paddingBottom: tabBarHeight + Spacing["5xl"] + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <View style={styles.header}>
        <ThemedText type="h3">Create your vibe</ThemedText>
        <ThemedText type="body" style={styles.subtitle}>
          Customize your perfect water theme
        </ThemedText>
      </View>

      <LivePreview customTheme={localTheme} />

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Pick your water
        </ThemedText>
        <View style={styles.colorGrid}>
          {WATER_COLORS.map((item) => (
            <ColorSwatch
              key={item.id}
              color={item.color}
              isSelected={localTheme.waterColor === item.color}
              onSelect={() => updateTheme({ waterColor: item.color })}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Koi vibes
        </ThemedText>
        <View style={styles.colorGrid}>
          {KOI_COLORS.map((item) => (
            <ColorSwatch
              key={item.id}
              color={item.color}
              isSelected={localTheme.koiColor === item.color}
              onSelect={() => updateTheme({ koiColor: item.color })}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Splash level
        </ThemedText>
        <CustomSlider
          value={localTheme.rippleIntensity}
          onValueChange={(value) => updateTheme({ rippleIntensity: value })}
          leftLabel="Subtle"
          rightLabel="Intense"
        />
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Sound volume
        </ThemedText>
        <CustomSlider
          value={localTheme.soundVolume}
          onValueChange={(value) => updateTheme({ soundVolume: value })}
          leftLabel="Quiet"
          rightLabel="Loud"
        />
      </View>

      <View style={styles.section}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            updateTheme({ particleEnabled: !localTheme.particleEnabled });
          }}
          style={[styles.toggleRow, { backgroundColor: theme.surface }]}
        >
          <View>
            <ThemedText type="body">Particle effects</ThemedText>
            <ThemedText type="small" style={styles.toggleDescription}>
              Floating bubbles and sparkles
            </ThemedText>
          </View>
          <View
            style={[
              styles.toggle,
              {
                backgroundColor: localTheme.particleEnabled
                  ? KoiColors.primary
                  : theme.surfaceElevated,
              },
            ]}
          >
            <Animated.View
              style={[
                styles.toggleThumb,
                {
                  transform: [
                    { translateX: localTheme.particleEnabled ? 20 : 0 },
                  ],
                },
              ]}
            />
          </View>
        </Pressable>
      </View>

      <AnimatedPressable
        onPress={handleSave}
        style={[styles.saveButton, saveAnimatedStyle]}
      >
        <ThemedText type="body" style={styles.saveButtonText}>
          Save Theme
        </ThemedText>
      </AnimatedPressable>
    </KeyboardAwareScrollViewCompat>
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
  previewContainer: {
    height: 180,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    marginBottom: Spacing["2xl"],
  },
  previewGradient: {
    flex: 1,
  },
  previewKoi: {
    position: "absolute",
    width: 50,
    height: 22,
    borderRadius: 22,
    transform: [{ rotate: "10deg" }],
  },
  previewParticle: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  colorSwatch: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  swatchCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  sliderLabel: {
    opacity: 0.7,
    width: 50,
  },
  sliderTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    position: "relative",
  },
  sliderFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 4,
  },
  sliderDot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    top: -2,
    marginLeft: -6,
  },
  sliderThumb: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    top: -6,
    marginLeft: -10,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  toggleDescription: {
    opacity: 0.7,
    marginTop: 2,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 4,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  saveButton: {
    backgroundColor: KoiColors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.lg,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
