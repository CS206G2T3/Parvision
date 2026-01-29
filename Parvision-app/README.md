# ParVision 🏌️

**Your AI Golf Coach - Mobile App**

A React Native mobile application for golf swing analysis and community connection.

---

## 🚀 Quick Start - Running the Homepage

### Prerequisites
- Node.js 18+ ([Download here](https://nodejs.org/))
- Expo Go app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- Git

---

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/your-username/parvision.git
cd parvision/Parvision-app
```

#### 2. Install dependencies
```bash
npm install
npm install lucide-react-native react-native-svg
```

#### 3. Start the development server
```bash
npx expo start
```

#### 4. View on your phone

**Option A: Using Expo Go (Same WiFi)**
- Scan the QR code with your phone's camera (iOS) or Expo Go app (Android)
- App will load on your phone

**Option B: Using Tunnel (Different WiFi/School Network)**
```bash
npx expo start --tunnel
```
- Open Expo Go app → Tap "Scan QR code"
- Scan the QR code that appears
- Wait 20-30 seconds for connection

**Option C: View in Browser**
```bash
npx expo start
# Press 'w' for web version
```
- Opens in browser at `http://localhost:8081`
- Press F12 → Ctrl+Shift+M to view in mobile size

---

## 📂 Project Structure
```
Parvision-app/
├── app/                    # Expo Router navigation
│   └── (tabs)/
│       └── index.tsx       # Home tab (imports HomeScreen)
├── src/
│   └── screens/
│       └── HomeScreen.js   # Main home screen component
├── assets/                 # Images and icons
├── App.js                  # App entry point
└── package.json            # Dependencies
```

---

## 🐛 Troubleshooting

### "Cannot find module 'lucide-react-native'"
```bash
npm install lucide-react-native react-native-svg
npx expo start --clear
```

### "No usable data found" when scanning QR code
```bash
# Use tunnel mode instead
npx expo start --tunnel
# Must scan with Expo Go app (not phone camera)
```

### App shows blank white screen
```bash
npx expo start --clear
```

### Icons not showing
```bash
npm install react-native-svg
npx expo start --clear
```

---

## 🎯 What You'll See

The homepage includes:
- ✅ ParVision branding header
- ✅ User profile card (David Goh - sample persona)
- ✅ Quick stats dashboard (swings, grades, metrics)
- ✅ "Record New Swing" button
- ✅ "Upload Video" button
- ✅ Recent swings list
- ✅ Community preview card ("The 19th Hole")
- ✅ Bottom navigation bar

---

## 📱 Development Commands
```bash
# Start development server
npx expo start

# Start with tunnel (for restricted networks)
npx expo start --tunnel

# Clear cache and restart
npx expo start --clear

# Open in web browser
npx expo start
# Then press 'w'
```

---

## 👥 Team

**G2T3**: Bradley Goh, Marcus Hooy, Jared Yeo, Merlin Gan, Ryan Lim, Calvin Ong

**Course**: CS206 Software Product Management

---

## 📄 License

This project is part of a university course assignment.

---

## 🆘 Need Help?

1. Make sure you're in the `Parvision-app` folder
2. Run `npm install` to ensure all packages are installed
3. Use `npx expo start --tunnel` if on school WiFi
4. Check that your phone and computer are on the same WiFi (if not using tunnel)

For more issues, check the Troubleshooting section above.