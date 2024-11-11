// Importa bibliotecas e componentes necessários.
import * as React from 'react';
import { View, StyleSheet, Image, Text, useWindowDimensions, ActivityIndicator } from 'react-native';
import EducationalContentList from '../components/EducationalContentList'; 
import { useEffect, useState } from 'react';
import Constants from 'expo-constants'; 
import { getTokenAndUserId } from '../helpers/Auth'; 
import { getSocket } from '../helpers/socket'; 
import { Snackbar } from 'react-native-paper'; 
import EducationalContentFormModal from '../components/EducationalContentFormModal'; 

/**
 * Componente principal para a tela inicial.
 * @returns Tela inicial com lista de conteúdos educacionais e funcionalidades associadas.
 */
export function HomeScreen() {
    // Usa a largura e altura da janela para ajuste de layout.
    const { height, width } = useWindowDimensions();
    // URL base da API a partir das constantes do ambiente Expo.
    const url = Constants.manifest2.extra.expoClient.extra.apiUrl;

    // Declaração de estados para gerenciar funcionalidades e dados.
    const [loading, setLoading] = useState(false); // Indica se a tela está em estado de carregamento.
    const [educationalContentData, setEducationalContentData] = useState(null); // Lista de conteúdos educacionais.
    const [educationalContentToEdit, setEducationalContentToEdit] = useState(null); // Conteúdo que está sendo editado.
    const [visible, setVisible] = useState(false); // Controle de visibilidade do Snackbar.
    const [modalVisible, setModalVisible] = useState(false); // Controle de visibilidade do modal.
    const [mode, setMode] = useState(null); // Modo do modal (criar ou editar).
    const [offset, setOffset] = useState(0); // Offset para carregamento paginado de dados.
    const [hasMoreData, setHasMoreData] = useState(true); // Verifica se há mais dados para carregar.

    // Função para ocultar o Snackbar.
    const onDismissSnackBar = () => setVisible(false);

    // Função assíncrona para buscar conteúdos educacionais iniciais.
    const fetchEducationalContents = async (offset) => {
        const { token } = await getTokenAndUserId(); // Obtém o token de autenticação.
        setLoading(true); // Define estado de carregamento como verdadeiro.
        const response = await fetch(`${url}/educationalcontents/${offset}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Adiciona o token ao cabeçalho de autenticação.
            }
        });

        if (response.ok) {
            const data = await response.json(); // Converte a resposta para JSON.
            if (data.length > 0) {
                setEducationalContentData(data); // Atualiza o estado com os dados recebidos.
            }
            setLoading(false); // Define estado de carregamento como falso.
        } else {
            console.error('Não foi possível carregar os conteúdos educacionais!'); // Log de erro em caso de falha.
        }
    };

    // Função para carregar mais conteúdos educacionais (paginação).
    const fetchMoreEducationalContents = async () => {
        const { token } = await getTokenAndUserId(); // Obtém o token de autenticação.
        const updatedOffset = offset + 10; // Calcula o novo offset.
        const response = await fetch(`${url}/educationalcontents/${updatedOffset}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Adiciona o token ao cabeçalho de autenticação.
            }
        });

        if (response.ok) {
            const moreEducationContents = await response.json(); // Converte a resposta para JSON.
            if (moreEducationContents.length === 0) {
                setHasMoreData(false); // Define que não há mais dados para carregar.
                return;
            }
            // Atualiza o estado com os novos conteúdos carregados.
            setEducationalContentData((prevEducationContents) => [...prevEducationContents, ...moreEducationContents]);
            setOffset(updatedOffset); // Atualiza o offset.
        }
    };

    // Hook de efeito para carregar os conteúdos e configurar os eventos de socket.
    useEffect(() => {
        const listenEvent = async () => {
            // Carrega os conteúdos iniciais.
            await fetchEducationalContents(offset);
            const socketIo = getSocket(); // Obtém a instância do socket.

            // Evento para adicionar um novo conteúdo.
            socketIo.on('educationalcontentcreate', (newContent) => {
                setEducationalContentData((prevEducationContents) => [newContent, ...prevEducationContents]);
            });

            // Evento para deletar um conteúdo.
            socketIo.on('educationalcontentdeleted', (contentId) => {
                setEducationalContentData((prevEducationContents) => {
                    if (!prevEducationContents) {
                        return prevEducationContents;
                    }
                    // Filtra o conteúdo deletado da lista.
                    const contents = prevEducationContents.filter((content) => content.id != contentId);
                    setVisible(true); // Exibe o Snackbar de confirmação.
                    return contents;
                });
            });

            // Evento para editar um conteúdo.
            socketIo.on('educationalcontentedit', (updatedContent) => {
                setEducationalContentData((prevEducationContents) => {
                    if (!prevEducationContents) {
                        return prevEducationContents;
                    }
                    // Atualiza o conteúdo editado na lista.
                    const contents = prevEducationContents.map((content) =>
                        content.id === updatedContent.id ? updatedContent : content
                    );
                    return contents;
                });
            });
        };
        listenEvent(); // Chama a função para iniciar o carregamento e os eventos.

        return () => {}; // Retorno de função de limpeza (pode ser útil em implementações futuras).
    }, []);

    return (
        <View style={styles.container}>
            {/* Verifica se a tela está em carregamento. */}
            {!loading ? (
                <>
                    {/* Componente de lista de conteúdos educacionais. */}
                    <EducationalContentList 
                        educationalContents={educationalContentData}
                        setModalVisible={setModalVisible}
                        setMode={setMode}
                        setEducationalContentToEdit={setEducationalContentToEdit}
                        loadMoreData={fetchMoreEducationalContents}
                        hasMoreData={hasMoreData}
                    />
                    {/* Modal para criar/editar conteúdos educacionais. */}
                    <EducationalContentFormModal 
                        modalVisible={modalVisible}
                        setModalVisible={setModalVisible}
                        mode={mode}
                        educationalContentToEdit={educationalContentToEdit}
                    />
                    {/* Snackbar para notificação de exclusão. */}
                    <Snackbar 
                        style={{ width: width - 10, position: 'absolute', bottom: 80 }}
                        visible={visible}
                        duration={2000}
                        onDismiss={onDismissSnackBar}
                    >
                        Conteúdo educacional deletado com sucesso!
                    </Snackbar>
                </>
            ) : (
                // Exibe um indicador de carregamento enquanto a lista é carregada.
                <View>
                    <ActivityIndicator size="large" />
                </View>
            )}
        </View>
    );
}

// Estilização do componente.
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        width: 50,
        height: 50,
    },
});
