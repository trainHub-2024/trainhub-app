import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "@/lib/global-provider";
import ExploreTraineeMain from "@/components/pages/explore/TraineeMain";
import ExploreTrainerMain from "@/components/pages/explore/TrainerMain";

const Explore = () => {
    const { user } = useGlobalContext();

    return (
        <SafeAreaView className="h-full pb-16 bg-white">
            {user?.role === "trainee" && (
                <ExploreTraineeMain />
            )}
            {user?.role === "trainer" && (
                <ExploreTrainerMain />
            )}
        </SafeAreaView>
    );
};

export default Explore;
