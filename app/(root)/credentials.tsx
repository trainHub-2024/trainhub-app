import { View, Text, TextInput, Alert, Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/ui-project/Button';
import * as DocumentPicker from 'expo-document-picker';
import { uploadCertificate } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/global-provider';
import { router } from 'expo-router';

const TrainerCredentials = () => {
    const { user, refetch } = useGlobalContext();
    const [isLoading, setIsLoading] = useState(false);
    const [certificate, setCertificate] = useState<any>(user?.profile?.certification ?? null);
    const [refreshing, setRefreshing] = useState(false);

    // Function to refresh data on swipe down
    const onRefresh = async () => {
        setRefreshing(true);
        refetch(); // Fetch latest data
        setCertificate(user?.profile?.certification ?? null); // Update certificate if changed
        setRefreshing(false);
    };

    // Function to open the document picker
    async function openPicker() {
        try {
            const result: any = await DocumentPicker.getDocumentAsync({
                type: ["image/png", "image/jpg"], // Allowing PNG, JPG
            });

            if (!result.canceled) {
                setCertificate(result.assets[0]);
            }
        } catch (error) {
            Alert.alert("Error", "An error occurred while selecting the file.");
        }
    }

    async function onSubmit() {
        if (!certificate) {
            Alert.alert("Error", "Please upload a file first");
            return null;
        }

        try {
            setIsLoading(true);
            await uploadCertificate({ profileId: user?.profile?.$id ?? "", file: certificate });
            Alert.alert("Success", "Your certificate is being processed by our admin, please wait for 1-2 days. Thank you!");
            router.push("/profile");
        } catch (e: any) {
            console.log(e);
            Alert.alert("Error", "An error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView className="h-full px-6 py-4 bg-white">
            {/* Scrollable View with Pull-to-Refresh */}
            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                showsVerticalScrollIndicator={false}
            >
                <View>
                    <Text className="text-2xl font-bold text-primary">My Certificates</Text>
                    <Text className="text-muted-foreground">
                        Upload your certificate for others to see. After uploading, our admin will verify your certificate.
                    </Text>
                </View>

                <View className='items-start justify-start mt-8 mb-2'>
                    <View className='px-2 py-1 border rounded-full'>
                        <Text className='text-sm uppercase'>{user?.profile?.isCertified ? "Certified" : "Not Certified"}</Text>
                    </View>
                </View>

                <TouchableOpacity onPress={openPicker}>
                    <View className="items-center justify-center w-full h-56 border rounded-lg">
                        {certificate ? (
                            <Image
                                source={{ uri: certificate?.uri || certificate }}
                                resizeMode="cover"
                                className="w-full h-full rounded-lg"
                            />
                        ) : (
                            <Text className="text-sm text-center text-muted-foreground">Tap to upload certificate</Text>
                        )}
                    </View>
                </TouchableOpacity>

                <View className="mt-1">
                    <Text className="text-xs text-muted-foreground">Upload PNG or JPG only*</Text>
                </View>

                <Button
                    className="mt-4"
                    label="Submit"
                    isLoading={isLoading}
                    onPress={() => {
                        if (!certificate) {
                            Alert.alert("Error", "Please upload a certificate before submitting.");
                        } else {
                            onSubmit();
                        }
                    }}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default TrainerCredentials;
