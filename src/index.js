import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Register, Login, InputGames, Games, Alert, League, MyPicks, InputGameResults } from './components';
import { fetchAllGames, fetchAllWeeklyPicks, fetchAllPicks, fetchUserStats } from "./axios-services";


const App = () => {
    const [games, setGames] = useState([]);
    const [picks, setPicks] = useState([]);
    const [myPicks, setMyPicks] = useState([]);
    const [myWeekly, setMyWeekly] = useState([]);
    const [weeklyPicks, setWeeklyPicks] = useState([])
    const [userStats, setUserStats] = useState([])
    const [token, setToken] = useState("");
    const [user, setUser] = useState({});
    const [alertMessage, setAlertMessage] = useState([]);
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        const getAllInitialData = async () => {
            const allGames = await fetchAllGames()
            const allWeeklyPicks = await fetchAllWeeklyPicks()
            const sortedWeeklyPicks = allWeeklyPicks.sort((a,b) => b.totalpoints - a.totalpoints)
            const allPicks = await fetchAllPicks()
            const allStats = await fetchUserStats()
            setGames(allGames)
            setPicks(allPicks)
            setWeeklyPicks(sortedWeeklyPicks)
            setUserStats(allStats)

            if (sessionStorage.getItem('token')) {
                setToken(sessionStorage.getItem('token'))
            }
            if (sessionStorage.getItem('username')) {
                setUser({username: sessionStorage.getItem('username'), admin: sessionStorage.getItem('admin')})
            }
        }    

        getAllInitialData();
    }, [update])

    function logout() {
        sessionStorage.clear();
        setUser({})
        setToken("")
        setUpdate(!update)
    }

    return (
        <div className='container'>
            <div className='alert'>
                <Alert alertMessage={alertMessage} />
            </div>
            <nav>
                <Link to="/" onClick={() => {setUpdate(!update)}}>HOME</Link>
                <Link to="/login" onClick={() => {setUpdate(!update)}}>LOGIN</Link>
                <Link to='/league' onClick={() => {setUpdate(!update)}}>LEAGUE</Link>
                { user.username ? <Link to="/profile" onClick={() => {setUpdate(!update)}}>PROFILE</Link> : null }
                { user.admin === "true" ? <Link to="/admin" onClick={() => {setUpdate(!update)}}>ADMIN</Link> : null }
                { user.username ? <Link to="/" onClick={logout}>LOGOUT</Link> : null }
            </nav>
            <h1>Welcome to Waldo Sports Co!</h1>
            <Routes>
                <Route exact path="/" element={
                    <Games games={games} token={token} update={update} setUpdate={setUpdate} setAlertMessage={setAlertMessage} />
                } />
                <Route exact path="/login" element={
                    <Login setToken={setToken} update={update} setUpdate={setUpdate} setAlertMessage={setAlertMessage} setUser={setUser} />
                } />
                <Route exact path="/register" element={
                    <Register update={update} setUpdate={setUpdate} setAlertMessage={setAlertMessage} />
                } />
                <Route exact path="/admin" element={<>
                    <InputGames update={update} setUpdate={setUpdate} token={token} setAlertMessage={setAlertMessage} />
                    <InputGameResults update={update} setUpdate={setUpdate} token={token} setAlertMessage={setAlertMessage} games={games} />
                </>} />
                <Route exact path="/league" element={<>
                    <League update={update} setUpdate={setUpdate} weeklyPicks={weeklyPicks} picks={picks} setPicks={setPicks} setWeeklyPicks={setWeeklyPicks} userStats={userStats}/>
                </>} />
                <Route exact path="/profile" element={<>
                    <MyPicks update={update} setUpdate={setUpdate} myPicks={myPicks} setMyPicks={setMyPicks} setMyWeekly={setMyWeekly} myWeekly={myWeekly} setPicks={setPicks} weeklyPicks={weeklyPicks} user={user} setAlertMessage={setAlertMessage} />
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