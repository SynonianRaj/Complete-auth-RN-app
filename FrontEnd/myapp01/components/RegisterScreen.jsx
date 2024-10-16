import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

export default function RegisterScreen({ navigation }) {
  const { saveToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setCofirmPassword] = useState('')
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const uri = "http://localhost:8000/api";

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both fields.");
      return;
    }
    setLoading(true)
    console.log(email)
    console.log(password)
    console.log(confirmPassword)
    try {
      const response = await axios.post(`${uri}/register/`, {
        email: email.toLowerCase(),
        password: password,
        password2: confirmPassword
      });

      console.log(response.data);
 
      navigation.navigate('VerifyEmailScreen', { 'email': email.toLowerCase() })
    } catch (error) {
      console.error(error);
      Alert.alert("Login Failed", errorMessage + uri);
    } finally {
      setLoading(false); // Stop loading
    }
  };


  return (
    <SafeAreaView style={styles.mainContainer}>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#3bceff" />
          <Text style={styles.loadingText}>Checking your credentials...</Text>
        </View>
      ) : (
        <>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subTitle}>Create your account to continue</Text>
          </View>
          <Image
            style={styles.logo}
            source={{
              uri: 'https://reactnative.dev/img/tiny_logo.png',
            }}
          />

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              autoCapitalize='none'
              placeholder="Email"
              placeholderTextColor="#a6a4a4"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              accessibilityLabel="Email input"
            />

            <TextInput
              secureTextEntry={true}
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#a6a4a4"
              value={password}
              onChangeText={setPassword}
              accessibilityLabel="Password input"
            />

            <TextInput
              secureTextEntry={true}
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#a6a4a4"
              value={confirmPassword}
              onChangeText={setCofirmPassword}
              accessibilityLabel="Password input"
            />

            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.signUpBtn}
              onPress={handleSignUp}
              accessibilityLabel="Sign Up button"
            >
              <Text style={styles.signUpBtnText}>Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.txtContainer}>
              <Text style={styles.loginLabel}>Already have an account?</Text>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.loginBtn}
                onPress={() => navigation.navigate('LoginScreen')} // Assuming you have a Login screen
                accessibilityLabel="Login button"
              >
                <Text style={styles.loginBtnTxt}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: StatusBar.currentHeight + 10,
    justifyContent: 'center',
  },

  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#000",
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#343a40',
  },
  subTitle: {
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  input: {
    height: 50,
    marginBottom: 15,
    borderWidth: 1,
    padding: 10,
    borderColor: '#ced4da',
    fontSize: 16,
    borderRadius: 5,
    backgroundColor: '#f8f9fa',
    color: '#0d0d0d',
  },
  signUpBtn: {
    backgroundColor: '#007bff',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
    elevation: 2,
  },
  signUpBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  txtContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  loginLabel: {
    fontSize: 16,
    color: '#6c757d',
  },
  loginBtnTxt: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
  loginBtn: {
    paddingHorizontal: 8,
  },
});
