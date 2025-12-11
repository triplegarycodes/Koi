import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
  runOnJS,
  useAnimatedGestureHandler,
  interpolate,
  cancelAnimation,
} from "react-native-reanimated";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

import { ThemedText } from "@/components/ThemedText";
import { useAppStorage } from "@/hooks/useAppStorage";
import { Spacing, BorderRadius, ThemePresets, KoiColors } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

const { width, height } = Dimensions.get("window");

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  popped: boolean;
}

function RippleEffect({ x, y, color, onComplete }: { x: number; y: number; color: string; onComplete: () => void }) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withTiming(3, { duration: 1000, easing: Easing.out(Easing.ease) });
    opacity.value = withTiming(0, { duration: 1000, easing: Easing.out(Easing.ease) }, () => {
      runOnJS(onComplete)();
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.ripple,
        {
          left: x - 50,
          top: y - 50,
          borderColor: color,
        },
        animatedStyle,
      ]}
    />
  );
}

function KoiFish({ color, lowMotion }: { color: string; lowMotion: boolean }) {
  const translateX = useSharedValue(width * 0.3);
  const translateY = useSharedValue(height * 0.4);
  const rotation = useSharedValue(0);
  const targetX = useSharedValue(width * 0.3);
  const targetY = useSharedValue(height * 0.4);

  useEffect(() => {
    const animate = () => {
      const duration = lowMotion ? 8000 : 4000;
      targetX.value = Math.random() * (width - 100) + 50;
      targetY.value = Math.random() * (height - 200) + 100;

      const dx = targetX.value - translateX.value;
      const dy = targetY.value - translateY.value;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      rotation.value = withTiming(angle, { duration: 500 });
      translateX.value = withTiming(targetX.value, { duration, easing: Easing.inOut(Easing.ease) });
      translateY.value = withTiming(targetY.value, { duration, easing: Easing.inOut(Easing.ease) });
    };

    animate();
    const interval = setInterval(animate, lowMotion ? 8000 : 4000);
    return () => clearInterval(interval);
  }, [lowMotion]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.absoluteX - 30;
      translateY.value = event.absoluteY - 15;
      const dx = event.velocityX;
      const dy = event.velocityY;
      if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        rotation.value = Math.atan2(dy, dx) * (180 / Math.PI);
      }
    })
    .onEnd(() => {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.koiFish, animatedStyle]}>
        <View style={[styles.koiBody, { backgroundColor: color }]} />
        <View style={[styles.koiTail, { backgroundColor: color, opacity: 0.8 }]} />
      </Animated.View>
    </GestureDetector>
  );
}

function FloatingParticle({ x, delay, color, lowMotion }: { x: number; delay: number; color: string; lowMotion: boolean }) {
  const translateY = useSharedValue(height);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    const duration = lowMotion ? 8000 : 4000;
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(-50, { duration, easing: Easing.linear }),
        -1,
        false
      )
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(0.6, { duration: duration / 2 }),
        -1,
        true
      )
    );
    scale.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: duration / 2, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
  }, [lowMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        { left: x, backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
}

function BubbleItem({ bubble, color, onPop }: { bubble: Bubble; color: string; onPop: () => void }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.7);
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(-10, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withTiming(1.5, { duration: 150 });
    opacity.value = withTiming(0, { duration: 150 }, () => {
      runOnJS(onPop)();
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  if (bubble.popped) return null;

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={[
          styles.bubble,
          {
            left: bubble.x,
            top: bubble.y,
            width: bubble.size,
            height: bubble.size,
            borderRadius: bubble.size / 2,
            borderColor: color,
          },
          animatedStyle,
        ]}
      />
    </Pressable>
  );
}

function MoodSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const sliderWidth = width - Spacing.lg * 4;
  
  return (
    <View style={styles.moodSliderContainer}>
      <ThemedText type="small" style={styles.moodLabel}>Foggy</ThemedText>
      <View style={styles.moodTrack}>
        <LinearGradient
          colors={[KoiColors.foggy, KoiColors.clear]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.moodGradient}
        />
        {[0, 0.25, 0.5, 0.75, 1].map((pos) => (
          <Pressable
            key={pos}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onChange(pos);
            }}
            style={[
              styles.moodDot,
              {
                left: `${pos * 100}%`,
                backgroundColor: pos <= value ? "#FFFFFF" : "rgba(255,255,255,0.3)",
              },
            ]}
          />
        ))}
        <View
          style={[
            styles.moodThumb,
            { left: `${value * 100}%` },
          ]}
        />
      </View>
      <ThemedText type="small" style={styles.moodLabel}>Clear</ThemedText>
    </View>
  );
}

