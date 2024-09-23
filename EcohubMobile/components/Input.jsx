import { TextInput } from "react-native"
import { base } from "../css/base"

/**
 * 
 * @param {TextInput} props Propriedades do componente nativo `TextInput` 
 * @returns 
 */
export function Input(props){
    return (
        <TextInput
            {...props}
            style={base.input}
        />
    )
}