import { Redirect, Slot, Stack } from "expo-router";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGlobalContext } from "@/lib/global-provider";

export default function AppLayout() {
    const { loading, isLogged, isOnboarded } = useGlobalContext();

    if (loading) {
        return (
            <SafeAreaView className="flex items-center justify-center h-full bg-white">
                <ActivityIndicator className="text-primary" size="large" />
            </SafeAreaView>
        );
    }

    if (!isLogged) {
        return <Redirect href="/sign-in" />;
    }

    if (!isOnboarded) {
        return <Redirect href="/onboarding" />;
    }

    return (
        <Stack screenOptions={{ headerShown: false }} />
    )
}