function Timer({ seconds, total }: { seconds: number; total: number }) {
  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, "0")}` : `${secs}s`;
  };

  const progress = 1 - seconds / total;

  return (
    <View style={styles.timerContainer}>
      <View style={styles.timerProgress}>
        <View style={[styles.timerFill, { width: `${progress * 100}%` }]} />
      </View>
      <ThemedText type="small" style={styles.timerText}>
        {formatTime(seconds)}
      </ThemedText>
    </View>
  );
}

export default function BreakSceneScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "BreakScene">>();
  const { duration, themeId } = route.params;
  
  const { preferences, moodValue, setMoodValue, recordBreak, customTheme } = useAppStorage();
  const [timeLeft, setTimeLeft] = useState(duration);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [showMoodSlider, setShowMoodSlider] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(preferences.soundEnabled);
  const rippleIdRef = useRef(0);
  const bubbleIdRef = useRef(0);

  const getThemeColors = () => {
    if (themeId === "custom") {
      return {
        waterColor: customTheme.waterColor,
        secondaryColor: adjustColorBrightness(customTheme.waterColor, -30),
        koiColor: customTheme.koiColor,
        particleColor: adjustColorBrightness(customTheme.waterColor, 30),
      };
    }
    const preset = ThemePresets[themeId as keyof typeof ThemePresets] || ThemePresets.koiPond;
    return preset;
  };

  const themeColors = getThemeColors();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          recordBreak();
          setTimeout(() => navigation.goBack(), 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const initialBubbles: Bubble[] = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: Math.random() * (width - 40) + 20,
      y: Math.random() * (height - 300) + 150,
      size: Math.random() * 20 + 20,
      popped: false,
    }));
    setBubbles(initialBubbles);
    bubbleIdRef.current = 5;
  }, []);

  const handleTap = useCallback((x: number, y: number) => {
    if (preferences.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const id = rippleIdRef.current++;
    setRipples((prev) => [...prev, { id, x, y }]);
  }, [preferences.hapticsEnabled]);

  const handleRippleComplete = useCallback((id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const handleBubblePop = useCallback((id: number) => {
    setBubbles((prev) => prev.map((b) => (b.id === id ? { ...b, popped: true } : b)));
    setTimeout(() => {
      const newBubble: Bubble = {
        id: bubbleIdRef.current++,
        x: Math.random() * (width - 40) + 20,
        y: Math.random() * (height - 300) + 150,
        size: Math.random() * 20 + 20,
        popped: false,
      };
      setBubbles((prev) => [...prev.filter((b) => !b.popped), newBubble]);
    }, 2000);
  }, []);

  const handleClose = () => {
    if (preferences.hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    navigation.goBack();
  };

  const tapGesture = Gesture.Tap()
    .onEnd((event) => {
      runOnJS(handleTap)(event.x, event.y);
    });

  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onStart(() => {
      runOnJS(setShowMoodSlider)(true);
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
    });

  const composedGesture = Gesture.Race(tapGesture, longPressGesture);

  const foggyOpacity = interpolate(moodValue, [0, 1], [0.4, 0]);

  const particles = Array.from({ length: 8 }, (_, i) => ({
    x: (width / 8) * i + Math.random() * 40,
    delay: i * 500,
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={composedGesture}>
        <View style={styles.container}>
          <LinearGradient
            colors={[themeColors.waterColor, themeColors.secondaryColor]}
            style={styles.background}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          >
            <View style={[styles.fogOverlay, { opacity: foggyOpacity }]} />

            {particles.map((p, i) => (
              <FloatingParticle
                key={i}
                x={p.x}
                delay={p.delay}
                color={themeColors.particleColor}
                lowMotion={preferences.lowMotionMode}
              />
            ))}

            {ripples.map((ripple) => (
              <RippleEffect
                key={ripple.id}
                x={ripple.x}
                y={ripple.y}
                color={themeColors.particleColor}
                onComplete={() => handleRippleComplete(ripple.id)}
              />
            ))}

            <KoiFish color={themeColors.koiColor} lowMotion={preferences.lowMotionMode} />

            {bubbles.map((bubble) => (
              <BubbleItem
                key={bubble.id}
                bubble={bubble}
                color={themeColors.particleColor}
                onPop={() => handleBubblePop(bubble.id)}
              />
            ))}
          </LinearGradient>

          <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
            <Timer seconds={timeLeft} total={duration} />
            <View style={styles.headerButtons}>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSoundEnabled(!soundEnabled);
                }}
                style={styles.headerButton}
              >
                <Feather
                  name={soundEnabled ? "volume-2" : "volume-x"}
                  size={20}
                  color="#FFFFFF"
                />
              </Pressable>
              <Pressable onPress={handleClose} style={styles.headerButton}>
                <Feather name="x" size={20} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>

          {showMoodSlider ? (
            <Pressable
              style={styles.moodOverlay}
              onPress={() => setShowMoodSlider(false)}
            >
              <View style={[styles.moodCard, { paddingBottom: insets.bottom + Spacing.xl }]}>
                <ThemedText type="h4" style={styles.moodTitle}>
                  How are you feeling?
                </ThemedText>
                <MoodSlider value={moodValue} onChange={setMoodValue} />
                <Pressable
                  onPress={() => setShowMoodSlider(false)}
                  style={styles.moodDoneButton}
                >
                  <ThemedText type="body" style={styles.moodDoneText}>
                    Done
                  </ThemedText>
                </Pressable>
              </View>
            </Pressable>
          ) : null}

          <View style={[styles.hint, { bottom: insets.bottom + Spacing.xl }]}>
            <ThemedText type="small" style={styles.hintText}>
              Tap for ripples, drag the koi, or hold for mood
            </ThemedText>
          </View>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

function adjustColorBrightness(color: string, amount: number): string {
  const hex = color.replace("#", "");
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) + amount));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  fogOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#1E293B",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  headerButtons: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  timerProgress: {
    width: 60,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  timerFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },
  timerText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  ripple: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
  },
  koiFish: {
    position: "absolute",
    width: 60,
    height: 30,
  },
  koiBody: {
    width: 40,
    height: 20,
    borderRadius: 20,
    position: "absolute",
    left: 10,
    top: 5,
  },
  koiTail: {
    width: 20,
    height: 16,
    borderRadius: 8,
    position: "absolute",
    left: 0,
    top: 7,
    transform: [{ rotate: "-20deg" }],
  },
  particle: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bubble: {
    position: "absolute",
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  hint: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  hintText: {
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
  },
  moodOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  moodCard: {
    backgroundColor: "#1E293B",
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    padding: Spacing.xl,
  },
  moodTitle: {
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  moodSliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  moodLabel: {
    color: "rgba(255,255,255,0.7)",
    width: 40,
  },
  moodTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    position: "relative",
  },
  moodGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 4,
  },
  moodDot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    top: -2,
    marginLeft: -6,
  },
  moodThumb: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    top: -6,
    marginLeft: -10,
    ...Platform.select({
      web: { boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)" },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
      },
    }),
  },
  moodDoneButton: {
    backgroundColor: KoiColors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    alignItems: "center",
  },
  moodDoneText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
