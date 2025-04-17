import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useAppwrite } from '@/lib/useAppwrite';
import { createPayment, getAppointmentById } from '@/lib/appwrite';

import * as DocumentPicker from "expo-document-picker";

const OnlinePayment = () => {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const [paymentLoading, setPaymentLoading] = useState(false);

    const { data: appointment, loading, refetch } = useAppwrite({
        fn: getAppointmentById,
        params: { id: id! },
    });

    const handleUploadPayment = async () => {
        if (!id) {
            alert("No appointment id!");
            return;
        }

        const result = await DocumentPicker.getDocumentAsync({
            type: ["image/png", "image/jpg"]
        });

        if (result.canceled) {
            return;
        }

        const imageURL = result.assets[0];

        setPaymentLoading(true);

        try {
            alert('Upload payment selected');
            const res = await createPayment({ type: "online", appointmentId: id, paymentImage: imageURL });

            if (res) {
                alert("Payment Successful");
                refetch({ id });
                router.dismissAll();
                router.push(`/appointments/${id}`);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setPaymentLoading(false);
        }
    };



    if (loading || paymentLoading) {
        return (
            <View className="items-center justify-center flex-1 p-4 bg-gray-100">
                <ActivityIndicator size="large" color="#0000ff" />
                <Text className="mt-4 text-lg">{paymentLoading ? "Processing Payment..." : "Loading..."}</Text>
            </View>
        );
    }

    return (
        <View className="items-center justify-center flex-1 p-4 bg-gray-100">
            <Text className="mb-8 text-3xl font-bold">Online Payment</Text>
            <View className="items-center w-3/4 p-6 bg-white rounded-lg shadow-md">
                <Text className="mb-4 text-lg">Scan the QR Code</Text>
                <Image
                    source={{ uri: appointment?.trainerProfile?.trainerProfile_id?.qrCodePayment }} // Replace with your QR code image URL
                    style={{ width: 200, height: 200, marginBottom: 20 }}
                />
                <Text className="mb-4 text-lg">Amount to be Paid: {appointment?.trainerProfile?.trainingPrice}</Text>
                <TouchableOpacity
                    className="flex-row items-center justify-center w-full p-4 rounded-lg bg-primary"
                    onPress={handleUploadPayment}
                >
                    <Text className="text-lg text-white">Upload Payment</Text>
                </TouchableOpacity>
                {appointment?.trainerProfile?.contactNumber && (
                    <Text className="mt-4 text-sm text-red-500">
                        If the QR code is not working, please send your GCash to {appointment.trainerProfile.contactNumber}
                    </Text>
                )}
            </View>
        </View>
    );
};

export default OnlinePayment;