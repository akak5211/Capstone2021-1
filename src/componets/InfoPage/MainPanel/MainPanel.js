import React, { Component } from 'react'
import MessageHeader from './MessageHeader';
import Message from './Message';
import MessageForm from './MessageForm';
import firebase from "../../../firebase";
import { connect } from "react-redux";
import { setUserPosts } from '../../../redux/actions/chatRoom_action';
import Skeleton from '../../../commons/components/Skeleton';
import ReactPlayer from 'react-player';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export class MainPanel extends Component {

    messagesEnd = React.createRef();

    state = {
        messages: [],
        messageLoading: true,
        messagesRef: firebase.database().ref("messages"),
        searchTerm: "",
        searchResults: [],
        searchLoading: false,
        typingRef: firebase.database().ref("typing"),
        typingUsers: [],
        listenerLists: [],
        connectedRef: firebase.database().ref(".info/connected"),
        currentChatRoomId: "",
        chatRoomRef: firebase.database().ref("chatRooms"),
        videoURL: ""
    }

    componentDidMount() {
        const { chatRoom } = this.props;
        if (chatRoom) {
            this.addMessagesListeners(chatRoom.id);
            this.addTypingListeners(chatRoom.id);
            this.addVideoURL(chatRoom.id);
            this.addCurrentChatroomId(chatRoom.id);
        }
    }

    componentDidUpdate() {
        if (this.messagesEnd) {
            console.log('jjsjsjs')
            this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        }
    }

    componentWillUnmount() {
        this.state.messagesRef.off();
        this.state.connectedRef.off();
        this.removeListeners(this.state.listenerLists);
    }

    removeListeners = listeners => {
        listeners.forEach(listener => {
            listener.ref.child(listener.id).off(listener.event);
        });
    };

    addTypingListeners = (chatRoomId) => {
        let typingUsers = [];
        this.state.typingRef.child(chatRoomId).on("child_added",
            DataSnapshot => {
                if (DataSnapshot.key !== this.props.user.uid) {
                    typingUsers = typingUsers.concat({
                        id: DataSnapshot.key,
                        name: DataSnapshot.val()
                    });
                    this.setState({ typingUsers });
                }
            });
        this.addToListenerLists(chatRoomId, this.state.typingRef, "child_added");

        this.state.typingRef.child(chatRoomId).on("child_removed",
            DataSnapshot => {
                const index = typingUsers.findIndex(user => user.id === DataSnapshot.key);
                if (index !== -1) {
                    typingUsers = typingUsers.filter(user => user.id !== DataSnapshot.key);
                    this.setState({ typingUsers });
                }
            });
        this.addToListenerLists(chatRoomId, this.state.typingRef, "child_removed");

        this.state.connectedRef.on("value", DataSnapshot => {
            //뒤에 this.props.user가 없으면 로그인 했을 때  이 부분이 trigger 될 때 user 값이 undefined 떠서 에러 발생.
            if (DataSnapshot.val() === true && this.props.user) {
                this.state.typingRef
                    .child(chatRoomId)
                    .child(this.props.user.uid)
                    .onDisconnect()
                    .remove(err => {
                        if (err !== null) {
                            console.error(err);
                        }
                    });
            }
        });

    }

    addToListenerLists = (id, ref, event) => {
        const index = this.state.listenerLists.findIndex(listener => {
            return (
                listener.id === id &&
                listener.ref === ref &&
                listener.event === event
            );
        });

        if (index === -1) {
            const newListener = { id, ref, event };
            this.setState({
                listenerLists: this.state.listenerLists.concat(newListener)
            });
        }
    };

    addMessagesListeners = (chatRoomId) => {
        let messagesArray = [];
        this.setState({ messages: [] });
        this.state.messagesRef.child(chatRoomId).on("child_added", DataSnapshot => {
            messagesArray.push(DataSnapshot.val());
            this.setState({
                messages: messagesArray,
                messageLoading: false
            })
            this.userPostsCount(messagesArray);
        });
    }

    addCurrentChatroomId = (chatRoomId) => {
        this.setState({ currentChatRoomId: chatRoomId });
    }

    addVideoURL = (chatRoomId) => {
        this.state.chatRoomRef.child(chatRoomId).child("createdBy").child("video").get().then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                this.setState({ videoURL: snapshot.val() });
            }
            else {
                console.log("No data");
            }
        }).catch((error) => {
            console.error(error);
        });
    }



    userPostsCount = messages => {
        let userPosts = messages.reduce((acc, message) => {
            if (message.user.name in acc) {
                acc[message.user.name].count += 1;
            } else {
                acc[message.user.name] = {
                    image: message.user.image,
                    count: 1
                };
            }
            return acc;
        }, {});
        // console.log('userPosts :', userPosts)
        this.props.dispatch(setUserPosts(userPosts));
    };

    handleSearchChange = event => {
        this.setState(
            {
                searchTerm: event.target.value,
                searchLoading: true
            },
            () => this.handleSearchMessages()
        );
    };

    handleSearchMessages = () => {
        const chatRoomMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, "gi");
        const searchResults = chatRoomMessages.reduce((acc, message) => {
            if (
                (message.content && message.content.match(regex)) ||
                message.user.name.match(regex)
            ) {
                acc.push(message);

            }
            return acc;
        }, []);
        this.setState({ searchResults });
        setTimeout(() => this.setState({ searchLoading: false }), 1000);
    };

    renderMessages = messages =>
        messages.length > 0 &&
        messages.map(message => (
            <Message
                key={message.timestamp}
                message={message}
                user={this.props.user}
            />
        ));

    renderTypingUsers = (typingUsers) =>
        typingUsers.length > 0 &&
        typingUsers.map(user => (
            <span>{user.name}님이 채팅을 입력하고 있습니다...</span>
        ))

    renderMessageSkeleton = (loading) =>
        loading && (
            <>
                {[...Array(10)].map((undefine, i) => (
                    <Skeleton key={i} />
                ))
                }
            </>
        )

    render() {
        const { messages, searchTerm, searchResults, typingUsers, messageLoading, currentChatRoomId, videoURL } = this.state;
        console.log("ChatRoomId", currentChatRoomId);
        console.log("VideoURL", videoURL);
        const URL = videoURL.substring(5);
        const URLsplit = URL.split("/");
        const projectid = URLsplit[0];
        var foldername = URLsplit[1];
        var foldername2 = URLsplit[2];
        const foldername3 = URLsplit[3];
        const filename = URLsplit[4];
        var url = "https://firebasestorage.googleapis.com/v0/b/" + [projectid] + "/o/" + [foldername] + "%2F" + [foldername2] + "%2F" + [foldername3] + "%2F" + [filename] + "?alt=media";
        console.log("Complete URL", url);
        return (
            <div style={{ padding: '0.8rem 0.5rem 0.5rem 0.5rem', fontSize: '.5rem' }}>
                <MessageHeader
                    messages={messages}
                    handleSearchChange={this.handleSearchChange}
                />
                <Row>
                    <Col sm={7}
                    style ={{
                        width: '100%',
                        height: '230px',
                        overflowY: 'auto',
                        border: 'solid #bfbbbb',
                        borderRadius: '20px',
                        padding: '0.3rem',
                        marginTop: '.2rem',
                        marginLeft:'0.8rem'
                    }}>
                        {this.renderMessageSkeleton(messageLoading)}
                        {searchTerm
                            ? this.renderMessages(searchResults)
                            : this.renderMessages(messages)}
                        {this.renderTypingUsers(typingUsers)}
                        <div ref={node => (this.messagesEnd = node)} />
                    </Col>

                    <Col>
                        <MessageForm />
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.currentUser,
        chatRoom: state.chatRoom.currentChatRoom
    };
};

export default connect(mapStateToProps)(MainPanel);