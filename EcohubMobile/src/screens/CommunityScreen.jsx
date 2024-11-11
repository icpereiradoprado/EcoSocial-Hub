// Importa as bibliotecas e componentes necessários.
import * as React from 'react';
import { View, StyleSheet, Image, Text, useWindowDimensions, ActivityIndicator } from 'react-native';
import PostList from '../components/PostList'; // Componente para listar os posts.
import { useEffect, useState } from 'react';
import Constants from 'expo-constants'; // Importa constantes do ambiente Expo.
import { getTokenAndUserId } from '../helpers/Auth'; // Helper para autenticação.
import { getSocket } from '../helpers/socket'; // Helper para gerenciar a conexão com o socket.
import { Snackbar } from 'react-native-paper'; // Componente Snackbar para notificações.
import PostFormModal from '../components/PostFormModal'; // Modal para criar/editar posts.

/**
 * Componente principal para a tela da Comunidade.
 * @returns A tela da comunidade com a lista de posts e funcionalidades de criação/edição.
 */
export function CommunityScreen() {
    // Usa a largura da janela para ajuste de layout.
    const { width } = useWindowDimensions();
    // URL da API a partir das constantes do ambiente Expo.
    const url = Constants.manifest2.extra.expoClient.extra.apiUrl;

    // Estado para gerenciar se a tela está carregando.
    const [loading] = useState(false);
    // Estado para exibir ou ocultar o Snackbar.
    const [visible, setVisible] = useState(false);
    // Estado que gerencia o deslocamento de página de posts (para paginação futura).
    const [offset] = useState(0);
    // Estado para armazenar a lista de posts.
    const [posts, setPosts] = useState(null);
    // Função para ocultar o Snackbar.
    const onDismissSnackBar = () => setVisible(false);
    // Estados para gerenciar a visibilidade do modal e o modo de operação (criar/editar).
    const [modalVisible, setModalVisible] = useState(false);
    const [mode, setMode] = useState(null);
    const [postToEdit, setPostToEdit] = useState(null); // Post que está sendo editado.

    // Função assíncrona para buscar os posts da API.
    const fetchPosts = async () => {
        // Obtém o token de autenticação e o ID do usuário.
        const { token, userId } = await getTokenAndUserId();

        // Realiza uma chamada GET para buscar os posts.
        const response = await fetch(`${url}/posts/${offset}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json", // Define o tipo de conteúdo.
                "Authorization": `Bearer ${token}` // Passa o token de autenticação no cabeçalho.
            }
        });

        if (response.ok) {
            // Se a resposta for bem-sucedida, converte para JSON e atualiza o estado.
            const data = await response.json();
            setPosts(data);
        } else {
            console.error('Não foi possível carregar os posts!');
        }
    };

    // Efeito colateral para carregar posts e configurar eventos de socket.
    useEffect(() => {
        const listenEvent = async () => {
            // Carrega os posts ao montar o componente.
            await fetchPosts();
            // Inicializa o socket para ouvir eventos em tempo real.
            const socketIo = getSocket();

            // Ouve o evento de criação de um novo post.
            socketIo.on('postcreate', (newContent) => {
                setPosts((prevPosts) => [newContent, ...prevPosts]);
            });

            // Ouve o evento de deleção de um post.
            socketIo.on('postdeleted', (contentId) => {
                setPosts((prevPosts) => {
                    if (!prevPosts) {
                        return prevPosts;
                    }
                    // Remove o post deletado da lista e exibe o Snackbar.
                    const contents = prevPosts.filter((content) => content.id !== contentId);
                    setVisible(true);
                    return contents;
                });
            });

            // Ouve o evento de edição de um post.
            socketIo.on('postedit', (updatedPost) => {
                setPosts((prevPosts) => {
                    if (!prevPosts) {
                        return prevPosts;
                    }
                    // Substitui o post na lista se o ID corresponder ao atualizado.
                    const contents = prevPosts.map((content) =>
                        content.id === updatedPost.id ? updatedPost : content
                    );
                    return contents;
                });
            });
        };
        listenEvent();

        // Retorna uma função de limpeza (opcional, mas pode ser útil para remover ouvintes).
        return () => {};
    }, []);

    return (
        <View style={styles.container}>
            {/* Verifica se está carregando, e exibe a lista de posts ou um indicador de carregamento. */}
            {!loading ? (
                <>
                    {/* Componente de lista de posts com funções de abertura de modal. */}
                    <PostList posts={posts} setModalVisible={setModalVisible} setMode={setMode} setPostToEdit={setPostToEdit} />
                    {/* Modal para criar/editar posts. */}
                    <PostFormModal modalVisible={modalVisible} setModalVisible={setModalVisible} mode={mode} postToEdit={postToEdit} />
                    {/* Snackbar para feedback de deleção de post. */}
                    <Snackbar style={{ width: width - 10, position: 'absolute', bottom: 80 }} visible={visible} duration={2000} onDismiss={onDismissSnackBar}>
                        Post deletado com sucesso!
                    </Snackbar>
                </>
            ) : (
                // Indicador de carregamento enquanto a lista está sendo carregada.
                <View>
                    <ActivityIndicator size="large" />
                </View>
            )}
        </View>
    );
}

// Estilização do componente.
const styles = StyleSheet.create({
    logo: {
        marginTop: 10,
        width: 48,
        height: 48,
    },
    criarContent: {
        paddingTop: 13,
    },
    input: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        width: '120%',
        textAlign: 'center',
    }
});
