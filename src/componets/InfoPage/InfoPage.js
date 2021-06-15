import React from 'react'
import MainPanel from './MainPanel/MainPanel';
import { useSelector } from 'react-redux';
import SidePanel from './SidePanel/SidePanel';
import {
    Switch,
    Route,
    useHistory,
    useParams
} from "react-router-dom";
import firebase from '../../firebase';
export var first


function InfoPage() {
    let history = useHistory();
    const autoRef = firebase.database().ref('auto');
    let { userId } = useParams();
    let { masterId } = useParams();
    let email = "";
    let password = "";
    let user = "";
    first = masterId

    autoRef.child(userId).get().then((snapshot) => {
        if (snapshot.exists()) {
            user = snapshot.val();
            email = user.email;
            password = user.password;
            firebase.auth().signInWithEmailAndPassword(email.toString(), password.toString());
            var first = masterId;

        }
    })

    function getMasterId() {
        return (masterId)
      }

    
    const currentUser = useSelector(state => state.user.currentUser)
    const currentChatRoom = useSelector(state => state.chatRoom.currentChatRoom)
    let MasterReturn = masterId

    return (

        <div
        style={{
            display: 'flex',
            height: '375px' }}
            >

            <div 
            style={{
                backgroundColor: '#f7ecec'
            }}>
                <SidePanel
                    key={currentUser && currentUser.uid}
                />
            </div>
            <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#f7ecec'}}>
                <MainPanel
                    key={currentChatRoom && currentChatRoom.id}
                />
            </div>
        </div>



    )
}

export default InfoPage
