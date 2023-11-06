import { Stack } from "expo-router";

export default function Layout() {
   return (
      <Stack screenOptions={{ headerTitleAlign: 'center' }}>
         <Stack.Screen name="index" options={{ headerTitle: "Post" }} />
      </Stack>
   )
}