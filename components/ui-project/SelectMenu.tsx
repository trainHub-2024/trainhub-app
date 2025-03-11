import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";

interface SelectMenuProps {
    label?: string;
    options: { key: string; label: string }[];
    selectedValue: string;
    onSelect: (value: string) => void;
}

const SelectMenu: React.FC<SelectMenuProps> = ({ label, options, selectedValue, onSelect }) => {
    return (
        <View style={{ marginBottom: 10 }}>
            {label && (
                <Text className="mb-2 text-lg font-semibold text-primary">{label}</Text>
            )}
            <FlatList
                data={options}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.key}
                contentContainerStyle={{ gap: 10, paddingHorizontal: 0 }}
                renderItem={({ item }) => {
                    const isSelected = item.key === selectedValue;
                    return (
                        <TouchableOpacity
                            onPress={() => onSelect(item.key)}
                            style={{
                                paddingVertical: 8,
                                paddingHorizontal: 16,
                                borderRadius: 20,
                                backgroundColor: isSelected ? "#f97316" : "#E5E7EB",
                            }}
                        >
                            <Text
                                style={{
                                    color: isSelected ? "#FFF" : "#000",
                                    fontWeight: "600",
                                }}
                            >
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
};

export default SelectMenu;
