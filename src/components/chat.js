import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';


export default class Chat extends React.Component {
    render() {
        let { username } = this.props.route.params;
        this.props.navigation.setOptions({ title: username })
        return (
            <View style={styles.container}>
                <Text>See Chats Here!</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
});