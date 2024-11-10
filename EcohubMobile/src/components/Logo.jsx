/**IMPORTS NECESSÁRIOS PARA O COMPONENTE */
import { Image } from 'react-native';
import { base } from '../css/base';

/**
 * Componente Logo
 * @returns Componente Logo
 */
export default function Logo(){
    /**
     * Retorna logo
     */
    return(
        <Image  source={require('../assets/images/logo.png')} style={base.logo}/>
    )
}
