import AsyncStorage from '@react-native-async-storage/async-storage';

const getTokenAndUserId = async () => {
    try {
        const token = await AsyncStorage.getItem('jwtToken');
        const userId = await AsyncStorage.getItem('userId');
        return {token, userId};
    } catch (error) {
        console.error('Erro ao obter o token ou userId:', error);
        return null;
    }
}



export {
    getTokenAndUserId
}