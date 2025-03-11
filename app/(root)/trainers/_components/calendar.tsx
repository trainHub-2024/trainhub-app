import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { addDays, format, isAfter, isBefore, isSameDay, parse } from 'date-fns'

const CalendarBooking = ({ workDays, timeSlots, handleSelectTimeSlot }:
    { workDays: string[]; timeSlots: string[]; handleSelectTimeSlot: (e: string, f: Date) => void }) => {

    const today = new Date();
    const nextWorkDays = Array.from({ length: 14 }, (_, i) => addDays(today, i)) // Check 14 days ahead
        .filter(date =>
            workDays.includes(format(date, "EEEE")) && (isAfter(date, today) || isSameDay(date, today))  // Exclude past days
        );

    const availableDates = nextWorkDays.filter(date =>
        workDays.includes(format(date, "EEEE")) // Match with trainer's work days
    );

    const [currentIndex, setCurrentIndex] = useState(0);
    const selectedDate = availableDates[currentIndex] || null;

    const isPastSlot = (slot: string) => {
        if (!selectedDate) return true;

        // Convert time slot into Date object
        const slotDate = parse(slot, "h:mm a", selectedDate); // Creates full Date object with slot time
        const currentDateTime = new Date();

        return isBefore(slotDate, currentDateTime);
    };


    return (
        <View className='gap-2'>
            <View className="p-4 mt-4 bg-muted rounded-2xl">
                <Text className="text-lg font-semibold text-center font-poppinsMedium">Select a Day</Text>

                <View className="flex-row items-center justify-between mt-4">
                    {/* Previous Button */}
                    <TouchableOpacity
                        onPress={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                        className={`px-4 py-2 bg-primary rounded-full ${currentIndex === 0 ? "opacity-50" : ""}`}
                        disabled={currentIndex === 0}
                    >
                        <Text className="text-lg text-white font-poppinsSemiBold">← Prev</Text>
                    </TouchableOpacity>

                    {/* Selected Date */}
                    <View className="items-center">
                        <Text className="text-lg font-poppinsBold">{format(selectedDate, "EEEE")}</Text>
                        <Text className="text-gray-700 font-poppins">{format(selectedDate, "MMM d, yyyy")}</Text>
                    </View>

                    {/* Next Button */}
                    <TouchableOpacity
                        onPress={() => setCurrentIndex(prev => Math.min(availableDates.length - 1, prev + 1))}
                        className={`px-4 py-2 bg-primary rounded-full ${currentIndex === availableDates.length - 1 ? "opacity-50" : ""}`}
                        disabled={currentIndex === availableDates.length - 1}
                    >
                        <Text className="text-lg text-white font-poppinsSemiBold">Next →</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {selectedDate && (
                <View className="p-4 mt-4 bg-gray-100 rounded-2xl">
                    <Text className="text-lg font-poppinsBold text-center">
                        Time Slots for {format(selectedDate, "EEEE, MMMM d")}
                    </Text>
                    <View className="flex-row flex-wrap gap-2 mt-2 justify-center">
                        {timeSlots.map((slot, index) => {
                            const isDisabled = isPastSlot(slot); // Check if the slot is in the past
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => !isDisabled && handleSelectTimeSlot(slot, selectedDate)}
                                    className={`px-3 py-2 rounded-full ${isDisabled ? "bg-gray-300" : "bg-primary"}`}
                                    disabled={isDisabled} // Disable button if the slot is in the past
                                >
                                    <Text className={`text-white font-poppins ${isDisabled ? "text-gray-500" : ""}`}>{slot}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            )}
        </View>
    )
}

export default CalendarBooking