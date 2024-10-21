import {Text, View} from "react-native";
import styles from "../style/style";

export default Footer = () => {
    return(
        <View style={styles.footer}>
            <Text styles={styles.author}>Author: Elias Konttaniemi</Text>
        </View>
    )
}