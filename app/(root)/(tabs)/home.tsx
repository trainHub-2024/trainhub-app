import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "@/lib/global-provider";
import HomeTraineeMain from "@/components/pages/home/TraineeMain";
import HomeTrainerMain from "@/components/pages/home/TrainerMain";

const Home = () => {
    const { user } = useGlobalContext();

    return (
        <SafeAreaView className="flex-1 bg-white">
            {user?.role === "trainee" && (
                <HomeTraineeMain />
            )}
            {user?.role === "trainer" && (
                <HomeTrainerMain />
            )}
        </SafeAreaView>
    );
};

export default Home;
