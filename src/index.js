import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Register, Login, InputGames, Games, Alert, AllPicks, MyPicks, InputGameResults } from './components';
import { showAlert } from './components/Alert';
import { fetchAllGames, fetchAllPicks, fetchAllWeeklyPicks } from "./axios-services";


const App = () => {
    const [games, setGames] = useState([]);
    const [picks, setPicks] = useState([]);
    const [myPicks, setMyPicks] = useState([]);
    const [weeklyPicks, setWeeklyPicks] = useState([])
    const [token, setToken] = useState([]);
    const [user, setUser] = useState({});
    const [alertMessage, setAlertMessage] = useState([]);
    const isMounted = useRef(false);

    useEffect(() => {
        if (isMounted.current) {
            showAlert()
        } else {
            isMounted.current = true;
        }}, [alertMessage]);

    useEffect(() => {
        const getAllInitialData = async () => {
            const allGames = await fetchAllGames()
            const allWeeklyPicks = await fetchAllWeeklyPicks()
            setGames(allGames)
            setWeeklyPicks(allWeeklyPicks)
        }    

        getAllInitialData();
    }, [])

    return (
        <div className='container'>
            <div className='alert'>
                <Alert alertMessage={alertMessage} />
            </div>
            <nav>
                <Link to="/">HOME</Link>
                <Link to="/login">LOGIN</Link>
                <Link to="/admin">ADMIN</Link>
                <Link to='/picks'>MY PICKS</Link>
            </nav>
            <h1>Welcome to Waldo Sports Co!</h1>
            <Routes>
                <Route exact path="/" element={
                    <Games games={games} token={token} setAlertMessage={setAlertMessage} />
                } />
                <Route exact path="/login" element={
                    <Login setToken={setToken} setAlertMessage={setAlertMessage} setUser={setUser} />
                } />
                <Route exact path="/register" element={
                    <Register setAlertMessage={setAlertMessage} />
                } />
                <Route exact path="/admin" element={<>
                    <InputGames token={token} setAlertMessage={setAlertMessage} />
                    <InputGameResults token={token} setAlertMessage={setAlertMessage} games={games} />
                </>} />
                <Route exact path="/picks" element={<>
                    <AllPicks weeklyPicks={weeklyPicks} picks={picks} setPicks={setPicks} setWeeklyPicks={setWeeklyPicks} />
                    <MyPicks myPicks={myPicks} setMyPicks={setMyPicks} setPicks={setPicks} weeklyPicks={weeklyPicks} user={user} setAlertMessage={setAlertMessage} />
                </>} />
            </Routes>
        </div>
    )
}

const appElement = document.getElementById('app');
const root = ReactDOM.createRoot(appElement);
root.render(  
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
  );