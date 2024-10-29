import AsyncStorage from '@react-native-async-storage/async-storage';

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



export {
    getTokenAndUserId
}