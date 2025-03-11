import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useAppwrite } from '@/lib/useAppwrite';
import { getInbox } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/global-provider';

const messages = [
    { $id: '1', sender: 'John Doe', subject: 'Meeting Reminder', preview: 'Don\'t forget about our meeting tomorrow at 10 AM.' },
    { $id: '2', sender: 'Jane Smith', subject: 'Project Update', preview: 'The project is on track and we should be able to meet the deadline.' },
    { $id: '3', sender: 'Bob Johnson', subject: 'Lunch Plans', preview: 'Are you free for lunch tomorrow?' },
    // Add more messages as needed
];

const Inbox = () => {
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useGlobalContext();
    const {
        data: inbox,
        refetch,
        loading,
    } = useAppwrite({
        fn: getInbox,
        skip: true,
    });

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        refetch({}).finally(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        refetch({});
    }, []);


    const renderItem = ({ item }) => {

        const chatOpposite = user?.profile?.$id === item?.trainerProfile_id ? item?.userProfile : item?.trainerProfile;

        return (
            <TouchableOpacity onPress={() => router.push(`/inboxes/${item.$id}`)}>
                <View className="bg-white py-4 px-6">
                    <Text className="text-lg font-bold capitalize">{chatOpposite?.name}</Text>
                    <View className='flex-row justify-between items-center'>
                        <Text className="text-sm text-gray-600">{item.lastMessage}</Text>
                        <Text className="text-sm text-gray-600">{new Date(item?.$updatedAt).toLocaleString()}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

    return (
        <View className="flex-1 bg-gray-100">
            <View className='bg-white pt-12'>
                <Text className="pl-6 text-2xl font-bold mb-4 text-primary">Inbox</Text>
            </View>
            <FlatList
                data={inbox}
                keyExtractor={(item) => item.$id}
                renderItem={renderItem}
                contentContainerStyle={{ backgroundColor: "white" }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    loading ? (
                        <ActivityIndicator size="large" color="#007AFF" className="mt-5" />
                    ) : (
                        <View className="items-center mt-10">
                            <Text className="text-gray-500">Nothing in your inbox.</Text>
                        </View>
                    )
                }
            />
        </View>
    );
};

export default Inbox;