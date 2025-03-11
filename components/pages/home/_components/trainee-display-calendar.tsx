import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { format } from 'date-fns';

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Generate days centered around today
const getCenteredDays = () => {
    const today = new Date();
    const todayIndex = today.getDay();
    const centeredDays = [];

    for (let i = -2; i <= 2; i++) {
        const dayIndex = (todayIndex + i + 7) % 7;
        const date = new Date();
        date.setDate(today.getDate() + i);

        centeredDays.push({
            day: daysOfWeek[dayIndex],
            date
        });
    }

    return centeredDays;
};

const DisplayCalendar = ({ selectedDate, setSelectedDate }: { selectedDate: Date; setSelectedDate: (e: Date) => void }) => {
    const days = getCenteredDays();

    return (
        <View className="h-auto gap-4 pb-4">
            {/* Display Days with Today at the Center */}
            <View className="flex-row flex-wrap justify-between pt-4">
                {days.map((item, index) => {
                    const selected = format(selectedDate, "yyyy-dd") === format(item.date, "yyyy-dd")


                    return (
                        <TouchableOpacity onPress={() => setSelectedDate(item.date)} key={index} className={`w-[18%] border border-primary h-32 
                        ${selected ? "bg-primary" : "bg-white"} py-4 rounded-lg justify-between items-center`}>
                            <Text className={`font-poppins text-sm 
                                ${!selected ? "text-primary" : "text-white"}`}>{item.day}</Text>
                            <Text className={`font-poppinsBold text-3xl
                                ${!selected ? "text-primary" : "text-white"}`}>
                                {item.date.toLocaleDateString("en-US", { day: "numeric" })}
                            </Text>
                            <Text className={`font-poppins text-sm 
                                ${!selected ? "text-muted-foreground" : "text-white"}`}>
                                {item.date.toLocaleDateString("en-US", { month: "short" })}
                            </Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View>
    )
}

export default DisplayCalendar