const League = (props) => {
    const { weeklyPicks, picks, userStats } = props;

    return (
        <div className="league">
            <h1>LEAGUE</h1>
            <div>
                <span>SEASON STATS</span>
                <span>WEEKLY LEADERBOARD</span>
                <span>WEEKLY PICKS</span>
            </div>
            <div id="seasonstats">
                <table>
                    <caption>Season Stats</caption>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Bet Record</th>
                            <th>Lock Record</th>
                            <th>Season Total Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        { userStats.length ? userStats.map((userStat, idx) => {
                            return (<tr key={idx} className="userStat">
                                        <td>{userStat.username}</td>
                                        <td>{userStat.betscorrect}-{userStat.totalbets}</td>
                                        <td>{userStat.lockscorrect}-{userStat.totallocks}</td>
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
                            <th>Total Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        { weeklyPicks.length ? weeklyPicks.map((weeklyPick, idx) => {
                            return (<tr key={idx} className="weeklyPick">
                                        <td>{weeklyPick.username}</td>
                                        <td>{weeklyPick.betscorrect}-{weeklyPick.totalbets}</td>
                                        <td>{weeklyPick.lockscorrect}-{weeklyPick.totallocks}</td>
                                        <td>{weeklyPick.totalpoints}</td>
                                    </tr>)
                        }) : <tr><td>No stats to display</td></tr>}
                    </tbody>
                </table>
            </div>
            <div id="weeklypicks">
                { weeklyPicks.length ? weeklyPicks.map((weeklyPick, idx) => {
                    let total = 0;
                    return (<div key={idx} className="weeklyPick">
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
                                        total+=pick.pointsawarded
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
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <th>Total Points</th>
                                    <td>{total}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>)
                }) : <div>No picks to display</div> }
            </div>
        </div>
    )
}

export default League;