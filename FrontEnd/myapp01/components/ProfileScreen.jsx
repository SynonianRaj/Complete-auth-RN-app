import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { useAuth } from './AuthContext';
import axios from 'axios';

const uri = "http://localhost:8000/api";

const uploadImage = async (imgPath, token) => {
    const fileName = imgPath.split('/').pop();
    const formData = new FormData();
    formData.append('profile_image', {
        uri: imgPath,
        type: 'image/*', // Adjust the type based on your image
        name: fileName
    });

    try {
        const response = await axios.post(`${uri}/user/upload/profile_image/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            },
        });
        Alert.alert('Upload Successful', response.data.message);
    } catch (error) {
        console.error(error);
        Alert.alert('Upload Failed', 'Something went wrong while uploading the image.');
    }
};

export default function ProfileScreen({ navigation }) {
    const { getToken } = useAuth();

    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [profileImage, setProfileImage] = useState('https://reactnative.dev/img/tiny_logo.png');

    const selectImage = () => {
        Alert.alert(
            "Change Profile Picture",
            "Choose an option",
            [
                {
                    text: "Camera",
                    onPress: () => launchCamera({ mediaType: 'photo', cameraType: "front" }, handleImageSelection),
                },
                {
                    text: "Gallery",
                    onPress: () => launchImageLibrary({ mediaType: 'photo' }, handleImageSelection),
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ]
        );
    };

    const handleImageSelection = async (response) => {
        if (response.didCancel) {
            console.log("User cancelled image picker");
            return;
        }
        if (response.error) {
            console.log("ImagePicker Error: ", response.error);
            return;
        }
        if (response.assets) {
            const uri = response.assets[0].uri;
            const token = await getToken();

            try {
                const croppedImage = await ImagePicker.openCropper({
                    path: uri,
                    width: 300,
                    height: 400,
                    freeStyleCropEnabled: true,
                });
                console.log(croppedImage.path)
                setProfileImage(croppedImage.path);

                await uploadImage(croppedImage.path, token);
            } catch (err) {
                console.log("Crop Error: ", err);
            }
        } else {
            console.log("Unexpected response format: ", response);
        }
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            const token = await getToken();
            if (!token) {
                console.error('No token found');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${uri}/user/profile/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log('data -> ', response.data)
                setProfileData(response.data);
                const imgSource = response.data.profile_image
                    ? `${uri}${response.data.profile_image}`
                    : 'https://reactnative.dev/img/tiny_logo.png';

                setProfileImage(imgSource);
            } catch (err) {
                console.error('Error fetching profile data:', err);
                console.err(err.data)
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [getToken]);


    return (
        <SafeAreaView style={styles.container}>
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#3bceff" />
                    <Text style={styles.loadingText}>Loading Details...</Text>
                </View>
            ) : (
                <>

                    <View style={styles.profileCard}>
                        <TouchableOpacity onPress={selectImage}>
                            <Image
                                source={{ uri: profileImage }}
                                style={styles.profileImage}
                            />
                        </TouchableOpacity>
                        <Text style={styles.name}>{profileData?.first_name} {profileData?.last_name}</Text>

                        <Text style={styles.email}>{profileData?.email}</Text>
                    </View>

                    <View style={styles.detailsContainer}>
                        <Text style={styles.detailsTitle}>Profile Details</Text>
                        <Text style={styles.detailItem}>Name: {profileData?.first_name} {profileData?.last_name}</Text>
                        <Text style={styles.detailItem}>Gender: {profileData?.gender}</Text>
                        <Text style={styles.detailItem}>Height: {profileData?.height} Cm</Text>
                        <Text style={styles.detailItem}>Weight: {profileData?.weight} Kg</Text>


                        <Text style={styles.detailItem}>Age: {profileData?.age} Years</Text>

                        <Text style={styles.detailItem}>Location: {profileData?.location}</Text>
                        <Text style={styles.detailItem}>Phone: +91 {profileData?.phone}</Text>
                        <Text style={styles.detailItem}>Bio: {profileData?.bio}</Text>
                    </View>

                    <TouchableOpacity style={styles.button}
                        onPress={() => navigation.navigate("ProfileSetupScreen")}>
                        <Text style={styles.buttonText}>Edit Profile</Text>
                    </TouchableOpacity>
                </>

            )}

        </SafeAreaView>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f0f4f8',
        padding: 20,
    },
    profileCard: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#4a90e2',
        marginBottom: 15,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    email: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
    },
    detailsContainer: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: 20,
    },
    detailsTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#4a90e2',
        marginBottom: 10,
    },
    detailItem: {
        fontSize: 16,
        color: '#444',
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#4a90e2',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
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
    }
});
