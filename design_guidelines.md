# KOI Mobile App - Design Guidelines

## Architecture Decisions

### Authentication
**No Auth Required**
- The app is a single-user utility focused on personal micro-breaks
- All data stored locally on device
- Include a **Profile/Settings screen** with:
  - User-customizable avatar (generate 1 water-themed avatar - simple koi silhouette or water drop)
  - Optional display name field
  - App preferences (sound volume, haptics, default break length)
  - Theme customization access
  - Privacy settings

### Navigation
**Tab Navigation (4 tabs + FAB)**
- 4 distinct feature areas require tab bar navigation
- Floating Action Button (FAB) for core "Take a Break" action

**Tab Structure:**
1. **Home** - Quick stats, recent themes, start break
2. **Themes** - Browse and select preset themes
3. **FAB (Center)** - "Take a Break" primary action
4. **Customize** - Theme customization studio
5. **Profile** - Settings, streaks, preferences

## Screen Specifications

### 1. Onboarding Flow (Stack-Only, 2-3 screens)
**Purpose:** Quick introduction to the app concept
- **Layout:** Full-screen with water animations in background
- **Screens:**
  1. Welcome + core concept (30 sec breaks, visual resets)
  2. Quick interaction demo (tap to create ripples)
  3. Choose default theme
- **Navigation:** Simple "Next" button, skip option on every screen
- **Tone:** "Welcome to KOI," "Tap to explore," "Pick your vibe"
- No header, full-screen immersive experience
- Safe area: top inset = insets.top + Spacing.xl, bottom inset = insets.bottom + Spacing.xl

### 2. Home Screen
**Purpose:** Launch breaks quickly, view stats casually
- **Header:** Transparent, no title, profile icon (top right)
- **Layout:** Scrollable root view
  - Hero area: Current theme preview (tappable card)
  - Quick break buttons (30s, 1m, 3m) - prominent, water-themed
  - Soft streak counter (non-intense, celebratory)
  - Recent themes carousel
- **Safe Area:** 
  - Top: headerHeight + Spacing.xl
  - Bottom: tabBarHeight + Spacing.xl
- **Components:** Cards, buttons, horizontal scroll list

### 3. Break Scene (Full-Screen Modal)
**Purpose:** Immersive water interaction experience
- **Navigation:** Modal presentation, dismiss with subtle "X" or swipe down
- **Header:** None (edge-to-edge water scene)
- **Layout:** Non-scrollable, full-screen interactive canvas
  - Floating timer (top center, very subtle)
  - Floating sound toggle (top right, small icon)
  - Interactive water layer (fills entire screen)
  - Mood slider appears on long-press bottom edge (optional)
- **Interactions:**
  - Tap: Create ripples with smooth animation
  - Drag: Guide koi fish with trailing particles
  - Swipe: Create gentle waves
  - Double-tap specific zones: Pop bubbles or trigger sparkles
- **Exit:** Auto-dismiss after timer, or user swipes down
- **Safe Area:** All interactive elements respect insets, but water fills entire screen including safe areas

### 4. Themes Screen
**Purpose:** Browse and select preset water themes
- **Header:** Default navigation header, title "Themes"
- **Layout:** Scrollable grid (2 columns)
  - Each theme card shows:
    - Animated preview loop (subtle, low-motion)
    - Theme name (Koi Pond, Deep Sea, etc.)
    - Current theme has subtle glow/border
- **Preset Themes:**
  1. Koi Pond (default) - warm teal, orange koi
  2. Deep Sea - deep indigo, bioluminescent particles
  3. Rainy Window - grey-blue, raindrop streaks
  4. Tide Pool - seafoam green, small ripples
  5. Glacier Lake - icy cyan, slow drift
  6. Zen River - soft jade, flowing motion
- **Safe Area:**
  - Top: Spacing.xl (non-transparent header)
  - Bottom: tabBarHeight + Spacing.xl
- **Components:** Grid, animated cards, selection indicator

### 5. Customize Screen
**Purpose:** Create custom water themes
- **Header:** Default header, "Customize" title, "Save" button (right)
- **Layout:** Scrollable form with live preview at top
  - Preview card (1/3 screen height, live water animation)
  - Customization controls:
    - Water color picker (preset swatches + custom)
    - Ripple intensity slider (Subtle → Intense)
    - Particle effects toggle + type selector
    - Koi fish color picker
    - Ambient sound volume slider
  - "Save Theme" button at bottom (or in header)
