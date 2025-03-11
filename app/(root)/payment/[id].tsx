import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { router, useLocalSearchParams } from 'expo-router';
import { createPayment, getAppointmentById } from '@/lib/appwrite';
import { useAppwrite } from '@/lib/useAppwrite';

const Payments = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [loading, setLoading] = useState(false);

  const { refetch } = useAppwrite({
    fn: getAppointmentById,
    params: { id: id! },
  });


  const handleCashPayment = async () => {
    if (!id) {
      alert("No appointment id!");
      return;
    }

    setLoading(true);

    try {
      const res = await createPayment({ type: "cash", appointmentId: id });
      if (res) {
        alert("Payment Successful");
        refetch({ id });
        router.dismissAll();
        router.push(`/appointments/${id}`)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnlinePayment = () => {
    router.push(`/payment/online-payment/${id}`);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="text-lg mt-4">Processing Payment...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center p-4 bg-gray-100">
      <Text className="text-3xl font-bold mb-8">Choose Payment Method</Text>
      <TouchableOpacity
        className="flex-row items-center bg-green-500 p-4 rounded-lg mb-4 w-3/4"
        onPress={handleCashPayment}
      >
        <Icon name="money" size={24} color="#fff" className="mr-3" />
        <Text className="text-white text-lg">Pay with Cash</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-row items-center bg-blue-500 p-4 rounded-lg w-3/4"
        onPress={handleOnlinePayment}
      >
        <Icon name="credit-card" size={24} color="#fff" className="mr-3" />
        <Text className="text-white text-lg">Pay Online</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Payments;