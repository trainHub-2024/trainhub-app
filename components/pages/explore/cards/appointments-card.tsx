import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { AppointmentType } from '@/types';

const AppointmentCard = ({ item }: { item: AppointmentType }) => {
    const isPaid: boolean = item?.paymentDate ? true : false;

    return (
        <TouchableOpacity
            onPress={() => router.push(`/appointments/${item.$id}`)}
            className="p-4 mx-5 mb-3 bg-white rounded-lg "
        >
            <View className="flex-row justify-between items-center">
                <View>
                    <Text className="text-lg font-semibold text-gray-800">{item.userProfile?.name}</Text>
                    <Text className="text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString()}
                    </Text>
                    <Text className="text-sm text-gray-500">₱{item.price}</Text>
                </View>
                <View className="flex-row items-center">
                    {item.status === "completed" && item.isConfirmedPayment ? <>
                        <View className={`px-3 py-1 rounded-full bg-green-200`}>
                            <Text className="text-xs font-semibold text-gray-700 uppercase">done</Text>
                        </View>
                    </> : <>
                        <View className={`px-3 py-1 rounded-full ${item.status === "cancelled" ? "bg-red-200" : "bg-green-200"}`}>
                            <Text className="text-xs font-semibold text-gray-700 uppercase">{item.status}</Text>
                        </View>
                        {item.status === "completed" && (
                            <View className="ml-3">
                                <Text className={`text-sm font-semibold ${isPaid ? "text-green-600" : "text-red-600"}`}>
                                    {isPaid ? "Paid" : "Pending Payment"}
                                </Text>
                            </View>
                        )}
                    </>}
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default AppointmentCard;