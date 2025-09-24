## JeevanDhan (Expo React Native)

### Prerequisites
- Node.js 18+ and npm
- Install Expo CLI globally:
```bash
npm i -g expo-cli
```

### Install dependencies
```bash
npm install
```

### Run the app (development)
```bash
npm start
```
This opens Expo Dev Tools and shows a QR code.

### Use Expo Go (device preview)
- Install the Expo Go app on your phone:
  - Android: Google Play Store
  - iOS: App Store
- Ensure your phone and computer are on the same Wi‑Fi network.
- Run `npm start` and then:
  - Android: Open Expo Go, tap “Scan QR code”, scan the QR from the terminal/Dev Tools
  - iOS: Use the Camera app to scan the QR and open in Expo Go

### Run on simulator/emulator
- Android: `npm run android` (requires Android Studio + emulator)
- iOS (macOS only): `npm run ios` (requires Xcode + simulator)

### App flow (current)
- Onboarding page 1 → Onboarding page 2 → Onboarding page 3 → Login → Home
- Skip in onboarding jumps directly to Login.
- Login with username `admin` and password `admin`.

### Customize logo/name
- Replace the placeholder logo at `assets/icon.png`.
- App header name is set to "JeevanDhan" in `screens/Home.tsx`.


