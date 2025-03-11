import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";

interface DaysOfWeekPickerProps {
    title: string;
    selectedDays: string[];
    onChange: (days: string[]) => void;
}

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const DaysOfWeekPicker: React.FC<DaysOfWeekPickerProps> = ({ title, selectedDays, onChange }) => {
    const [selected, setSelected] = useState<string[]>(selectedDays);

    const toggleDay = (day: string) => {
        let updatedDays;
        if (selected.includes(day)) {
            updatedDays = selected.filter(d => d !== day); // Remove day if already selected
        } else {
            updatedDays = [...selected, day]; // Add day if not selected
        }
        setSelected(updatedDays);
        onChange(updatedDays); // Notify parent component
    };

    return (
        <View className="w-full">
            <Text className="text-base font-medium text-muted-foreground">{title}</Text>

            {/* Display selected days */}
            {/* <Text className="mt-2 text-lg font-semibold text-primary">
                {selected.length > 0 ? selected.join(", ") : "No days selected"}
            </Text> */}

            {/* Day Selection Buttons */}
            <View className="flex-row flex-wrap gap-2 mt-2">
                {daysOfWeek.map(day => (
                    <TouchableOpacity
                        key={day}
                        onPress={() => toggleDay(day)}
                        className={`px-4 py-2 rounded-lg ${selected.includes(day) ? "bg-primary text-white" : "bg-gray-200"
                            }`}
                    >
                        <Text className={selected.includes(day) ? "text-white" : "text-black"}>
                            {day.substring(0, 3)} {/* Show "Mon", "Tue", etc. */}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default DaysOfWeekPicker;
