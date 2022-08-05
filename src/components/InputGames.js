const API_URL = 'https://floating-stream-77094.herokuapp.com/api'

const InputGames = () => {   
    const postGame = async (gameData) => {
        const { hometeam, awayteam, level, date, time, primetime, value, duration, over, under, chalk, dog, totalpoints, favoredteam, line } = gameData;
        await fetch(`${API_URL}/games/add`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                    hometeam,
                    awayteam,
                    level,
                    date,
                    time,
                    primetime,
                    value,
                    duration,
                    over,
                    under,
                    chalk,
                    dog,
                    totalpoints,
                    favoredteam,
                    line
            })
        }).then(response => response.json())
        .then(result => {
            if (!result.name) {
                console.log(result)
                alert('You have added a new game!')
            } else {
                alert(result.message);
            }
        })
        .catch(console.error)
    }

    const submitGame = async (event) => {
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
    
    return (
        <div className="input-game">
            <h1>INPUT GAME</h1>
            <div id="form-container">
                <form id='input-game-form'>
                    <div className="inputs">
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
    )
}

export default InputGames;