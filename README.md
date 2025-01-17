# Trackd Frontend

A React Native mobile application built with Expo, featuring a modern dark theme and secure authentication system.

## Features

- Secure authentication with JWT tokens
- Cross-platform support (iOS, Android, Web)
- Dark theme UI
- Secure storage handling for different platforms
- Safe area handling for modern devices

## Tech Stack

- React Native with Expo
- TypeScript
- React Navigation
- Axios for API calls
- Expo Secure Store
- AsyncStorage for web fallback
- React Native Safe Area Context

## Project Structure

```
trackd-frontend/
├── app/
│   ├── context/      # Global state management
│   ├── navigation/   # Navigation configuration
│   ├── screens/      # App screens
│   └── services/     # API and storage services
├── assets/          # Images and icons
└── app.json         # Expo configuration
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on specific platforms:
```bash
npm run ios     # for iOS
npm run android # for Android
npm run web     # for web
```

## API Configuration

The API base URL can be configured in `app/services/api.ts`. Currently set to:

```4:6:app/services/api.ts
const api = axios.create({
    baseURL: 'http://192.168.1.209:8000/api', // Replace with your LAN IP
});
```


## Security

The app implements a secure storage system that automatically uses:
- Expo SecureStore for native platforms
- AsyncStorage for web platform

## Authentication Flow

1. User signs in through SignOnScreen
2. JWT tokens (access & refresh) are securely stored
3. Tokens are automatically attached to API requests
4. Sign out clears stored tokens

## Navigation

The app uses React Navigation's stack navigator with two main screens:
- SignOn Screen (Initial screen)
- Home Screen (Post-authentication)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is private and confidential. See `.gitignore` for excluded files and directories.
