import React from 'react';
import { View, Text } from 'react-native';


export default class Chat extends React.Component {
    render() {
        let { username } = this.props.route.params;
        this.props.navigation.setOptions({ title: username })

        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>See Chats Here!</Text>
            </View>
        )
    }
}