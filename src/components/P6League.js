import "../style/league.css"
import React from "react"

const P6League = (props) => {
    const { weeklyPicks, picks, userStats, picksixPicks, currentPot, allPots, games} = props;
    let weeklyPot = 0;
    if (currentPot) {
        weeklyPot = (0.93 * currentPot).toFixed(2)
    }

    let seasonPot = (0.07 * allPots).toFixed(2)

    function showContainers(event) {
        let target = event.target.id
        let statsContainer = document.getElementById("seasonstats");
        let picksContainer = document.getElementById("weeklypicks");

        if (target === "stats") {
            statsContainer.style.display = "initial";
            picksContainer.style.display = "none";    
        }
    
        if (target === "weekly-picks") {
            statsContainer.style.display = "none";
            picksContainer.style.display = "initial";    
        }
    }

    function collapsible(index) {
        const content = document.getElementById(`picksixcontent-${index}`)
        if (content && content.style.display === "initial") {
            content.style.display = "none"
        } else if (content) {
            content.style.display = "initial"
        }
    }

    let btnContainer = document.getElementById("leagueButtons");

    if (btnContainer) {
        let btns = btnContainer.getElementsByClassName("buttons");
    
        for (let i = 0; i < btns.length; i++) {
            btns[i].addEventListener("click", function() {
                let current = document.getElementsByClassName("activeButton");
    
                if (current.length > 0) {
                    current[0].className = current[0].className.replace(" activeButton", "");
                }
    
                this.className += " activeButton";
            });
        }
    }

    function checkTime(gameidx) {
        let game = games.find(game => game.id === gameidx)
        const currentDate = new Date()
        const comparedDate = new Date(new Date(`${game.date}T${game.time}-0500`))

        if (currentDate > comparedDate) {
            return true
        } else {
            return false
        }
    }

    return (
        <div id="league-container">
            <div className="buttons-div" id="leagueButtons">
                <span className="buttons" id="stats" onClick={showContainers}>SEASON LEADERBOARD</span>
                <span className="buttons" id="weekly-picks" onClick={showContainers}>PICKS</span>
            </div>
            <div id="seasonstats">
                <p id="seasonpot">This Season's Pot: ${seasonPot}</p>
                <div className="table">
                    <table>
                        <caption>SEASON LEADERBOARD</caption>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Bet Record</th>
                                <th>Lock Record</th>
                                <th>Parlay Record</th>
                                <th>Season Total Points</th>
                                <th>Wins</th>
                            </tr>
                        </thead>
                        <tbody>
                            { userStats.length ? userStats.map((userStat, idx) => {
                                return (<tr key={idx} className="userStat">
                                            <td>{userStat.username}</td>
                                            <td>{userStat.betscorrect}/{userStat.totalbets}</td>
                                            <td>{userStat.lockscorrect}/{userStat.totallocks}</td>
                                            <td>{userStat.parlayscorrect}/{userStat.totalparlays}</td>
                                            <td>{userStat.totalpoints}</td>
                                            <td>{userStat.wins}</td>
                                        </tr>)
                            }) : <tr><td colSpan={5}>No stats to display</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
            <div id="weeklypicks">
                { weeklyPicks.length ? weeklyPicks.map((weeklyPick, idx) => {

                    return (
                    <React.Fragment key={idx}>
                    <button type="button" className="collapsible" onClick={() => collapsible(idx)}>{weeklyPick.username}'s Picks --- Total Points: {weeklyPick.totalpoints}</button>
                    <div key={idx} className="weeklyPick-content" id={`picksixcontent-${idx}`}>
                        { picksixPicks.filter(pick => pick.weeklyid === weeklyPick.id).length ? <>
                            <div className="table">
                                <table>
                                    <caption>{weeklyPick.username}'s Picks</caption>
                                    <thead>
                                        <tr>
                                            <th>Picks</th>
                                            <th>Results</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { picksixPicks ? picksixPicks.map((pick, index) => {
                                            if (pick.weeklyid === weeklyPick.id  && checkTime(pick.gameid)) {
                                                return (
                                                    <tr key={index}>
                                                        <td key={'pick' + index}>{pick.text}</td>
                                                        <td key={'outcome' + index}>{pick.outcometext}</td>
                                                    </tr>
                                                )
                                            } else {
                                                return null
                                            }
                                        }): <tr><td>{weeklyPick.username} has not made any picks yet.</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </> : null }
                    </div>
                    </React.Fragment>)
                }) : <div>No picks to display</div> }
            </div>
        </div>
    )
}

export default P6League;