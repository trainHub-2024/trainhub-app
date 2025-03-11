import { View, TextInput, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import icons from '@/constants/icons'
import { router, useLocalSearchParams } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign';

const UiSearchTrainer = () => {
    const params = useLocalSearchParams<{ search?: string }>();
    const [searchTerm, setSearchTerm] = useState(params.search ?? "")

    const handleSearch = () => {
        console.log(searchTerm)
        router.setParams({ search: searchTerm });
    }

    const handleReset = () => {
        setSearchTerm("");
        router.setParams({ search: "" })

    }

    return (
        <View style={{ borderRadius: 20 }} className='flex-row items-center justify-between flex-1 gap-2 px-4 py-2 bg-white border border-primary'>
            <View className='flex-row items-center justify-between flex-1'>
                <TextInput
                    value={searchTerm}
                    onChangeText={(e) => setSearchTerm(e)}
                    className='flex-1 mb-2 text-lg text-left'
                    placeholderTextColor={"#71717a"}
                    placeholder='Search trainer...'
                />
                {searchTerm && (
                    <TouchableOpacity onPress={handleReset}>
                        <AntDesign name="close" size={20} color="black" />
                    </TouchableOpacity>
                )}
            </View>
            <TouchableOpacity style={{ borderRadius: 20 }} onPress={handleSearch} className='p-2 bg-primary'>
                <Image
                    source={icons.search}
                    className='size-6'
                    tintColor={"white"}
                    resizeMode='contain'
                />
            </TouchableOpacity>
        </View>
    )
}

export default UiSearchTrainer