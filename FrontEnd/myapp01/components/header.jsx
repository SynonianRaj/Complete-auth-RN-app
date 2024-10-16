
import React, { useEffect, useState } from 'react';
import { Text, Image, StyleSheet, View, StatusBar, TouchableOpacity } from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto'; // Import the icon library
import axios from 'axios';
import { useAuth } from './AuthContext';

const uri = "http://localhost:8000/api";


export default function Header( {navigation} ) {
  const { getToken } = useAuth();

  const [imgLogo, setImgLogo] = useState('https://cdn.jsdelivr.net/gh/alohe/memojis/png/vibrent_3.png')


  useEffect(() => {
    const fetchProfileImage = async () => {
      const token = await getToken();
      if  (!token) {
        console.log('Token not Found!')
        return;
      }

      try {
        const response = await axios.get(`${uri}/user/upload/profile_image/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log(response.data);
        if (response.data.profile_image) {
          setImgLogo(`${uri}${response.data.profile_image}`);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfileImage();
  }, [uri]); // Adding dependencies if needed

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>App Name</Text>

    
      <View style={styles.smallContainer}>
  
        <TouchableOpacity onPress={() => { /* Navigate to Notifications */ }}>
          <Fontisto name="bell" size={30} color="#333" style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {navigation.navigate('ProfileScreen')}}>
          <Image
            source={{
              uri: imgLogo,
            }}
            style={styles.headerImg}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8', // Light background for contrast
    padding: 15, // Add padding for better spacing
    borderBottomWidth: 1,
    borderBottomColor: '#ddd', // Subtle border for separation
    elevation: 2, // Add shadow for elevation on Android
    shadowColor: '#000', // Add shadow for elevation on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  smallContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0d0d0d',
  },
  headerImg: {
    width: 45,
    height: 45,
    borderRadius: 22.5, // Make it circular
    borderWidth: 2,
    borderColor: '#007BFF', // Use a vibrant border color
    marginLeft: 10, // Add margin for spacing
  },
  icon: {
    marginHorizontal: 10, // Add horizontal margin to the icon
  },
});
