import { Image } from 'react-native';
import { base } from '../css/base';

/**
 * Componente Logo
 * @returns Componente Logo
 */
export default function Logo(){
    return(
        <Image  source={require('../assets/images/logo.png')} style={base.logo}/>
    )
}
