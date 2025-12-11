import React from "react";
import { View, StyleSheet, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useTheme } from "@/hooks/useTheme";
import { useAppStorage } from "@/hooks/useAppStorage";
import { useOnboarding } from "@/hooks/useOnboarding";
import { Spacing, BorderRadius, KoiColors } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const AVATARS = [
  { id: 0, icon: "droplet" as const, color: KoiColors.primary },
  { id: 1, icon: "activity" as const, color: KoiColors.seafoam },
  { id: 2, icon: "wind" as const, color: KoiColors.glacier },
  { id: 3, icon: "sun" as const, color: KoiColors.koiOrange },
  { id: 4, icon: "moon" as const, color: KoiColors.deepSea },
  { id: 5, icon: "star" as const, color: KoiColors.koiPink },
];

interface SettingsRowProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value?: string;
  isToggle?: boolean;
  toggleValue?: boolean;
  onPress?: () => void;
}

function SettingsRow({
  icon,
  label,
  value,
  isToggle,
  toggleValue,
  onPress,
}: SettingsRowProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (!onPress) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.98, { damping: 15 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15 });
    }, 100);
    onPress();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.settingsRow, { backgroundColor: theme.surface }, animatedStyle]}
    >
      <View style={styles.settingsRowLeft}>
        <View style={[styles.settingsIcon, { backgroundColor: theme.surfaceElevated }]}>
          <Feather name={icon} size={18} color={theme.text} />
        </View>
        <ThemedText type="body">{label}</ThemedText>
      </View>
      {isToggle ? (
        <View
          style={[
            styles.toggle,
            {
              backgroundColor: toggleValue
                ? KoiColors.primary
                : theme.surfaceElevated,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.toggleThumb,
              {
                transform: [{ translateX: toggleValue ? 20 : 0 }],
              },
            ]}
          />
        </View>
      ) : value ? (
        <ThemedText type="small" style={styles.settingsValue}>
          {value}
        </ThemedText>
      ) : (
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
      )}
    </AnimatedPressable>
  );
}

function AvatarPicker({
  selectedId,
  onSelect,
}: {
  selectedId: number;
  onSelect: (id: number) => void;
}) {
  return (
    <View style={styles.avatarGrid}>
      {AVATARS.map((avatar) => (
        <Pressable
          key={avatar.id}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onSelect(avatar.id);
          }}
          style={[
            styles.avatarItem,
            { backgroundColor: avatar.color + "20" },
            selectedId === avatar.id && styles.avatarSelected,
          ]}
        >
          <Feather name={avatar.icon} size={24} color={avatar.color} />
          {selectedId === avatar.id ? (
            <View style={styles.avatarCheck}>
              <Feather name="check" size={10} color="#FFFFFF" />
            </View>
          ) : null}
        </Pressable>
      ))}
    </View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { preferences, setPreferences, streakData, clearAllData } = useAppStorage();
  const { resetOnboarding } = useOnboarding();

  const handleToggleSound = () => {
    setPreferences({ ...preferences, soundEnabled: !preferences.soundEnabled });
  };

  const handleToggleHaptics = () => {
    setPreferences({ ...preferences, hapticsEnabled: !preferences.hapticsEnabled });
  };

  const handleToggleLowMotion = () => {
    setPreferences({ ...preferences, lowMotionMode: !preferences.lowMotionMode });
  };

  const handleBreakLengthChange = () => {
    const lengths = [30, 60, 180];
    const currentIndex = lengths.indexOf(preferences.defaultBreakLength);
    const nextIndex = (currentIndex + 1) % lengths.length;
    setPreferences({ ...preferences, defaultBreakLength: lengths[nextIndex] });
  };

  const handleAvatarSelect = (id: number) => {
    setPreferences({ ...preferences, avatarId: id });
  };

  const handleResetData = () => {
    Alert.alert(
      "Reset all data?",
      "This will clear your preferences, themes, and streak. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await clearAllData();
            await resetOnboarding();
          },
        },
      ]
    );
  };

  const formatBreakLength = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    return `${seconds / 60}m`;
  };

  const selectedAvatar = AVATARS.find((a) => a.id === preferences.avatarId) || AVATARS[0];

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
      <View style={styles.profileHeader}>
        <View
          style={[
            styles.profileAvatar,
            { backgroundColor: selectedAvatar.color + "20" },
          ]}
        >
          <Feather
            name={selectedAvatar.icon}
            size={40}
            color={selectedAvatar.color}
          />
        </View>
        <ThemedText type="h3" style={styles.profileName}>
          {preferences.displayName || "Drifter"}
        </ThemedText>
        <ThemedText type="small" style={styles.profileSubtitle}>
          {streakData.totalBreaks} breaks taken
        </ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Choose avatar
        </ThemedText>
        <AvatarPicker
          selectedId={preferences.avatarId}
          onSelect={handleAvatarSelect}
        />
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Preferences
        </ThemedText>
        <View style={styles.settingsGroup}>
          <SettingsRow
            icon="clock"
            label="Default break"
            value={formatBreakLength(preferences.defaultBreakLength)}
            onPress={handleBreakLengthChange}
          />
          <SettingsRow
            icon="volume-2"
            label="Sound"
            isToggle
            toggleValue={preferences.soundEnabled}
            onPress={handleToggleSound}
          />
          <SettingsRow
            icon="smartphone"
            label="Haptics"
            isToggle
            toggleValue={preferences.hapticsEnabled}
            onPress={handleToggleHaptics}
          />
          <SettingsRow
            icon="minimize-2"
            label="Low motion"
            isToggle
            toggleValue={preferences.lowMotionMode}
            onPress={handleToggleLowMotion}
          />
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          Stats
        </ThemedText>
        <View style={[styles.statsCard, { backgroundColor: theme.surface }]}>
          <View style={styles.statItem}>
            <Feather name="zap" size={20} color={KoiColors.streak} />
            <View>
              <ThemedText type="h4">{streakData.currentStreak}</ThemedText>
              <ThemedText type="small" style={styles.statLabel}>
                Day streak
              </ThemedText>
            </View>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Feather name="droplet" size={20} color={KoiColors.primary} />
            <View>
              <ThemedText type="h4">{streakData.totalBreaks}</ThemedText>
              <ThemedText type="small" style={styles.statLabel}>
                Total breaks
              </ThemedText>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={styles.sectionTitle}>
          About
        </ThemedText>
        <View style={styles.settingsGroup}>
          <SettingsRow icon="shield" label="Privacy" onPress={() => {}} />
          <SettingsRow icon="info" label="Version" value="1.0.0" />
        </View>
      </View>

      <Pressable
        onPress={handleResetData}
        style={[styles.dangerButton, { backgroundColor: theme.surface }]}
      >
        <Feather name="trash-2" size={18} color="#EF4444" />
        <ThemedText type="body" style={styles.dangerButtonText}>
          Reset all data
        </ThemedText>
      </Pressable>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  profileName: {
    marginBottom: Spacing.xs,
  },
  profileSubtitle: {
    opacity: 0.7,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  avatarItem: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarSelected: {
    borderWidth: 2,
    borderColor: KoiColors.primary,
  },
  avatarCheck: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: KoiColors.streak,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsGroup: {
    gap: Spacing.sm,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  settingsRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  settingsIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsValue: {
    opacity: 0.7,
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
  statsCard: {
    flexDirection: "row",
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  statLabel: {
    opacity: 0.7,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#334155",
    marginHorizontal: Spacing.lg,
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.lg,
  },
  dangerButtonText: {
    color: "#EF4444",
  },
});
