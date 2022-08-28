import { showAlert } from "./Alert";
import "../style/admin.css";
const API_URL = 'https://floating-stream-77094.herokuapp.com/api'

const Admin = (props) => {
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

    const postGame = async (gameData) => {
        const { week, hometeam, awayteam, level, date, time, primetime, value, duration, over, under, chalk, dog, totalpoints, favoredteam, line } = gameData;
        await fetch(`${API_URL}/games/add`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                    week, hometeam, awayteam, level, date, time, primetime, value, duration, over, under, chalk, dog, totalpoints, favoredteam, line
            })
        }).then(response => response.json())
        .then(result => {
            if (!result.name) {
                setAlertMessage('You have added a new game!')
                showAlert()
                setUpdate(!update)
            } else {
                setAlertMessage(result.message);
                showAlert()
            }
        })
        .catch(console.error)
    }

    const submitGame = async () => {
        const weekInput = document.getElementById('input-game-week').value;
        const hometeamInput = document.getElementById('input-game-hometeam').value;
        const awayteamInput = document.getElementById('input-game-awayteam').value;
        const levelInput = document.getElementById('input-game-level').value;
        const dateInput = document.getElementById('input-game-date').value;
        const timeInput = document.getElementById('input-game-time').value;
        const primetimeInput = document.getElementById('input-game-primetime').checked;
        let valueInput = document.getElementById('input-game-value').value;
        const durationInput = document.getElementById('input-game-duration').value;
        const overInput = document.getElementById('option1').checked;
        const underInput = document.getElementById('option2').checked;
        const chalkInput = document.getElementById('option3').checked;
        const dogInput = document.getElementById('option4').checked;
        let totalpointsInput = document.getElementById('input-game-totalpoints').value;
        const favoredteamInput = document.getElementById('input-game-favoredteam').value;
        let lineInput = document.getElementById('input-game-line').value;

        if (!valueInput) {
            valueInput = null;
        }

        if (!totalpointsInput) {
            totalpointsInput = null;
        }

        if (!lineInput) {
            lineInput = null;
        }

        let gameData = {};
        
        gameData = {
            week: weekInput,
            hometeam: hometeamInput,
            awayteam: awayteamInput,
            level: levelInput,
            date: dateInput,
            time: timeInput,
            primetime: primetimeInput,
            value: valueInput,
            duration: durationInput,
            over: overInput,
            under: underInput,
            chalk: chalkInput,
            dog: dogInput,
            totalpoints: totalpointsInput,
            favoredteam: favoredteamInput,
            line: lineInput
        };

        await postGame(gameData);
    }

    function showContainers(event) {
        let target = event.target.id
        let gameContainer = document.getElementById("input-game");
        let resultsContainer = document.getElementById("input-game-results");

        if (target === "game") {
            gameContainer.style.display = "initial";
            resultsContainer.style.display = "none";    
        }
    
        if (target === "results") {
            gameContainer.style.display = "none";
            resultsContainer.style.display = "initial";    
        }
      }

    return (
        <div id='admin-container'> 
            <div>
                <span className="buttons" id="game" onClick={showContainers}>ADD GAME</span>
                <span className="buttons" id="results" onClick={showContainers}>ADD RESULTS</span>
            </div>  
            <div id="input-game">
                <h1>INPUT GAME</h1>
                <div id="form-container">
                    <form id='input-game-form'>
                        <div className="inputs">
                            <label>Week:</label>
                            <select id='input-game-week'>
                                <option value='1'>1</option>
                                <option value='2'>2</option>
                                <option value='3'>3</option>
                                <option value='1'>4</option>
                                <option value='1'>5</option>
                                <option value='1'>6</option>
                                <option value='1'>7</option>
                                <option value='1'>8</option>
                                <option value='1'>9</option>
                                <option value='1'>10</option>
                                <option value='1'>11</option>
                                <option value='1'>12</option>
                                <option value='1'>13</option>
                                <option value='1'>14</option>
                                <option value='1'>15</option>
                                <option value='1'>16</option>
                                <option value='1'>17</option>
                                <option value='1'>18</option>
                            </select>
                            <br />
                            <label>Home Team:</label>
                            <input id='input-game-hometeam' type='text' placeholder="Home Team"></input>
                            <br />
                            <label>Away Team:</label>
                            <input id='input-game-awayteam' type='text' placeholder="Away Team"></input>
                            <br />
                            <label>Level:</label>
                            <input id='input-game-level' type='text' placeholder="Level"></input>
                            <br />
                            <label>Date:</label>
                            <input id='input-game-date' type='date' placeholder="Date"></input>
                            <br />
                            <label>Time:</label>
                            <input id='input-game-time' type='time' placeholder="Time"></input>
                            <br />
                            <label>Primetime:</label>
                            <input id='input-game-primetime' type='checkbox' value='true'></input>
                            <br />
                            <label>Value:</label>
                            <input id='input-game-value' type='number' step='0.1' placeholder="Point Value"></input>
                            <br />
                            <label>Duration:</label>
                            <select id='input-game-duration'>
                                <option value="full-game">Full Game</option>
                                <option value="first-half">First Half</option>
                                <option value="second-half">Second Half</option>
                            </select>
                            <br />
                            <label>Options:</label>
                            <label>over</label>
                            <input id='option1' type='checkbox' name='option' value='over'></input>
                            <label>under</label>
                            <input id='option2' type='checkbox' name='option' value='under'></input>
                            <label>chalk</label>
                            <input id='option3' type='checkbox' name='option' value='chalk'></input>
                            <label>dog</label>
                            <input id='option4' type='checkbox' name='option' value='dog'></input>
                            <br />
                            <label>Total Points:</label>
                            <input id='input-game-totalpoints' type='number' step='0.1' placeholder="Total Points"></input>
                            <br />
                            <label>Favored Team:</label>
                            <select id='input-game-favoredteam'>
                                <option value='home'>HOME TEAM</option>
                                <option value='away'>AWAY TEAM</option>
                            </select>
                            <br />
                            <label>Line:</label>
                            <input id='input-game-line' type='number' step='0.1' placeholder="Line"></input>
                            <br />
                        </div>
                        <div className="submit-button">
                            <button type='button' onClick={submitGame}>SUBMIT</button>
                        </div>
                    </form>
                </div>
            </div> 
            <div id="input-game-results">
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
        </div>
    )
}

export default Admin;