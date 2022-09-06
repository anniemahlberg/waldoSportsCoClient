import "../style/league.css"
import React from "react"

const League = (props) => {
    const { weeklyPicks, picks, userStats, parlays } = props;

    function showContainers(event) {
        let target = event.target.id
        let statsContainer = document.getElementById("seasonstats");
        let leaderboardContainer = document.getElementById("weeklyleaderboard");
        let picksContainer = document.getElementById("weeklypicks");

        if (target === "stats") {
            statsContainer.style.display = "initial";
            leaderboardContainer.style.display = "none";
            picksContainer.style.display = "none";    
        }
    
        if (target === "leaderboard") {
            statsContainer.style.display = "none";
            leaderboardContainer.style.display = "initial";
            picksContainer.style.display = "none";    
    
        }
    
        if (target === "picks") {
            statsContainer.style.display = "none";
            leaderboardContainer.style.display = "none";
            picksContainer.style.display = "initial";    
        }
    }

    function collapsible(index) {
        const content = document.getElementById(`content-${index}`)
        if (content && content.style.display === "initial") {
            content.style.display = "none"
        } else if (content) {
            content.style.display = "initial"
        }
    }

    return (
        <div id="league-container">
            <h1>LEAGUE</h1>
            <div>
                <span className="buttons" id="stats" onClick={showContainers}>SEASON STATS</span>
                <span className="buttons" id="leaderboard" onClick={showContainers}>WEEKLY LEADERBOARD</span>
                <span className="buttons" id="picks" onClick={showContainers}>WEEKLY PICKS</span>
            </div>
            <br />
            <div id="seasonstats">
                <table>
                    <caption>Season Stats</caption>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Bet Record</th>
                            <th>Lock Record</th>
                            <th>Parlay Record</th>
                            <th>Season Total Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        { userStats.length ? userStats.map((userStat, idx) => {
                            return (<tr key={idx} className="userStat">
                                        <td>{userStat.username}</td>
                                        <td>{userStat.betscorrect}-{userStat.totalbets}</td>
                                        <td>{userStat.lockscorrect}-{userStat.totallocks}</td>
                                        <td>{userStat.parlayscorrect}-{userStat.totalparlays}</td>
                                        <td>{userStat.totalpoints}</td>
                                    </tr>)
                        }) : <tr><td>No stats to display</td></tr>}
                    </tbody>
                </table>
            </div>
            <div id="weeklyleaderboard">
                <table>
                    <caption>Weekly Leaderboard</caption>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Bet Record</th>
                            <th>Lock Record</th>
                            <th>Parlay Record</th>
                            <th>Total Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        { weeklyPicks.length ? weeklyPicks.map((weeklyPick, idx) => {
                            return (<tr key={idx} className="weeklyPick">
                                        <td>{weeklyPick.username}</td>
                                        <td>{weeklyPick.betscorrect}-{weeklyPick.totalbets}</td>
                                        <td>{weeklyPick.lockscorrect}-{weeklyPick.totallocks}</td>
                                        <td>{weeklyPick.parlayscorrect}-{weeklyPick.totalparlays}</td>
                                        <td>{weeklyPick.totalpoints}</td>
                                    </tr>)
                        }) : <tr><td>No stats to display</td></tr>}
                    </tbody>
                </table>
            </div>
            <div id="weeklypicks">
                { weeklyPicks.length ? weeklyPicks.map((weeklyPick, idx) => {
                    let parlay1total = 0;
                    let parlay2total = 0;

                    function updateParlayTotal(weeklyid) {
                        const parlay1 = parlays.filter(parlay => parlay.parlaynumber === 1 && parlay.weeklyid === weeklyid)
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
                
                        const parlay2 = parlays.filter(parlay => parlay.parlaynumber === 2 && parlay.weeklyid === weeklyid)
                        let twopointswon = 4;
                        let twopointslost = -2;
                        let twoparlayshit = 0;
                        let twotbd = false

                        parlay2.forEach((parlay) => {
                            if (!parlay.statsupdated) {
                                twotbd = true
                                return
                            } else if (parlay.result === "HIT") {
                                twoparlayshit++
                            }
                        })
                
                        if (twoparlayshit === parlay2.length && !twotbd) {
                            parlay2total = twopointswon
                        } else if (!twotbd) {
                            parlay2total = twopointslost
                        } else {
                            parlay2total = 0
                        }
                        
                    }

                    updateParlayTotal(weeklyPick.id)

                    return (
                    <React.Fragment key={idx}>
                    <button type="button" className="collapsible" onClick={() => collapsible(idx)}>{weeklyPick.username}'s Picks --- Total Points: {weeklyPick.totalpoints}</button>
                    <div key={idx} className="weeklyPick-content" id={`content-${idx}`}>
                        { picks.filter(pick => pick.weeklyid === weeklyPick.id).length ? <>
                            <table>
                                <caption>{weeklyPick.username}'s Picks</caption>
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
                                    { picks ? picks.map((pick, index) => {
                                        if (pick.weeklyid === weeklyPick.id) {
                                            return (
                                                <tr key={index}>
                                                    <td key={'pick' + index}>{pick.text}</td>
                                                    <td key={'lock' + index}>{pick.lock ? "LOCK" : null}</td>
                                                    <td key={'points' + index}>{pick.worth}</td>
                                                    <td key={'outcome' + index}>{pick.outcometext}</td>
                                                    <td key={'pointsawarded' + index}>{pick.outcome === "tbd" ? "tbd" : pick.pointsawarded}</td>
                                                </tr>
                                            )
                                        } else {
                                            return null
                                        }
                                    }): <tr><td>{weeklyPick.username} has not made any picks yet.</td></tr>}
                                </tbody>
                            </table>
                        </> : null }
                        { parlays.filter(parlay => parlay.weeklyid === weeklyPick.id && parlay.parlaynumber == 1).length ? <>
                            <table>
                                <caption>{weeklyPick.username}'s Parlays</caption>
                                <tbody>
                                    <tr>
                                        <th>Parlay 1</th>
                                        { parlays ? parlays.map((parlay, index) => {
                                                if (parlay.weeklyid === weeklyPick.id && parlay.parlaynumber == 1) {
                                                    return (
                                                        <React.Fragment key={index}>
                                                            <td>{parlay.text}</td>
                                                            <td>{parlay.result}</td>
                                                        </React.Fragment>
                                                    )
                                                } else {
                                                    return null
                                                }
                                            }): <td>{weeklyPick.username} has not made any picks yet.</td>}
                                        <th>Points Awarded</th>
                                        <td>{parlay1total}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </> : null}
                        { parlays.filter(parlay => parlay.weeklyid === weeklyPick.id && parlay.parlaynumber == 2).length ? <>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>Parlay 2</th>
                                        { parlays ? parlays.map((parlay, index2) => {
                                                if (parlay.weeklyid === weeklyPick.id && parlay.parlaynumber == 2) {
                                                    return (
                                                        <React.Fragment key={index2}>
                                                            <td>{parlay.text}</td>
                                                            <td>{parlay.result}</td>
                                                        </React.Fragment>                                                )
                                                } else {
                                                    return null
                                                }
                                            }): <td>{weeklyPick.username} has not made any picks yet.</td>}
                                        <th>Points Awarded</th>
                                        <td>{parlay2total}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </> : null}
                        <h2>TOTAL POINTS: {weeklyPick.totalpoints}</h2>
                    </div>
                    </React.Fragment>)
                }) : <div>No picks to display</div> }
            </div>
        </div>
    )
}

export default League;