import { base } from "../css/base";
import { TouchableOpacity, Text } from "react-native";

export function Button({buttonText, ...props}){
    return(
        <TouchableOpacity {...props} style={base.button}>
            <Text style={base.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
    )
}
