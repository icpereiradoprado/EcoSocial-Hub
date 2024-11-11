// Importações de bibliotecas e componentes.
import Constants from 'expo-constants'; // Para acessar constantes de configuração do ambiente Expo.
import { View, StyleSheet, useWindowDimensions, ActivityIndicator } from "react-native";
import { useEffect, useState, useContext } from 'react'; // Hooks do React para gerenciamento de estado e ciclo de vida.
import { base, colors } from "../css/base"; // Importações de estilos.
import RecyclingCenterList from "../components/RecyclingCenterList"; // Componente de lista de pontos de coleta.
import { getTokenAndUserId } from "../helpers/Auth"; // Função auxiliar para obter token e ID do usuário.
import { getSocket } from '../helpers/socket'; // Função para obter a instância do socket.
import RecyclingCenterFormModal from '../components/RecyclingCenterFormModal'; // Componente modal de formulário.
import { Snackbar } from 'react-native-paper'; // Componente de Snackbar para notificações.
import { SettingsContext } from '../context/SettingsContext'; // Contexto de configurações para obter dados do usuário.

/**
 * Componente da tela de pontos de coleta.
 * @returns Componente da tela de pontos de coleta.
 */
export function RecyclingCentersScreen() {
	// Obtenção de altura e largura da tela.
	const { height, width } = useWindowDimensions();
	// URL da API configurada no Expo.
	const url = Constants.manifest2.extra.expoClient.extra.apiUrl;
	// Estados para controle de carregamento, dados e modal.
	const [loading, setLoading] = useState(false);
	const [recyclingCenterData, setRecyclingCenterData] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [mode, setMode] = useState(null);
	const [visible, setVisible] = useState(false);
	const [recyclingCenterToEdit, setRecyclingCenterToEdit] = useState(null);
	const { userCity } = useContext(SettingsContext); // Obtenção da cidade do usuário a partir do contexto.

	// Função para ocultar o Snackbar.
	const onDismissSnackBar = () => setVisible(false);

	/**
	 * Função para buscar dados dos pontos de coleta do servidor.
	 */
	const fetchRecyclingCenters = async () => {
		setLoading(true); // Ativa o estado de carregamento.
		const { token, userId } = await getTokenAndUserId(); // Obtém o token e ID do usuário.
		const response = await fetch(`${url}/recyclingcenters/${userId}`, {
			method: 'GET',
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}` // Cabeçalho de autorização com token.
			}
		});

		// Verifica a resposta da requisição.
		if (response.ok) {
			const data = await response.json();
			setRecyclingCenterData(data); // Atualiza os dados dos pontos de coleta.
			setLoading(false);
		} else {
			console.error('Não foi possível carregar os pontos de coleta!'); // Loga um erro se a resposta não for bem-sucedida.
		}
	};

	// useEffect para carregar dados e configurar escuta de eventos do socket.
	useEffect(() => {
		const listenEvent = async () => {
			await fetchRecyclingCenters(); // Carrega os pontos de coleta.
			const socketIo = getSocket(); // Obtém a instância do socket.

			// Escuta eventos de criação de ponto de coleta.
			socketIo.on('recyclingcentercreate', (newRecyclingCenter) => {
				setRecyclingCenterData((prevRecyclingCenter) => [newRecyclingCenter, ...prevRecyclingCenter]);
			});

			// Escuta eventos de exclusão de ponto de coleta.
			socketIo.on('recyclingcenterdeleted', (recyclingCenterId) => {
				setRecyclingCenterData((prevRecyclingCenter) => {
					if (!prevRecyclingCenter) {
						return prevRecyclingCenter;
					}
					const recyclingCenters = prevRecyclingCenter.filter((recyclingCenter) => recyclingCenter.id !== recyclingCenterId);
					setVisible(true); // Mostra Snackbar de notificação.
					return recyclingCenters;
				});
			});

			// Escuta eventos de edição de ponto de coleta.
			socketIo.on('recyclingcenteredit', (updatedRecyclingCenter) => {
				setRecyclingCenterData((prevRecyclingCenters) => {
					if (!prevRecyclingCenters) {
						return prevRecyclingCenters;
					}
					const recyclingCenters = prevRecyclingCenters.map((recyclingCenter) =>
						recyclingCenter.id === updatedRecyclingCenter.id ? updatedRecyclingCenter : recyclingCenter
					);
					return recyclingCenters;
				});
			});
		};
		listenEvent();

		// Cleanup no retorno do useEffect (caso necessário).
		return () => {};
	}, [userCity]); // Dependência do useEffect para atualizar sempre que a cidade do usuário mudar.

	// Renderização do componente.
	return (
		<View style={styles.container}>
			{!loading ? (
				<>
					<RecyclingCenterList
						recyclingCenterData={recyclingCenterData}
						setModalVisible={setModalVisible}
						setMode={setMode}
						setRecyclingCenterToEdit={setRecyclingCenterToEdit}
					/>
					<RecyclingCenterFormModal
						modalVisible={modalVisible}
						setModalVisible={setModalVisible}
						mode={mode}
						recyclingCenterToEdit={recyclingCenterToEdit}
					/>
					<Snackbar
						style={{ width: width - 10, position: 'absolute', bottom: 80 }}
						visible={visible}
						duration={2000}
						onDismiss={onDismissSnackBar}
					>
						Ponto de coleta deletado com sucesso!
					</Snackbar>
				</>
			) : (
				<View>
					<ActivityIndicator size="large" /> {/* Indicador de carregamento. */}
				</View>
			)}
		</View>
	);
}

// Estilização dos componentes.
const styles = StyleSheet.create({
	logo: {
		marginTop: 15,
		width: 45,
		height: 45,
	},
	input: {
		borderColor: 'gray',
		borderWidth: 1,
		borderRadius: 10,
		width: '120%',
		textAlign: 'center',
	},
});
