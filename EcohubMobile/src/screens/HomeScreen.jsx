import * as React from 'react';
import { View, StyleSheet, Image , Text, useWindowDimensions, ActivityIndicator } from 'react-native';
import EducationalContentList from '../components/EducationalContentList';
import { useEffect, useState } from 'react';
import Constants from 'expo-constants';
import { getTokenAndUserId } from '../helpers/Auth';
import { getSocket } from '../helpers/socket';
import { Snackbar } from 'react-native-paper';
import EducationalContentFormModal from '../components/EducationalContentFormModal';

export function HomeScreen(){
    const { height, width } = useWindowDimensions();
    const url = Constants.manifest2.extra.expoClient.extra.apiUrl;
	const [loading, setLoading] = useState(false);
    const [educationalContentData, setEducationalContentData] = useState(null);
	const [educationalContentToEdit, setEducationalContentToEdit] = useState(null);
	const [visible, setVisible] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [mode, setMode] = useState(null);
	const [offset, setOffset] = useState(0);
	const [hasMoreData, setHasMoreData] = useState(true);
	
	const onDismissSnackBar = () => setVisible(false);

    const fetchEducationalContents = async (offset) => {
		const { token } = await getTokenAndUserId();
		setLoading(true);
        const response = await fetch(`${url}/educationalcontents/${offset}`,{
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if(response.ok){
            const data = await response.json();
			if(data.length > 0){
				setEducationalContentData(data);
			}
			setLoading(false);
        }else{
            console.error('Não foi possível carregar os conteúdos educacionais!');
        }
    }
	
	const fetchMoreEducationalContents = async () => {
		const { token } = await getTokenAndUserId();
		const updatedOffset = offset + 10;
		const response = await fetch(`${url}/educationalcontents/${updatedOffset}`,{
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
		if(response.ok){
			const moreEducationContents = await response.json();
			if(moreEducationContents.length === 0){
				setHasMoreData(false);
				return;
			};
			setEducationalContentData((prevEducationContents) => [...prevEducationContents, ...moreEducationContents]);
			setOffset(updatedOffset);
		}
	}

    useEffect(()=>{
		const listenEvent = async () => {
			//Carrega os conteúdos educacionais do banco de dados
			await fetchEducationalContents(offset);
			const socketIo = getSocket();

			socketIo.on('educationalcontentcreate', (newContent)=>{
				setEducationalContentData((prevEducationContents) => [newContent, ...prevEducationContents]);
			});

			socketIo.on('educationalcontentdeleted', (contentId) => {
				setEducationalContentData((prevEducationContents) => {
					if (!prevEducationContents) {
						return prevEducationContents;
					}
					const contents = prevEducationContents.filter((content) => content.id != contentId);
					setVisible(true);
					return contents;
				});
			});

			socketIo.on('educationalcontentedit', (updatedContent) => {
				setEducationalContentData((prevEducationContents) => {
					if (!prevEducationContents) {
						return prevEducationContents;
					}
					// Mapeia a lista, substituindo o item pelo novo conteúdo se o ID for correspondente
					const contents = prevEducationContents.map((content) =>
						content.id === updatedContent.id ? updatedContent : content
					);
					return contents;
				});
			});
		}
		listenEvent();

		return () => {}
		
    }, []);

    return(
        <View style = {styles.container}>
			{!loading ? (
				<>
					<EducationalContentList 
						educationalContents={educationalContentData} 
						setModalVisible={setModalVisible} 
						setMode={setMode} 
						setEducationalContentToEdit={setEducationalContentToEdit} 
						loadMoreData={fetchMoreEducationalContents} 
						hasMoreData={hasMoreData}
					/>
					<EducationalContentFormModal 
						modalVisible={modalVisible} 
						setModalVisible={setModalVisible} 
						mode={mode} 
						educationalContentToEdit={educationalContentToEdit}
					/>
					<Snackbar 
						style={{width: width - 10, position: 'absolute', bottom: 80}}
						visible={visible}
						duration={2000}
						onDismiss={onDismissSnackBar}
					>
						Conteúdo educacional deletado com sucesso!
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
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent:'center'
    },
    logo:{
        width:50,
        height:50,
    },
 
  });