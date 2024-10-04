import React, { useState } from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';

const Post = ({ userImage, userName, postDescription, postImage, postTitle, date }) => {
  const { height, width } = useWindowDimensions();
  
  return (
    <View style={styles.postContainer}>
      {/* Informações do usuário */}
      <View style={styles.userInfo}>
        <Image source={{ uri: userImage }} style={styles.userImage} />
        <Text style={styles.userName}>{userName}</Text>
      </View>

      {/* Descrição do post */}
      <Text style={styles.postTitle}>{postTitle}  </Text>
      <Text style={styles.postDescription}>{postDescription}</Text>

      {/* Imagem postada */}
      {postImage ? <Image source={{ uri: postImage }} style={[styles.postImage,{width: width-50, height: height-250}]} /> : null}
      <Text style={styles.date} > {date}</Text>

    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postTitle:{
    fontWeight: 'bold',
    fontSize:20,
  },
  postDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  postImage: {
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Post;