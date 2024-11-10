/**IMPORTS NECESSÁRIOS PARA O COMPONENTE */
import { TextInput } from "react-native"
import { base } from "../css/base"

/**
 * Componente TextArea
 * @param {TextInput} props Propriedades do componente nativo `TextInput` 
 * @returns Componente Input
 */
export function TextArea(props){
    return (
        <TextInput
            {...props}
            style={base.textArea}
        />
    )
}