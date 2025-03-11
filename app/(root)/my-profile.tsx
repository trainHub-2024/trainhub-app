import { View, Text, ScrollView, Alert, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useGlobalContext } from '@/lib/global-provider'
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '@/components/ui-project/FormField';
import Button from '@/components/ui-project/Button';
import { updateUserProfile } from '@/lib/appwrite';
import { router } from 'expo-router';

import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

import DaysOfWeekPicker from '@/components/ui-project/FormDayPicker';
import TimePickerInput from '@/components/ui-project/FormTimePicker';
import { useAppwrite } from '@/lib/useAppwrite';
import { getSports } from '@/lib/actions/sports.actions';
import SelectMenu from '@/components/ui-project/SelectMenu';

type FormProps = {
    name: string;
    contactNumber: string;
    gender: string;
    location: string;
    image: any;
    password: string

    trainingPrice?: number;
    startTime?: Date;
    endTime?: Date;
    workDays: string[];
    qrCodePayment?: any;
    sports_id: string[];
}
const MyProfile = () => {
    const { user, refetch } = useGlobalContext();
    const [form, setForm] = useState<FormProps>({
        name: user?.profile?.name ?? "",
        // email: user?.profile?.email ?? "",
        contactNumber: user?.profile?.contactNumber ?? "",
        gender: user?.profile?.gender ?? "",
        location: user?.profile?.location ?? "",
        image: null,
        password: "",

        trainingPrice: user?.role ? user?.profile?.trainingPrice : undefined,
        startTime: user?.role && user?.profile?.startTime ? new Date(user?.profile?.startTime) : undefined,
        endTime: user?.role && user?.profile?.endTime ? new Date(user?.profile?.endTime) : undefined,
        workDays: user?.role ? user?.profile?.workDays : [],
        qrCodePayment: user?.role && user?.profile?.qrCodePayment ? user?.profile?.qrCodePayment : undefined,
        sports_id: user?.role ? user?.profile?.sports_id : [],
    });


    const [isSubmitting, setisSubmitting] = useState(false)

    const { data: sportsData, loading: loadingSports } = useAppwrite({
        fn: getSports,
    });
    const sportsOptions = [...(sportsData?.map((sport) => ({ key: sport.$id, label: sport.name })) || [])];


    async function openPicker(value: "profile" | "qrCode") {
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
            if (value === "profile") {
                setForm({ ...form, image: result.assets[0] });
            } else if (value === "qrCode") {
                setForm({ ...form, qrCodePayment: result.assets[0] });
            }
        }
    }


    const onSubmit = async () => {
        try {
            setisSubmitting(true);
            let response = await updateUserProfile({ profileId: user?.profile?.$id ?? "", body: form, role: user?.role });

            if (response) {
                Alert.alert(`Successfully updated profile!`);
                refetch();
                router.back()
            } else {
                Alert.alert("Failed to update profile. Please try again.");
            }
        } catch (error) {
            console.error("Updating error:", error);
            Alert.alert("Something went wrong!");
        } finally {
            setisSubmitting(false);
        }
    }

    if (isSubmitting) {
        return (
            <View className="items-center justify-center flex-1 bg-white">
                <ActivityIndicator size="large" color="#007AFF" />
                <Text className="mt-4 text-lg">Saving your Profile...</Text>
            </View>
        );
    }

    console.log(form)

    return (
        <SafeAreaView className='h-full px-8 py-4 bg-white'>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View>
                    <Text className='mb-8 text-2xl font-bold text-primary'>My Profile</Text>
                </View>
                <View className='w-full gap-2'>
                    <View className='items-center justify-center w-full gap-1'>
                        <TouchableOpacity onPress={() => openPicker("profile")} className='relative items-center justify-center border rounded-full border-primary size-48'>
                            {
                                form.image || user?.avatar ? <>
                                    {form.image ? <>
                                        <Image
                                            source={{ uri: form.image.uri }}
                                            resizeMode="cover"
                                            className="rounded-full size-full"
                                        />
                                    </>
                                        : <Image
                                            source={{ uri: user?.avatar }}
                                            resizeMode="cover"
                                            className="rounded-full size-full"
                                        />
                                    }
                                </> : <>
                                    <Text className='text-center'>Please upload your profile</Text>
                                </>
                            }
                        </TouchableOpacity>
                    </View>

                    {/* USER DETAILS */}
                    <View className='gap-2'>
                        <FormField
                            title='Name'
                            value={form.name}
                            placeholder='Enter your name'
                            handleChangeText={(e) => setForm({ ...form, name: e })}
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
                        <FormField
                            title='Contact Number'
                            value={form.contactNumber}
                            placeholder='Enter your contactNumber'
                            handleChangeText={(e) => setForm({ ...form, contactNumber: e })}
                            otherStyles='w-full'
                        />
                        <FormField
                            title='Password'
                            value={form.password}
                            placeholder='Enter your email'
                            handleChangeText={(e) => setForm({ ...form, password: e })}
                            otherStyles='w-full'
                        />
                    </View>

                    {/* TRAINER DETAILSs */}
                    {user?.role === "trainer" && (
                        <View className='gap-2 mt-10'>
                            <Text className='text-xl font-bold'>Trainer Details</Text>
                            <FormField
                                title="Training Price"
                                isNumeric={true}
                                value={form.trainingPrice?.toLocaleString() ?? ""} // Ensure a string is passed
                                placeholder="Enter your training price"
                                handleChangeText={(e) =>
                                    setForm({ ...form, trainingPrice: e === "" ? undefined : Number(e) }) // Convert back to number
                                }
                                otherStyles="w-full"
                            />
                            <DaysOfWeekPicker
                                title="Work Days"
                                selectedDays={form.workDays}
                                onChange={(e) => { setForm({ ...form, workDays: e }) }}
                            />
                            <TimePickerInput
                                title="Start Time"
                                value={form.startTime ?? new Date()}
                                onChange={(e) => setForm({ ...form, startTime: e })}
                            />
                            <TimePickerInput
                                title="End Time"
                                value={form.endTime ?? new Date()}
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
                                <TouchableOpacity onPress={() => openPicker("qrCode")} className='relative items-center justify-center w-full border rounded-md border-primary aspect-square'>
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
                        </View>
                    )}
                    <View className='mt-4'>
                        <Button
                            isLoading={isSubmitting}
                            onPress={onSubmit}
                            label='Save Changes'
                        />
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default MyProfile