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
cd framelyMobile
npm install


🔑 Environment Setup

Create a .env file in root:
EXPO_PUBLIC_BACKEND_URL=http://192.168.X.X:3000Show

▶️ Run the App

Start the development server :
- npx expo start

📱 Run on Device...
📲 Open Expo Go app
📷 Scan the QR code shown in terminal


🧹 Reset Cache (if errors occur)
- npx expo start --clear


📦 Install New Packages
Always use:
Shell npx expo install <package-name>Show more lines
Example:
- npx expo install expo-image-picker
- npx expo install expo-linear-gradient
- npx expo install @expo/vector-icons
- npx expo install react-native-screens react-native-safe-area-context
- npx expo install react-native-gesture-handler

🧭 Navigation
Routing is handled via Expo Router
Example:
TypeScriptimport { router } from 'expo-router';router.push('/create');

📌 Development Guidelines

Keep UI in src/screens
Keep app/ files minimal (routing only)
Use reusable components inside src/components
Do not modify package.json manually
Add dependencies only when required


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