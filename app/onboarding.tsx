import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DatePickerInput from "@/components/ui-project/FormDatePicker";
import Button from "@/components/ui-project/Button";
import FormField from "@/components/ui-project/FormField";
import { useGlobalContext } from "@/lib/global-provider";
import { Redirect, router } from "expo-router";
import { onBoardTrainee, onBoardTrainer } from "@/lib/appwrite";

type FormType = {
    contactNumber: string;
    gender: string;
    location: string;
    dob: Date;
}

const Onboarding = () => {
    const { user, isLogged, isOnboarded, loading, refetch } = useGlobalContext();

    if (!loading && isLogged) {
        if (isOnboarded) return <Redirect href="/home" />;
    }

    const [form, setForm] = useState<FormType>({
        contactNumber: "",
        gender: "",
        location: "",
        dob: new Date(),
    });

    const [isSubmitting, setSubmitting] = useState(false);

    const onSubmit = async () => {
        if (user?.role) {
            setSubmitting(true);

            try {
                if (user.role === "trainee") {
                    await onBoardTrainee({ ...form, id: user.user_id });
                    Alert.alert("Onboarded Successfully!")
                    refetch();
                } else {
                    await onBoardTrainer({ ...form, id: user.user_id })
                    router.push("/onboarding-schedule");
                }

            } catch (error: any) {
                Alert.alert("Error", error.message);
            } finally {
                setSubmitting(false);
            }


        }

    }

    return (
        <SafeAreaView className="flex-1 p-6 bg-white">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerClassName="flex-grow justify-start"
            >
                <View>
                    <Text className="text-4xl font-bold text-center text-primary">
                        Welcome
                    </Text>
                    <Text className="mt-1 text-center">Please fill up all the details</Text>
                </View>

                <View className='justify-center flex-1 gap-2'>
                    <FormField
                        isNumeric={true}
                        title='Contact Number'
                        value={form.contactNumber}
                        placeholder='Enter your contact number'
                        handleChangeText={(e) => setForm({ ...form, contactNumber: e })}
                        otherStyles='w-full'
                    />
                    <FormField
                        title='Location'
                        value={form.location}
                        placeholder='Enter your location'
                        handleChangeText={(e) => setForm({ ...form, location: e })}
                        otherStyles='w-full'
                    />
                    <FormField
                        title='Gender'
                        value={form.gender}
                        placeholder='Enter your gender'
                        handleChangeText={(e) => setForm({ ...form, gender: e })}
                        otherStyles='w-full'
                    />
                    <DatePickerInput
                        title="Date of Birth"
                        date={form.dob}
                        onChange={(e) => setForm({ ...form, dob: e })}
                    />
                    <View className='mt-8'>
                        <Button
                            isLoading={isSubmitting}
                            onPress={onSubmit}
                            label='Next'
                        />
                    </View>
                    <TouchableOpacity onPress={() => router.push("/onboarding-schedule")}>
                        <View>
                            <Text>Next</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default Onboarding;
