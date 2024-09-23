import { TouchableOpacity, Text } from "react-native";

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

