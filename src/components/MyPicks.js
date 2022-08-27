import { useEffect } from "react";
import { fetchAllPicks } from "../axios-services";

const MyPicks = (props) => {
    const {myPicks, setMyPicks, myWeekly, setMyWeekly, setPicks, user, weeklyPicks, update } = props;
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
        getMyPicks();
    }, [update])

    return (
        <div className="allpicks">
            <div>
                <table>
                    <caption>MY STATS</caption>
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
            </div>
        </div>
    )
}

export default MyPicks;