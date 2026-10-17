import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.shoshu.clinic',
  appName: 'Shima Clinic',
  webDir: 'public',
  server: {
    url: 'https://shoshu-clinic-l67s.vercel.app/', // ← replace with your real URL
    cleartext: false,
    androidScheme: 'https',
    iosScheme: 'https',
  },
  ios: {
    contentInset: 'always',
  },
  android: {
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#ffffff',
      showSpinner: false,
    },
  },
  server: {
  url: 'https://your-app.vercel.app',  // ← must be live, not localhost
  cleartext: false,
  androidScheme: 'https',
  iosScheme: 'https',
},
};

export default config;