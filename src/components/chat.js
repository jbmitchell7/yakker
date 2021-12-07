import React from 'react';
import { View, Platform, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, SystemMessage, Day, InputToolbar } from 'react-native-gifted-chat';
import firebase from 'firebase';
import 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

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
        //points to location of the messages collection in firebase
        this.referenceMessages = firebase.firestore().collection('messages');
    }

    componentDidMount() {
        //import username from user entry on start screen
        const { username } = this.props.route.params;
        this.props.navigation.setOptions({ title: username ? username : "You did not enter a name!" });
        //switch for online versus offline data
        NetInfo.fetch().then(connection => {
            if (connection.isConnected) {
                console.log('online');
                //authentication
                this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
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
            } else {
                console.log('offline');
                //sets to local storage of messages when offline
                this.getMessages();
            }
        });


    }

    componentWillUnmount() {
        this.unsubscribe();
        this.authUnsubscribe();
    }

    //gets changes to messages collection
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
        this.setState({ messages }, () => {
            this.saveMessages();
        });
    };

    //adds new message to collection
    addMessages() {
        const newMessage = this.state.messages[0];
        this.referenceMessages.add({
            _id: newMessage._id,
            text: newMessage.text,
            createdAt: newMessage.createdAt,
            user: newMessage.user,
        })
    }

    //gets messages from local storage
    async getMessages() {
        let messages = '';
        try {
            messages = await AsyncStorage.getItem('messages') || [];
            this.setState({
                messages: JSON.parse(messages)
            });
        } catch (e) {
            console.log(e.message);
        }
    }

    //saves messages to local storage
    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (e) {
            console.log(e.message);
        }
    }

    //deletes messages from local storage
    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
            this.setState({
                messages: []
            });
        } catch (e) {
            console.log(e.message);
        }
    }

    //appends messages to the state on send and calls addMessages()
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }),
            () => {
                this.addMessages();
                this.saveMessages();
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

    //changes date color of chat info
    renderDay(props) {
        return <Day {...props} textStyle={{ color: 'black' }} />
    }

    //renders input toolbar is user is online
    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
        } else {
            return (
                <InputToolbar
                    {...props}
                />
            );
        }
    }

    render() {
        let { color } = this.props.route.params;
        return (
            //sets background color to pink if none is chosen
            <View style={{ flex: 1, backgroundColor: color ? color : '#C373CB' }}>
                <GiftedChat
                    renderInputToolbar={this.renderInputToolbar.bind(this)}
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