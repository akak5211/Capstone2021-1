import React, { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';

import { FaLockOpen } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSelector } from 'react-redux';

import { MdFavorite } from 'react-icons/md';
import { MdFavoriteBorder } from 'react-icons/md';
import firebase from "../../../firebase";
import Media from 'react-bootstrap/Media';

import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import UserPanel from './UserPanel';
import img1 from './ex.png';
import './Button.css';




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
                        width={40}
                        height={40}
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

            const popover = (
                <Popover id="popover-basic"
                style={{
                    fontFamily: 'poor story',
                }}>
                  <Popover.Content>
                  {chatRoom && chatRoom.description}
                  </Popover.Content>
                </Popover>
              );

              const Example = () => (
                <OverlayTrigger trigger="click" placement="right" overlay={popover}>
                  <button
                  style = {{
                      borderColor:'#f7ecec'
                  }}
                  className = 'gradient-button2 gradient-button-2'>
                      Description
                  </button>
                </OverlayTrigger>
              );

            const popover1 = (
                <Popover id="popover-basic"
                style={{
                    fontFamily: 'poor story',
                    
                }}>
                  <Popover.Content>
                  {userPosts && renderUserPosts(userPosts)}
                  </Popover.Content>
                </Popover>
              );

              const Example1 = () => (
                <OverlayTrigger trigger="click" placement="right" overlay={popover1}>
                  <button
                  style = {{
                    borderColor:'#f7ecec',
                    outline: 'none'
                    
                }}
                className = 'gradient-button2 gradient-button-2'
                >Post Counts</button>
                </OverlayTrigger>
              );
              
              
    
    return (
        // <div style={{
        //     width: '100%',
        //     height: '10%',
        //     border: 'solid #bfbbbb',
        //     borderRadius: '10px',
        //     padding: '0.3rem',
        //     marginBottom: '.5rem',
        //     fontFamily: 'poor story',
        //     borderColor: '#a0a0a1'
        // }}>
            <Container
            style = {{
                fontFamily:'poor story'
            }}>
                <Row>
                    <Col sm={1}>
                    <img src={img1}
                    width='50'
                    height='50'/>
                    </Col>
                    <Col>
                        <h5>
                            {
                                isPrivateChatRoom ?
                                    <FaLock style={{ marginBottom: '10px', fontSize: '.8rem', marginLeft: 6, marginTop: 3 }} />
                                    :
                                    <FaLockOpen style={{ marginBottom: '10px', fontSize: '1.2rem', marginLeft: 6, marginTop: 3 }} />
                            }
                            {" "}

                            {chatRoom && chatRoom.name}


                            {!isPrivateChatRoom &&
                                <span style={{ cursor: 'pointer', fontSize: '1.5rem', marginLeft: 3 }} onClick={handleFavorite}>
                                    {
                                        isFavorited ?
                                            <MdFavorite style={{ borderBottom: '10px', fontSize: '1.5rem', marginBottom: 3 }} />
                                            :
                                            <MdFavoriteBorder style={{ borderBottom: '10px', fontSize: '1.5rem', marginBottom: 3 }} />
                                    }
                                </span>
                            }

                        </h5>
                    </Col>
                    <Col sm={4}>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">
                                    <AiOutlineSearch />
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                onChange={handleSearchChange}
                                placeholder="Search Messages"
                                aria-label="Search"
                                aria-describedby="basic-addon1"
                            />
                        </InputGroup>
                    </Col>

                    <Col>
                    {!isPrivateChatRoom &&
                            <div style={{ display: 'flex', }} >
                                <p style={{
                                    fontWeight: 'bold',
                                    marginTop: '5',
                                    fontSize: '10px'
                                }}>
                                    "{chatRoom && chatRoom.name}" room host :
                                        </p>
                                        <p style={{
                                    fontWeight: 'bold',
                                    // marginTop: 5,
                                    fontSize: '10px',
                                    color: '#e4007f',
                                    
                                }}>
                                    <Image style={{width: '15px', height: '15px' }}
                                        src={chatRoom && chatRoom.createdBy.image} roundedCircle />
                                    {chatRoom && chatRoom.createdBy.name}
                                    </p>
                            </div>
                        }
                    </Col>
                </Row>

                <Row
                style ={{
                    marginTop: '3px'
                }}>
                    <Col>
                        <UserPanel>
                        </UserPanel>
                    </Col>

                    <Col>
                        <Example>
                        </Example>
                    </Col>

                    <Col>
                        <Example1>
                        </Example1>
                    </Col>


                </Row>
            </Container>
        // </div>
    )
}

export default MessageHeader
