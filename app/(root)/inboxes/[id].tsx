import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppwrite } from '@/lib/useAppwrite';
import { creatInboxMessage, getInbox, getInboxById, getInboxMessages } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/global-provider';
import { SafeAreaView } from 'react-native-safe-area-context';

const initialMessages = [
    { id: '1', sender: 'John Doe', message: 'Hey, how are you?' },
    { id: '2', sender: 'You', message: 'I am good, thanks! How about you?' },
    { id: '3', sender: 'John Doe', message: 'I am doing well, just busy with work.' },
    // Add more messages as needed
];

const InboxChat = () => {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const { user } = useGlobalContext()

    const {
        data: messagesData,
        refetch: refetchMessages,
        loading: loadingMessages,
    } = useAppwrite({
        fn: getInboxMessages,
        skip: true,
        params: { id: id! }
    });

    const {
        data: inbox,
        refetch: refetchInbox,
        loading: loadingInbox
    } = useAppwrite({
        fn: getInboxById,
        skip: true,
        params: { id: id! }
    });


    console.log(messagesData);
    console.log(inbox)

    const chatOpposite = user?.profile?.$id === inbox?.trainerProfile?.$id ? inbox?.userProfile : inbox?.trainerProfile;

    const sendMessage = async () => {
        if (!id || !user?.profile?.$id) {
            alert("Invalid Message");
            return;
        }

        try {
            const res = await creatInboxMessage({
                message: newMessage.trim(),
                sender_id: user?.profile?.$id,
                inbox_id: id
            })

            if (res) {
                refetchMessages({ id })
                setNewMessage('');
            }
        } catch (error) {
            alert(error);
        }

    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        refetchMessages({ id: id! }).finally(() => setRefreshing(false));
    }, []);

    useEffect(() => {
        refetchInbox({ id: id! });
        refetchMessages({ id: id! });
    }, []);



    const renderItem = ({ item }) => {
        const sender = item?.sender_id !== chatOpposite?.$id ? "Me" : chatOpposite?.name;
        return (
            <View className={`p-4 mb-2 rounded-lg ${sender === 'Me' ? 'bg-primary-light self-end' : 'bg-white self-start'}`}>
                <Text className={`text-xs ${sender === "Me" ? "text-right" : "text-left"} font-light`}>{sender}</Text>
                <Text className="text-base">{item.text}</Text>
            </View>
        )
    };

    if (loadingInbox || loadingMessages) {
        return (
            <SafeAreaView className="items-center justify-center flex-1">
                <ActivityIndicator size="large" color="#007AFF" />
            </SafeAreaView>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <View className="flex-1 bg-gray-100">
                <View className="bg-white pt-12 pb-4 px-6">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text className="text-primary">Back</Text>
                    </TouchableOpacity>
                    <Text className="text-2xl font-bold mt-2 capitalize">{chatOpposite?.name}</Text>
                </View>
                <FlatList
                    data={messagesData}
                    keyExtractor={(item) => item.$id}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 10, paddingTop: 20 }}
                    ListEmptyComponent={
                        loadingMessages ? (
                            <ActivityIndicator size="large" color="#007AFF" className="mt-5" />
                        ) : (
                            <View className="items-center mt-10">
                                <Text className="text-gray-500">Send your first message.</Text>
                            </View>
                        )
                    }
                />
                <View className="absolute bottom-0 left-0 right-0 flex-row items-center p-4 pb-10 bg-white border-t border-gray-200">
                    <TextInput
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Type your message..."
                        className="flex-1 p-2 border border-gray-300 rounded-lg placeholder:text-black/40"
                    />
                    <TouchableOpacity onPress={sendMessage} className="ml-2 p-2 bg-primary rounded-lg">
                        <Text className="text-white">Send</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default InboxChat;