- **Tone:** Playful labels ("Pick your water," "Koi vibes," "Splash level")
- **Safe Area:**
  - Top: Spacing.xl
  - Bottom: tabBarHeight + Spacing.xl
- **Components:** Color pickers, sliders, toggles, live preview

### 6. Profile/Settings Screen
**Purpose:** Personal preferences and app settings
- **Header:** Default header, "Profile" title
- **Layout:** Scrollable form
  - Avatar selection (custom water-themed icons)
  - Optional display name
  - Preferences section:
    - Default break length
    - Sound on/off by default
    - Haptic feedback toggle
    - Low motion mode (accessibility)
  - About section:
    - Streak history (casual, non-intense)
    - Privacy info
    - App version
- **Safe Area:**
  - Top: Spacing.xl
  - Bottom: tabBarHeight + Spacing.xl
- **Components:** Avatar picker, text input, settings list, toggles

## Design System

### Color Palette
**Water-Inspired, Dark-Mode First**

Primary Colors:
- **Primary Blue:** #2DD4BF (teal, for koi pond theme)
- **Deep Sea:** #1E3A8A (indigo)
- **Seafoam:** #6EE7B7 (accent green)
- **Glacier:** #67E8F9 (cyan)

Neutrals (Dark Mode):
- **Background:** #0F172A (very dark blue-grey)
- **Surface:** #1E293B (dark slate)
- **Surface Elevated:** #334155 (medium slate)
- **Text Primary:** #F1F5F9 (off-white)
- **Text Secondary:** #94A3B8 (muted blue-grey)

Feedback:
- **Success/Streak:** #34D399 (green)
- **Calm/Mood:** Gradient from #6366F1 (foggy) to #2DD4BF (clear)

### Typography
- **Primary Font:** System default (SF Pro for iOS, Roboto for Android)
- **Headers:** Semi-bold, 24-28px
- **Body:** Regular, 16-18px
- **Labels:** Medium, 14-16px
- **Casual Tone:** All caps avoided, friendly lowercase or sentence case

### Spacing
- **xl:** 24px
- **lg:** 16px
- **md:** 12px
- **sm:** 8px
- **xs:** 4px

### Shadows
- Floating elements ONLY (FAB, floating timer):
  - shadowOffset: {width: 0, height: 2}
  - shadowOpacity: 0.10
  - shadowRadius: 2

## Visual Design

### Icons
- Use Feather icons from @expo/vector-icons for UI (home, settings, sound, etc.)
- NO emojis
- Custom water-themed icons for:
  - Tab bar (simple wave, droplet, koi silhouettes)
  - Break interactions (ripple indicator, bubble)

### Animations
- **Ripples:** Expand outward from tap, fade after 1-2 seconds
- **Koi fish:** Smooth follow animation, trailing particle effect
- **Bubbles:** Rise slowly, pop on tap with gentle burst
- **Waves:** Gentle oscillation following swipe direction
- **Theme transitions:** Crossfade between water scenes (0.5s)
- **All animations:** 60fps target, smooth easing curves

### Visual Feedback
- **All touchables:** Scale down slightly (0.95) when pressed, subtle haptic
- **Cards:** Lift on press (slight elevation change)
- **Sliders:** Immediate visual response, haptic at intervals
- **FAB:** Ripple effect + haptic on press

### Critical Assets to Generate
1. **Koi Fish Sprite:** Stylized, simple silhouette, multiple color variants (orange, white, black, pink)
2. **Bubble Particles:** Simple circles with subtle gradients
3. **Ripple Texture:** Concentric circles with opacity gradient
4. **Avatar Set:** 6-8 water-themed user avatars (koi, water drop, wave, shell, etc.)
5. **Theme Preview Loops:** 2-3 second looping animations for each of 6 preset themes
6. **Lily Pad Asset:** Simple, flat design for fidget interaction

**Asset Aesthetic:** Minimalist, flat/semi-flat style, water-inspired, NOT realistic

### Accessibility
- **Low Motion Mode:** Reduce animation intensity, slower movements
- **Sound Optional:** All soundscapes can be disabled
- **High Contrast:** Ensure text meets WCAG AA on all backgrounds
- **Touch Targets:** Minimum 44x44px for all interactive elements
- **Mood Slider:** Not required for use, purely optional

### Sound Design
- **6 Looping Soundscapes** (15-30 second loops, seamless):
  1. Pond water (gentle bubbling)
  2. Deep underwater hum
  3. Rain on glass
  4. Gentle waves lapping
  5. Glacier drips
  6. Flowing river
- All sounds optional, volume controlled by user
- Subtle haptics accompany sound interactions