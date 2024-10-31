import { useState, useEffect } from "react";
import { Text, View, FlatList, Pressable, Alert } from "react-native";
import Header from "./Header";
import Footer from "./Footer";
import { SCOREBOARD_KEY } from "../constants/Game";
import styles from "../style/style";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default Scoreboard = ({ navigation }) => {
    const [scores, setScores] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            getScoreboardData();
        });
        return unsubscribe;
    }, [navigation]);

    const getScoreboardData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
            if (jsonValue !== null) {
                let tmpScores = JSON.parse(jsonValue);
                tmpScores.sort((a, b) => b.points - a.points);
                setScores(tmpScores);
                console.log("Scoreboard: READ SUCCESS");
                console.log("Scoreboard: NMBR OF SCORES: " + tmpScores.length);
            }
        } catch (e) {
            console.log("Scoreboard: Read error: " + e);
        }
    };

    const renderScoreItem = ({ item }) => (
        <View style={styles.scoreItem}>
            <Text style={styles.scoreText}>
                {item.name} - {item.points} points
            </Text>
            <Text style={styles.dateText}>
                {item.date} at {item.time}
            </Text>
        </View>
    );

    return (
        <>
        <View style={styles.container}>
            <Header />
            <View style={styles.scoreboardContainer}>
                <Text style={styles.title}>Scoreboard</Text>
                <FlatList
                    data={scores}
                    renderItem={renderScoreItem}
                    keyExtractor={(item) => item.key.toString()}
                    ListEmptyComponent={
                        <Text style={styles.noScoresText}>No scores available</Text>
                    }
                />
            </View>
            <Footer />
            </View>
        </>
    );
};
