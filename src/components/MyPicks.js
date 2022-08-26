import { useEffect } from "react";
import { fetchAllPicks } from "../axios-services";
const API_URL = 'https://floating-stream-77094.herokuapp.com/api'

const MyPicks = (props) => {
    const {myPicks, setMyPicks, setPicks, user, weeklyPicks } = props;

    useEffect(() => {
        const getMyPicks = async () => {
            const allPicks = await fetchAllPicks()
            setPicks(allPicks)
            if (user.username) {
                const mypicks = allPicks.filter(pick => {
                    const myWeeklyPick = weeklyPicks.find(weeklyPick => weeklyPick.username === user.username)
                    if (myWeeklyPick) {
                        return myWeeklyPick.id === pick.weeklyid
                    }
                })
                setMyPicks(mypicks)
            }
        }
        getMyPicks();
    }, [])

    return (
        <div className="allpicks">
            <h1>MY PICKS</h1>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Picks</th>
                            <th>Results</th>
                        </tr>
                    </thead>
                    <tbody>
                        { user.username && myPicks.length ? myPicks.map((pick, idx) => {
                            return (
                                <tr key={idx}>
                                    <td key={'pick' + idx}>{pick.text}</td>
                                    <td key={'outcome' + idx}>{pick.outcome}</td>
                                </tr>)
                        }) : user.username ? <tr><td>You haven't made any picks yet</td></tr> : <tr><td>You must be logged in to see your picks</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MyPicks;