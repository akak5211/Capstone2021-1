import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container';

import { FaLockOpen } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSelector } from 'react-redux';

import firebase from "../../../firebase";
import Media from 'react-bootstrap/Media';

import * as FaIcons from 'react-icons/fa';
import { IoMdTv } from "react-icons/io";



function MessageHeader({ handleSearchChange }) {
    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)
    const isPrivateChatRoom = useSelector(state => state.chatRoom.isPrivateChatRoom)
    const user = useSelector(state => state.user.currentUser)
    const usersRef = firebase.database().ref("users")
    const [isFavorited, setIsFavorited] = useState(false)
    const userPosts = useSelector(state => state.chatRoom.userPosts)

    useEffect(() => {
        if (chatRoom && user) {
            addFavoriteListener(chatRoom.id, user.uid)
        }
    }, [])

    const addFavoriteListener = (chatRoomId, userId) => {
        usersRef
            .child(userId)
            .child("favorited")
            .once("value")
            .then(data => {
                if (data.val() !== null) {
                    const chatRoomIds = Object.keys(data.val());
                    const isAlreadyFavorited = chatRoomIds.includes(chatRoomId);
                    setIsFavorited(isAlreadyFavorited)
                }
            });
    };

    const handleFavorite = () => {
        if (isFavorited) {
            usersRef
                .child(`${user.uid}/favorited`)
                .child(chatRoom.id)
                .remove(err => {
                    if (err !== null) {
                        console.error(err);
                    }
                });
            setIsFavorited(prev => !prev)
        } else {
            usersRef
                .child(`${user.uid}/favorited`).update({
                    [chatRoom.id]: {
                        name: chatRoom.name,
                        description: chatRoom.description,
                        createdBy: {
                            name: chatRoom.createdBy.name,
                            image: chatRoom.createdBy.image
                        }
                    }
                });
            setIsFavorited(prev => !prev)
        }
    };



    const renderUserPosts = userPosts =>
        Object.entries(userPosts)
            .sort((a, b) => b[1].count - a[1].count)
            .map(([key, val], i) => (
                <Media key={i}>
                    <img
                        style={{ borderRadius: '25px' }}
                        width={20}
                        height={20}
                        className="mr-3"
                        src={val.image}
                        alt={val.name}
                    />
                    <Media.Body>
                        <h6>{key}</h6>
                        <p>
                            {val.count} 개
                        </p>
                    </Media.Body>
                </Media>
            ))

            return (
                <div style={{
                    width: '95%',
                    height: '10%',
                    marginTop: '0.5rem',
                    marginBottom: '0.5rem'
                    
                }}>
                    
                    <Container>
                        <div
                        style ={{
                            fontSize: '1.2rem',
                            fontFamily: 'poor story',
                            fontWeight: 'bold',
                            
                        }}>
                            <IoMdTv 
                            style={{
                                marginRight: '.4rem'
                            }}/>
                            "{chatRoom && chatRoom.name}" 입니다.
                        </div>   
                    </Container>
                </div>
            )
}

export default MessageHeader
