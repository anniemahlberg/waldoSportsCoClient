import { showAlert } from "./Alert";
const API_URL = 'https://floating-stream-77094.herokuapp.com/api'

const InputGameResults = (props) => {
    const { token, games, setAlertMessage, setUpdate, update } = props;

    const postResults = async (resultsArr) => {
        let alert = "";

        for (let i = 0; i < resultsArr.length; i++) {
            await fetch(`${API_URL}/games/updateResults/${resultsArr[i].gameId}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    totalpointsoutcome: resultsArr[i].totalpointsoutcome,
                    lineoutcome: resultsArr[i].lineoutcome,
                    totalpointsoutcometext: resultsArr[i].totalpointsoutcometext,
                    lineoutcometext: resultsArr[i].lineoutcometext
                })
            }).then(response => response.json())
            .then(result => {
                if (result.name) {
                    alert = result.message
                }
            })
            .catch(console.error)
        }

        if (!alert) {
            alert = "Outcome(s) successfully added!"
        }

        setAlertMessage(alert)
        showAlert()
        setUpdate(!update)
    }

    const submitResults = async () => {
        let outcomesArr = [];
        games.map((game, index) => {
            let outcome = {
                gameId: game.id
            }

            if (game.totalpoints && (game.over || game.under)) {
                let totalpoints = document.getElementById(`input-results-totalpoints-${index}`)
                outcome.totalpointsoutcome = totalpoints.value
                outcome.totalpointsoutcometext = `${game.awayteam} vs. ${game.hometeam} ${totalpoints.options[totalpoints.selectedIndex].text}`
            }

            if (game.line && (game.chalk || game.dog)) {
                let line = document.getElementById(`input-results-line-${index}`)
                outcome.lineoutcome = line.value
                outcome.lineoutcometext = line.options[line.selectedIndex].text
            }

            outcomesArr.push(outcome)
        })
        
        await postResults(outcomesArr)
    }

    return (
        <div className="input-game-results">
            <h1>INPUT GAME RESULTS</h1>
            <div id="form-container">
                <form id='input-game-results-form'>
                    { games ? games.map((game, index) => {
                        return (
                            <div key={index}>
                                <div>
                                    <h2>{game.awayteam} @ {game.hometeam}</h2>
                                </div>
                                <div className="inputs">
                                    { game.totalpoints && (game.over || game.under) ? 
                                        <>
                                        <label>Total Points Outcome:</label>
                                        <select id={`input-results-totalpoints-${index}`}>
                                            <option value=''>SELECT AN OUTCOME</option>
                                            {game.over ? <option value="over">OVER {game.totalpoints}</option> : null}
                                            {game.under ? <option value="under">UNDER {game.totalpoints}</option> : null}
                                            <option value='push'>PUSH</option>
                                        </select>
                                        </>
                                    : null}
                                    <br />
                                    { game.line && (game.chalk || game.dog) ? 
                                        <>
                                        <label>Line:</label>
                                        <select id={`input-results-line-${index}`}>
                                                <option value=''>SELECT AN OUTCOME</option>
                                            { game.favoredteam === 'home' ? <>
                                                {game.chalk ? <option value="chalk">{game.hometeam} -{game.line}</option> :null}
                                                {game.dog ? <option value="dog">{game.awayteam} +{game.line}</option> :null}                             
                                            </> : <>
                                                {game.chalk ? <option value="chalk">{game.awayteam} -{game.line}</option> :null}
                                                {game.dog ? <option value="dog">{game.hometeam} +{game.line}</option> :null}
                                            </>
                                            }
                                                <option value='push'>PUSH</option>
                                        </select>
                                        </>
                                    : null}
                                    <br />
                                </div>
                            </div>
                        )
                    }) : <div>No games to input results</div>}
                    <div className="submit-button">
                        <button type='button' onClick={submitResults}>SUBMIT</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default InputGameResults;