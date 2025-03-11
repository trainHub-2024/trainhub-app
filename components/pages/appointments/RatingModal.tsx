import Button from "@/components/ui-project/Button";
import { createRating } from "@/lib/appwrite";
import { router } from "expo-router";
import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

const RatingModal = ({ trainerId, userId, appointmentId }: { trainerId: string, userId: string, appointmentId: string }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [rating, setRating] = useState("");
    const [isLoading, setIsLoading] = useState(false)

    const handleRate = () => {
        setModalVisible(true); // Show the modal
    };

    const handleSubmit = async () => {
        const ratingValue = parseInt(rating, 10);

        // Check if the rating is between 1 and 5
        if (ratingValue >= 1 && ratingValue <= 5) {
            console.log("Rating submitted:", ratingValue);

            try {
                setIsLoading(true);
                const res = await createRating({ rating: ratingValue, trainerId, userId, appointmentId }); // Call the cancellation function
                Alert.alert("Completed!", "Thank you! Your score has been updated");
                router.push("/home")
            } catch (error) {
                Alert.alert("Error", "Failed to complete appointment. Please try again.");
            } finally {
                setIsLoading(false);
            }

            setModalVisible(false); // Close the modal
        } else {
            // Show an error alert if the rating is not between 1 and 5
            Alert.alert("Invalid Rating", "Please enter a rating between 1 and 5.");
        }
    };

    const handleCancel = () => {
        setModalVisible(false); // Close the modal
    };

    return (
        <View className="p-5">
            <Button
                variant="default"
                label="Rate your Experience"
                onPress={handleRate}
            />

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={handleCancel}
            >
                <View className="flex-1 justify-center items-center bg-black/50 backdrop-blur-sm">
                    <View className="bg-white p-5 rounded-lg w-4/5">
                        <Text className="text-xl font-bold">Rate Your Experience</Text>
                        <Text className="my-3">How would you rate your experience from 1-5?</Text>
                        <TextInput
                            style={{ borderWidth: 1 }} // Nativewind does not support dynamic borderWidth directly
                            className="p-3 rounded-lg mb-5"
                            value={rating}
                            onChangeText={setRating}
                            keyboardType="numeric"
                            placeholder="Enter a rating from 1-5"
                        />
                        <View className="flex-row justify-between">
                            <TouchableOpacity
                                onPress={handleCancel}
                                className="p-3 bg-gray-300 rounded-lg"
                            >
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleSubmit}
                                className="p-3 bg-primary rounded-lg"
                            >
                                <Text className="text-white">Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default RatingModal;
