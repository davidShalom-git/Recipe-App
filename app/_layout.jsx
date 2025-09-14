// app/_layout.tsx
import SafeScreen from '@/components/SafeScreen';
import { useAuthStore } from '@/store/auth';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
  const router   = useRouter();
  const segments = useSegments();

  const { checkAuth, isAuthenticated } = useAuthStore();

  /* 1.  Load token & user from AsyncStorage exactly once */
  useEffect(() => {
    checkAuth();
  }, []);

  /* 2.  Redirect whenever auth state OR active segment changes */
  useEffect(() => {
    if (!segments.length) return;                 // still mounting

    const inAuth = segments[0] === '(auth)';      // first folder of current route

    if (isAuthenticated && inAuth) {
      router.replace('/(tabs)');                  // logged-in user → main app
    } else if (!isAuthenticated && !inAuth) {
      router.replace('/(auth)/login');            // guest → login stack
    }
  }, [segments, isAuthenticated]);

  /* 3.  Normal navigation tree */
  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <StatusBar barStyle="dark-content" />
    </SafeAreaProvider>
  );
}
