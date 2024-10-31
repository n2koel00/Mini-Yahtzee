import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginTop: 30,
    marginBottom: 15,
    backgroundColor: "#a973d6",
    flexDirection: 'row',
  },
  footer: {
    marginTop: 20,
    backgroundColor: "#a973d6",
    flexDirection: 'row'
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 23,
    textAlign: 'center',
    margin: 10,
  },
  ruleTitle: {
    fontWeight: 'bold',
    fontSize: 23,
    textAlign: 'center',
    margin: 10,
  },
  ruleText: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    borderRadius: 5,
    margin: 5,
    borderWidth: 2,
  },
  goodluck: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  author: {
    color: '#fff',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
  },
  gameboard: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  gameinfo: {
    backgroundColor: "#a973d6",
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 20,
    marginTop: 10
  },
  row: {
    marginTop: 20,
    padding: 10
  },
  flex: {
    flexDirection: "row"
  },
  button: {
    margin: 10,
    padding: 10,
    width: 150,
    backgroundColor: "#a973d6",

    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontWeight: 'bold',
    color: "#2B2B52",
    fontSize: 20
  },
  scoreboardContainer: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  scoreItem: {
    padding: 10,
    borderRadius: 5,
    margin: 5,
    borderWidth: 1,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "500",
  },
  dateText: {
    fontSize: 14,
    color: "gray",
  },
  noScoresText: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
    marginTop: 20,
  },
  pointsStyle: {
    fontSize: 18,
    textAlign: 'center',
  },
  throwDice: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: 'center',
    marginVertical: 15,
  },
  playerName: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 10,
  },
});
