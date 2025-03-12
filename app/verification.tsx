import { View, Text, TextInput, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import { verifyPhone } from '@/lib/appwrite';
import { router } from 'expo-router';
import FormField from '@/components/ui-project/FormField';
import Button from '@/components/ui-project/Button';

const VerificationScreen = () => {
    const [verificationCode, setVerificationCode] = useState('');

    const verifyPhoneNumber = async () => {
        try {
            const res = await verifyPhone(verificationCode);
            Alert.alert('Success', 'Phone number verified successfully');
            router.replace("/home")
        } catch (error) {
            Alert.alert('Error', 'Failed to verify phone number');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} className='flex-1 h-full bg-white'>
            <View className='flex-1 flex justify-center items-center px-7 gap-2'>

                <Text className='text-xl text-center text-primary font-poppinsBold'>Enter the sent OTP on your phone</Text>
                <FormField
                    isNumeric={true}
                    title='OTP Code'
                    value={verificationCode}
                    placeholder='Enter code'
                    handleChangeText={(e) => setVerificationCode(e)}
                    otherStyles='w-full'
                />
                <Button
                    className='w-full'
                    label="Verify" onPress={verifyPhoneNumber} />
            </View>
        </TouchableWithoutFeedback>
    );
};

export default VerificationScreen;