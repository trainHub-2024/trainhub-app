import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { useAppwrite } from '@/lib/useAppwrite';
import { getPaidAppointments } from '@/lib/appwrite';
import { useLocalSearchParams } from 'expo-router';
import { formatAppointment } from '@/utils';
import { AppointmentType } from '@/types';

const Earnings = () => {
    const params = useLocalSearchParams();

    const {
        data: paidAppointments,
        refetch,
        loading,
    } = useAppwrite({
        fn: getPaidAppointments,
        skip: true,
    });

    const data = useMemo(() => {
        return paidAppointments?.map((d) => formatAppointment(d));
    }, [paidAppointments]);

    const totalEarnings = useMemo(() => {
        return data?.reduce((sum, appointment) => sum + appointment.price, 0) ?? 0;
    }, [data]);

    useEffect(() => {
        refetch({ filter: "", query: "" });
    }, [params.search]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#007AFF" />
                <Text className="text-lg mt-4">Loading...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-100 p-4">
            <Text className="text-2xl font-bold text-primary mb-4 mt-6">Earnings</Text>
            <View className='mt-4 justify-center items-center'>
                <Text className='text-2xl font-bold text-primary text-center'>₱{totalEarnings}</Text>
                <Text className="text-sm text-muted-foreground font-semibold mb-4">Total Earnings</Text>
            </View>
            <FlatList
                data={data}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }: { item: AppointmentType }) => (
                    <View className="p-4 mb-3 bg-white rounded-lg shadow-md">
                        <Text className="text-lg font-semibold text-gray-800">{item.userProfile?.name}</Text>
                        <Text className="text-sm text-gray-500">
                            {new Date(item.date).toLocaleDateString()}
                        </Text>
                        <Text className="text-sm text-gray-500">₱{item.price}</Text>
                        <Text className="text-sm text-gray-500">Status: {item.status}</Text>
                    </View>
                )}
                ListEmptyComponent={
                    <View className="items-center mt-10">
                        <Text className="text-gray-500">No earnings available.</Text>
                    </View>
                }
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

export default Earnings;