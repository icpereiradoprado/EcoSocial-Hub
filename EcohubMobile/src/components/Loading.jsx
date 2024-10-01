import { View, Text, ActivityIndicator, StyleSheet, useWindowDimensions } from 'react-native'
import { colors } from '../css/base'
import { useEffect } from 'react';

/**
 * Componente de Loading
 * @param {boolean} isLoading Estado do load
 * @param {string} loadingText Texto do loading
 */

export default function Loading({ isLoading, loadingText }){
    const { height, width } = useWindowDimensions();

    return(
        <View style={[style.container, {display: isLoading ? 'flex' : 'none'}, {width: width, height: height}]}>
            <Text style={style.loadingText}>{loadingText}</Text>
            <ActivityIndicator size='large' color="white"/>
        </View>
    )
}


const style = StyleSheet.create({
    container: {
        backgroundColor: '#42424254',
        position: 'absolute',
        zIndex: 20,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 25
    }
})