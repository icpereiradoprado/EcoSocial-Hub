import { base } from "../css/base";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

/**
 * Componente Botão
 * @param {string} buttonText Texto do botão
 * @param {boolean} loading Indica se está acontecendo um carregamento
 * @param {string} loadingText Texto do botão enquanto acontece o carregamento
 * @param {TouchableOpacity} props Propriedades do componente nativo TouchableOpacity
 * @returns Componente Botão
 */
export function Button({buttonText, loading, loadingText, ...props}){
    return(
        <>
            <TouchableOpacity {...props} style={base.button}>
                <Text style={base.buttonText}>{loading ? (loadingText || 'Carregando...') : buttonText}</Text>
            </TouchableOpacity>
            {loading && <ActivityIndicator size="small" color="#0000ff" />}
        </>
    )
}