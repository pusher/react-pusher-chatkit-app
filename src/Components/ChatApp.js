import React, { Component } from 'react';
import { ChatManager, TokenProvider } from '@pusher/chatkit';
import Input from './Input';
import MessageList from './MessageList';

class ChatApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            currentRoom: { users: [] },
            messages: [],
            users: []
        }
        this.addMessage = this.addMessage.bind(this);
    }

    componentDidMount() {
        const chatManager = new ChatManager({
            instanceLocator: "INSTANCE LOCATOR",
            userId: this.props.currentId,
            tokenProvider: new TokenProvider({
                url: "TOKEN PROVIDER"
            })
        })

        chatManager
            .connect()
            .then(currentUser => {
                this.setState({
                    currentUser: currentUser,
                })

                return currentUser.createRoom({
                    name: this.state.currentUser.name,
                    private: true,
                    addUserIds: ['Admin']
                    })
                    .then(room => {
                        this.setState({
                            currentRoom: room,
                            users: room.userIds
                        })
                    })
                    .then(room => {
                        currentUser.subscribeToRoom({
                            roomId: this.state.currentRoom.id,
                            messageLimit: 100,
                            hooks: {
                                onNewMessage: message => {
                                    this.setState({
                                        messages: [...this.state.messages, message],
                                    })
                                },
                            }
                        })
                    })
                    .catch(err => {
                        console.log(`Error creating room ${err}`)
                    })
                })
    }


    addMessage(text) {
        console.log(this.state);
        this.state.currentUser.sendMessage({
            text,
            roomId: this.state.currentRoom.id
        })
            .catch(error => console.error('error', error));
    }

    render() {
        return (
            <div>
                <h2 className="header">Hi There! Ask us anything</h2>
                <MessageList messages={this.state.messages} />
                <Input className="input-field" onSubmit={this.addMessage} />
            </div>
        )
    }
}

export default ChatApp;