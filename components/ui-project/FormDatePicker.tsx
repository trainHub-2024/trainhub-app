import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import Button from "./Button";

interface DatePickerInputProps {
    title: string;
    date: Date;
    onChange: (selectedDate: Date) => void;
    mode?: "date" | "time"
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({ title, date, onChange, mode = "date" }) => {
    const [showPicker, setShowPicker] = useState(false);

    const toggleDatepicker = () => {
        setShowPicker(!showPicker);
    };

    const handleDateChange = ({ type }: any, selectedDate: any) => {
        if (type === "set") {
            onChange(selectedDate);
        }
    };

    return (
        <View className="w-full">
            <Text className='text-base font-medium text-muted-foreground'>{title}</Text>
            <TouchableOpacity
                onPress={toggleDatepicker}
                className={`border-2 border-muted w-full h-16 px-4 bg-muted rounded-2xl focus:border-primary flex-row justify-between items-center`}
            >
                <TextInput
                    value={date.toDateString()}
                    editable={false}
                    className='flex-1 pb-2 text-lg font-semibold text-left'
                />
                <Text className="font-medium text-primary">📅 Pick Date</Text>
            </TouchableOpacity>

            {/* DateTime Picker Modal */}
            {showPicker && (
                <Modal transparent={true} animationType="slide" visible={showPicker}>
                    <View className="items-center justify-center flex-1 px-4 bg-black/40">
                        <View className="items-center justify-center w-full p-4 bg-white rounded-lg shadow-lg">
                            <DateTimePicker
                                mode={mode}
                                display="spinner"
                                value={date}
                                onChange={handleDateChange}
                                textColor="black"
                            />

                            <Button
                                className="w-full mt-2"
                                size="sm"
                                label="Done"
                                onPress={toggleDatepicker}
                            />
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

export default DatePickerInput;
