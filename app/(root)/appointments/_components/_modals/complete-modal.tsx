import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Modal from 'react-native-modal';
import FormField from '@/components/ui-project/FormField';


const CompleteModal = ({ open, onSubmit, handleCancel }:
    { open: boolean; onSubmit: (duration: string) => void; handleCancel: () => void }) => {

    const [duration, setDuration] = useState("")

    return (
        <Modal isVisible={open} className='flex-1 justify-center items-center'>
            <View className='rounded-xl px-7 py-8' style={{ width: 300, height: 400, justifyContent: "space-between", alignItems: 'center', backgroundColor: 'white', gap: 8 }}>
                <View className='flex-1 gap-2'>
                    <Text className='text-2xl font-poppinsBold text-primary'>Complete Booking</Text>
                    <FormField
                        className='w-full'
                        isNumeric
                        title='Duration of the workout'
                        value={duration}
                        handleChangeText={(e) => setDuration(e)}
                        placeholder='Enter the in hrs'
                    />
                </View>
                <View className='w-full flex-row gap-2'>
                    <TouchableOpacity onPress={handleCancel} className='flex-1 px-2 py-4 bg-muted rounded-lg'>
                        <Text className='text-center font-poppinsBold text-lg text-muted-foreground'>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onSubmit(duration)} className='flex-1 px-2 py-4 bg-green-200 rounded-lg'>
                        <Text className='text-center font-poppinsBold text-lg text-green-600'>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default CompleteModal