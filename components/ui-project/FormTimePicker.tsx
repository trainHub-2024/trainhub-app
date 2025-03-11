import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import Button from "./Button";

interface TimePickerInputProps {
    title: string;
    value: Date;
    onChange: (selectedTime: Date) => void;
}

const TimePickerInput: React.FC<TimePickerInputProps> = ({ title, value, onChange }) => {
    const [showPicker, setShowPicker] = useState(false);
    const [selectedTime, setSelectedTime] = useState(value);

    const toggleDatepicker = () => {
        setShowPicker(!showPicker);
    };

    const handleDateChange = (_event: any, selectedTime?: Date) => {
        if (selectedTime) {
            setSelectedTime(selectedTime); // Update local state
        }
    };

    const confirmTime = () => {
        onChange(selectedTime); // Pass the selected time to parent
        setShowPicker(false);
    };

    return (
        <View className="w-full">
            <Text className="text-base font-medium text-muted-foreground">{title}</Text>
            <TouchableOpacity
                onPress={toggleDatepicker}
                className="flex-row items-center justify-between w-full h-16 px-4 border-2 border-muted bg-muted rounded-2xl"
            >
                <TextInput
                    value={selectedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
                    editable={false}
                    className="flex-1 pb-2 text-lg font-semibold text-left"
                />
                <Text className="font-medium text-primary">⏰ Pick Time</Text>
            </TouchableOpacity>

            {/* DateTime Picker Modal */}
            {showPicker && (
                <Modal transparent={true} animationType="slide" visible={showPicker}>
                    <View className="items-center justify-center flex-1 px-4 bg-black/40">
                        <View className="items-center justify-center w-full p-4 bg-white rounded-lg shadow-lg">
                            <DateTimePicker
                                mode="time"
                                display="spinner"
                                value={selectedTime}
                                onChange={handleDateChange}
                                textColor="black"
                            />
                            <Button className="w-full mt-2" size="sm" label="Done" onPress={confirmTime} />
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

export default TimePickerInput;
