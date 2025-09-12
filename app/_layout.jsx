import SafeScreen from "@/components/SafeScreen";
import { useAuthStore } from "@/store/auth";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Layout() {
  const router = useRouter();
  const segments = useSegments();

  const { checkAuth, user, token } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
   
    if (segments.length === 0) return;

    const inAuthScreen = segments[0] === '(auth)';
    const isSignedIn = user && token;

    if (isSignedIn && inAuthScreen) {
     
      router.replace('/(tabs)');
    } else if (!isSignedIn && !inAuthScreen) {
      
      router.replace('/(auth)/login');
    }
  }, [segments, user, token]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}