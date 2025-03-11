import { Stack } from 'expo-router'
import React from 'react'

import { useFonts } from 'expo-font';

import "./global.css";
import GlobalProvider from '@/lib/global-provider';

export default function RootLayout() {

    const [fontsLoaded] = useFonts({
        "Poppins-Regular": require('../assets/fonts/Poppins-Regular.ttf'),
        "Poppins-Bold": require('../assets/fonts/Poppins-Bold.ttf'),
        "Poppins-Medium": require('../assets/fonts/Poppins-Medium.ttf'),
        "Poppins-SemiBold": require('../assets/fonts/Poppins-SemiBold.ttf'),
    });

    if (!fontsLoaded) return null;

    return (
        <GlobalProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </GlobalProvider>
    )
}

