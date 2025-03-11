import { View, Text, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import UiSearchTrainer from '@/components/ui-project/SearchTrainer'
import SelectMenu from '@/components/ui-project/SelectMenu';
import { mapIdToNumber } from '@/lib/utils';
import images from '@/constants/images';
import { Image } from 'react-native';

const SportSelectionCard = ({ item, isSelected, setSelectedSport }: { item: any; isSelected: boolean; setSelectedSport: (e: string) => void }) => {
    const number = mapIdToNumber(item.key)
    const avatar: any = {
        1: images.avatar_1,
        2: images.avatar_2,
        3: images.avatar_3,
        4: images.avatar_4,
    };


    return (
        <View>
            <TouchableOpacity
                className='border'
                style={{
                    borderRadius: "100%",
                    width: 50,
                    height: 50,
                    backgroundColor: isSelected ? "#f97316" : "#E5E7EB",
                    borderColor: isSelected ? "black" : "#E5E7EB",
                    opacity: isSelected ? 1 : 0.4,
                }}
                onPress={() => setSelectedSport(item.key)}
            >
                <Image
                    style={{ width: 50, height: 50 }}
                    alt='avatar'
                    source={avatar[number]}
                    resizeMode='contain'
                />
            </TouchableOpacity>
            <Text style={{ color: isSelected ? "#f97316" : "black", opacity: isSelected ? 1 : 0.4, }} className='font-poppins text-xs text-center'>{item.label}</Text>
        </View>
    )
}

const TraineeHeader = ({ loading, sportsOptions, selectedSport, setSelectedSport }: { loading: boolean; sportsOptions: any[]; selectedSport: string; setSelectedSport: (e: string) => void }) => {

    return (
        <View className='bg-white'>
            {/* Header */}
            <View className="items-center justify-center pt-2 mt-5">
                <Text className="text-2xl font-poppinsBold text-primary">Find a Trainer</Text>
            </View>

            {/* Search & Sport Selection */}
            <View className="h-auto gap-4">
                <View className="flex-row items-center justify-between gap-2 mt-4">
                    <UiSearchTrainer />
                </View>

                <View className="mt-2">
                    {loading ? (
                        <ActivityIndicator size="small" className="text-primary-300" />
                    ) : (

                        <View>
                            <Text className='text-primary text-xl font-poppinsBold'>Sports Filter</Text>
                            <FlatList
                                data={sportsOptions}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item) => item.key}
                                contentContainerStyle={{ gap: 10, paddingHorizontal: 0 }}
                                renderItem={({ item }) => {
                                    const isSelected = item.key === selectedSport;

                                    return (
                                        <SportSelectionCard item={item} isSelected={isSelected} setSelectedSport={setSelectedSport} />
                                    )
                                }}
                            />

                        </View>

                        // <SelectMenu
                        //     label="Filter by Sport"
                        //     options={sportsOptions}
                        //     selectedValue={selectedSport}
                        //     onSelect={setSelectedSport}
                        // />
                    )}
                </View>
            </View>

            {/* Section Title */}
            <View className="pt-4 pb-1">
                <Text className='text-primary text-xl font-poppinsBold'>Available Trainers</Text>
            </View>
        </View>
    )
}

export default TraineeHeader