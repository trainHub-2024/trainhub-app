import { View, Text, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import FormField from '@/components/ui-project/FormField';
import Button from '@/components/ui-project/Button';
import { useGlobalContext } from '@/lib/global-provider';
import { createUser } from '@/lib/appwrite';
import { UserRoleType } from '@/types';
import UiLoading from '@/components/ui/Loading';

const SignUp = () => {
    const { refetch } = useGlobalContext();
    const [isSubmitting, setSubmitting] = useState(false);

    const [form, setForm] = useState<{ username: string, email: string, password: string, role: UserRoleType; contactNumber: string }>({
        username: "",
        email: "",
        password: "",
        role: "trainee",
        contactNumber: "",
    });

    function handleChangeRole(newRole: "trainee" | "trainer") {
        setForm((prev) => ({ ...prev, role: newRole }));
    }

    const isValidPhoneNumber = (phoneNumber: string) => {
        const phoneRegex = /^\+63\d{10}$/;
        return phoneRegex.test(phoneNumber);
    };

    const onSubmit = async () => {
        if (!form.email || !form.password || !form.username || !form.role || !form.contactNumber) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        const validForm = {
            ...form,
            contactNumber: "+63" + form.contactNumber

        }

        if (!isValidPhoneNumber(validForm.contactNumber)) {
            Alert.alert("Error", "Please enter a valid phone number with +63 country code");
            return;
        }

        setSubmitting(true);

        try {
            const result = await createUser(validForm);

            if (result) {
                Alert.alert("Registered successfully");
                refetch();
                router.replace("/verification");
            } else {
                throw new Error("Registration failed");
            }

            // router.replace("/home");
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (isSubmitting) {
        return <UiLoading />;
    }

    return (
        <SafeAreaView className='h-full bg-white'>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className='flex-1'>
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerClassName='px-10 h-full py-6 flex flex-col justify-start items-center'>
                    <View className=''>
                        <Text className='text-base text-center uppercase text-muted-foreground'>
                            TrainHub
                        </Text>
                        <Text className='mt-2 text-3xl font-bold text-center text-primary'>
                            Register
                        </Text>
                    </View>

                    <View className='items-center justify-center flex-1 gap-4'>

                        <View className='flex-row items-center justify-center w-full gap-2'>
                            <TouchableOpacity
                                className={`py-2 border rounded-full flex-1 flex justify-center items-center
                ${form.role === "trainee" ? "bg-primary border-primary" : "bg-white"}
                `}
                                onPress={() => handleChangeRole("trainee")}>
                                <Text
                                    className={`font-poppins text-lg text-center 
                  ${form.role === "trainee" ? "text-white" : ""} `}
                                >
                                    Trainee
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className={`py-2 border rounded-full flex-1 flex justify-center items-center
                ${form.role === "trainer" ? "bg-primary border-primary" : "bg-white"}
                `}
                                onPress={() => handleChangeRole("trainer")}>
                                <Text
                                    className={`font-poppins text-lg text-center 
                  ${form.role === "trainer" ? "text-white" : ""} `}
                                >
                                    Trainer
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View className='w-full gap-2'>
                            <FormField
                                title='Username'
                                value={form.username}
                                placeholder='Enter your username'
                                handleChangeText={(e) => setForm({ ...form, username: e })}
                                otherStyles='w-full'
                            />
                            <FormField
                                title='Email'
                                value={form.email}
                                placeholder='Enter your email'
                                handleChangeText={(e) => setForm({ ...form, email: e })}
                                otherStyles='w-full'
                                keyboardType='email-address'
                            />
                            <FormField
                                isNumeric={true}
                                title='Contact Number'
                                value={form.contactNumber}
                                placeholder='+63xxxxxxxxxx'
                                handleChangeText={(e) => setForm({ ...form, contactNumber: e })}
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
                                    label='Sign up to TrainHub'
                                />
                            </View>
                            <TouchableOpacity className='mt-4' onPress={() => router.push("/sign-in")}>
                                <Text className='font-medium text-center underline text-primary'>Already have an account?</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignUp;