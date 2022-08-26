import { fetchAllPicks, fetchAllWeeklyPicks } from "../axios-services";
import { useEffect} from 'react'

const AllPicks = (props) => {
    const { weeklyPicks, picks, setWeeklyPicks, setPicks } = props;

    useEffect(() => {
        const getAllInitialData = async () => {
            const allWeeklyPicks = await fetchAllWeeklyPicks()
            setWeeklyPicks(allWeeklyPicks)
            const allPicks = await fetchAllPicks()
            setPicks(allPicks)
        }    

        getAllInitialData();
    }, [])

    return (
        <div className="allpicks">
            <h1>PICKS</h1>
            <div>
                { weeklyPicks.length ? weeklyPicks.map((weeklyPick, idx) => {
                    return (<div key={idx} className="weeklyPick">
                        <h3>{weeklyPick.username}'s Picks</h3>
                        <table>
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
                    </div>)
                }) : <div>No picks to display</div> }
            </div>
        </div>
    )
}

export default AllPicks;