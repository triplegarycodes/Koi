import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  selectedTheme: "@koi_selected_theme",
  customTheme: "@koi_custom_theme",
  preferences: "@koi_preferences",
  streakData: "@koi_streak_data",
  moodSlider: "@koi_mood_slider",
};

export interface CustomTheme {
  waterColor: string;
  rippleIntensity: number;
  particleEnabled: boolean;
  koiColor: string;
  soundVolume: number;
}

export interface Preferences {
  defaultBreakLength: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  lowMotionMode: boolean;
  displayName: string;
  avatarId: number;
}

export interface StreakData {
  currentStreak: number;
  lastBreakDate: string | null;
  totalBreaks: number;
}

const defaultPreferences: Preferences = {
  defaultBreakLength: 60,
  soundEnabled: true,
  hapticsEnabled: true,
  lowMotionMode: false,
  displayName: "",
  avatarId: 0,
};

const defaultCustomTheme: CustomTheme = {
  waterColor: "#2DD4BF",
  rippleIntensity: 0.5,
  particleEnabled: true,
  koiColor: "#F97316",
  soundVolume: 0.5,
};

const defaultStreakData: StreakData = {
  currentStreak: 0,
  lastBreakDate: null,
  totalBreaks: 0,
};

export function useAppStorage() {
  const [selectedTheme, setSelectedThemeState] = useState<string>("koiPond");
  const [customTheme, setCustomThemeState] = useState<CustomTheme>(defaultCustomTheme);
  const [preferences, setPreferencesState] = useState<Preferences>(defaultPreferences);
  const [streakData, setStreakDataState] = useState<StreakData>(defaultStreakData);
  const [moodValue, setMoodValueState] = useState<number>(0.5);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [
        themeValue,
        customThemeValue,
        preferencesValue,
        streakValue,
        moodValue,
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.selectedTheme),
        AsyncStorage.getItem(STORAGE_KEYS.customTheme),
        AsyncStorage.getItem(STORAGE_KEYS.preferences),
        AsyncStorage.getItem(STORAGE_KEYS.streakData),
        AsyncStorage.getItem(STORAGE_KEYS.moodSlider),
      ]);

      if (themeValue) setSelectedThemeState(themeValue);
      if (customThemeValue) setCustomThemeState(JSON.parse(customThemeValue));
      if (preferencesValue) setPreferencesState(JSON.parse(preferencesValue));
      if (streakValue) setStreakDataState(JSON.parse(streakValue));
      if (moodValue) setMoodValueState(parseFloat(moodValue));
    } catch (error) {
      console.error("Error loading app data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setSelectedTheme = useCallback(async (theme: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.selectedTheme, theme);
      setSelectedThemeState(theme);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  }, []);

  const setCustomTheme = useCallback(async (theme: CustomTheme) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.customTheme, JSON.stringify(theme));
      setCustomThemeState(theme);
    } catch (error) {
      console.error("Error saving custom theme:", error);
    }
  }, []);

  const setPreferences = useCallback(async (prefs: Preferences) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.preferences, JSON.stringify(prefs));
      setPreferencesState(prefs);
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  }, []);

  const setMoodValue = useCallback(async (value: number) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.moodSlider, value.toString());
      setMoodValueState(value);
    } catch (error) {
      console.error("Error saving mood:", error);
    }
  }, []);

  const recordBreak = useCallback(async () => {
    try {
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();

      let newStreak = 1;
      if (streakData.lastBreakDate === today) {
        newStreak = streakData.currentStreak;
      } else if (streakData.lastBreakDate === yesterday) {
        newStreak = streakData.currentStreak + 1;
      }

      const newStreakData: StreakData = {
        currentStreak: newStreak,
        lastBreakDate: today,
        totalBreaks: streakData.totalBreaks + 1,
      };

      await AsyncStorage.setItem(STORAGE_KEYS.streakData, JSON.stringify(newStreakData));
      setStreakDataState(newStreakData);
    } catch (error) {
      console.error("Error recording break:", error);
    }
  }, [streakData]);

  const clearAllData = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
      setSelectedThemeState("koiPond");
      setCustomThemeState(defaultCustomTheme);
      setPreferencesState(defaultPreferences);
      setStreakDataState(defaultStreakData);
      setMoodValueState(0.5);
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  }, []);

  return {
    selectedTheme,
    customTheme,
    preferences,
    streakData,
    moodValue,
    isLoading,
    setSelectedTheme,
    setCustomTheme,
    setPreferences,
    setMoodValue,
    recordBreak,
    clearAllData,
  };
}
