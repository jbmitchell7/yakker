import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, ImageBackground } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import bgImage from '../assets/mountain.jpg';

//initializes colors for chat background choices
const colors = {
    grey: '#363732',
    tan: '#FECB7A',
    teal: '#0DD5B2',
    brown: '#B5742A',
    blue: '#5171A5',
}

export default class Start extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            color: ''
        };
    }

    render() {
        return (
            <ImageBackground
                source={bgImage}
                resizeMode='cover'
                style={styles.bgImage}
            >
                <View style={styles.container}>
                    <Text style={styles.nameHeader}>What is Your Name?</Text>
                    <TextInput
                        style={styles.nameInput}
                        onChangeText={(username) => this.setState({ username })}
                        value={this.state.username}
                        placeholder='Enter Name Here'
                    />
                    <Text style={styles.bgHeader}>Choose a Chat Background Color</Text>
                    <View style={styles.colorChooser}>
                        <TouchableOpacity
                            accessible={true}
                            accessibilityLabel="choose teal background"
                            accessibilityHint="choose chat screen background"
                            accessibilityRole="button"
                            onPress={() => this.setState({ color: colors.teal })}
                        >
                            <View style={[styles.colorChoice, styles.color1]}></View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            accessible={true}
                            accessibilityLabel="choose gray background"
                            accessibilityHint="choose chat screen background"
                            accessibilityRole="button"
                            onPress={() => this.setState({ color: colors.grey })}
                        >
                            <View style={[styles.colorChoice, styles.color2]}></View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            accessible={true}
                            accessibilityLabel="choose tan background"
                            accessibilityHint="choose chat screen background"
                            accessibilityRole="button"
                            onPress={() => this.setState({ color: colors.tan })}
                        >
                            <View style={[styles.colorChoice, styles.color3]}></View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            accessible={true}
                            accessibilityLabel="choose brown background"
                            accessibilityHint="choose chat screen background"
                            accessibilityRole="button"
                            onPress={() => this.setState({ color: colors.brown })}
                        >
                            <View style={[styles.colorChoice, styles.color4]}></View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            accessible={true}
                            accessibilityLabel="choose blue background"
                            accessibilityHint="choose chat screen background"
                            accessibilityRole="button"
                            onPress={() => this.setState({ color: colors.blue })}
                        >
                            <View style={[styles.colorChoice, styles.color5]}></View>
                        </TouchableOpacity>
                    </View>
                    <Button
                        style={styles.btn}
                        title="Go to Chat"
                        onPress={() => {
                            this.props.navigation.navigate('Chat', { username: this.state.username, color: this.state.color })
                        }}
                    />
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bgImage: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    nameInput: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: 'white',
        textAlign: 'center',
        marginBottom: 10
    },
    nameHeader: {
        fontSize: 18,
        marginBottom: 15,
    },
    bgHeader: {
        fontSize: 15,
        marginTop: 20,
        marginBottom: 15
    },
    btn: {
        backgroundColor: '#FECB7A',
        borderRadius: 5
    },
    colorChooser: {
        flex: 0.1,
        flexDirection: 'row',
        marginBottom: 20
    },
    colorChoice: {
        width: 40,
        height: 40,
        borderRadius: 40,
        margin: 5
    },
    color1: {
        backgroundColor: colors.teal
    },
    color2: {
        backgroundColor: colors.grey
    },
    color3: {
        backgroundColor: colors.tan
    },
    color4: {
        backgroundColor: colors.brown
    },
    color5: {
        backgroundColor: colors.blue
    },
});