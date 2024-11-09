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
    /**Retorna um componente que simula um botão contendo algumas particularidades.
     * Caso a propriedade `loading` seja verdadeira desabilita o botão e altera o seu texto
    */
    return(
        <>
            <TouchableOpacity {...props} style={[base.button, {opacity: loading && 0.2}]} disabled={loading}>
                <Text style={base.buttonText}>{loading ? (loadingText || 'Carregando...') : buttonText}</Text>
            </TouchableOpacity>
            {loading && <ActivityIndicator size="small" color="#0000ff" />}
        </>
    )
}
