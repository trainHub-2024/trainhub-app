import { Stack, Redirect } from 'expo-router';
import { useGlobalContext } from '@/lib/global-provider';

export default function AuthLayout() {
    const { loading, isLogged, isOnboarded } = useGlobalContext();

    if (!loading && isLogged) {
        if (isOnboarded) return <Redirect href="/home" />;
        else return <Redirect href={"/onboarding"}/>
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="sign-in" />
            <Stack.Screen name="sign-up" />
        </Stack>
    );
}
