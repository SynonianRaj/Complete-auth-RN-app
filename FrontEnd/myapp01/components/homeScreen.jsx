import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'


import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import Header from './header';
import { useAuth } from './AuthContext';


const removeValue = async () => {
  try {
      await AsyncStorage.removeItem('accessToken');
  } catch (e) {
      console.error(e);
  }
  console.log('Done.');
}

export default function HomeScreen({ navigation }) {
  const { getToken } = useAuth();
  const { setIsSignedIn,logout } = useAuth();
  const logOutClick = async () => {
    try {
      await logout(); // Call the logout method from context
      setIsSignedIn(false)
      navigation.navigate("LoginScreen"); // Navigate to LoginScreen after logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  const uri = "http://localhost:8000/api";
  const showProfileDetails = async () =>{
    const token = await getToken();
    try {
      const response = await fetch(`${uri}/user/profile/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('Profile Data:', data);
      // Handle the profile data
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  }

  return (
    
    <View>
      <Header navigation={navigation} />
      <Text style= {styles.title}>Login Success</Text>
      <TouchableOpacity style = {styles.btnContainer}
      onPress={logOutClick}
      >
        <Text style = {styles.btnText}>Log Out</Text>
      </TouchableOpacity >

      <TouchableOpacity style = {styles.btnContainer}
      onPress={showProfileDetails}>
       <Text style = {styles.btnText}>Show Profile</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({

    title:{
        fontSize:35,
        fontWeight:'bold',
        padding:10,
        color:"#000",
        textAlign:'center',
    },
    btnContainer: {

        marginTop: 25,
        backgroundColor: '#3bceff',
        padding: 10,
        alignSelf: 'center',

    },
    btnText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF'
    },
})