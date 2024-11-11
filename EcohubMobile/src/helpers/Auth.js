/**IMPORTS NECESSÁRIOS PARA O COMPONENTE */
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Retorna um objeto contendo o token, userId e isAdmin, ou null em caso de erro.
 */
const getTokenAndUserId = async () => {
    try {
        const token = await AsyncStorage.getItem('jwtToken');
        const userId = await AsyncStorage.getItem('userId');
        const isAdmin = await AsyncStorage.getItem('isAdmin');
        return { token, userId, isAdmin };
    } catch (error) {
        console.error('Erro ao obter o token ou userId:', error);
        return null;
    }
}

/** 
 * Exporta a função getTokenAndUserId para que possa ser utilizada em outros módulos.
 */
export {
    getTokenAndUserId
}