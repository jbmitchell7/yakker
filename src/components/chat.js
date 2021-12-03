import React from 'react';
import { View, Platform, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, SystemMessage, Day } from 'react-native-gifted-chat';
import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyCe4Dj3FoDfIj_FZmFT1ioPMczcGsVdQ4U",
    authDomain: "yakker-30e6b.firebaseapp.com",
    projectId: "yakker-30e6b",
    storageBucket: "yakker-30e6b.appspot.com",
    messagingSenderId: "358579917269",
    appId: "1:358579917269:web:402506dae8bb4ffb56ed5c"
};

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            uid: null,
        }
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        this.referenceMessages = firebase.firestore().collection('messages');
    }

    componentDidMount() {
        //import username from user entry on start screen
        const { username } = this.props.route.params;
        this.props.navigation.setOptions({ title: username ? username : "You did not enter a name!" });
        //authentication
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
            if (!user) {
                firebase.auth().signInAnonymously();
            }
            this.setState({
                uid: user.uid,
                messages: [],
            });
            //gets messages from db and subscribes to updates
            this.unsubscribe = this.referenceMessages
                .orderBy("createdAt", "desc")
                .onSnapshot(this.onCollectionUpdate);
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
        this.authUnsubscribe();
    }

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: data.user,
            });
        });
        this.setState({ messages });
    };

    addMessages() {
        const newMessage = this.state.messages[0];
        this.referenceMessages.add({
            _id: newMessage._id,
            text: newMessage.text,
            createdAt: newMessage.createdAt,
            user: newMessage.user,
        })
    }

    //appends messages to the state on send
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }),
            () => {
                this.addMessages();
            });

    }

    //changes chat bubble color
    renderBubble(props) {
        return <Bubble {...props} wrapperStyle={{ right: { backgroundColor: '#363732' } }} />
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