import { Text, View, Pressable } from "react-native";
import { useEffect, useState } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Container, Row, Col } from "react-native-flex-grid";
import Header from "./Header";
import Footer from "./Footer";
import { 
    NBR_OF_DICE, 
    NBR_OF_THROWS, 
    MIN_SPOT, 
    MAX_SPOT, 
    BONUS_POINTS, 
    BONUS_POINTS_LIMIT, 
    SCOREBOARD_KEY
} from "../constants/Game"
import styles from "../style/style";

let board = [];

export default Gameboard = ({navigation, route}) => {

    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState("Throw dice");
    const [gameEndStatus, setGameEndStatus] = useState(false);
    /*Mitkä arpakuutiot ovat valittuna */
    const [selectedDice, setSelectedDice] = 
        useState(new Array(NBR_OF_DICE).fill(false));
    /*Arpakuutioiden silmäluvut */
    const [diceSpots, setDiceSpots] =
        useState(new Array(NBR_OF_DICE).fill(0));
    /*Valittujen arpakuutioiden kokonaispistemäärät */
    const [dicePointsTotal, setDicePointsTotal] =
        useState(new Array(MAX_SPOT).fill(0));
    /*Mitkä arpakuutioiden silmäluvuista on valittu pisteisiin */
    const [selectedDicePoints, setSelectedDicePoints] = 
        useState(new Array(MAX_SPOT).fill(0));
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
        })
        return unsubscribe; 
    }, [navigation]);

    const getScoreboardData = async() => {
        try {
            const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
            if (jsonValue !== null) {
                const tmpScores = JSON.parse(jsonValue);
                setScores(tmpScores);
                console.log("Gameboard: READ SUCCESS");
                console.log("Gameboard: NBR OF SCORES: " + tmpScores.length);
            }
        }
        catch (e) {
            console.log("Gameboard: Read error: " + e);
        }
    }

    const savePlayerPoints = async () => {
        const newKey = scores.length + 1;
        const playerPoints = {
            key: newKey,
            name: playerName,
            date: "date", // hae tänne pvm
            time: "time", // hae tänne kellonaika
            points: 0 // sijoita pisteet tähän
        }
        try {
            const newScore = [...scores,playerpoints];
            const jsonValue = JSON.stringify(newScore);
            await AsyncStorage.setItem(SCOREBOARD_KEY, jsonValue);
            console.log("Gameboard: Save success: " + jsonValue);
        }
        catch(e) {
            console.log("Gameboard: save error: " + e);
        }
    }

    /**luodaan arpakuutiorivi sarakkeittain (Col)  */
    const diceRow = [];
    for (let dice = 0; dice < NBR_OF_DICE; dice++) {
        diceRow.push(
        <Col key={"dice" + dice}>
            <Pressable 
            key={"row" + dice}
            onPress={() => chooseDice(dice)}>
            <MaterialCommunityIcons
                name={board[dice]}
                key={"dice" + dice}
                size={50} 
                color={getDiceColor(dice)}>
            </MaterialCommunityIcons>
            </Pressable>
        </Col>
    );
  }

  /**Tässä luodaan pisterivi sarakkeittain (Col)*/
  const pointsRow = [];
  for (let spot= 0;spot < MAX_SPOT; spot++) {
    pointsRow.push(
        <Col key ={"pointsRow" + spot}>
            <Text 
            /**style={pointsStyle}*/ 
            key={"pointsRow" + spot}
            >{getSpotTotal(spot)}
            </Text>  
        </Col>
    );
  }

  /**Tässä luodaan rivi, joka kertoo onko pisteet jo valittu silmäluvulle */
    const pointsToSelectRow = [];
    for (let diceButton=0; diceButton < MAX_SPOT; diceButton++) {
        pointsToSelectRow.push(
            <Col key={"buttonsRow" + diceButton}>
                <Pressable 
                key={"buttonsRow" + diceButton}
                onPress={() => chooseDicePoints(diceButton)}>
                    <MaterialCommunityIcons 
                    name={"numeric-" + (diceButton + 1) + "-circle"}
                    key={"buttonsRow" + diceButton}
                    size={35}
                    color={getDicePointsColor(diceButton)}>
                    </MaterialCommunityIcons>
                </Pressable>
            </Col>
        );
    }

    const chooseDice = (i) => {
        if (nbrOfThrowsLeft < NBR_OF_THROWS && !gameEndStatus) {
        let dice = [...selectedDice];
        dice[i] = selectedDice[i] ? false : true;
        setSelectedDice(dice);
        } else {
            setStatus("You have to throw dice first.")
        }
      }

      const chooseDicePoints = (i) => {
        if (nbrOfThrowsLeft === 0) {
            let selectedPoints = [...selectedDicePoints];
            let points = [...dicePointsTotal];
            if (!selectedPoints[i]) {
                selectedPoints[i] = true;
                let nbrOfDice = 
                diceSpots.reduce((total, x) => (x === (i + 1) ? total + 1: total), 0);
                points[i] = nbrOfDice * (i + 1);
                } 
        else {
            setStatus("You already selected points for " + (i + 1));
            return points[i];
            }
            setDicePointsTotal(points);
            setSelectedDicePoints(selectedPoints);
            return points[i];
    }
        else {
            setStatus("Throw " + NBR_OF_THROWS + " times before setting points.");
            }
  }

      function getDiceColor(i) {
          return selectedDice[i] ? "black" : "steelblue";
      }

      function getDicePointsColor(i) {
        return (selectedDicePoints[i] && !gameEndStatus) ? "black" : "steelblue";
    }

    function getSpotTotal(i) {
        return dicePointsTotal[i];
    }

      const throwDice = () => {
        let spots = [...diceSpots];
        for (let i = 0; i < NBR_OF_DICE; i++) {
          if (!selectedDice[i]) {
            let randomNumber = Math.floor(Math.random() * 6 + 1);
            board[i] = 'dice-' + randomNumber;
            spots[i] = randomNumber;
          }
        }
        setNbrOfThrowsLeft(nbrOfThrowsLeft-1);
        setDiceSpots(spots);
        setStatus("Select and throw dice again")
      }

    return(
        /**style={throwDice}*/
        /*style={styles.playerName}*/
        <>
            <Header />
                <View>
                    <Container>
                        <Row>{diceRow}</Row>
                    </Container>
                    <Text>Throws left: {nbrOfThrowsLeft}</Text>
                    <Text>{status}</Text>
                    <Pressable onPress={() => throwDice()}>
                        <Text>THROW DICE</Text>
                    </Pressable>
                    <Container>
                        <Row>{pointsRow}</Row>
                    </Container>
                    <Container>
                        <Row>{pointsToSelectRow}</Row>
                    </Container>
                    <Text>Player: {playerName}</Text>
                    <Pressable onPress={() => throwDice()}>
                        <Text>Save Points</Text>
                    </Pressable>
                </View>
            <Footer />
        </>
    )
}
