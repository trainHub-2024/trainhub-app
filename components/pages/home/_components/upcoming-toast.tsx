import { getTomorrowAppointments } from '@/lib/appwrite';
import { useAppwrite } from '@/lib/useAppwrite';
import React, { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { View, StyleSheet } from 'react-native';

const UpcomingToast = () => {
    const {
        data: tomorrowAppointments,
        refetch,
        loading,
    } = useAppwrite({
        fn: getTomorrowAppointments,
        // skip: true,
    });

    console.log(tomorrowAppointments);

    useEffect(() => {
        if (tomorrowAppointments && tomorrowAppointments.length > 0) {
            Toast.show({
                type: 'info',
                text1: 'Upcoming Appointment',
                text2: `You have ${tomorrowAppointments.length} appointment(s) tomorrow.`,
            });
        }
    }, [tomorrowAppointments]);

    return (
        <View style={styles.container}>
            <Toast />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000, // Ensure the toast is above other UI elements
    },
});

export default UpcomingToast;