import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'

const UiLoading = ({ message }: { message?: string }) => {
    return (
        <View className="flex-1 justify-center items-center p-4 bg-gray-100">
            <ActivityIndicator size="large" color="#f97316" />
            {message &&
                <Text className='text-2xl font-poppinsBold text-primary'>{message}</Text>
            }
        </View>
    )
}

export default UiLoading