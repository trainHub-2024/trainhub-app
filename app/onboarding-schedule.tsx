import { View, Text, ScrollView, Alert, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DatePickerInput from "@/components/ui-project/FormDatePicker";
import Button from "@/components/ui-project/Button";
import FormField from "@/components/ui-project/FormField";
import { useGlobalContext } from "@/lib/global-provider";
import { Redirect, router } from "expo-router";
import { onBoardTrainee, onBoardTrainer, updateScheduleTrainer } from "@/lib/appwrite";
import TimePickerInput from "@/components/ui-project/FormTimePicker";
import DaysOfWeekPicker from "@/components/ui-project/FormDayPicker";

import * as ImagePicker from "expo-image-picker";
import { useAppwrite } from "@/lib/useAppwrite";
import { getSports } from "@/lib/actions/sports.actions";
import { ActivityIndicator } from "react-native";
import SelectMenu from "@/components/ui-project/SelectMenu";
import UiLoading from "@/components/ui/Loading";

type FormType = {
    trainingPrice: string;
    startTime: Date;
    endTime: Date;
    workDays: string[];
    qrCodePayment?: any;
    sports_id: string[];
}

const OnboardingSchedule = () => {
    const { user, refetch } = useGlobalContext();

    const { data: sportsData, loading: loadingSports } = useAppwrite({
        fn: getSports,
    });
    const sportsOptions = [...(sportsData?.map((sport) => ({ key: sport.$id, label: sport.name })) || [])];


    const [form, setForm] = useState<FormType>({
        trainingPrice: "0",
        startTime: new Date(),
        endTime: new Date(),
        workDays: [],
        sports_id: [],
        qrCodePayment: undefined
    });

    const [isSubmitting, setSubmitting] = useState(false);

    const onSubmit = async () => {
        if (!form.trainingPrice || !form.startTime || !form.endTime || form.workDays.length === 0 || form.sports_id.length === 0) {
            Alert.alert("Please fill up all the necessary details!");
            return;
        }

        if (user?.role) {
            setSubmitting(true);

            try {
                await updateScheduleTrainer({ ...form, id: user.user_id });
                Alert.alert("Onboarded Successfully!")
                refetch();
                router.push("/home");
            } catch (error: any) {
                Alert.alert("Error", error.message);
            } finally {
                setSubmitting(false);
            }


        }

    }

    async function openPicker() {
        // Request permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Permission denied! Please allow access to continue.");
            return;
        }

        // Open image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setForm({ ...form, qrCodePayment: result.assets[0] });
        }
    }

    if (isSubmitting) {
        return <UiLoading />
    }

    return (
        <SafeAreaView className="flex-1 p-6 bg-white">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerClassName="flex-grow justify-start"
            >
                <View>
                    <Text className="text-4xl font-bold text-center text-primary">
                        Work Schedule
                    </Text>
                    <Text className="mt-1 text-center">Set up the best work schedule for you!</Text>
                </View>

                <View className='justify-center flex-1 gap-2 mt-6'>
                    <FormField
                        title='Price of Training'
                        isNumeric
                        value={form.trainingPrice}
                        placeholder='Enter your training price'
                        handleChangeText={(e) => setForm({ ...form, trainingPrice: e })}
                        otherStyles='w-full'
                    />
                    <DaysOfWeekPicker
                        title="Work Days"
                        selectedDays={form.workDays}
                        onChange={(e) => { setForm({ ...form, workDays: e }) }}
                    />
                    <TimePickerInput
                        title="Start Time"
                        value={form.startTime}
                        onChange={(e) => setForm({ ...form, startTime: e })}
                    />
                    <TimePickerInput
                        title="End Time"
                        value={form.endTime}
                        onChange={(e) => setForm({ ...form, endTime: e })}
                    />
                    <View className="gap-1 mt-2">
                        <Text className='w-full font-medium text-left text-muted-foreground'>Select a specialized sport</Text>
                        {loadingSports ? (
                            <ActivityIndicator size="small" className="text-primary-300" />
                        ) : (
                            <SelectMenu
                                options={sportsOptions}
                                selectedValue={form.sports_id.length > 0 ? form.sports_id[0] : ""}
                                onSelect={(e) => setForm({ ...form, sports_id: [e] })}
                            />
                        )}
                    </View>
                    <View className='items-center justify-center w-full gap-2'>
                        <Text className='w-full font-medium text-left text-muted-foreground'>QR Code</Text>
                        <TouchableOpacity onPress={openPicker} className='relative items-center justify-center w-full border rounded-md border-primary aspect-square'>
                            {form.qrCodePayment ? (
                                <>
                                    {form.qrCodePayment.uri ? <Image
                                        source={{ uri: form.qrCodePayment.uri }} // ✅ Ensure the correct property is accessed
                                        resizeMode="cover"
                                        className="rounded-md size-full"
                                    /> :
                                        <Image
                                            source={{ uri: form.qrCodePayment }} // ✅ Ensure the correct property is accessed
                                            resizeMode="cover"
                                            className="rounded-md size-full"
                                        />}
                                </>
                            ) : (
                                <Text className='text-center'>Please upload a QR Code Payment</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                    <View className='mt-8'>
                        <Button
                            isLoading={isSubmitting}
                            onPress={onSubmit}
                            label='Next'
                        />
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default OnboardingSchedule;
