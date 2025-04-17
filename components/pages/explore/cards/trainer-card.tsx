import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { computeLevel } from '@/utils'
import { Sport } from '@/types/appwrite.types'
import icons from '@/constants/icons'
import { formatTimeRange } from '@/lib/utils'

const TrainerCard = ({ item }: { item: any }) => {
    const totalRating = item?.ratings?.reduce((acc: any, curr: any) => acc + curr.rating, 0);
    const averageRating = item?.ratings?.length > 0 ? totalRating / item.ratings.length : 0;

    return (
        <TouchableOpacity
            onPress={() => router.push(`/trainers/${item.user_id}`)}
            className="w-full px-6 py-4 border"
            style={{ height: 160, borderRadius: 12, backgroundColor: "#fb8500" }}
        >
            <View className='flex-row items-center justify-between gap-2'>
                <View className='justify-between h-full'>
                    <View>
                        <Text className="text-xl text-white font-poppinsBold">{item.name}</Text>
                        <View className='mt-1'>
                            {item.sports?.length > 0 ?
                                <View className='flex items-start justify-start'>
                                    <View className='px-2 py-0 border rounded-full '>
                                        <Text className='text-sm font-poppins'>{item.sports.map((s: Sport) => s.name).join("")}</Text>
                                    </View>
                                </View>
                                :
                                <Text className='text-sm font-poppins'>No Sport</Text>
                            }
                        </View>
                    </View>
                    <View className='items-start justify-start gap-1'>
                        <View className='px-2 py-0.5 flex-row gap-1 bg-white rounded-full justify-start items-center'>
                            <Image source={icons.calendar} tintColor={"#f97316"} resizeMode='contain' className='size-6' />
                            <Text className='text-sm font-poppinsMedium text-primary'>{formatTimeRange(item.startTime, item.endTime)}</Text>
                        </View>
                        <View className='flex-row gap-1'>
                            <View className='px-2 py-0.5 flex-row gap-1 bg-white rounded-full justify-start items-center'>
                                <Image source={icons.dumbell} tintColor={"#f97316"} resizeMode='contain' className='size-6' />
                                <Text className='text-sm font-poppinsMedium text-primary'>Level {computeLevel(item.score)}</Text>
                            </View>
                            <View className='px-2 py-0.5 flex-row gap-1 bg-white rounded-full justify-start items-center'>
                                <Image source={icons.star} tintColor={"#f97316"} resizeMode='contain' className='size-6' />
                                <Text className='text-sm font-poppinsMedium text-primary'>{averageRating.toFixed(2)} stars</Text>
                            </View>
                        </View>
                    </View>
                </View>

            </View>
            {/* <View className="flex-row items-center justify-between flex-1">
                <View>
                    <Text className="text-lg font-medium">{item.name}</Text>
                    <Text className="text-sm text-gray-500">{item.sports.map((s: Sport) => s.name).join("")}</Text>
                </View>
                <View>
                    <Text>Level: {computeLevel(item.score)}</Text>
                    <Text>Rating: {Math.floor(averageRating)}</Text>
                </View>
            </View> */}
        </TouchableOpacity>
    )
}

export default TrainerCard