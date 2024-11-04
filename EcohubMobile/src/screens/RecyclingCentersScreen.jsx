import Constants from 'expo-constants';
import { View, StyleSheet, useWindowDimensions, ActivityIndicator} from "react-native";
import { useEffect, useState, useContext } from 'react';
import { base, colors } from "../css/base";
import RecyclingCenterList from "../components/RecyclingCenterList";
import { getTokenAndUserId } from "../helpers/Auth";
import { getSocket } from '../helpers/socket';
import RecyclingCenterFormModal from '../components/RecyclingCenterFormModal';
import { Snackbar } from 'react-native-paper';
import { SettingsContext } from '../context/SettingsContext';

export function RecyclingCentersScreen(){
	const { height, width } = useWindowDimensions();
	const url = Constants.manifest2.extra.expoClient.extra.apiUrl;
    const [loading, setLoading] = useState(false);
    const [recyclingCenterData, setRecyclingCenterData] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [mode, setMode] = useState(null);
	const [visible, setVisible] = useState(false);
	const [recyclingCenterToEdit, setRecyclingCenterToEdit] = useState(null);
	const { userCity } = useContext(SettingsContext);

	const onDismissSnackBar = () => setVisible(false);

    const fetchRecyclingCenters = async () => {
		setLoading(true);
        const { token, userId } = await getTokenAndUserId();
        const response = await fetch(`${url}/recyclingcenters/${userId}`,{
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if(response.ok){
            const data = await response.json();
            setRecyclingCenterData(data);
			setLoading(false);
        }else{
            console.error('Não foi possível carregar os pontos de coleta!');
        }
    }

    useEffect(()=>{
		const listenEvent = async () => {
			//Carrega os conteúdos educacionais do banco de dados
			await fetchRecyclingCenters();
			const socketIo = getSocket();

			socketIo.on('recyclingcentercreate', (newRecyclingCenter)=>{
				setRecyclingCenterData((prevRecyclingCenter) => [newRecyclingCenter, ...prevRecyclingCenter]);
			});

			socketIo.on('recyclingcenterdeleted', (recyclingCenterId) => {
				setRecyclingCenterData((prevRecyclingCenter) => {
					if (!prevRecyclingCenter) {
						return prevRecyclingCenter;
					}
					const recyclingCenters = prevRecyclingCenter.filter((recyclingCenter) => recyclingCenter.id != recyclingCenterId);
					setVisible(true);
					return recyclingCenters;
				});
			});

			socketIo.on('recyclingcenteredit', (updatedRecyclingCenter) => {
				setRecyclingCenterData((prevRecyclingCenters) => {
					if (!prevRecyclingCenters) {
						return prevRecyclingCenters;
					}
					// Mapeia a lista, substituindo o item pelo novo conteúdo se o ID for correspondente
					const recyclingCenters = prevRecyclingCenters.map((recyclingCenter) =>
						recyclingCenter.id === updatedRecyclingCenter.id ? updatedRecyclingCenter : recyclingCenter
					);
					return recyclingCenters;
				});
			});
		}
		listenEvent();

		return () => {}
		
    }, [userCity]);


    return(
        <View style = {styles.container}>
			{!loading ? (
				<>
					<RecyclingCenterList recyclingCenterData={recyclingCenterData} setModalVisible={setModalVisible} setMode={setMode} setRecyclingCenterToEdit={setRecyclingCenterToEdit}/>
					<RecyclingCenterFormModal modalVisible={modalVisible} setModalVisible={setModalVisible} mode={mode} recyclingCenterToEdit={recyclingCenterToEdit}/>
					<Snackbar style={{width: width - 10, position: 'absolute', bottom: 80}} visible={visible} duration={2000} onDismiss={onDismissSnackBar}>
						Ponto de coleta deletado com sucesso!
					</Snackbar>
				</>
			) : (
				<View>
					<ActivityIndicator size="large" />
				</View>
			)}
        </View>
    )
}
const styles = StyleSheet.create({
    
    logo:{
        marginTop:15,
        width:45,
        height:45,
    },
    input:{
    	borderColor: 'gray',
    	borderWidth: 1,
    	borderRadius: 10,
    	width:'120%',
    	textAlign:'center',
    }
});
