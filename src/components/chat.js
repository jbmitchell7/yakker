import React from 'react';
import { View, Platform, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, SystemMessage, Day } from 'react-native-gifted-chat';

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
        }
    }

    componentDidMount() {
        //import username from user entry on start screen
        let { username } = this.props.route.params;
        this.props.navigation.setOptions({ title: username ? username : "You did not enter a name!" });
        this.setState({
            //dummy messages when opening the chat screen
            messages: [
                {
                    _id: 1,
                    text: 'Hello developer',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                        avatar: 'https://placeimg.com/140/140/any',
                    },
                },
                {
                    _id: 2,
                    text: `${username} has entered the chat`,
                    createdAt: new Date(),
                    system: true,
                },
            ],
        })
    }

    //appends messages to the state on send
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
    }

    //changes chat bubble color
    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#363732'
                    }
                }}
            />
        )
    }

    //customizes system message style when entering the chat
    renderSystemMessage(props) {
        return <SystemMessage {...props} textStyle={{ color: 'black', }} />
    }

    renderDay(props) {
        return <Day {...props} textStyle={{ color: 'black' }} />
    }

    render() {
        let { color } = this.props.route.params;
        return (
            //sets background color to pink if none is chosen
            <View style={{ flex: 1, backgroundColor: color ? color : '#C373CB' }}>
                <GiftedChat
                    renderSystemMessage={this.renderSystemMessage.bind(this)}
                    renderDay={this.renderDay.bind(this)}
                    renderBubble={this.renderBubble.bind(this)}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: 1,
                    }}
                />
                {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            </View>
        )
    }
}

const styles = StyleSheet.create({
});