import { View, Text, TouchableOpacity, Alert, TextInput, Button as ButtonReact } from 'react-native'
import React, { useState } from 'react'
import { Appointment } from '@/types/appwrite.types'
import { useGlobalContext } from '@/lib/global-provider';
import { router } from 'expo-router';
import { confirmPayment, creatInbox, updateStatusAppointmentById } from '@/lib/appwrite';
import UiLoading from '@/components/ui/Loading';

import Modal from 'react-native-modal';
import ConfirmModal from './_modals/confirm-modal';
import { isPast } from 'date-fns';
import CompleteModal from './_modals/complete-modal';
import { FontAwesome } from '@expo/vector-icons';
import RatingModal from '@/components/pages/appointments/RatingModal';

type StatusType = "pending" | "confirmed" | "cancelled" | "completed" | "confirm_payment" | "pay";

const Button = ({ status, onPress, children, isLoading }: { status: StatusType; children: React.ReactNode; onPress: () => void; isLoading: boolean }) => {
    const STATUS_VIEW_STYLE = {
        "pending": "bg-yellow-200",
        "completed": "bg-blue-200",
        "cancelled": "bg-red-200",
        "confirmed": "bg-green-200",
        "confirm_payment": "bg-violet-200",
        "pay": "bg-orange-200",
    }

    const STATUS_TEXT_STYLE = {
        "pending": "text-yellow-600",
        "completed": "text-blue-600",
        "cancelled": "text-red-600",
        "confirmed": "text-green-600",
        "confirm_payment": "text-violet-600",
        "pay": "text-orange-600",
    }

    return (
        <TouchableOpacity disabled={isLoading} onPress={onPress} className={`px-4 rounded-xl py-5 ${STATUS_VIEW_STYLE[status]}`}>
            <Text className={`text-center font-poppinsBold text-xl uppercase ${STATUS_TEXT_STYLE[status]}`}>{children}</Text>
        </TouchableOpacity>
    )
}

const ConfirmButton = ({ handleChange, isLoading }: { handleChange: () => void; isLoading: boolean }) => {

    return (
        <Button status="confirmed" onPress={handleChange} isLoading={isLoading}>confirm booking</Button>
    )
}

const CancelButton = ({ handleChange, isLoading }: { handleChange: () => void; isLoading: boolean }) => {

    return (
        <Button status="cancelled" onPress={handleChange} isLoading={isLoading}>cancel booking</Button>
    )
}


const CompleteButton = ({ handleChange, isLoading }: { handleChange: () => void; isLoading: boolean }) => {

    return (
        <Button status="completed" onPress={handleChange} isLoading={isLoading}>complete workout</Button>
    )
}

const ConfirmPaymentButton = ({ handleChange, isLoading }: { handleChange: () => void; isLoading: boolean }) => {

    return (
        <Button status="confirm_payment" onPress={handleChange} isLoading={isLoading}>Confirm Payment</Button>
    )
}

const PayButton = ({ handleChange, isLoading }: { handleChange: () => void; isLoading: boolean }) => {

    return (
        <Button status="pay" onPress={handleChange} isLoading={isLoading}>Proceed to Payment</Button>
    )
}

