import { Image } from 'react-native';
import { base } from '../css/base';

export default function Logo(){
    return(
        <Image  source={require('../assets/images/logo.png')} style={base.logo}/>
    )
}
