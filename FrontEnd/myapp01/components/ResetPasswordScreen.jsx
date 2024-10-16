
import { Text, SafeAreaView, StyleSheet, StatusBar, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import axios from 'axios';



export default function ResetPasswordScreen( {  navigation } ) {

    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const uri = "http://localhost:8000/api";
    const handlePasswordReset = async () => {
            const trimmedEmail = email.trim()
            const trimmedNewPassword = newPassword.trim()
            const trimmedConfirmPassword = confirmPassword.trim()
            if (!trimmedEmail || !trimmedNewPassword || !trimmedConfirmPassword) {
                Alert.alert('Error', 'Please fill in all fields')
                return
        }

        if (trimmedNewPassword !== trimmedConfirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post(`${uri}/user/change_password/`, { 
                email:trimmedEmail,
                password: trimmedNewPassword,
                password2: trimmedConfirmPassword
             });

            if (response.status === 200) {
                Alert.alert('Success', 'Password changed successfully.');
                navigation.navigate('LoginScreen')
            } else {
                const errorResponse = await response.json();
                Alert.alert('Error', errorResponse.error);
            }
        } catch (error) {
            console.error('Error: ', error.response.data)
            Alert.alert('Network error', 'Please try again later.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Reset Your Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#a6a4a4"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    placeholderTextColor="#a6a4a4"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm New Password"
                    placeholderTextColor="#a6a4a4"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <TouchableOpacity style={styles.resetBtn} onPress={handlePasswordReset}>
                    <Text style={styles.resetBtnTxt}>Reset Password</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingTop: StatusBar.currentHeight + 20,
        justifyContent: 'center',
    },
    contentContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        marginHorizontal: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#343a40',
        marginBottom: 20,
    },
    input: {
        height: 50,
        width: '100%',
        marginBottom: 15,
        borderWidth: 1,
        padding: 10,
        borderColor: '#ced4da',
        borderRadius: 5,
        backgroundColor: '#f8f9fa',
        fontSize: 16,
    },
    resetBtn: {
        backgroundColor: '#007bff',
        alignItems: 'center',
        padding: 15,
        borderRadius: 5,
        marginTop: 10,
        elevation: 2,
        width: '100%',
    },
    resetBtnTxt: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
    },
});