const TrainerButtons = ({ data, refetch }: { data: Appointment; refetch: () => void }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisibleComplete, setModalVisibleComplete] = useState(false);

    // const status = isPast(new Date(data.date)) ? "expired" : data.status;
    const status = data.status;
    const id = data.$id;
    const isPaid = data.paymentDate ? true : false;

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const toggleModalComplete = () => {
        setModalVisibleComplete(!isModalVisibleComplete);
    };

    async function handleConfirm(location: string) {
        try {
            setIsLoading(true);
            await updateStatusAppointmentById({ id, status: "confirmed", location });
            refetch();
            router.replace("/explore");
        } catch (error) {
            Alert.alert("Error", "Failed to confirm appointment. Please try again.");
        } finally {
            setIsLoading(false);
            toggleModal();
        }
    }

    async function handleCancel() {
        Alert.alert(
            "Cancel Appointment",
            "Are you sure you want to cancel this appointment?",
            [
                {
                    text: "No",
                    style: "cancel",
                },
                {
                    text: "Yes, Cancel",
                    onPress: async () => {
                        try {
                            setIsLoading(true);
                            await updateStatusAppointmentById({ id, status: "cancelled" }); // Call the cancellation function
                            Alert.alert("Cancelled appointment!");
                            refetch();
                            router.replace("/explore"); // Navigate back after cancellation
                        } catch (error) {
                            Alert.alert("Error", "Failed to cancel appointment. Please try again.");
                        } finally {
                            setIsLoading(false);
                        }
                    },
                },
            ]
        );
    }

    async function handleComplete(duration: string) {
        if (parseFloat(duration) < 1) {
            Alert.alert("Invalid Duration", "The duration must be at least 1 hour.");
            return;
        }

        try {
            setIsLoading(true);
            const res = await updateStatusAppointmentById({ id: id!, status: "completed", duration: parseInt(duration) });
            Alert.alert("Completed!", "Thank you! Your score has been updated");
            refetch();
            router.replace("/explore");
        } catch (error) {
            Alert.alert("Error", "Failed to complete appointment. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleConfirmPayment() {
        try {
            setIsLoading(true);
            const res = await confirmPayment(id);
            if (res) {
                Alert.alert("Confirmed Payment!", "Thank you!");
                router.replace("/explore");
                refetch();
            }
        } catch (error) {
            Alert.alert("Error", "Failed to confirm payment. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleCreateChat = async () => {
        if (!data?.userProfile_id || !data?.trainerProfile_id) {
            alert("Invalid Appointment");
            return;
        }

        try {
            const res = await creatInbox({
                trainerProfile_id: data.trainerProfile_id,
                userProfile_id: data.userProfile_id
            })

            if (res) {
                router.push(`/inboxes/${res.$id}`);
            }
        } catch (error) {
            console.log(error)
            alert(error)
        } finally {

        }

    }

    if (isLoading) {
        return <UiLoading />;
    }

    return (
        <>
            {status === "pending" && (
                <>
                    <ConfirmButton handleChange={toggleModal} isLoading={isLoading} />
                    <CancelButton handleChange={handleCancel} isLoading={isLoading} />
                </>
            )}

            {status === "confirmed" && (
                <>
                    <CompleteButton handleChange={toggleModalComplete} isLoading={isLoading} />
                    <CancelButton handleChange={handleCancel} isLoading={isLoading} />
                </>
            )}

            {status === "completed" && !data.isConfirmedPayment && (
                <>
                    {
                        isPaid ? <>
                            <ConfirmPaymentButton handleChange={handleConfirmPayment} isLoading={isLoading} />
                        </> :
                            <View className='w-full px-6 py-4 bg-white rounded-lg'>
                                <Text className='text-xl text-primary font-poppinsBold'>Waiting for Payment...</Text>
                                <Text className='font-poppins text-muted-foreground text-sm'>Please wait or message the user to inform them about their payment</Text>
                                <View className='flex-row justify-end items-center mt-4'>
                                    <TouchableOpacity onPress={handleCreateChat} className="flex justify-center gap-2 items-center flex-row bg-primary h-12 rounded-full flex-1">
                                        <FontAwesome name="send" size={16} color={"white"} />
                                        <Text className="font-poppinsBold text-white text-lg">Message</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                    }
                </>
            )}

            <ConfirmModal
                open={isModalVisible}
                onSubmit={(e) => {
                    handleConfirm(e)
                }}
                handleCancel={() => setModalVisible(false)}
            />
            <CompleteModal
                open={isModalVisibleComplete}
                onSubmit={(e) => {
                    handleComplete(e)
                }}
                handleCancel={() => setModalVisibleComplete(false)}
            />
        </>
    );
};

const TraineeButtons = ({ data, refetch }: { data: Appointment; refetch: () => void }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);

    const status = data.status;
    const id = data.$id;
    const isPaid = data.paymentDate ? true : false;

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    async function handleCancel() {
        Alert.alert(
            "Cancel Appointment",
            "Are you sure you want to cancel this appointment?",
            [
                {
                    text: "No",
                    style: "cancel",
                },
                {
                    text: "Yes, Cancel",
                    onPress: async () => {
                        try {
                            setIsLoading(true);
                            await updateStatusAppointmentById({ id, status: "cancelled" }); // Call the cancellation function
                            Alert.alert("Cancelled appointment!");
                            refetch();
                            router.replace("/explore"); // Navigate back after cancellation
                        } catch (error) {
                            Alert.alert("Error", "Failed to cancel appointment. Please try again.");
                        } finally {
                            setIsLoading(false);
                        }
                    },
                },
            ]
        );
    }

    async function handlePay() {
        router.push(`/payment/${id}`)
    }

    return (
        <>
            {status === "pending" && (
                <>
                    <CancelButton handleChange={handleCancel} isLoading={isLoading} />
                </>
            )}

            {status === "confirmed" && (
                <>
                    <CancelButton handleChange={handleCancel} isLoading={isLoading} />
                </>
            )}

            {status === "completed" && !data.isConfirmedPayment && (
                <>
                    {isPaid ? <View className='w-full px-6 py-4 bg-white rounded-lg'>
                        <Text className='text-xl text-primary font-poppinsBold'>Waiting for confirmation...</Text>
                        <Text className='font-poppins text-muted-foreground text-sm'>Please wait or message the trainer to inform them about your payment</Text>
                        <View className='mt-4 w-full'>
                            <RatingModal trainerId={data.trainerProfile.$id} userId={data.userProfile.$id} appointmentId={id} />
                        </View>
                    </View> :
                        <PayButton handleChange={handlePay} isLoading={isLoading} />
                    }
                </>
            )}

            {status === "completed" && data.isConfirmedPayment && (
                <RatingModal trainerId={data.trainerProfile.$id} userId={data.userProfile.$id} appointmentId={id} />
            )}
        </>
    )
}







const AppointmentButtons = ({ data, refetch }: { data: Appointment; refetch: () => void }) => {
    const { user } = useGlobalContext();
    const userRole = user?.role;

    return (
        <View className='gap-2'>
            {
                userRole === "trainer" ?
                    <TrainerButtons data={data} refetch={refetch} /> : <TraineeButtons data={data} refetch={refetch} />
            }
        </View>
    )
}

export default AppointmentButtons