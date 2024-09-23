import { base } from "../css/base";
import { Text } from 'react-native';

/**
 * Componente Título
 * @returns Componente de Título com o texto: Eco Social Hub
 */
export function Title(){
    return(
        <Text style={base.title}> Eco Social Hub </Text>
    )
}