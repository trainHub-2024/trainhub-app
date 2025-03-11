import { View, Text, ScrollView, Image, Animated, Dimensions } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '@/lib/global-provider';
import { Redirect, router } from 'expo-router';
import Button from '@/components/ui-project/Button';
import images from '@/constants/images';

const { width, height } = Dimensions.get("window");

const Index = () => {
    const { loading, isLogged, isOnboarded } = useGlobalContext();

    // Redirect logic
    if (!loading && isLogged) {
        if (isOnboarded) return <Redirect href="/home" />;
        return <Redirect href="/onboarding" />;
    }

    // Animation for fade-in effect
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <SafeAreaView className="flex items-center justify-center h-full bg-white">
            <View className="relative flex flex-col items-center justify-between w-full h-full px-10 py-6">

                {/* BACKGROUND CIRCLE - CENTERED */}
                <View
                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary blur-3xl"
                    style={{
                        width: width * 0.8, // 80% of screen width
                        height: width * 0.8, // Keep it a circle
                        top: height/2,
                        left: "60%",
                        zIndex: -10,
                    }}
                ></View>


                {/* Welcome Text */}
                <Animated.View style={{ opacity: fadeAnim }}>
                    <Text className="text-base text-center uppercase text-muted-foreground font-poppinsMedium">
                        Welcome to Trainhub
                    </Text>
                    <Text className="mt-2 text-3xl font-bold text-center text-primary font-poppins">
                        Let's Get You Closer to Your Ideal Training
                    </Text>
                </Animated.View>

                {/* Hero Image */}
                <Animated.Image
                    className="absolute z-10"
                    source={images.standing}
                    style={{
                        bottom: 60,
                        width: 180, height: 420,
                        opacity: fadeAnim,
                        transform: [{ scale: fadeAnim }],
                    }}
                    resizeMode="cover"
                />

                {/* CTA Button */}
                <Animated.View className="w-full" style={{ opacity: fadeAnim }}>
                    <Button
                        className="w-full mt-6"
                        onPress={() => router.push('/sign-in')}
                        label="Get Started!"
                    />
                </Animated.View>
            </View>
        </SafeAreaView>
    );
};

export default Index;
