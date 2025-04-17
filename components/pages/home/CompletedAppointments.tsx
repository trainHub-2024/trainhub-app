import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { useAppwrite } from '@/lib/useAppwrite';
import { getUserCompletedAppointments } from '@/lib/appwrite';
import { ParseTime } from '@/lib/utils';
import AppointmentCard from './_components/appointment-card';

const CompletedAppointments = ({ selectedDate }: { selectedDate: Date }) => {
    const params = useLocalSearchParams<{ query?: string; search?: string }>();

    const {
        data: appointmentsData,
        refetch,
        loading,
    } = useAppwrite({
        fn: getUserCompletedAppointments,
        params: {
            filter: selectedDate.toISOString(),
            query: params.search!,
        },
        skip: true,
    });

    useEffect(() => {
        refetch({ filter: selectedDate.toISOString(), query: params.search! });
    }, [params.search, selectedDate])

    console.log(appointmentsData);

    return (
        <>
            {/* Training Appointments */}
            <View className="py-4">
                <Text className="mb-2 text-lg font-poppinsBold text-primary">Completed Appointments ({appointmentsData?.length})</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    {appointmentsData?.map((item: any) => (
                        <AppointmentCard item={item} key={item.$id} />
                    ))}
                </ScrollView>
            </View>
        </>
    )
}

export default CompletedAppointments