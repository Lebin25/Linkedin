import { Stack } from "expo-router";

export default function Layout() {
   return (
      <Stack screenOptions={{ headerTitleAlign: 'center' }}>
         <Stack.Screen name="index" options={{ headerShown: false }} />
         <Stack.Screen name="connections" />
      </Stack>
   );
}