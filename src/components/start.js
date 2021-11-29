import React from 'react';
import { StyleSheet, View, TextInput, Button } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class Start extends React.Component {
    constructor(props) {
        super(props);
        this.state = { username: '' };
    }

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.nameInput}
                    onChangeText={(username) => this.setState({ username })}
                    value={this.state.username}
                    placeholder='Enter Name Here'
                />
                <View style={styles.colorChooser}>
                    <TouchableOpacity
                        accessible={true}
                        accessibilityLabel="choose teal background"
                        accessibilityHint="choose chat screen background"
                        accessibilityRole="button"
                        onPress={() => { }}
                    >
                        <View style={styles.color1}></View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        accessible={true}
                        accessibilityLabel="choose gray background"
                        accessibilityHint="choose chat screen background"
                        accessibilityRole="button"
                        onPress={() => { }}
                    >
                        <View style={styles.color2}></View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        accessible={true}
                        accessibilityLabel="choose white background"
                        accessibilityHint="choose chat screen background"
                        accessibilityRole="button"
                        onPress={() => { }}
                    >
                        <View style={styles.color3}></View>
                    </TouchableOpacity>
                </View>
                <Button
                    style={styles.btn}
                    title="Go to Chat"
                    onPress={() => {
                        this.props.navigation.navigate('Chat', { username: this.state.username })
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0DD5B2',
        alignItems: 'center',
        justifyContent: 'center'
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
    btn: {
        backgroundColor: '#FECB7A',
        borderRadius: 5
    },
    colorChooser: {
        marginBottom: 10,
        backgroundColor: 'white'
    },
    color1: {
        width: 40,
        height: 40,
        borderRadius: 40,
        backgroundColor: '#0DD5B2'
    },
    color2: {
        width: 40,
        height: 40,
        borderRadius: 40,
        backgroundColor: '#41464D'
    },
    color3: {
        width: 40,
        height: 40,
        borderRadius: 40,
        backgroundColor: 'white'
    },
});