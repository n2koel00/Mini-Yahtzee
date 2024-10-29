import { useState, useEffect } from "react";
import { Text, View } from "react-native";
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
        })
        return unsubscribe; 
    }, [navigation]);

    const getScoreboardData = async() => {
        try {
            const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
            if (jsonValue !== null) {
                const tmpScores = JSON.parse(jsonValue);
                // stackoverflow homes.sort(function (a,b) {
                // return prasefloat (a.price) - parseFloat(b.price); 
                // });
                setScores(tmpScores);
                console.log("Scoreboard: READ SUCCESS");
                console.log("Scoreboard: NMBR OF SCORES: " + tmpScores.length);
            }
        }
        catch (e) {
            console.log("Scoreboard: Read error: " + e);
        }
    }

    const clearScoreboard = async () => {
        try {
            await AsyncStorage.removeItem(SCOREBOARD_KEY);
            setScores([]);
        }
        catch(e) {
            console.log("Scoreboard: Clear error: " + e);
        }
    }
    
    return(
        <>
            <Header />
                <View>
                    <Text>Scoreboard here</Text>
                </View>
            <Footer />
        </>
    )
}