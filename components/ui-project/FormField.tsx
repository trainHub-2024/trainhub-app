import { View, Text, TextInput, TouchableOpacity, Image, TextInputProps } from "react-native";
import React, { useState } from "react";
import icons from "@/constants/icons";

interface FormFieldProps extends TextInputProps {
    title: string;
    value: any;
    placeholder: string;
    handleChangeText: (text: string) => void;
    otherStyles?: string;
    isNumeric?: boolean; // New prop to define if input should accept numbers only
}

const FormField: React.FC<FormFieldProps> = ({
    title,
    value,
    placeholder,
    handleChangeText,
    otherStyles,
    isNumeric = false, // Default to false
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View className={`space-y-2 ${otherStyles}`}>
            <Text className="text-base font-medium text-muted-foreground">{title}</Text>

            <View className="flex-row items-center justify-between w-full h-16 px-4 border-2 border-muted bg-muted rounded-2xl">
                <TextInput
                    className="flex-1 text-lg font-semibold text-left placeholder:text-muted-foreground"
                    value={value}
                    placeholder={placeholder}
                    keyboardType={isNumeric ? "numeric" : "default"} // Use numeric keyboard when needed
                    onChangeText={(text) => {
                        if (isNumeric) {
                            const cleanedText = text.replace(/[^0-9]/g, ""); // Ensure only numbers are accepted
                            handleChangeText(cleanedText);
                        } else {
                            handleChangeText(text);
                        }
                    }}
                    secureTextEntry={title === "Password" && !showPassword}
                    {...props}
                />

                {title === "Password" && (
                    <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
                        <Image className="size-8" source={showPassword ? icons.eye : icons.eye_hide} resizeMode="contain" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default FormField;
