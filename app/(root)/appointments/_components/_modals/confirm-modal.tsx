import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Modal from 'react-native-modal';
import FormField from '@/components/ui-project/FormField';


const ConfirmModal = ({ open, onSubmit, handleCancel }:
    { open: boolean; onSubmit: (location: string) => void; handleCancel: () => void }) => {

    const [location, setLocation] = useState("")

    return (
        <Modal isVisible={open} className='flex-1 justify-center items-center'>
            <View className='rounded-xl px-7 py-8' style={{ width: 300, height: 400, justifyContent: "space-between", alignItems: 'center', backgroundColor: 'white', gap: 8 }}>
                <View className='flex-1 gap-2'>
                    <Text className='text-2xl font-poppinsBold text-primary'>Confirming Booking</Text>
                    <FormField
                        className='w-full'
                        title='Venue'
                        value={location}
                        handleChangeText={(e) => setLocation(e)}
                        placeholder='Enter the venue'
                    />
                </View>
                <View className='w-full flex-row gap-2'>
                    <TouchableOpacity onPress={handleCancel} className='flex-1 px-2 py-4 bg-muted rounded-lg'>
                        <Text className='text-center font-poppinsBold text-lg text-muted-foreground'>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onSubmit(location)} className='flex-1 px-2 py-4 bg-green-200 rounded-lg'>
                        <Text className='text-center font-poppinsBold text-lg text-green-600'>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default ConfirmModal