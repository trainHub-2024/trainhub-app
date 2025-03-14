import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/lib/global-provider";
import UiSearchTrainer from "@/components/ui-project/SearchTrainer";
import { useAppwrite } from "@/lib/useAppwrite";
import { getTrainers } from "@/lib/appwrite";
import { router, useLocalSearchParams } from "expo-router";
import { computeLevel } from "@/utils";
import { getSports } from "@/lib/actions/sports.actions";
import SelectMenu from "@/components/ui-project/SelectMenu";
import { Sport } from "@/types/appwrite.types";
import TraineeHeader from "./_components/trainee-header";
import TrainerCard from "./cards/trainer-card";

const ExploreTraineeMain = () => {
    const { user } = useGlobalContext();
    const params = useLocalSearchParams<{ query?: string; search?: string }>();

    // State for sports filter
    const [selectedSport, setSelectedSport] = useState("");

    const {
        data: trainersData,
        refetch: refetchTrainers,
        loading: loadingTrainers,
    } = useAppwrite({
        fn: getTrainers,
        params: {
            filter: selectedSport,
            query: params.search!,
            location: user?.profile?.location ?? ""
        },
        skip: true,
    });

    const { data: sportsData, loading: loadingSports } = useAppwrite({
        fn: getSports,
    });

    // Refetch trainers when the search query or selected sport changes
    useEffect(() => {
        console.log(selectedSport)
        refetchTrainers({ filter: selectedSport, query: params.search!, location: user?.profile?.location ?? "" });
    }, [params.search, selectedSport]);

    if (!user) return null;

    // Format data for SelectMenu
    const sportsOptions = [{ key: "", label: "All Sports" }, ...(sportsData?.map((sport) => ({ key: sport.$id, label: sport.name })) || [])];

    return (
        <View style={{ flex: 1, paddingHorizontal: 24 }}>
            <TraineeHeader
                loading={loadingSports}
                sportsOptions={sportsOptions}
                selectedSport={selectedSport}
                setSelectedSport={setSelectedSport}
            />
            <FlatList
                data={trainersData}
                keyExtractor={(item) => item.$id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 10, paddingVertical: 8 }}
                ListEmptyComponent={
                    loadingTrainers ? (
                        <ActivityIndicator size="large" className="mt-5 text-primary-300" />
                    ) : (
                        <View>
                            <Text>No Trainers Found!</Text>
                        </View>
                    )
                }
                renderItem={({ item }) => {
                    return (
                        <TrainerCard item={item} />
                    );
                }}
                style={{ flex: 1 }}
            />
        </View>
    );
};

export default ExploreTraineeMain;