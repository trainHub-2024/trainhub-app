import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '@/lib/global-provider';
import { useAppwrite } from '@/lib/useAppwrite';
import { getUserAppointments } from '@/lib/appwrite';
import { useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import AppointmentCard from './cards/appointments-card';
import { AppointmentType } from '@/types';
import SelectMenu from '@/components/ui-project/SelectMenu';

const ExploreTrainerMain = () => {
    const { user } = useGlobalContext();
    const params = useLocalSearchParams();
    const [refreshing, setRefreshing] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [filterLoading, setFilterLoading] = useState(false); // Add loading for filtering

    const {
        data: appointments,
        refetch,
        loading,
    } = useAppwrite({
        fn: getUserAppointments,
        skip: true,
    });

    useEffect(() => {
        setFilterLoading(true); // Show loading when filter changes
        refetch({ filter: selectedStatus, query: "" }).finally(() => setFilterLoading(false));
    }, [selectedStatus]);

    useFocusEffect(
        React.useCallback(() => {
            setFilterLoading(true);
            refetch({ filter: selectedStatus, query: "" }).finally(() => setFilterLoading(false));
        }, [selectedStatus])
    );

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        refetch({ filter: selectedStatus, query: "" }).finally(() => setRefreshing(false));
    }, [selectedStatus]);

    const statusOptions = [
        { key: "", label: "All" },
        { key: "pending", label: "Pending" },
        { key: "completed", label: "Completed" },
        { key: "cancelled", label: "Cancelled" },
        { key: "confirmed", label: "Confirmed" },
    ];

    return (
        <View className="flex-1 bg-gray-100">
            <FlatList
                data={appointments as any[]}
                keyExtractor={(item) => item.$id}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListHeaderComponent={
                    <View className="h-auto gap-4 pt-2 pb-4 mt-5 px-7 bg-muted">
                        <Text className="text-2xl font-bold text-primary">Bookings</Text>

                        <View className="mt-2">
                            <SelectMenu
                                label="Filter by Status"
                                options={statusOptions}
                                selectedValue={selectedStatus}
                                onSelect={setSelectedStatus}
                            />
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    loading || filterLoading ? ( // Show loading when status changes
                        <ActivityIndicator size="large" color="#007AFF" className="mt-5" />
                    ) : (
                        <View className="items-center mt-10">
                            <Text className="text-gray-500">No bookings received.</Text>
                        </View>
                    )
                }
                renderItem={({ item }: { item: AppointmentType }) => (
                    <AppointmentCard key={item.$id} item={item} />
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

export default ExploreTrainerMain;
