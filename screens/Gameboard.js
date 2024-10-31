import { Text, View, Pressable, Alert } from "react-native";
import { useEffect, useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Container, Row, Col } from "react-native-flex-grid";
import Header from "./Header";
import Footer from "./Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    NBR_OF_DICE,
    NBR_OF_THROWS,
    MIN_SPOT,
    MAX_SPOT,
    BONUS_POINTS,
    BONUS_POINTS_LIMIT,
    SCOREBOARD_KEY
} from "../constants/Game";
import styles from "../style/style";

let board = [];

export default Gameboard = ({ navigation, route }) => {
    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState("Throw dice");
    const [gameEndStatus, setGameEndStatus] = useState(false);
    const [selectedDice, setSelectedDice] = useState(new Array(NBR_OF_DICE).fill(false));
    const [diceSpots, setDiceSpots] = useState(new Array(NBR_OF_DICE).fill(0));
    const [dicePointsTotal, setDicePointsTotal] = useState(new Array(MAX_SPOT).fill(0));
    const [selectedDicePoints, setSelectedDicePoints] = useState(new Array(MAX_SPOT).fill(0));
    const [playerName, setPlayerName] = useState("");
    const [scores, setScores] = useState([]);

    useEffect(() => {
        if (playerName === "" && route.params?.player) {
            setPlayerName(route.params.player);
        }
    }, []);

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
                const tmpScores = JSON.parse(jsonValue);
                setScores(tmpScores);
                console.log("Gameboard: READ SUCCESS");
                console.log("Gameboard: NBR OF SCORES: " + tmpScores.length);
            }
        } catch (e) {
            console.log("Gameboard: Read error: " + e);
        }
    };

    const savePlayerPoints = async (points) => {
        const newKey = scores.length + 1;
        const date = new Date();
        const playerPoints = {
            key: newKey,
            name: playerName,
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString(),
            points
        };
        try {
            const newScore = [...scores, playerPoints];
            const jsonValue = JSON.stringify(newScore);
            await AsyncStorage.setItem(SCOREBOARD_KEY, jsonValue);
            console.log("Gameboard: Save success:", jsonValue);
        } catch (e) {
            console.log("Gameboard: save error:", e);
        }
    };

    const resetGame = () => {
        setNbrOfThrowsLeft(NBR_OF_THROWS);
        setStatus("Throw dice");
        setGameEndStatus(false);
        setSelectedDice(new Array(NBR_OF_DICE).fill(false));
        setDiceSpots(new Array(NBR_OF_DICE).fill(0));
        setDicePointsTotal(new Array(MAX_SPOT).fill(0));
        setSelectedDicePoints(new Array(MAX_SPOT).fill(false));
    };

    const allPointsSelected = selectedDicePoints.every((point) => point);

    const throwDice = () => {
        if (allPointsSelected) {
            savePlayerPoints();
            resetGame();
            setStatus("New game started! Throw dice.");
        } else if (nbrOfThrowsLeft > 0) {
            let spots = [...diceSpots];
            for (let i = 0; i < NBR_OF_DICE; i++) {
                if (!selectedDice[i]) {
                    let randomNumber = Math.floor(Math.random() * 6 + 1);
                    board[i] = "dice-" + randomNumber;
                    spots[i] = randomNumber;
                }
            }
            setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
            setDiceSpots(spots);
            setStatus("Select and throw dice again");
        } else {
            setStatus("No throws left. Select your points or reset the game.");
        }
    };

    const chooseDicePoints = (i) => {
        if (nbrOfThrowsLeft === 0) {
            let selectedPoints = [...selectedDicePoints];
            let points = [...dicePointsTotal];
            if (!selectedPoints[i]) {
                selectedPoints[i] = true;
                let nbrOfDice = diceSpots.reduce((total, x) => (x === i + 1 ? total + 1 : total), 0);
                points[i] = nbrOfDice * (i + 1);
                setDicePointsTotal(points);
                setSelectedDicePoints(selectedPoints);

                const totalPoints = points.reduce((sum, p) => sum + p, 0);
                savePlayerPoints(totalPoints);
                setNbrOfThrowsLeft(NBR_OF_THROWS);
                setSelectedDice(new Array(NBR_OF_DICE).fill(false));
                setDiceSpots(new Array(NBR_OF_DICE).fill(0));
                setStatus("Throw dice to start a new round.");
            } else {
                setStatus("You already selected points for " + (i + 1));
            }
        } else {
            setStatus("Throw " + NBR_OF_THROWS + " times before setting points.");
        }
    };

    const chooseDice = (i) => {
        if (nbrOfThrowsLeft < NBR_OF_THROWS && !gameEndStatus) {
            let dice = [...selectedDice];
            dice[i] = !selectedDice[i];
            setSelectedDice(dice);
        } else {
            setStatus("You have to throw dice first.");
        }
    };

    function getDiceColor(i) {
        return selectedDice[i] ? "black" : "red";
    }

    function getDicePointsColor(i) {
        return selectedDicePoints[i] && !gameEndStatus ? "black" : "red";
    }

    function getSpotTotal(i) {
        return dicePointsTotal[i];
    }
    return (
        <>
        <View style={styles.container}>
            <Header />
            <View style={styles.mainContent}>
                <Container>
                    <Row>
                        {Array.from({ length: NBR_OF_DICE }, (_, dice) => (
                            <Col key={"dice" + dice}>
                                <Pressable onPress={() => chooseDice(dice)}>
                                    <MaterialCommunityIcons
                                        name={board[dice]}
                                        size={50}
                                        color={getDiceColor(dice)}
                                    />
                                </Pressable>
                            </Col>
                        ))}
                    </Row>
                </Container>
                <Text>Throws left: {nbrOfThrowsLeft}</Text>
                <Text>{status}</Text>
                <Pressable onPress={throwDice} disabled={nbrOfThrowsLeft === 0}>
                    <Text style={styles.throwDice}>THROW DICE</Text>
                </Pressable>
                <Container>
                    <Row>
                        {Array.from({ length: MAX_SPOT }, (_, spot) => (
                            <Col key={"pointsRow" + spot}>
                                <Text style={styles.pointsStyle}>{getSpotTotal(spot)}</Text>
                            </Col>
                        ))}
                    </Row>
                </Container>
                <Container>
                    <Row>
                        {Array.from({ length: MAX_SPOT }, (_, diceButton) => (
                            <Col key={"buttonsRow" + diceButton}>
                                <Pressable onPress={() => chooseDicePoints(diceButton)}>
                                    <MaterialCommunityIcons
                                        name={"numeric-" + (diceButton + 1) + "-circle"}
                                        size={35}
                                        color={getDicePointsColor(diceButton)}
                                    />
                                </Pressable>
                            </Col>
                        ))}
                    </Row>
                </Container>
                <Text style={styles.playerName}>Player: {playerName}</Text>
            </View>
            <Footer />
            </View>
        </>
    );
};
