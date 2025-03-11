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
            <View className="flex-1 justify-center items-center p-4 bg-gray-100">
                <ActivityIndicator size="large" color="#0000ff" />
                <Text className="text-lg mt-4">{paymentLoading ? "Processing Payment..." : "Loading..."}</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 justify-center items-center p-4 bg-gray-100">
            <Text className="text-3xl font-bold mb-8">Online Payment</Text>
            <View className="bg-white p-6 rounded-lg shadow-md w-3/4 items-center">
                <Text className="text-lg mb-4">Scan the QR Code</Text>
                <Image
                    source={{ uri: appointment?.trainerProfile?.qrCodePayment }} // Replace with your QR code image URL
                    style={{ width: 200, height: 200, marginBottom: 20 }}
                />
                <Text className="text-lg mb-4">Amount to be Paid: {appointment?.trainerProfile?.trainingPrice}</Text>
                <TouchableOpacity
                    className="flex-row items-center bg-primary p-4 rounded-lg w-full justify-center"
                    onPress={handleUploadPayment}
                >
                    <Text className="text-white text-lg">Upload Payment</Text>
                </TouchableOpacity>
                {appointment?.trainerProfile?.contactNumber && (
                    <Text className="text-red-500 text-sm mt-4">
                        If the QR code is not working, please send your GCash to {appointment.trainerProfile.contactNumber}
                    </Text>
                )}
            </View>
        </View>
    );
};

export default OnlinePayment;