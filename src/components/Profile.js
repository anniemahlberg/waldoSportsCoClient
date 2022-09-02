import { useEffect } from "react";
import { fetchAllParlays, fetchAllPicks, fetchUserStats, getGameById } from "../axios-services";
import "../style/profile.css"
import { showAlert } from "./Alert";

const API_URL = 'https://floating-stream-77094.herokuapp.com/api'

const Profile = (props) => {
    const {myPicks, setMyPicks, myWeekly, setMyWeekly, setPicks, user, weeklyPicks, update, setUserStats, myStats, setMyStats, setParlays, myParlays, setMyParlays, token, setUpdate, setAlertMessage } = props;
    let total = 0;

    useEffect(() => {
        const getMyPicks = async () => {
            const allPicks = await fetchAllPicks()
            setPicks(allPicks)
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

        const getMyParlays = async () => {
            const allParlays = await fetchAllParlays()
            setParlays(allParlays)
            if (user.username) {
                const myparlays = allParlays.filter(parlay => {
                    const myWeeklyPick = weeklyPicks.find(weeklyPick => weeklyPick.username === user.username)
                    if (myWeeklyPick) {
                        setMyWeekly(myWeeklyPick);
                        return myWeeklyPick.id === parlay.weeklyid
                    }
                })
                setMyParlays(myparlays)
            }

        }

        const getMyStats = async () => {
            const allStats = await fetchUserStats()
            setUserStats(allStats)
            if (user.username) {
                const mystats = allStats.find(stat => {
                    return stat.username === user.username
                })

                setMyStats(mystats)
            }
        }

        getMyPicks();
        getMyStats();
        getMyParlays();
    }, [update])

    function showContainers(event) {
        let target = event.target.id
        let seasonStatsContainer = document.getElementById("myseasonstats");
        let statsContainer = document.getElementById("myweeklystats");
        let picksContainer = document.getElementById("mypicks");
        let editPicksContainer = document.getElementById("editmypicks");
        let editParlaysContainer = document.getElementById("editmyparlays");

        if (target === "season-stats") {
            statsContainer.style.display = "none";
            picksContainer.style.display = "none";  
            seasonStatsContainer.style.display = "initial";  
            editPicksContainer.style.display = "none";
            editParlaysContainer.style.display = "none";
        }

        if (target === "stats") {
            statsContainer.style.display = "initial";
            picksContainer.style.display = "none";  
            seasonStatsContainer.style.display = "none";  
            editPicksContainer.style.display = "none";
            editParlaysContainer.style.display = "none";

        }
    
        if (target === "picks") {
            statsContainer.style.display = "none";
            picksContainer.style.display = "initial";  
            seasonStatsContainer.style.display = "none";
            editPicksContainer.style.display = "none";    
            editParlaysContainer.style.display = "none";

        }

        if (target === "edit-mypicks") {
            statsContainer.style.display = "none";
            picksContainer.style.display = "none";  
            seasonStatsContainer.style.display = "none";
            editPicksContainer.style.display = "initial";  
            editParlaysContainer.style.display = "none";
  
        }

        if (target === "edit-myparlays") {
            statsContainer.style.display = "none";
            picksContainer.style.display = "none";  
            seasonStatsContainer.style.display = "none";
            editPicksContainer.style.display = "none";  
            editParlaysContainer.style.display = "initial";
  
        }
    }

    async function editPick(index, pickId, worth) {
        const lock = document.getElementById(`edit-lock-${index}`).checked
        let newlock = undefined
        if (lock) {
            newlock = true
        } else {
            newlock = false
        }

        let newworth = undefined;
        if (lock && worth === 2) {
            newworth = 7
        } else if (lock && worth === 1) {
            newworth = 5
        } else if (!lock && worth === 7) {
            newworth = 2
        } else if (!lock && worth === 5) {
            newworth = 1
        }

        await fetch(`${API_URL}/picks/pick/id/updatePick/${pickId}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                lock: newlock,
                worth: newworth
            })
        }).then(response => response.json())
        .then(result => {
            setAlertMessage("You have updated your pick!")
            showAlert()
            setUpdate(!update)
        })
        .catch(console.error)         
    }

    async function deletePick(pickId) {
        await fetch(`${API_URL}/picks/deletePick/${pickId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => response.json())
        .then(result => {
            setAlertMessage("You have deleted your pick!")
            showAlert()
            setUpdate(!update)
        })
        .catch(console.error)         
    }

    async function deleteParlay(parlayId) {
        await fetch(`${API_URL}/parlays/deleteParlay/${parlayId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => response.json())
        .then(result => {
            setAlertMessage(result.message)
            showAlert()
            setUpdate(!update)
        })
        .catch(console.error)         
    }

    async function checkTime(gameid, index) {
        const game = await getGameById(gameid);
        const currentDate = new Date()
        const comparedDate = new Date(new Date(`${game.date} ${game.time}`).toLocaleString('en-US', {
            timeZone: 'America/Chicago'
        }))        
        const parlay1button = document.getElementById("parlay1-button")
        const parlay2button = document.getElementById("parlays2-button")

        if (index !== undefined && currentDate > comparedDate) {
            if (document.getElementById(`edit-button-${index}`)) {
                document.getElementById(`edit-button-${index}`).setAttribute("disabled","true")
                document.getElementById(`delete-button-${index}`).setAttribute("disabled", "true")
            }
        }
        
        if (index === undefined && parlay1button && currentDate > comparedDate) {
            parlay1button.setAttribute("disabled", "true")
        }

        if (index === undefined && parlay2button && currentDate > comparedDate) {
            parlay2button.setAttribute("disabled", "true")
        }
    }


    return (
        <div id="profile-container">
            <h1>PROFILE</h1>
            <div>
                <span className="buttons" id="season-stats" onClick={showContainers}>MY SEASON STATS</span>
                <span className="buttons" id="stats" onClick={showContainers}>MY WEEKS STATS</span>
                <span className="buttons" id="picks" onClick={showContainers}>MY PICKS</span>
                <span className="buttons" id="edit-mypicks" onClick={showContainers}>EDIT MY PICKS</span>
                <span className="buttons" id="edit-myparlays" onClick={showContainers}>EDIT MY PARLAYS</span>
            </div>
            <br />
            <div id='myseasonstats'>
                <h2>MY SEASON STATS</h2>
                <table>
                    <caption>MY SEASON STATS</caption>
                    <thead>
                        <tr>
                            <th>Bet Record</th>
                            <th>Lock Record</th>
                            <th>Total Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        { user.username && myStats ? 
                            <tr>
                                <td>{myStats.betscorrect}-{myStats.totalbets}</td>
                                <td>{myStats.lockscorrect}-{myStats.totallocks}</td>
                                <td>{myStats.totalpoints}</td>
                            </tr>
                        : <tr><td>No stats to display</td></tr>}
                    </tbody>
                </table>
            </div>
            <div id='myweeklystats'>
                <h2>MY WEEKLY STATS</h2>
                <table>
                    <caption>MY WEEKS STATS</caption>
                    <thead>
                        <tr>
                            <th>Bet Record</th>
                            <th>Lock Record</th>
                            <th>Total Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        { user.username && myWeekly ? 
                                <tr>
                                    <td>{myWeekly.betscorrect}-{myWeekly.totalbets}</td>
                                    <td>{myWeekly.lockscorrect}-{myWeekly.totallocks}</td>
                                    <td>{myWeekly.totalpoints}</td>
                                </tr>
                        : user.username ? <tr><td>You do not have any stats yet to show</td></tr> : <tr><td>You must be logged in to see your stats</td></tr>}
                    </tbody>
                </table>
            </div>
            <div id='mypicks'>
                <h2>MY PICKS</h2>
                { user.username && myPicks.length ? <>
                    <table>
                        <caption>MY PICKS</caption>
                        <thead>
                            <tr>
                                <th>Picks</th>
                                <th>Lock</th>
                                <th>Point Potential</th>
                                <th>Results</th>
                                <th>Points Awarded</th>
                            </tr>
                        </thead>
                        <tbody>
                            { user.username && myPicks.length ? myPicks.map((pick, idx) => {
                                total += pick.pointsawarded
                                return (
                                    <tr key={idx}>
                                        <td key={'pick' + idx}>{pick.text}</td>
                                        <td key={'lock' + idx}>{pick.lock ? "LOCK" : null}</td>
                                        <td key={'points' + idx}>{pick.worth}</td>
                                        <td key={'outcome' + idx}>{pick.outcometext}</td>
                                        <td key={'pointsawarded' + idx}>{pick.outcome === "tbd" ? "tbd" : pick.pointsawarded}</td>
                                    </tr>
                                    )
                            }) : user.username ? <tr><td>You haven't made any picks yet</td></tr> : <tr><td>You must be logged in to see your picks</td></tr>}
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <th>Total Points</th>
                                <td>{total}</td>
                            </tr>
                        </tbody>
                    </table>
                </> : <p>You have not made any picks yet!</p>}
            </div>
            <div id="editmypicks">
                <h2>EDIT MY PICKS</h2>
                { user.username && myPicks.length ? <>
                <table>
                    <caption>My Picks</caption>
                    <thead>
                        <tr>
                            <th>Pick</th>
                            <th>Lock</th>
                            <th>Point Potential</th>
                        </tr>
                    </thead>
                    <tbody>
                        { user.username && myPicks.length ? myPicks.map((pick, idx1) => {
                                checkTime(pick.gameid, idx1)
                                return (
                                    <tr key={idx1}>
                                        <td>{pick.text}</td>
                                        <td>
                                            <input type='checkbox' defaultChecked={pick.lock ? true : false} id={`edit-lock-${idx1}`}></input>
                                        </td>
                                        <td>{pick.worth}</td>
                                        <td><button id={`edit-button-${idx1}`} onClick={() => {editPick(idx1, pick.id, pick.worth)}}>EDIT</button></td>
                                        <td><button id={`delete-button-${idx1}`} onClick={() => {deletePick(pick.id)}}>DELETE</button></td>
                                    </tr>
                                    )
                            }) : user.username ? <tr><td>You haven't made any picks yet</td></tr> : <tr><td>You must be logged in to see your picks</td></tr>}
                    </tbody>
                </table>
                </> : <p>You have not makde any picks!</p>
                }
            </div>
            <div id='editmyparlays'>
                <h2>EDIT MY PARLAYS</h2>
                { user.username && myParlays.length ? <>
                    { myParlays.filter(parlay => parlay.parlaynumber === 1).length ? <>
                        <table>
                            <caption>Parlay 1</caption>
                            <thead>
                                <tr>
                                    <th>Pick</th>
                                    <th>Pick</th>
                                    <th>Pick</th>
                                    <th>Pick</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                { user.username && myParlays.length ? myParlays.map((parlay, idx2) => {
                                    checkTime(parlay.gameid)
                                    if (parlay.parlaynumber === 1) {
                                        return (
                                                <td key={idx2}>{parlay.text}</td>
                                            )
                                    }
                                    }) : user.username ? <td>You haven't made any picks yet</td> : <td>You must be logged in to see your picks</td>}
                                </tr>
                            </tbody>
                        </table>
                        <button id="parlay1-button" onClick={() => {
                            const parlay1 = myParlays.filter(parlay => parlay.parlaynumber === 1)
                            parlay1.forEach((parlay => deleteParlay(parlay.id)))
                            }}>DELETE PARLAY</button>
                    </> : null}
                    { myParlays.filter(parlay => parlay.parlaynumber === 2).length ? <>
                        <table>
                            <caption>Parlay 2</caption>
                            <thead>
                                <tr>
                                    <th>Pick</th>
                                    <th>Pick</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                { user.username && myParlays.length ? myParlays.map((parlay, idx3) => {
                                    if (parlay.parlaynumber === 2) {
                                        return (
                                                <td key={idx3}>{parlay.text}</td>
                                            )
                                    }
                                    }) : user.username ? <td>You haven't made any picks yet</td> : <td>You must be logged in to see your picks</td>}
                                </tr>
                            </tbody>
                        </table>
                        <button id="parlay2-button" onClick={() => {
                            const parlay2 = myParlays.filter(parlay => parlay.parlaynumber === 2)
                            parlay2.forEach((parlay => deleteParlay(parlay.id)))
                            }}>DELETE PARLAY</button>
                    </> : null}
                </> : <p>You have not made any parlays!</p> }
            </div>
        </div>
    )
}

export default Profile;