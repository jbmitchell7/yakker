import React from 'react';
import { StyleSheet, Text, ScrollView, TextInput, Button } from 'react-native';

export default class Start extends React.Component {
    constructor(props) {
        super(props);
        this.state = { username: '' };
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={(username) => this.setState({ username })}
                    value={this.state.username}
                    placeholder='Enter Name Here'
                />
                <Button
                    onPress={() => {
                        this.props.navigation.navigate('Chat', { username: this.state.username })
                    }}
                    title="Go to Chat"
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0DD5B2'
    }
});