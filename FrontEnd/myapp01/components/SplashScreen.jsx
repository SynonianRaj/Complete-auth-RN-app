import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ActivityIndicator } from 'react-native';

export default function SplashScreen() {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome</Text>
        <ActivityIndicator size="large" color="#FFF" style={styles.loadingIndicator} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#ff554f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    borderRadius: 15,
  
  },
  title: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
  },
  loadingIndicator: {
    marginTop: 15,
  
  },
});
