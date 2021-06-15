import React from 'react'
import Media from 'react-bootstrap/Media';
import moment from 'moment';
import { MdTurnedIn } from 'react-icons/md';
import firebase from "../../../firebase";

function Message({ message, user }) {

    let videoURL = "";
    let URL = "";
    let URLsplit = "";
    let projectid = "";
    let foldername = "";
    let foldername2 = "";
    const chatRoomRef = firebase.database().ref("chatRooms");
    console.log("videoURL",videoURL);

    chatRoomRef.on("child_added",snapshot => {
        if(snapshot.exists()) {
            videoURL = snapshot.child("createdBy").child("video").val();         
            URL = videoURL.substring(5);
            URLsplit = URL.split("/");
            projectid = URLsplit[0];
            foldername = URLsplit[1];
            foldername2 = URLsplit[2];
        }
    })

    const timeFromNow = timestamp => moment(timestamp).fromNow();

    const isImage = message => {
        return message.hasOwnProperty("image") && !message.hasOwnProperty("content");
    }

    const hashtest = (message) => {
        if (message.content.includes("#")) {
            return true;
        }
        else {
            return false;
        }
    }

    const isMessageMine = (message, user) => {
        if (user) {
            return message.user.id === user.uid
        }
    }

    const isMessageLength2 = (message, length) => {
        if (message.content.length > 15) {
            return message.content
        }
    }


    const hashtag = "https://search.shopping.naver.com/search/all?query="+foldername+ ' '+foldername2;

    
    return (

        <Media style={{ backgroundColor: "#f7ecec" }}>
            {isMessageMine(message, user) ?
                <img
                    width={0}
                    height={0}
                />
                : <img
                    style={{
                        borderRadius: '10px',
                        marginTop: '3px',
                        marginLeft: '7px'
                    }}
                    width={20}
                    height={20}
                    className="mr-3"
                    src={message.user.image}
                    alt={message.user.name}
                />
            }

            <Media.Body style={{
                backgroundColor: '#f7ecec'
            }}>
                
                {isMessageMine(message, user) ?
                    <p>
                        <a style={{
                            fontSize: '0px'
                        }}>
                        </a>
                    </p>
                    :
                    <p>
                        <a style={{
                            fontSize: '15px',
                            fontWeight: 'bolder',
                            fontFamily: 'poor story'
                        }}>
                            {message.user.name}
                        </a>
                    </p>
                }

                {isImage(message) ?
                <p>

                    <img style={{
                        width: '240px',
                        height: '200px',
                        backgroundColor: '#d5356d',
                        float: isMessageMine(message, user) && 'right' || 'left'
                    }} alt="이미지" src={message.image} />

                    {isMessageMine(message, user) ?
                                <span style={{
                                    fontSize: '10px',
                                    color: 'black',
                                    float: 'right',
                                    marginTop: '2%',
                                    marginRight: '55%'
                                }}>
                                    {timeFromNow(message.timestamp)}
                                </span>

                                :
                                <span style={{
                                    fontSize: '10px',
                                    color: 'black',
                                    float: 'right',
                                    marginTop: '2%',
                                    marginRight: '20%'
                                }}>
                                    {timeFromNow(message.timestamp)}
                                </span>
                            }
                </p>
                    :
                    hashtest(message) ?
                        //링크 색
                        <p>
                            <a style={{
                                backgroundColor: isMessageMine(message, user) && '#727171' || '#d5356d',
                                borderRadius: '5px',
                                marginBottom: '15px',
                                fontSize: '15px',
                                fontWeight: 'bolder',
                                margin: '-10px 10px 10px 0',
                                padding: '10px 10px 10px 10px',
                                float: isMessageMine(message, user) && 'right' || 'left',
                                color: '#0700c9'


                            }} href={hashtag+' '+ message.content.substring(1)}>{message.content}</a>

                            {isMessageMine(message, user) ?
                                <span style={{
                                    fontSize: '10px',
                                    color: 'black',
                                    float: 'right',
                                    marginTop: '4%',
                                    marginRight: '2%'
                                }}>
                                    {timeFromNow(message.timestamp)}
                                </span>

                                :
                                <span style={{
                                    fontSize: '10px',
                                    color: 'black',
                                    float: 'left',
                                    marginTop: '5%',
                                    marginLeft: '-1%'
                                }}>
                                    {timeFromNow(message.timestamp)}
                                </span>
                            }
                        </p> :

                        //내 채팅, 상대채팅 색 변경
                        <p>
                            <a style={{
                                fontSize: '20px',
                                backgroundColor: isMessageMine(message, user) && "#727171" || "#d5356d",
                                borderRadius: '8px',
                                float: isMessageMine(message, user) && 'right' || 'left',
                                margin: '0 10px 10px 0',
                                padding: '10px 10px 10px 10px',
                                fontFamily: 'poor story',
                                color: 'white'

                            }}>
                                {message.content}
                            </a>

                            {isMessageMine(message, user) ?
                                <span style={{
                                    fontSize: '10px',
                                    color: 'black',
                                    float: 'right',
                                    marginTop: isMessageLength2(message,user) && '0%' || '9%',
                                    marginRight: isMessageLength2(message,user) && '5%' || '2%'
                                }}>
                                    {timeFromNow(message.timestamp)}
                                </span>

                                :
                                
                                <span style={{
                                    fontSize: '10px',
                                    color: 'black',
                                    float: 'left',
                                    marginTop: isMessageLength2(message,user) && '0%' || '10%',
                                    marginLeft: isMessageLength2(message,user) && '3%' ||'0%'
                                }}>
                                    {timeFromNow(message.timestamp)}
                                </span>
                            
                             }
                        </p>
                }
            </Media.Body>
        </Media>
        
    )
}
export default Message