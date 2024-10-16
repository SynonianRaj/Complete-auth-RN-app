import {
  StyleSheet,
  View,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Components Import
import LoginScreen from './components/loginScreen';
import RegisterScreen from './components/RegisterScreen';
import HomeScreen from './components/homeScreen';
import SplashScreen from './components/SplashScreen';
import VerifyEmailScreen from './components/verifyEmailScreen';
import ProfileScreen from './components/ProfileScreen';
import ProfileSetupScreen from './components/profileSetupScreen';
import ResetPasswordScreen from './components/ResetPasswordScreen';

import { AuthProvider, useAuth } from './components/AuthContext'; // Import AuthProvider

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
  );
};

const MainNavigator = () => {
  const { isSignedIn, setIsSignedIn,isLoading } = useAuth();

  // Show SplashScreen while loading
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isSignedIn ? 'HomeScreen' : 'LoginScreen'}
          screenOptions={{
            headerShown: false,
          }}
        >
          {isSignedIn ? (
            <>
              <Stack.Screen name="HomeScreen">
                {props => <HomeScreen {...props}  />}
              </Stack.Screen>
              <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
              <Stack.Screen name="ProfileSetupScreen" component={ProfileSetupScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="LoginScreen">
                {props => <LoginScreen {...props} />}
              </Stack.Screen>
              <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
              <Stack.Screen name="VerifyEmailScreen" component={VerifyEmailScreen} />
              <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 'auto',
    justifyContent: 'center',
  },
});

export default App;
