# 📱 Framely Mobile App

This is a React Native mobile application built using **Expo (Router + TypeScript)** with a clean scalable architecture.
---
#  Tech Stack

- React Native (Expo)
- Expo Router (file-based navigation)
- TypeScript
- Node.js backend (API)

---

# 📂 Project Structure
app/               → Routing layer only

src/               → Application code(Business logic)
|
├── screens/      → Main UI screens
├── components/   → Reusable UI components
├── services/     → API calls
├── constants/    → Config & static data
├── hooks/        → Custom hooks
├── utils/        → Helper functions
assets/            → Images & icons

---

# ⚙️ Prerequisites

Make sure you have:

- Node.js (v20 recommended)
- npm or yarn
- Expo CLI (via npx)
- Expo Go app (Android/iOS)

---

# 📦 Installation

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd project name
check node -v
check npx expo -v


🔑 Environment Setup
Create a .env file in root:
EXPO_PUBLIC_BACKEND_URL=http://192.168.X.X:3000Show
-------------------------------
▶️ Run the App( first time run or setuped project -- go below instructions )

 Start the development server :
    - npx expo start

🧹 Reset Cache (if errors occur)
- npx expo install expo@~54.0.35 expo-font@~14.0.12 expo-router@~6.0.24
    - npx expo start --clear
--------------------------------
📱 Run on Device...
📲 Open Expo Go app
📷 Scan the QR code shown in terminal

-----------------------------------------
(-- This is for first time setup--)

📦 Installation---
- npm install
- npx expo install

📦->Required packages:
- npx expo install expo-media-library
- npx expo install expo-image-picker
- npx expo install expo-linear-gradient
- npx expo install @expo/vector-icons
- npx expo install react-native-screens react-native-safe-area-context
- npx expo install react-native-gesture-handler
- npx expo install @react-native-async-storage/async-storage


✔ (now start the projct)...
- npx expo start

-------------------------------------------


🧭 Navigation
Routing is handled via Expo Router
Example:
TypeScriptimport { router } from 'expo-router';router.push('/create');

📌 Development Guidelines-->
Keep UI in src/screens
Keep app/ files minimal (routing only)
Use reusable components inside src/components
Do not modify package.json manually
Add dependencies only when required
Always use: npx expo install <package-name>

⚠️ Common Issues & Fixes

✅ Module not found
→ Install using:
npx expo install <package>


✅ Env not working
→ Ensure:

.env exists
starts with EXPO_PUBLIC_
restart Expo


✅ Path errors
→ Check: file exists 
→ correct import path
→ case-sensitive filenames


✅ Metro cache issue
npx expo start --clear


✅ Project Status
✔ Working with Expo Router
✔ Clean architecture (app + src)
✔ Ready for API integration