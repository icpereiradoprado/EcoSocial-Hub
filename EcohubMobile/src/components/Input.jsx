/**IMPORTS NECESSÁRIOS PARA O COMPONENTE */
import { TextInput } from "react-native"
import { base } from "../css/base"

/**
 * Componente Input
 * @param {TextInput} props Propriedades do componente nativo `TextInput` 
 * @returns Componente Input
 */
export function Input(props){
    /**
     * Componente Input
     */
    return (
        <TextInput
            {...props}
            style={base.input}
        />
    )
}