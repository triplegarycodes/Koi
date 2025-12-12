````markdown
# Koi

All-in-one teen app for pure vibes and chillin.

This repository includes a simple local authentication flow (mock) so you can sign in and sign out. The session is persisted on-device.

How the mock auth works
- Any non-empty username and password will sign you in.
- The token is stored locally with AsyncStorage so next launches stay signed in.
- There is no backend in this demo. Replace the signIn/signUp logic in src/context/AuthContext.tsx to connect to your real auth server.

Running the app
1. Install dependencies:
   - npm: `npm install`
   - yarn: `yarn`
2. Start Expo:
   - `npm start` or `yarn start`
3. Run on device/emulator:
   - Press `a` to open Android emulator or `i` for iOS (macOS)
   - Or scan the QR code with the Expo Go app

Files added
- App.tsx — root wiring and auth provider
- src/context/AuthContext.tsx — auth state and persistence
- src/screens/LoginScreen.tsx — sign in / sign up UI
- src/screens/HomeScreen.tsx — home UI with sign out
- src/components/KoiCustomizer.tsx — placeholder customizer UI
- package.json updated to include @react-native-async-storage/async-storage

Next ideas I can add
- Real backend integration (example with Firebase or your API)
- Add animations to the koi (Lottie or custom RN animations)
- Add save/load presets for koi customization
- Add navigation and multiple screens (React Navigation) if you'd like

Would you like me to:
1) Wire this into a real backend (Firebase or your REST API)? or
2) Add a simple local "presets" save/load for the koi customizer?
