import { View, Text, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'

interface IButtonProps {
    onPress?: () => void;
    variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "light" | "success";
    size?: "base" | "sm";
    className?: string;
    label: string;
    isLoading?: boolean;
}

const Button = memo(({ onPress, variant = "default", label, className = "", isLoading = false, size = "base" }: IButtonProps) => {
    // Use explicit style mapping instead of template strings to avoid nativewind conflicts
    const buttonStyles = {
        default: ["bg-primary", "shadow-md", "shadow-zinc-300"].join(" "),
        light: ["bg-primary/70", "shadow-md", "shadow-zinc-300"].join(" "),
        success: ["bg-green-500", "shadow-md", "shadow-zinc-300"].join(" "),
        secondary: ["bg-muted", "shadow-md", "shadow-zinc-300"].join(" "),
        outline: ["border", "border-muted-foreground", "bg-white"].join(" "),
        destructive: ["bg-red-500", "shadow-md", "shadow-zinc-300"].join(" "),
        ghost: ["bg-white"].join(" "),
    };

    const textStyles = {
        default: "text-white",
        light: "text-white",
        success: "text-white",
        secondary: "text-muted-foreground",
        destructive: "text-white",
        outline: "text-muted-foreground",
        ghost: "text-muted-foreground",
    };

    const sizeStyles = {
        base: "py-4",
        sm: "py-2",
    };

    return (
        <TouchableOpacity
            onPress={onPress ? () => onPress() : undefined}
            className={`${className} ${sizeStyles[size]} rounded-full ${buttonStyles[variant] || "bg-primary"}`}
            disabled={isLoading}
        >
            <View className="flex flex-row items-center justify-center">
                <Text className={`text-lg font-medium ${textStyles[variant] || "text-white"} font-poppinsBold`}>
                    {label}
                </Text>
            </View>
        </TouchableOpacity>
    );
});

export default Button;
