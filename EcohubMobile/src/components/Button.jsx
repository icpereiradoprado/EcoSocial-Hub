import { base } from "../css/base";
import { TouchableOpacity, Text } from "react-native";

/**
 * Componente Botão
 * @param {string} buttonText Texto do botão
 * @param {TouchableOpacity} props Propriedades do componente nativo TouchableOpacity
 * @returns Componente Botão
 */
export function Button({buttonText, ...props}){
    return(
        <TouchableOpacity {...props} style={base.button}>
            <Text style={base.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
    )
}
