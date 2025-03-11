import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { useAppwrite } from '@/lib/useAppwrite';
import { getUserUpcomingAppointments } from '@/lib/appwrite';
import { ParseTime } from '@/lib/utils';
import UpcomingCard from './_components/upcoming-card';
import { format } from 'date-fns';

const UpcomingAppointments = ({ selectedDate }: { selectedDate: Date }) => {
    const params = useLocalSearchParams<{ query?: string; search?: string }>();

    const {
        data: appointmentsData,
        refetch,
        loading,
    } = useAppwrite({
        fn: getUserUpcomingAppointments,
        params: {
            filter: selectedDate.toISOString(),
            query: params.search!,
        },
        skip: true,
    });

    useEffect(() => {
        refetch({ filter: selectedDate.toISOString(), query: params.search! });
    }, [params.search, selectedDate])

    return (
        <>
            {/* Training Appointments */}
            <View className="py-4">
                <Text className="mb-2 text-lg font-poppinsBold text-primary">{format(selectedDate, "MMMM dd")} Appointments ({appointmentsData?.length})</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    {appointmentsData?.map((item: any) => (
                        <UpcomingCard item={item} key={item.$id} />
                    ))}
                </ScrollView>
            </View>
        </>
    )
}

export default UpcomingAppointments