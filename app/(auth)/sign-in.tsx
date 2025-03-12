import { View, Text, ScrollView, TouchableOpacity, Alert, Dimensions, Image, Keyboard, TouchableWithoutFeedback, Platform, KeyboardAvoidingView, Animated, Easing } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import FormField from '@/components/ui-project/FormField'
import Button from '@/components/ui-project/Button'
import { useGlobalContext } from '@/lib/global-provider'
import { logout, signIn } from '@/lib/appwrite'
import images from '@/constants/images'
import UiLoading from '@/components/ui/Loading'

const { width, height } = Dimensions.get("window");


const SignIn = () => {
    const { refetch } = useGlobalContext();
    const [isSubmitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const imageAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const keyboardShowListener = Keyboard.addListener('keyboardDidShow', () => {
            Animated.timing(imageAnim, {
                toValue: -220, // Move image up by 80 pixels
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: true,
            }).start();
        });

        const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
            Animated.timing(imageAnim, {
                toValue: 0, // Reset image position
                duration: 300,
                easing: Easing.ease,
                useNativeDriver: true,
            }).start();
        });

        return () => {
            keyboardShowListener.remove();
            keyboardHideListener.remove();
        };
    }, []);

    async function onSubmit() {
        if (!form.email || !form.password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setSubmitting(true);

        try {
            const session = await signIn(form);

            if (session) {
                Alert.alert("Login successful")
                refetch();
                router.replace("/home");
            } else {
                throw new Error("Login failed");
            }
        } catch (error: any) {
            Alert.alert("Invalid Credentials", "Please register or try again!");
        } finally {
            setSubmitting(false);
        }
    }

    if (isSubmitting) {
        return <UiLoading />
    }

    return (
        <SafeAreaView className="flex-1 bg-primary">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className='h-full' style={{ position: "relative" }}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={{ flex: 1 }}
                    >
                        <ScrollView
                            contentContainerStyle={{ flexGrow: 1 }}
                            keyboardShouldPersistTaps="handled"
                        >
                            {/* Upper Content (Takes Remaining Space) */}
                            <View className="relative items-center justify-start flex-1">
                                <Text className="mt-4 text-3xl text-white font-poppinsBold">Trainhub</Text>
                                <Animated.Image
                                    source={images.sitting}
                                    style={{
                                        marginTop: 15,
                                        width: 220,
                                        height: 320,
                                        transform: [{ translateY: imageAnim }],
                                    }}
                                    resizeMode="cover"
                                    className={"z-00"}
                                />
                            </View>

                            {/* Bottom Section (Always Stays at Bottom) */}
                            <View style={{ height: width * 1.1, width: width, position: "absolute", bottom: 0, marginTop: 100 }} className="px-6 pt-1 bg-white rounded-2xl">
                                <Text className='mt-10 text-3xl text-center font-poppinsMedium'>
                                    Login
                                </Text>
                                <Text className='mt-1 text-center text-muted-foreground'>
                                    Let&apos;s get you started and find trainers just for you!
                                </Text>
                                <View className='w-full gap-2'>
                                    <FormField
                                        title='Email'
                                        value={form.email}
                                        placeholder='Enter your email'
                                        handleChangeText={(e) => setForm({ ...form, email: e })}
                                        otherStyles='w-full'
                                    />
                                    <FormField
                                        title='Password'
                                        value={form.password}
                                        placeholder='Enter your password'
                                        handleChangeText={(e) => setForm({ ...form, password: e })}
                                        otherStyles='w-full'
                                    />
                                    <View className='mt-4'>
                                        <Button
                                            isLoading={isSubmitting}
                                            onPress={onSubmit}
                                            label='Login to TrainHub'
                                        />
                                    </View>
                                    <TouchableOpacity className='mt-4' onPress={() => router.push("/sign-up")}>
                                        <Text className='font-medium text-center underline text-primary'>Don&apos;t have an account yet?</Text>
                                    </TouchableOpacity>
                                    {/* <TouchableOpacity onPress={() => logout()}>
                                        <Text>Logout</Text>
                                    </TouchableOpacity> */}
                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default SignIn