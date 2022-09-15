import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Register, Login, Picks, Alert, League, Profile, Admin, Home, Pick6 } from './components';
import { fetchAllGames, fetchAllWeeklyPicks, fetchAllPicks, fetchUserStats, fetchAllParlays, fetchAllUsers, fetchCurrentPot, fetchAllPots } from "./axios-services";
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
    const [currentPot, setCurrentPot] = useState("");
    const [allPots, setAllPots] = useState('');

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
            const allPots = await fetchAllPots()

            if (sortedGames[0]) {
                const currentPot = await fetchCurrentPot(sortedGames[0].week)
                if (currentPot) {
                    setCurrentPot(currentPot.amount)
                }
            }

            if (allPots) {
                let totalPot = 0;
                allPots.forEach((pot) => totalPot += pot.amount)
                setAllPots(totalPot)
            }

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

            if (user.username) {
                const mypicks = allPicks.filter(pick => {
                    const myWeeklyPick = weeklyPicks.find(weeklyPick => weeklyPick.username === user.username)
                    if (myWeeklyPick) {
                        setMyWeekly(myWeeklyPick);
                        return myWeeklyPick.id === pick.weeklyid
                    }
                })
                setMyPicks(mypicks)
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
        let lio = document.getElementById("mobile-liolink")
        
        if (x.style.display === "block") {
            x.style.display = "none";
            lio.style.display = "none"
        } else {
            x.style.display = "block";
        }
      }

    function showGamesNav() {
        let lio = document.getElementById("liolink")
        let pick6 = document.getElementById("pick6link")
        
        if (lio.style.display === "block") {
            lio.style.display = "none"
            pick6.style.display = "none"
        } else {
            lio.style.display = "block"
            pick6.style.display = "block"
        }
    }

    function showGamesMobileNav() {
        let lio = document.getElementById("mobile-liolink")
        let pick6 = document.getElementById("mobile-pick6link")
        
        if (lio.style.display === "block") {
            lio.style.display = "none"
            pick6.style.display = "none"
        } else {
            lio.style.display = "block"
            pick6.style.display = "block"
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
                    <span className="header-link" id="playlink" onClick={showGamesNav}>PLAY</span>
                    <Link className="header-sec-link" to="/picks" id="liolink" onClick={() => {setUpdate(!update); showGamesNav()}}>LOCK IT UP</Link>
                    <Link className='header-sec-link' to='/pick6' id='pick6link' onClick={() => {setUpdate(!update); showGamesNav()}}>PICK 6</Link>
                    <Link className="header-link" to='/league' onClick={() => {setUpdate(!update)}}>LEAGUE</Link>
                    { !user.username ? <Link className="header-link" to="/login" onClick={() => {setUpdate(!update)}}>LOGIN</Link> : null }
                    { user.username ? <Link className="header-link" to="/profile" onClick={() => {setUpdate(!update)}}>PROFILE</Link> : null }
                    { user.admin === "true" ? <Link className="header-link" to="/admin" onClick={() => {setUpdate(!update)}}>ADMIN</Link> : null }
                    { user.username ? <Link className="header-link" to="/" onClick={() => {logout()}}>LOGOUT</Link> : null }
                </nav>
                <nav className='mobilenav' id="myLinks">
                    <span className="header-link" id="playlink" onClick={showGamesMobileNav}>PLAY</span>
                    <br />
                    <Link className="header-sec-link" to="/picks" id="mobile-liolink" onClick={() => {setUpdate(!update); showGamesMobileNav(); myFunction()}}>LOCK IT UP</Link>
                    <Link className='header-sec-link' to='/pick6' id='mobile-pick6link' onClick={() => {setUpdate(!update); showGamesMobileNav(); myFunction()}}>PICK 6</Link>
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
                        myPicks={myPicks}
                        setPicks={setPicks}
                        setMyPicks={setMyPicks}
                        user={user}
                        weeklyPicks={weeklyPicks}
                    />
                } />
                <Route exact path="/pick6" element={
                    <Pick6 
                        games={games} 
                        token={token} 
                        update={update} 
                        setUpdate={setUpdate} 
                        setAlertMessage={setAlertMessage}
                        sortedGames={sortedGames}
                        myPicks={myPicks}
                        setPicks={setPicks}
                        setMyPicks={setMyPicks}
                        user={user}
                        weeklyPicks={weeklyPicks}
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
                        currentPot={currentPot}
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
                        currentPot={currentPot}
                        allPots={allPots}
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