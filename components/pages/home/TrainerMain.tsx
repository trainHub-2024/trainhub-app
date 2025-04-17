import { View, Text, Image, SafeAreaView, Button, Linking, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { useGlobalContext } from '@/lib/global-provider';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useAppwrite } from '@/lib/useAppwrite';
import { getPaidAppointments, getPenaltyAppointments } from '@/lib/appwrite';
import { computeTrainerIncome } from '@/lib/utils';
import { COLORS, computeLevel } from '@/utils';
import { FontAwesome } from '@expo/vector-icons';

const HomeTrainerMain = () => {
    const { user } = useGlobalContext();
    console.log(user?.profile.score);
    const trainerScore = (user?.profile.score ?? 0);

    const {
        data,
        refetch,
        loading,
    } = useAppwrite({
        fn: getPaidAppointments,
        // skip: true,
    });

    const {
        data: penalties,
        refetch: refetchPenalties,
        loading: penaltiesLoading,
    } = useAppwrite({
        fn: getPenaltyAppointments,
        // skip: true,
    });

    const rating = useMemo(() => {
        if (!user?.profile?.ratings || user?.profile.ratings.length === 0) return 0;

        const total = user?.profile.ratings.reduce((sum, r) => sum + r.rating, 0);
        return total / user?.profile.ratings.length; // Get average
    }, [user]);

    const totalEarnings = useMemo(() => {
        return data?.reduce((sum, appointment) => sum + computeTrainerIncome(appointment as any), 0) ?? 0;
    }, [data]);

    const progress = (trainerScore % 5) / 5; // Progress within the level

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Dashboard</Text>
                <Text style={styles.headerSubtitle}>Welcome back, {user?.name}</Text>
            </View>
            <ScrollView>

                <View style={styles.cardsContainer}>
                    {/* Rating Card */}
                    <View style={styles.card}>
                        <View style={styles.cardIconContainer}>
                            <FontAwesome name="star" size={32} color={"white"} />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardLabel}>Rating</Text>
                            <Text style={styles.cardValue}>{rating}</Text>
                            <Text style={styles.cardSubtext}>out of 5.0</Text>
                        </View>
                    </View>

                    {/* Level Card */}
                    <View style={styles.card}>
                        <View style={styles.cardIconContainer}>
                            <FontAwesome name="certificate" size={32} color={"white"} />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardLabel}>Level</Text>
                            <Text style={styles.cardValue}>{computeLevel(trainerScore)} </Text>
                            <Text style={styles.cardSubtext}>{Math.floor(progress * 5)}/5 completed for next level</Text>
                        </View>
                    </View>

                    {/* Penalties Card */}
                    <View style={styles.card}>
                        <View style={styles.cardIconContainer}>
                            <FontAwesome name="exclamation-triangle" size={32} color={"white"} />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardLabel}>Penalties</Text>
                            <Text style={styles.cardValue}>{penalties?.length ?? 0}</Text>
                            <Text style={styles.cardSubtext}>These are the cancelled bookings</Text>
                        </View>
                    </View>

                    {/* Earnings Card */}
                    <View style={styles.card}>
                        <View style={styles.cardIconContainer}>
                            <FontAwesome name="money" size={32} color={"white"} />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardLabel}>Total Earnings</Text>
                            <Text style={styles.cardValue}>₱{totalEarnings.toLocaleString()}</Text>
                            <Text style={styles.cardSubtext}></Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
        // <SafeAreaView className='flex-1 h-full bg-muted'>
        //     <View className='flex-row items-center justify-start w-full gap-4 py-4 bg-white px-7'>
        //         <View className='border-2 rounded-full border-primary-light'>
        //             <Image src={user?.avatar} className="w-12 h-12 border border-white rounded-full" />
        //         </View>
        //         <Text className='text-2xl font-poppinsMedium text-primary'>Hello, {user?.name}</Text>
        //     </View>
        //     <View className='flex-row gap-2 py-2 pt-4 px-7'>
        //         <View className='flex-1 gap-2 p-4 rounded-xl bg-primary-light'>
        //             <Text className='text-xl font-poppins'>Level</Text>
        //             <Text className='text-4xl text-left font-poppinsBold'>{level}</Text>
        //             <Text className='text-sm font-poppins'>
        //                 {Math.floor(progress * 5)}/5 completed for next level
        //             </Text>
        //         </View>
        //         <View className='flex-1 gap-2 p-4 rounded-xl bg-secondary'>
        //             <Text className='text-xl font-poppins'>Earnings</Text>
        //             <Text className='text-4xl text-left font-poppinsBold'>₱{totalEarnings}</Text>
        //         </View>
        //     </View>
        //     <View className='flex-row gap-2 py-2 px-7'>
        //         <View className='flex-1 gap-2 p-4 rounded-xl bg-primary-light'>
        //             <Text className='text-xl font-poppins'>Penalties</Text>
        //             <Text className='text-4xl text-left font-poppinsBold'>{penalties?.length ?? 0}</Text>
        //             <Text className='text-sm font-poppins'>
        //                 these are the cancelled bookings
        //             </Text>
        //         </View>
        //         <View className='flex-1'>
        //             {/* <Text className='text-xl font-poppins'>Earnings</Text>
        //             <Text className='text-4xl text-left font-poppinsBold'>₱{totalEarnings}</Text> */}
        //         </View>
        //     </View>
        //     {/* ✅ APK DOWNLOAD BUTTON */}
        //     <View className="mt-4 px-7">
        //         <Button
        //             title="Download TrainerHub APK"
        //             onPress={() => Linking.openURL('https://drive.google.com/uc?export=download&id=1l4WFjcbDLk1kUoimd7a4CDaZYMy19v-W')}
        //             color="#007AFF"
        //         />
        //     </View>
        // </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    cardsContainer: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
    },
    cardLabel: {
        fontSize: 14,
        color: '#666',
    },
    cardValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 4,
    },
    cardSubtext: {
        fontSize: 12,
        color: '#999',
    },
});

export default HomeTrainerMain;
