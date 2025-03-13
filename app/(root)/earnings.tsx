import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useMemo } from 'react';
import { useAppwrite } from '@/lib/useAppwrite';
import { getPaidAppointments } from '@/lib/appwrite';
import { useLocalSearchParams } from 'expo-router';
import { formatAppointment } from '@/utils';
import { AppointmentType } from '@/types';
import EarningsCard from '@/components/pages/earnings/card';
import { computeTrainerIncome } from '@/lib/utils';

const Earnings = () => {
    const params = useLocalSearchParams();

    const {
        data,
        refetch,
        loading,
    } = useAppwrite({
        fn: getPaidAppointments,
        skip: true,
    });

    // const data = useMemo(() => {
    //     return paidAppointments?.map((d) => formatAppointment(d));
    // }, [paidAppointments]);

    const totalEarnings = useMemo(() => {
        return data?.reduce((sum, appointment) => sum + computeTrainerIncome(appointment as any), 0) ?? 0;
    }, [data]);

    useEffect(() => {
        refetch({ filter: "", query: "" });
    }, [params.search]);

    if (loading) {
        return (
            <View className="items-center justify-center flex-1 bg-white">
                <ActivityIndicator size="large" color="#007AFF" />
                <Text className="mt-4 text-lg">Loading...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 p-4 bg-gray-100">
            <Text className="mt-6 mb-4 text-2xl font-bold text-primary">Earnings</Text>
            <View className='items-center justify-center mt-4'>
                <Text className='text-2xl font-bold text-center text-primary'>₱{totalEarnings}</Text>
                <Text className="mb-4 text-sm font-semibold text-muted-foreground">Total Earnings</Text>
            </View>
            <FlatList
                data={data}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }: { item: any }) => (
                    <EarningsCard data={item as any} />
                    // <View className="p-4 mb-3 bg-white rounded-lg shadow-md">
                    //     <Text className="text-lg font-semibold text-gray-800">{item.userProfile?.name}</Text>
                    //     <Text className="text-sm text-gray-500">
                    //         {new Date(item.date).toLocaleDateString()}
                    //     </Text>
                    //     <Text className="text-sm text-gray-500">₱{item.price}</Text>
                    //     <Text className="text-sm text-gray-500">Status: {item.status}</Text>
                    // </View>
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