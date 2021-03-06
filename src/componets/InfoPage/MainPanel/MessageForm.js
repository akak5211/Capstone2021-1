import React, { useState, useRef, useEffect } from 'react'
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import firebase from "../../../firebase";
import { useSelector } from 'react-redux';
import mime from "mime-types";
import './Button.css';

function MessageForm() {
    const [content, setContent] = useState("")
    const messagesRef = firebase.database().ref("messages")
    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)
    const user = useSelector(state => state.user.currentUser)
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const storageRef = firebase.storage().ref()
    const inputOpenImageRef = useRef()
    const [percentage, setPercentage] = useState(0)
    const isPrivateChatRoom = useSelector(state => state.chatRoom.isPrivateChatRoom)
    const typingRef = firebase.database().ref("typing");

    const handleOpenImageRef = () => {
        inputOpenImageRef.current.click()
    }

    const handleChange = (e) => {
        setContent(e.target.value)
    }

    const createMessage = (fileUrl = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: user.uid,
                name: user.displayName,
                image: user.photoURL
            }
        };

        if (fileUrl !== null) {
            message["image"] = fileUrl;
        } else {
            message["content"] = content;
        }
        console.log('message', message)
        return message;
    };

    const handleKeyDown = event => {
        console.log('event.keyCode', event.keyCode)
        console.log('event.ctrlKey', event.ctrlKey)

        if (event.ctrlKey && event.keyCode === 13) {
            handleSubmit();
        }

        if (content) {
            typingRef
                .child(chatRoom.id)
                .child(user.uid)
                .set(user.displayName);
        } else {
            typingRef
                .child(chatRoom.id)
                .child(user.uid)
                .remove();
        }
    };

    const handleSubmit = async () => {
        console.log('aoiksdo')
        if (!content) {
            setErrors(prev => prev.concat("Type contents first"))
            return;

        }

        setLoading(true);

        try {
            await messagesRef
                .child(chatRoom.id)
                .push()
                .set(createMessage())

            typingRef
                .child(chatRoom.id)
                .child(user.uid)
                .remove();

            setErrors([])
            setContent("")
            setLoading(false)
        } catch (error) {
            console.error(error.message);
            setErrors(prev => prev.concat(error.message))
            setLoading(false)
        }
    };


    const getPath = () => {
        if (isPrivateChatRoom) {
            return `message/private/${chatRoom.id}`;
        } else {
            return "message/public";
        }
    };

    const handleUploadImage = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const filePath = `${getPath()}/${file.name}`;
        const metadata = { contentType: mime.lookup(file.name) };

        setLoading(true)
        // ????????? ?????? ??????????????? ???????????? 
        let uploadTask = storageRef.child(filePath).put(file, metadata)
        // ?????? ???????????? ???????????? ????????? 
        //on ??? 1?????? ??????, ????????? ??????(err) , ????????? ?????? (complete)
        uploadTask.on("state_changed",
            UploadTaskSnapshot => {
                const percentage = Math.round(
                    (UploadTaskSnapshot.bytesTransferred / UploadTaskSnapshot.totalBytes) * 100
                );
                setPercentage(percentage);
            },
            err => {
                setLoading(false)
                console.error(err);
            },
            () => {
                // ????????? ??? ??? ?????? ?????? ????????? ??????
                // ????????? ????????? ???????????? ?????? ??? ?????? URL ????????????
                uploadTask.snapshot.ref.getDownloadURL()
                    .then(downloadURL => {
                        // // message collection??? ?????? ????????? ???????????? 
                        messagesRef
                            .child(chatRoom.id)
                            .push()
                            .set(createMessage(downloadURL))
                        setLoading(false)
                    })
            }
        )

    }

    return (
        <div>
            
            <div className = "textarea-sizing"
            style={{
                width: '100%',
                marginTop:'0.3rem'
            }}>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Control
                        onKeyDown={handleKeyDown}
                        value={content}
                        onChange={handleChange}
                        as="textarea"
                        rows={3}
                    />
                </Form.Group>
            </Form>
            </div>

            {!(percentage === 0 || percentage === 100) &&
                <ProgressBar
                    variant="warning"
                    label={`${percentage}%`}
                    now={percentage} />
            }
            <div>
                {errors.map(errorMsg => 
                <p
                style={{
                    color: 'red',
                    marginBottom: '0'}} key={errorMsg}>{errorMsg}</p>)}
            </div>

            <Row>
                <Col sm={6}
                style ={{
                    textAlign:'center'
                }}>
                    <button onClick={handleSubmit}
                    className = 'gradient-button gradient-button-1'
                        // type="submit"
                        // style={{ 
                        //     width: '30%',
                        //  fontFamily: 'poor story', backgroundColor:'#e4007f', color:'white'}}
                        disabled={loading ? true : false}
                    >
                        SEND
                    </button>
                </Col>
                <Col sm={6}
                style ={{
                    textAlign:'center',
                    
                }}>
                    <button onClick={handleOpenImageRef}
                    className = 'gradient-button gradient-button-1'
                        // type="submit"
                        // style={{ 
                        //     width: '30%',
                        //  fontFamily: 'poor story', backgroundColor:'#e4007f',color:'white'}}
                        disabled={loading ? true : false}
                    >
                        UPLOAD
                     </button>{' '}
                </Col>
            </Row>

            <input
                type="file"
                accept="image/jpeg, image/png"
                ref={inputOpenImageRef}
                style={{ display: "none" }}
                onChange={handleUploadImage}
            />

        </div>
    )
}

export default MessageForm
