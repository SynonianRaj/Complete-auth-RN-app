import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, ScrollView, KeyboardAvoidingView} from 'react-native';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from './AuthContext';


function calculateAge(birthDate) {
    const birth = new Date(birthDate);
    const today = new Date();
    
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    // Adjust age if the birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}


const ProfileSetupScreen = ({ navigation }) => {
    const { getToken } = useAuth();

    const gender_choices = ["Male", "Female", "Other", "Prefer not to say"];

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [dateOfBirthString, setDateOfBirthString] = useState('');
    const [gender, setGender] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    
    const uri = "http://localhost:8000/api";
    const handleSubmit = async () => {
        if (!firstName || !lastName || !dateOfBirthString || !height || !weight || !phone || !gender) {
            Alert.alert("Error", "Please fill in all fields.");
            console.log(firstName)
            console.log(lastName)
            console.log(dateOfBirthString)
            console.log(age)
            console.log(height)
            console.log(weight)
            console.log(phone)
            console.log('gender -> ',gender)
            return;
        }
  

        setLoading(true);
        const age = calculateAge(dateOfBirthString)

        const token = await getToken();
        try {
            const response = await axios.post(`${uri}/user/save_profile/`, {
                first_name: firstName,
                last_name: lastName,
                gender:  gender,
                date_of_birth: dateOfBirthString,
                age: parseInt(age, 10),
                height: parseInt(height, 10),
                weight: parseInt(weight, 10),
                phone: parseInt(phone, 10),
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                Alert.alert("Success", "Profile updated successfully!");
                navigation.navigate("HomeScreen");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const showDatePicker = () => {
        setShowPicker(true);
    };

    const onDateChange = (event, selectedDate) => {
        if (event.type === 'dismissed') {
            setDateOfBirthString('');
            setShowPicker(false);
            return;
        }

        const currentDate = selectedDate || dateOfBirth;
        setShowPicker(false);
        setDateOfBirth(currentDate);
        const formattedDate = currentDate.toISOString().split('T')[0];
        setDateOfBirthString(formattedDate);
    };

    return (
        <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>

        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <Text style={styles.header}>Profile Setup</Text>
            <Text style={styles.tagline}>Tell us about yourself to help us serve you better!</Text>
            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
            />


            <View style={[styles.input, {padding: 0, justifyContent: 'center', }]}>
                    <Picker
                    selectedValue={gender}
                    onValueChange={(itemValue) => setGender(itemValue)}
                    style={styles.picker}
                    >
                    <Picker.Item label="Select gender" value="" 
                     style=  {{color: '#aaa', fontSize:15}} enabled = {false}/>

                    {gender_choices.map((choice) => (
                        <Picker.Item label={choice} value={choice} key={choice} />
                    ))}
                    </Picker>
            </View>


            <TextInput
                style={styles.input}
                placeholder="Date of Birth"
                value={dateOfBirthString}
                onFocus={showDatePicker}
                editable={null}
            />
            {showPicker && (
                <DateTimePicker
                    value={dateOfBirth}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}
    
            <TextInput
                style={styles.input}
                placeholder="Height (cm)"
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
            />
            <TextInput
                style={styles.input}
                placeholder="Weight (kg)"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
            />
            <TextInput
                style={styles.input}
                placeholder="Phone"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                maxLength={10}
            />
            <Button
                title={loading ? "Saving..." : "Save Profile"}
                onPress={handleSubmit}
                disabled={loading}
                color="#4CAF50"
            />
        </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        flexGrow:1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#333',
    },
    tagline: {
        fontSize: 16,
        textAlign: 'center',
        color: '#777',
        marginBottom: 20,
    },
    input: {
        height: 60,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3, // For Android shadow
    },

    picker:{
        height: '100%',
        width: '100%',
    },
});

export default ProfileSetupScreen;
