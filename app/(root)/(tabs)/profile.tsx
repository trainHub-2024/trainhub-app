import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import icons from '@/constants/icons'
import images from '@/constants/images'
import { useGlobalContext } from '@/lib/global-provider'
import { createAppealNotice, logout } from '@/lib/appwrite'
import { router } from 'expo-router'

type SettingsItemProps = {
    icon: any;
    label: string;
    onPress?: () => void
    showArrow?: boolean;
}

const SettingsItem = ({ icon, label, onPress, showArrow = true }: SettingsItemProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className='flex-row items-center justify-between py-2'
        >
            <View className='flex-row items-center justify-start gap-4'>
                <Image source={icon} className='size-6' tintColor={"#f97316"} />
                <Text className='text-xl font-medium'>{label}</Text>
            </View>
            {showArrow && (
                <View>
                    <Image source={icons.rightArrow} className='size-6' />
                </View>
            )}
        </TouchableOpacity>
    )
}



const Profile = () => {
    const { user, refetch } = useGlobalContext();

    const handleLogout = async () => {
        const result = await logout();
        if (result) {
            Alert.alert("Success", "Logged out successfully");
            refetch();
        } else {
            Alert.alert("Error", "Failed to logout");
        }
    };

    const handleAppeal = async () => {
        try {
            const res = await createAppealNotice({ profileId: user?.profile?.$id ?? "" })
            if (res)
                Alert.alert("Success", "Sent an appeal for the admin!");
        } catch (error) {
            console.log(error)
            Alert.alert("Error", "Failed to send appeal");
        }
    }

    return (
        <SafeAreaView className='h-full bg-white'>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerClassName="pb-32 px-7"
            >
                <View className='flex-row items-center justify-between mt-5'>
                    <Text className='text-2xl font-bold text-primary'>Profile</Text>
                    {/* <TouchableOpacity>
                        <Image source={icons.bell}
                            className='size-6' resizeMode='contain' />
                    </TouchableOpacity> */}
                </View>

                <View className='flex items-center justify-center gap-4 mt-6 mb-8'>
                    <View className='relative p-0.5 rounded-full border-2 border-primary'>
                        <Image source={{ uri: user?.avatar }} className='rounded-full size-48' />
                    </View>
                    <View className='flex-row gap-1'>
                        <Text className='text-2xl'>
                            {user?.name}
                        </Text>
                        {user?.role === "trainer" && user?.profile?.isDisabled && (
                            <View className='items-center justify-center px-2 py-0 border rounded-full border-muted-foreground'>
                                <Text className='text-xs uppercase text-muted-foreground'>{"Disabled"}</Text>
                            </View>
                        )}
                    </View>
                </View>

                <View className='flex-col gap-4'>
                    {user?.profile?.isDisabled && (
                        <SettingsItem icon={icons.phone} label='Send appeal notice' showArrow={false} onPress={handleAppeal} />
                    )}
                    <SettingsItem icon={icons.people} label='My Profile' onPress={() => router.push(`/my-profile`)} />
                    {user?.role === "trainer" && (
                        <>
                            <SettingsItem icon={icons.wallet} label='Earnings' onPress={() => router.push("/earnings")} />
                            <SettingsItem icon={icons.dumbell} label='Credentials' onPress={() => router.push("/credentials")} />
                        </>
                    )}
                    <SettingsItem icon={icons.info} label='FAQ' onPress={() => router.push("/faq")} />
                    <SettingsItem icon={icons.logout} label='Logout' showArrow={false} onPress={handleLogout} />
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default Profile