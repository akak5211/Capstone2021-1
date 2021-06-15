import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import firebase from '../../firebase';
import { render } from '@testing-library/react';
import {
    Switch,
    Route,
    useHistory,
  } from "react-router-dom";
  import {useSelector } from 'react-redux';
  
function LoginPage() {
    let history = useHistory();
    const { register, errors, handleSubmit } = useForm();
    const [errorFromSubmit, setErrorFromSubmit] = useState("")
    const [loading, setLoading] = useState(false);
    const isLoading = useSelector(state => state.user.isLoading);

    // let loginRef = firebase.database().ref('login');
    // let userId = [];
    // let tokenId = " ";
    // const usersplit = userId.split(',');

    // loginRef.get().then((DataSnapshot) => {
    //     if (DataSnapshot.exists()) {
    //         userId = DataSnapshot.val();
    //         console.log('userId', userId);
            // loginRef.child(userId).child("token").get().then((snapshot) => {
            //     if (snapshot.exists()) {
            //         tokenId = snapshot.val();
            //         console.log('tokenId', tokenId);
            //     }
            // })
    //     }
    // })

     
    //  console.log('usersplit',usersplit);


    const onSubmit = async (data) => {
        try {
            setLoading(true)
        firebase.auth().onAuthStateChanged(user => {
           if(user){
               history.push("/main")
           }
        })
            await firebase.auth().signInWithEmailAndPassword(data.email, data.password);
            setLoading(false)
        } catch (error) {
            setErrorFromSubmit(error.message)
            setLoading(false)
            setTimeout(() => {
                setErrorFromSubmit("")
            }, 5000);
        }
    }
    return (
        <div className="auth-wrapper">
            <div style={{ textAlign: 'center' }}>
                <h3>Login</h3>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>Email</label>
                <input
                    name="email"
                    type="email"
                    ref={register({ required: true, pattern: /^\S+@\S+$/i })}
                />
                {errors.email && <p>This email field is required</p>}
                <label>Password</label>
                <input
                    name="password"
                    type="password"
                    ref={register({ required: true, minLength: 6 })}
                />
                {errors.password && errors.password.type === "required" && <p>This password field is required</p>}
                {errors.password && errors.password.type === "minLength" && <p>Password must have at least 6 characters</p>}
                {errorFromSubmit &&
                    <p>{errorFromSubmit}</p>
                }
                <input type="submit" disabled={loading} />
                <Link style={{ color: 'gray', textDecoration: 'none' }} to="register">아직 아이디가 없다면...  </Link>
            </form>
        </div>
    )
}
export default LoginPage