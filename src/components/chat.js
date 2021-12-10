import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, SystemMessage, Day, InputToolbar } from 'react-native-gifted-chat';
import firebase from 'firebase';
import 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import MapView from 'react-native-maps';

import CustomActions from './customactions';

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
            isConnected: false,
            image: null,
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
                        isConnected: true,
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

    //appends messages to the state on send and calls addMessages() to add to firestore
    onSend = (messages = []) => {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }),
            () => {
                this.addMessages();
                this.saveMessages();
            });

    }

    //adds new message to collection
    addMessages = () => {
        const newMessage = this.state.messages[0];
        this.referenceMessages.add({
            _id: newMessage._id,
            text: newMessage.text,
            createdAt: newMessage.createdAt,
            user: newMessage.user,
        })
    }

    //gets messages from local storage
    getMessages = async () => {
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
    saveMessages = async () => {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (e) {
            console.log(e.message);
        }
    }

    //deletes messages from local storage
    deleteMessages = async () => {
        try {
            await AsyncStorage.removeItem('messages');
            this.setState({
                messages: []
            });
        } catch (e) {
            console.log(e.message);
        }
    }

    //changes chat bubble color
    renderBubble = (props) => {
        return <Bubble {...props} wrapperStyle={{ right: { backgroundColor: '#363732' } }} />
    }

    //customizes system message style when entering the chat
    renderSystemMessage = (props) => {
        return <SystemMessage {...props} textStyle={{ color: 'black', }} />
    }

    //changes date color of chat info
    renderDay = (props) => {
        return <Day {...props} textStyle={{ color: 'black' }} />
    }

    //renders input toolbar is user is online
    renderInputToolbar = (props) => {
        if (this.state.isConnected == false) {
        } else {
            return <InputToolbar {...props} />;
        }
    }

    //renders the + button to add image or location from CustomActions
    renderCustomActions = (props) => {
        return <CustomActions {...props} />
    };

    //renders custom view of user shared location
    renderCustomView = (props) => {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }

    render() {
        let { color } = this.props.route.params;
        return (
            //sets background color to pink if none is chosen
            <View style={{ flex: 1, backgroundColor: color ? color : '#C373CB' }}>
                <GiftedChat
                    renderActions={this.renderCustomActions}
                    renderCustomView={this.renderCustomView}
                    renderInputToolbar={this.renderInputToolbar}
                    renderSystemMessage={this.renderSystemMessage}
                    renderDay={this.renderDay}
                    renderBubble={this.renderBubble}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{
                        _id: this.state.uid,
                    }}
                />
                {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            </View>
        )
    }
}