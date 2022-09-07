import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Register, Login, Picks, Alert, League, Profile, Admin, Home } from './components';
import { fetchAllGames, fetchAllWeeklyPicks, fetchAllPicks, fetchUserStats, fetchAllParlays, fetchAllUsers } from "./axios-services";
import { showAlert } from './components/Alert';
import "./style/index.css";


const App = () => {
    const [games, setGames] = useState([]);
    const [sortedGames, setSortedGames] = useState([])
    const [picks, setPicks] = useState([]);
    const [myPicks, setMyPicks] = useState([]);
    const [parlays, setParlays] = useState([]);
    const [myParlays, setMyParlays] = useState([]);
    const [myWeekly, setMyWeekly] = useState([]);
    const [weeklyPicks, setWeeklyPicks] = useState([])
    const [userStats, setUserStats] = useState([])
    const [myStats, setMyStats] = useState({});
    const [token, setToken] = useState("");
    const [user, setUser] = useState({});
    const [users, setUsers] = useState([])
    const [alertMessage, setAlertMessage] = useState([]);
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        const getAllInitialData = async () => {
            const allGames = await fetchAllGames()
            const allWeeklyPicks = await fetchAllWeeklyPicks()
            const sortedWeeklyPicks = allWeeklyPicks.sort((a,b) => b.totalpoints - a.totalpoints)
            const allPicks = await fetchAllPicks()
            const allStats = await fetchUserStats()
            const sortedAllStats = allStats.sort((a,b) => b.totalpoints - a.totalpoints)
            const allParlays = await fetchAllParlays()
            const sortedGames = [...allGames].sort((a, b) => {
                const adate = new Date(`${a.date}T${a.time}`)
                const bdate = new Date(`${b.date}T${b.time}`)

                return adate - bdate
            })
            const allUsers = await fetchAllUsers()
            setUsers(allUsers)
            setGames(allGames)
            setSortedGames(sortedGames)
            setPicks(allPicks)
            setWeeklyPicks(sortedWeeklyPicks)
            setUserStats(sortedAllStats)
            setParlays(allParlays)

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
        setAlertMessage("You have logged out")
        showAlert()
    }

    function myFunction() {
        let x = document.getElementById("myLinks");
        
        if (x.style.display === "block") {
            x.style.display = "none";
        } else {
            x.style.display = "block";
        }
      }

    return (
        <div className='container'>
            <div className='alert'>
                <Alert alertMessage={alertMessage} />
            </div>
            <div className='header'>
                <Link to="/"><img src={require("./photos/wscLogo.png")} id='logo'></img></Link>
                <nav className='nav'>
                    <Link className="header-link" to="/picks" onClick={() => {setUpdate(!update)}}>PICKS</Link>
                    <Link className="header-link" to='/league' onClick={() => {setUpdate(!update)}}>LEAGUE</Link>
                    { !user.username ? <Link className="header-link" to="/login" onClick={() => {setUpdate(!update)}}>LOGIN</Link> : null }
                    { user.username ? <Link className="header-link" to="/profile" onClick={() => {setUpdate(!update)}}>PROFILE</Link> : null }
                    { user.admin === "true" ? <Link className="header-link" to="/admin" onClick={() => {setUpdate(!update)}}>ADMIN</Link> : null }
                    { user.username ? <Link className="header-link" to="/" onClick={() => {logout()}}>LOGOUT</Link> : null }
                </nav>
                <nav className='mobilenav' id="myLinks">
                    <Link className="header-link" to="/picks" onClick={() => {setUpdate(!update); myFunction()}}>PICKS</Link>
                    <br />
                    <Link className="header-link" to='/league' onClick={() => {setUpdate(!update); myFunction()}}>LEAGUE</Link>
                    <br />
                    { !user.username ? <><Link className="header-link" to="/login" onClick={() => {setUpdate(!update); myFunction()}}>LOGIN</Link><br/></> : null }
                    { user.username ? <><Link className="header-link" to="/profile" onClick={() => {setUpdate(!update); myFunction()}}>PROFILE</Link><br/></> : null }
                    { user.admin === "true" ? <><Link className="header-link" to="/admin" onClick={() => {setUpdate(!update); myFunction()}}>ADMIN</Link><br/></> : null }
                    { user.username ? <><Link className="header-link" to="/" onClick={() => {logout(); myFunction()}}>LOGOUT</Link><br/></> : null }
                </nav>
                <div>
                    <img id="hamburger" onClick={myFunction} src={require("./photos/hamburger-removebg-preview.png")}></img>
                </div>
            </div>
            <Routes>
                <Route exact path="/" element={
                    <Home />
                } />
                <Route exact path="/picks" element={
                    <Picks 
                        games={games} 
                        token={token} 
                        update={update} 
                        setUpdate={setUpdate} 
                        setAlertMessage={setAlertMessage}
                        sortedGames={sortedGames}
                    />
                } />
                <Route exact path="/login" element={
                    <Login 
                        setToken={setToken} 
                        update={update} 
                        setUpdate={setUpdate} 
                        setAlertMessage={setAlertMessage} 
                        setUser={setUser} 
                    />
                } />
                <Route exact path="/register" element={
                    <Register 
                        update={update} 
                        setUpdate={setUpdate} 
                        setAlertMessage={setAlertMessage} 
                    />
                } />
                <Route exact path="/admin" element={<>
                    <Admin 
                        update={update} 
                        setUpdate={setUpdate} 
                        token={token} 
                        setAlertMessage={setAlertMessage} 
                        games={games} 
                        users={users}
                    />
                </>} />
                <Route exact path="/league" element={<>
                    <League 
                        update={update} 
                        setUpdate={setUpdate} 
                        weeklyPicks={weeklyPicks} 
                        picks={picks} 
                        setPicks={setPicks} 
                        setWeeklyPicks={setWeeklyPicks} 
                        userStats={userStats}
                        parlays={parlays}
                    />
                </>} />
                <Route exact path="/profile" element={<>
                    <Profile 
                        update={update} 
                        setUpdate={setUpdate} 
                        myPicks={myPicks} 
                        setMyPicks={setMyPicks} 
                        setMyWeekly={setMyWeekly} 
                        myWeekly={myWeekly} 
                        setPicks={setPicks} 
                        weeklyPicks={weeklyPicks} 
                        user={user} 
                        setAlertMessage={setAlertMessage} 
                        setUserStats={setUserStats} 
                        myStats={myStats} 
                        setMyStats={setMyStats}
                        setParlays={setParlays}
                        myParlays={myParlays}
                        setMyParlays={setMyParlays}
                        token={token}
                        users={users}
                    />
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