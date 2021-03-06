import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Camera from 'expo-camera';
import firebase from 'firebase';
import 'firebase/firestore';

export default class CustomActions extends React.Component {

    //function to let user pick image from device library
    imagePicker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        try {
            //if no media library permissions
            if (status !== "granted") {
                return
            }
            //with media library permissions
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
            }).catch((error) => console.log(error));
            //if operation is cancelled, do nothing
            if (result.cancelled) {
                console.log('cancelled by user');
                return
            }
            //upload image if all conditions pass
            const imageUrl = await this.uploadImageFetch(result.uri);
            this.props.onSend({ image: imageUrl });
        } catch (error) {
            console.log(error.message);
        }
    };

    //function to send photo just taken by user
    takePhoto = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        try {
            //if no camera permissions
            if (status !== "granted") {
                return
            }
            //with camera permissions
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
            }).catch((error) => console.log(error));
            //if operation is cancelled, do nothing
            if (result.cancelled) {
                return
            }
            //upload image if all conditions pass
            const imageUrl = await this.uploadImageFetch(result.uri);
            this.props.onSend({ image: imageUrl });
        } catch (error) {
            console.log(error.message);
        }
    };

    //uploads image to firestore
    uploadImageFetch = async (uri) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });

        const imageNameBefore = uri.split("/");
        const imageName = imageNameBefore[imageNameBefore.length - 1];

        const ref = firebase.storage().ref().child(`images/${imageName}`);

        const snapshot = await ref.put(blob);

        blob.close();

        return await snapshot.ref.getDownloadURL();
    };

    //gets and sends user location
    getLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        try {
            if (status !== "granted") {
                console.log('user permission not granted');
                return
            }
            const result = await Location.getCurrentPositionAsync({}).catch(
                (error) => console.log(error));
            if (!result) {
                console.log('couldnt get user location');
                return
            }
            this.props.onSend({
                location: {
                    longitude: result.coords.longitude,
                    latitude: result.coords.latitude,
                },
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    //handles press of + action button on chat keyboard
    onActionPress = () => {
        const options = ["Choose From Library", "Take Picture", "Send Location", "Cancel"];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        console.log("user wants to pick an image");
                        return this.imagePicker();
                    case 1:
                        console.log("user wants to take a photo");
                        return this.takePhoto();
                    case 2:
                        console.log("user wants to get their location");
                        return this.getLocation();
                }
            }
        );
    };

    render() {
        return (
            <TouchableOpacity
                accessible={true}
                accessibilityLabel={"More Actions"}
                accessibilityHint={"Lets you choose to send an image or geolocation"}
                style={[styles.container]}
                onPress={this.onActionPress}
            >
                <View style={[styles.wrapper, this.props.wrapperStyle]}>
                    <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});

CustomActions.contextTypes = {
    actionSheet: PropTypes.func,
};