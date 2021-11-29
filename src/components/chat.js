import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class Chat extends React.Component {
    render() {
        let { username, color } = this.props.route.params;
        this.props.navigation.setOptions({ title: username })
        return (
            <View style={{ flex: 1, backgroundColor: color ? color : 'black' }}>
                <Text style={{ color: 'yellow' }}>See Chats Here!</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
});