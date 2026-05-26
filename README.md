# 🌾 Kisan Sathi — Smart Farmer App

A React Native Android app for Indian farmers with AI-powered crop advice, smart reminders, and expense tracking.

---

## Features

- **Field Management** — Register khets with crop, soil, area, sowing date
- **AI Salah** — Chat with Claude AI in Hindi/Hinglish for crop-specific advice
- **Smart Reminders** — Auto-scheduled watering & fertilizer notifications
- **Expense Tracker** — Track all farm expenses by category and field
- **Offline First** — Works without internet (except AI chat)

---

## Tech Stack

- React Native 0.73
- React Navigation (Bottom Tabs + Stack)
- AsyncStorage (local data)
- react-native-push-notification (reminders)
- Claude AI API (Sonnet 4)

---

## Setup (Local Development)

### Prerequisites
- Node.js 18+
- Android Studio + Android SDK
- JDK 17
- React Native CLI

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/KisanSathi.git
cd KisanSathi

# 2. Install dependencies
npm install

# 3. Start Metro bundler
npx react-native start

# 4. Run on Android (with device/emulator connected)
npx react-native run-android
```

---

## GitHub Actions — Signed APK Release

### One-Time Keystore Setup

**Step 1: Generate keystore** (run once on your computer)
```bash
keytool -genkey -v \
  -keystore kisan-sathi-release.keystore \
  -alias kisan-sathi \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```
It will ask for passwords — remember them!

**Step 2: Convert keystore to base64**
```bash
# On Mac/Linux:
base64 -i kisan-sathi-release.keystore | tr -d '\n'

# On Windows (PowerShell):
[Convert]::ToBase64String([IO.File]::ReadAllBytes("kisan-sathi-release.keystore"))
```
Copy the entire output.

**Step 3: Add GitHub Secrets**

Go to your GitHub repo → Settings → Secrets and variables → Actions → New repository secret

Add these 4 secrets:

| Secret Name | Value |
|-------------|-------|
| `KEYSTORE_BASE64` | The base64 string from Step 2 |
| `KEY_ALIAS` | `kisan-sathi` (or whatever alias you used) |
| `KEY_PASSWORD` | The key password you set |
| `STORE_PASSWORD` | The keystore password you set |

### Release an APK

```bash
# Create and push a version tag
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions will automatically:
1. Build the signed APK
2. Create a GitHub Release
3. Attach the APK as a downloadable asset

Users can then download and install the APK directly!

---

## Project Structure

```
KisanSathi/
├── App.js                          # Entry point
├── src/
│   ├── navigation/
│   │   └── MainNavigator.js        # Tab + Stack navigation
│   ├── screens/
│   │   ├── HomeScreen.js           # Field list
│   │   ├── AddFieldScreen.js       # Add new field
│   │   ├── FieldDetailScreen.js    # Field details + advice
│   │   ├── AIAdviceScreen.js       # Chat with AI
│   │   ├── RemindersScreen.js      # Manage reminders
│   │   ├── FinanceScreen.js        # Expense list
│   │   └── AddExpenseScreen.js     # Add expense
│   └── utils/
│       ├── storage.js              # AsyncStorage helpers
│       ├── notifications.js        # Push notification helpers
│       └── cropData.js             # Fertilizer + watering data
└── .github/
    └── workflows/
        └── release.yml             # CI/CD pipeline
```

---

## Add Your Anthropic API Key

In `src/screens/AIAdviceScreen.js`, the app calls the Anthropic API. You need to set up a backend proxy or add your API key.

For development, you can use a backend proxy (recommended for production).

---

## License

MIT — Free to use and modify for farmers!
