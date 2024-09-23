import { TextInput } from "react-native"
import { base } from "../css/base"

/**
 * Componente Input
 * @param {TextInput} props Propriedades do componente nativo `TextInput` 
 * @returns Componente Input
 */
export function Input(props){
    return (
        <TextInput
            {...props}
            style={base.input}
        />
    )
}