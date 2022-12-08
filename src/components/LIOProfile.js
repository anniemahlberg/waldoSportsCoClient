import React, { useEffect } from "react";
import { fetchAllParlays, fetchAllPicks, fetchUserStats, getGameById } from "../axios-services";
import "../style/profile.css"
import { showAlert } from "./Alert";

const API_URL = 'https://floating-stream-77094.herokuapp.com/api'

const LIOProfile = (props) => {
    const {myPicks, setMyPicks, myWeekly, setMyWeekly, setPicks, user, weeklyPicks, update, setUserStats, myStats, setMyStats, setParlays, myParlays, setMyParlays, token, setUpdate, setAlertMessage, users } = props;
    let total = 0;
    let parlay1total = 0;

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
        let picksContainer = document.getElementById("mypicks");
        let editContainer = document.getElementById("editmypicks");
        let statsContainer = document.getElementById("mystats");
        let picksButton = document.getElementById("lio-mypicks")
        let editButton = document.getElementById("lio-editpicks")
        let statsButton = document.getElementById("lio-stats")

        if (target === "lio-mypicks") {
            editContainer.style.display = "none";
            statsContainer.style.display = "none";  
            picksContainer.style.display = "flex";  
            picksButton.style.backgroundColor = "white"
            picksButton.style.color = "black"
            editButton.style.backgroundColor = "black"
            editButton.style.color = "white"
            statsButton.style.backgroundColor = "black"
            statsButton.style.color = "white"
        }

        if (target === "lio-editpicks") {
            editContainer.style.display = "flex";
            statsContainer.style.display = "none";  
            picksContainer.style.display = "none";  
            picksButton.style.backgroundColor = "black"
            picksButton.style.color = "white"
            editButton.style.backgroundColor = "white"
            editButton.style.color = "black"
            statsButton.style.backgroundColor = "black"
            statsButton.style.color = "white"
        }
    
        if (target === "lio-stats") {
            editContainer.style.display = "none";
            statsContainer.style.display = "flex";
            picksContainer.style.display = "none";  
            picksButton.style.backgroundColor = "black"
            picksButton.style.color = "white"
            editButton.style.backgroundColor = "black"
            editButton.style.color = "white"
            statsButton.style.backgroundColor = "white"
            statsButton.style.color = "black"
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

        let locksLength = 0;
        for (let i = 0; i < myPicks.length; i++) {
            if (myPicks[i].lock) {
                locksLength++
            }
        }

        if (newlock) {
            locksLength++
        } else {
            locksLength--
        }

        if (locksLength < 3) {
            setAlertMessage("You must have at least 3 picks locked!")
            showAlert()
            document.getElementById(`edit-lock-${index}`).checked = true
            return
        }

        if (locksLength > 7) {
            setAlertMessage("You can only lock up to 7 picks!")
            showAlert()
            document.getElementById(`edit-lock-${index}`).checked = false

            return
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
        let locksLength = 0; 

        for (let i = 0; i < myPicks.length; i++) {
            if (myPicks[i].lock) {
                locksLength++
            }
        }

        if (locksLength < 4) {
            setAlertMessage("3 of your picks must be locked, so add a new lock in order to delete this pick!")
            showAlert()
            return
        }

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
        const comparedDate = new Date(new Date(`${game.date}T${game.time}-0600`))        
        const parlay1button = document.getElementById("parlay1-button")

        if (index !== undefined && currentDate > comparedDate) {
            if (document.getElementById(`edit-button-${index}`)) {
                document.getElementById(`edit-button-${index}`).setAttribute("disabled","true")
                document.getElementById(`delete-button-${index}`).setAttribute("disabled", "true")
            }
        }
        
        if (index === undefined && parlay1button && currentDate > comparedDate) {
            parlay1button.setAttribute("disabled", "true")
        }
    }

    function updateParlayTotal() {
        const parlay1 = myParlays.filter(parlay => parlay.parlaynumber === 1)
        let onepointswon = 0;
        let onepointslost = 0;
        let oneparlayshit = 0;
        let onetbd = false

        if (parlay1.length === 2) {
            onepointswon = 4
            onepointslost = -2
        } else if (parlay1.length === 3) {
            onepointswon = 10
            onepointslost = -3
        } else if (parlay1.length === 4) {
            onepointswon = 20
            onepointslost = -4
        } else if (parlay1.length === 5) {
            onepointswon = 30
            onepointslost = -5
        } else if (parlay1.length === 6) {
            onepointswon = 60
            onepointslost = -6
        }

        parlay1.forEach((parlay) => {
            if (!parlay.statsupdated) {
                onetbd = true
                return
            } else if (parlay.result === "HIT") {
                oneparlayshit++
            }
        })

        if (oneparlayshit === parlay1.length && !onetbd) {
            parlay1total = onepointswon
        } else if (!onetbd) {
            parlay1total = onepointslost
        } else {
            parlay1total = 0;
        }
        
    }

    return (
        <div id="profile-container">
            <div className="buttons-div" id="profileButtons">
                <span className="buttons" id="lio-stats" onClick={showContainers}>MY STATS</span>
                <span className="buttons" id="lio-mypicks" onClick={showContainers}>MY PICKS</span>
                <span className="buttons" id="lio-editpicks" onClick={showContainers}>EDIT MY PICKS</span>
            </div>
            <div id="profile-lio-container">
                <div id='mypicks'>
                    <div className="table">
                        <table className="profile-table" id="picks-table">
                            <caption>PICKS</caption>
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
                                }) : user.username ? <tr><td colSpan={5}>You haven't made any picks yet</td></tr> : <tr><td>You must be logged in to see your picks</td></tr>}
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <th>Total Points</th>
                                    <td>{total}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="table">
                        <table className="profile-table" id="parlay-table">
                            <caption>PARLAY</caption>
                            <thead>
                                <tr>
                                    <th>Pick</th>
                                    <th>Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                { myParlays.filter(parlay => parlay.parlaynumber === 1).length ? 
                                    <>
                                        {myParlays.map((parlay, index) => {
                                            updateParlayTotal()
                                            if (parlay.parlaynumber === 1) {
                                                return (
                                                    <tr key={index}>
                                                        <td>{parlay.text}</td>
                                                        <td>{parlay.result}</td>
                                                    </tr>
                                                )
                                            }
                                        })}
                                        <tr>
                                            <th>Points Awarded</th>
                                            <td>{parlay1total}</td>
                                        </tr>
                                    </>
                                : <tr><td colSpan={2}>You have not made a parlay yet!</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div id="editmypicks">
                    <div className="table">
                        <table className="profile-table">
                            <caption>PICKS</caption>
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
                                                <td><button className="profile-button" id={`edit-button-${idx1}`} onClick={() => {editPick(idx1, pick.id, pick.worth)}}>EDIT</button></td>
                                                <td><button className="profile-button" id={`delete-button-${idx1}`} onClick={() => {deletePick(pick.id)}}>DELETE</button></td>
                                            </tr>
                                            )
                                    }) : user.username ? <tr><td colSpan={3}>You haven't made any picks yet</td></tr> : <tr><td colSpan={3}>You must be logged in to see your picks</td></tr>}
                            </tbody>
                        </table>
                    </div>
                    <div className="table">
                        <table className="profile-table">
                            <caption>PARLAY</caption>
                            <tbody>
                                { user.username && myParlays.length ? myParlays.map((parlay, idx2) => {
                                    checkTime(parlay.gameid)
                                    if (parlay.parlaynumber === 1) {
                                        return (
                                                <tr key={idx2}>
                                                    <td>{parlay.text}</td>
                                                </tr>
                                            )
                                    }
                                    }) : user.username ? <tr><td>You haven't made a parlay yet</td></tr> : <tr><td>You must be logged in to see your picks</td></tr>}
                                <tr>
                                    <td>
                                        <button className="profile-button" id="parlay1-button" onClick={() => {
                                            const parlay1 = myParlays.filter(parlay => parlay.parlaynumber === 1)
                                            parlay1.forEach((parlay => deleteParlay(parlay.id)))
                                            }}>DELETE PARLAY</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div id='mystats'>
                    <div className="table">
                        <table className="profile-table">
                            <caption>SEASON STATS</caption>
                            <thead>
                                <tr>
                                    <th>Bet Record</th>
                                    <th>Lock Record</th>
                                    <th>Parlay Record</th>
                                    <th>Total Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                { user.username && myStats ? 
                                    <tr>
                                        <td>{myStats.betscorrect}/{myStats.totalbets}</td>
                                        <td>{myStats.lockscorrect}/{myStats.totallocks}</td>
                                        <td>{myStats.parlayscorrect}/{myStats.totalparlays}</td>
                                        <td>{myStats.totalpoints}</td>
                                    </tr>
                                : <tr><td>No stats to display</td></tr>}
                            </tbody>
                        </table>
                    </div>
                    <div className="table">
                        <table className="profile-table">
                            <caption>WEEKLY STATS</caption>
                            <thead>
                                <tr>
                                    <th>Bet Record</th>
                                    <th>Lock Record</th>
                                    <th>Parlay Record</th>
                                    <th>Total Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                { user.username && myWeekly ? 
                                        <tr>
                                            <td>{myWeekly.betscorrect}/{myWeekly.totalbets}</td>
                                            <td>{myWeekly.lockscorrect}/{myWeekly.totallocks}</td>
                                            <td>{myWeekly.parlayscorrect}/{myWeekly.totalparlays}</td>
                                            <td>{myWeekly.totalpoints}</td>
                                        </tr>
                                : user.username ? <tr><td>You do not have any stats yet to show</td></tr> : <tr><td>You must be logged in to see your stats</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LIOProfile;