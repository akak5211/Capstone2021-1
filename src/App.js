import React, { useEffect } from 'react';
import {
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import LoginPage from './componets/LoginPage/LoginPage';
import RegisterPage from './componets/RegisterPage/RegisterPage';
import VideoPage from './componets/VideoPage/VideoPage';
import InfoPage from './componets/InfoPage/InfoPage';
import firebase from './firebase';
import { useDispatch, useSelector } from 'react-redux';
import {
  setUser,
  clearUser
} from './redux/actions/user_action';
import Loader from "react-loader-spinner";



function App(props) {
  let history = useHistory();
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.user.isLoading);
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      console.log('user', user)
      //로그인이 된 상태
      if (user) {
        // history.push("/");
        dispatch(setUser(user))
      }
       else {
         //history.push("/login");
         dispatch(clearUser())
       }
    })
  }, [])
  if (isLoading) {
    return (
      <div className="auth-wrapper">
         <div style={{ textAlign: 'center' }}>
                
        <div>

          <Loader
            right="50%"
            type="Puff"
            color="#f857a6"
            secondaryColor="#ff5858"
            height="200"
            width="200"
            timeout="5000"



          />  <h3>Loading...</h3> </div>
      </div>
      </div>
    )
  }
  return (
    <Switch>
      <Route exact path="/main/:userId/:masterId" component={VideoPage} />
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/register" component={RegisterPage} />
      <Route exact path="/info/:userId/:masterId" component={InfoPage} />
    </Switch>
  );
}
export default App;