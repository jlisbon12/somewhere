import { Stack } from "expo-router/stack";


export default function Layout() {
  // separate home page into multiple components
  return (
<Stack
        screenOptions={{
          headerShown: false,
        }}
      />
  );
}
