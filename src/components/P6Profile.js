import React, { useEffect } from "react";
import { fetchAllPicksixPicks, fetchUserStats, getGameById } from "../axios-services";
import "../style/profile.css"
import { showAlert } from "./Alert";

const API_URL = 'https://floating-stream-77094.herokuapp.com/api'

const P6Profile = (props) => {
    const {myWeekly, setMyWeekly, user, weeklyPicks, update, setUserStats, myStats, setMyStats, picksixPicks, setPicksixPicks, myPicksixPicks, setMyPicksixPicks, token, setUpdate, setAlertMessage, users } = props;

    useEffect(() => {
        const getMyPicksixPicks = async () => {
            const allPicksixPicks = await fetchAllPicksixPicks()
            setPicksixPicks(allPicksixPicks)
            if (user.username) {
                const mypicksixpicks = allPicksixPicks.filter(pick => {
                    const myWeeklyPick = weeklyPicks.find(weeklyPick => weeklyPick.username === user.username)
                    if (myWeeklyPick) {
                        setMyWeekly(myWeeklyPick);
                        return myWeeklyPick.id === pick.weeklyid
                    }
                })
                setMyPicksixPicks(mypicksixpicks)
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

        getMyStats();
        getMyPicksixPicks();
    }, [update])

    function showContainers(event) {
        let target = event.target.id
        let picksContainer = document.getElementById("mypicks");
        let editContainer = document.getElementById("editmypicks");
        let picksButton = document.getElementById("lio-mypicks")
        let editButton = document.getElementById("lio-editpicks")

        if (target === "lio-mypicks") {
            editContainer.style.display = "none";
            picksContainer.style.display = "flex";  
            picksButton.style.backgroundColor = "white"
            picksButton.style.color = "black"
            editButton.style.backgroundColor = "black"
            editButton.style.color = "white"
        }

        if (target === "lio-editpicks") {
            editContainer.style.display = "flex";
            picksContainer.style.display = "none";  
            picksButton.style.backgroundColor = "black"
            picksButton.style.color = "white"
            editButton.style.backgroundColor = "white"
            editButton.style.color = "black"
        }
    
        if (target === "lio-stats") {
            editContainer.style.display = "none";
            picksContainer.style.display = "none";  
            picksButton.style.backgroundColor = "black"
            picksButton.style.color = "white"
            editButton.style.backgroundColor = "black"
            editButton.style.color = "white"
        }
    }

    async function deletePicksixPick(pickId) {
        await fetch(`${API_URL}/picksix/deletePicksix/${pickId}`, {
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
        const comparedDate = new Date(new Date(`${game.date}T${game.time}-0500`))        
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

    return (
        <div id="profile-container">
            <div className="buttons-div" id="profileButtons">
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
                                    <th>Results</th>
                                </tr>
                            </thead>
                            <tbody>
                                { user.username && myPicksixPicks.length ? myPicksixPicks.map((pick, idx) => {
                                    return (
                                        <tr key={idx}>
                                            <td key={'pick' + idx}>{pick.text}</td>
                                            <td key={'outcome' + idx}>{pick.outcometext}</td>
                                        </tr>
                                        )
                                }) : user.username ? <tr><td colSpan={5}>You haven't made any picks yet</td></tr> : <tr><td>You must be logged in to see your picks</td></tr>}
                                <tr>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div id="editmypicks">
                    <div className="table">
                        <table className="profile-table">
                            <caption>PARLAY</caption>
                            <tbody>
                                { user.username && myPicksixPicks.length ? myPicksixPicks.map((pick, idx2) => {
                                    checkTime(pick.gameid)
                                    if (pick.picknumber === 1) {
                                        return (
                                                <tr key={idx2}>
                                                    <td>{pick.text}</td>
                                                </tr>
                                            )
                                    }
                                    }) : user.username ? <tr><td>You haven't made a parlay yet</td></tr> : <tr><td>You must be logged in to see your picks</td></tr>}
                                <tr>
                                    <td>
                                        <button className="profile-button" id="parlay1-button" onClick={() => {
                                            const pick = myPicksixPicks.filter(pick => pick.picknumber === 1)
                                            pick.forEach((pick => deletePicksixPick(pick.id)))
                                            }}>DELETE PARLAY</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default P6Profile;