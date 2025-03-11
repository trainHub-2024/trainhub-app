import { View, Text, TouchableOpacity, Alert, Image } from 'react-native'
import * as DocumentPicker from "expo-document-picker";
import React, { useState } from 'react'

const UiImageUpload = () => {
    const [image, setImage] = useState<any>(null)

    async function openPicker() {
        const result = await DocumentPicker.getDocumentAsync({
            type: ["image/png", "image/jpg"]
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    }

    return (
        <View className='gap-1'>
            <View className='border justify-center items-center size-24 rounded-full overflow-hidden'>
                {
                    image ? <>
                        <Image
                            source={{ uri: image.uri }}
                            resizeMode="cover"
                            className="size-full rounded-2xl"
                        />
                    </> : <>
                        <Text className='text-center'>Please upload an image</Text>
                    </>
                }
            </View>
            <TouchableOpacity onPress={openPicker}>
                <Text>Upload</Text>
            </TouchableOpacity>
        </View>
    )
}

export default UiImageUpload