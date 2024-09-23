import { TouchableOpacity, Text } from "react-native";

/**
 * Componente Botão Link
 * @param {string} linkText Texto do link
 * @param {string} additionalText Opcional. Texto de complemento.
 * @param {TouchableOpacity} props Propriedades do componente nativo TouchableOpacity
 * @returns Componente Botão Link
 */
export function ButtonLink({ linkText, additionalText, ...props }){
    return(
        <TouchableOpacity style={{flexDirection: 'row', gap: 4}} {...props}>
            { additionalText && <Text>{additionalText}</Text> }
            <Text style={{ color: "grey", textDecorationLine: "underline" }}>
                {linkText}
            </Text>
        </TouchableOpacity>
    )
}

