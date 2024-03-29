import { showAlert } from "./Alert";
import convertTime from "convert-time";
import "../style/admin.css";
const API_URL = 'https://floating-stream-77094.herokuapp.com/api'

const Admin = (props) => {
    const { token, games, setAlertMessage, setUpdate, update, users, currentPot } = props;

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

        await fetch(`${API_URL}/parlays/updateResults/parlay1`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                week: resultsArr[0].week
            })
        }).then(response => response.json())
        .catch(console.error)

        await fetch(`${API_URL}/picksix/updateResults/pick1`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                week: resultsArr[0].week
            })
        }).then(response => response.json())
        .catch(console.error)

        setAlertMessage(alert)
        showAlert()
        setUpdate(!update)
    }

    const submitResults = async () => {
        let outcomesArr = [];
        games.map((game, index) => {
            let outcome = {
                gameId: game.id,
                week: game.week
            }

            if (game.totalpoints && (game.over || game.under)) {
                let totalpoints = document.getElementById(`input-results-totalpoints-${index}`)
                outcome.totalpointsoutcome = totalpoints.value
                if (totalpoints.options[totalpoints.selectedIndex]) {
                    outcome.totalpointsoutcometext = `${game.awayteam} vs. ${game.hometeam} ${totalpoints.options[totalpoints.selectedIndex].text}`
                } else {
                    outcome.totalpointsoutcometext = "PUSH"
                }
            }

            if (game.line && (game.chalk || game.dog)) {
                let line = document.getElementById(`input-results-line-${index}`)
                outcome.lineoutcome = line.value
                if (line.options[line.selectedIndex]) {
                    outcome.lineoutcometext = line.options[line.selectedIndex].text
                } else {
                    outcome.lineoutcometext = "PUSH"
                }
            }

            outcomesArr.push(outcome)
        })
        
        await postResults(outcomesArr)
    }

    const postGame = async (gameData) => {
        const { week, hometeam, awayteam, level, date, time, primetime, duration, over, under, chalk, dog, totalpoints, favoredteam, line } = gameData;
        await fetch(`${API_URL}/games/add`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                    week, hometeam, awayteam, level, date, time, primetime, duration, over, under, chalk, dog, totalpoints, favoredteam, line
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
        const durationInput = document.getElementById('input-game-duration').value;
        const overInput = document.getElementById('option1').checked;
        const underInput = document.getElementById('option2').checked;
        const chalkInput = document.getElementById('option3').checked;
        const dogInput = document.getElementById('option4').checked;
        let totalpointsInput = document.getElementById('input-game-totalpoints').value;
        const favoredteamInput = document.getElementById('input-game-favoredteam').value;
        let lineInput = document.getElementById('input-game-line').value;

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

    async function deactivateWeek() {
        let weeknumber = document.getElementById('weeknumber').value
        await fetch(`${API_URL}/games/byWeek/${weeknumber}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => response.json())
        .then(result => {
            if (!result.name) {
                setAlertMessage(result.message)
                showAlert()
                setUpdate(!update)
            } else {
                setAlertMessage(result.message);
                showAlert()
            }
        })
        .catch(console.error)
    }

    const editGameNow = async (gameData) => {
        const { gameid, week, hometeam, awayteam, level, date, time, primetime, duration, over, under, chalk, dog, totalpoints, favoredteam, line } = gameData;
        await fetch(`${API_URL}/games/${gameid}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                    week, hometeam, awayteam, level, date, time, primetime, duration, over, under, chalk, dog, totalpoints, favoredteam, line
            })
        }).then(response => response.json())
        .then(result => {
            if (!result.name) {
                setAlertMessage('You have edited a game!')
                showAlert()
                setUpdate(!update)
            } else {
                setAlertMessage(result.message);
                showAlert()
            }
        })
        .catch(console.error)
    }

    async function editGame(event,index, gameid) {
        event.preventDefault()
        const newhometeam = document.getElementById(`edit-hometeam-${index}`).innerText
        const newawayteam = document.getElementById(`edit-awayteam-${index}`).innerText
        const newweek = document.getElementById(`edit-week-${index}`).value
        const newlevel = document.getElementById(`edit-level-${index}`).value
        const newdate = document.getElementById(`edit-date-${index}`).value
        const newtime = document.getElementById(`edit-time-${index}`).value
        const newduration = document.getElementById(`edit-duration-${index}`).value
        let newprimetime = document.getElementById(`edit-primetime-${index}`).checked
        let newchalk = document.getElementById(`edit-chalk-${index}`).checked
        let newdog = document.getElementById(`edit-dog-${index}`).checked
        let newover = document.getElementById(`edit-over-${index}`).checked
        let newunder = document.getElementById(`edit-under-${index}`).checked
        const newtotalpoints = document.getElementById(`edit-totalpoints-${index}`).innerText
        const newfavoredteam = document.getElementById(`edit-favoredteam-${index}`).value
        const newline = document.getElementById(`edit-line-${index}`).innerText

        if (!newprimetime) {
            newprimetime = false
        }

        if (!newchalk) {
            newchalk = false
        }

        if (!newdog) {
            newdog = false
        }

        if (!newover) {
            newover = false
        }

        if (!newunder) {
            newunder = false
        }

        let data = {
            gameid,
            hometeam: newhometeam,
            awayteam: newawayteam,
            week: newweek,
            level: newlevel,
            date: newdate,
            time: newtime,
            duration: newduration,
            primetime: newprimetime,
            chalk: newchalk,
            dog: newdog,
            over: newover,
            under: newunder,
            totalpoints: newtotalpoints,
            favoredteam: newfavoredteam,
            line: newline
        }

        await editGameNow(data)
    }

    async function deleteGame(event, gameId) {
        event.preventDefault()
        await fetch(`${API_URL}/games/${gameId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => response.json())
        .then(result => {
            if (!result.name) {
                setAlertMessage(result.message)
                showAlert()
                setUpdate(!update)
            } else {
                setAlertMessage(result.message);
                showAlert()
            }
        })
        .catch(console.error)
    }

    async function makeAdmin(userid) {
        await fetch(`${API_URL}/users/${userid}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                admin: true
            })
        }).then(response => response.json())
        .then(result => {
            if (!result.name) {
                setAlertMessage(`You have made the user with user id: ${userid} an admin!`)
                showAlert()
                setUpdate(!update)
            } else {
                setAlertMessage(result.message);
                showAlert()
            }
        })
        .catch(console.error)
    }

    async function makeWinner() {
        const winnerUserId = document.getElementById(`winner`).value

        await fetch(`${API_URL}/users/makeWinner/${winnerUserId}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }).then(response => response.json())
        .then(result => {
            if (!result.name) {
                setAlertMessage(`You have set this week's winner!`)
                showAlert()
                setUpdate(!update)
            } else {
                setAlertMessage(result.message);
                showAlert()
            }
        })
        .catch(console.error)
    }

    async function deleteUser(userid) {                 
        await fetch(`${API_URL}/users/${userid}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => response.json())
        .then(result => {
            if (!result.name) {
                setAlertMessage(result.message)
                showAlert()
                setUpdate(!update)
            } else {
                setAlertMessage(result.message);
                showAlert()
            }
        })
        .catch(console.error)
    }

    async function addPotAmount() {
        const week = document.getElementById("pot-week").value
        const amount = document.getElementById("pot-amount").value

        await fetch(`${API_URL}/pot/add`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({week, amount})
        }).then(response => response.json())
        .then(result => {
            if (!result.name) {
                setAlertMessage(result.message)
                showAlert()
                setUpdate(!update)
            } else {
                setAlertMessage(result.message);
                showAlert()
            }
        })
        .catch(console.error)
    }

    async function editPotAmount() {
        const week = document.getElementById("edit-pot-week").value
        const amount = document.getElementById("edit-pot-amount").value

        await fetch(`${API_URL}/pot/week/${week}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({amount})
        }).then(response => response.json())
        .then(result => {
            if (!result.name) {
                setAlertMessage(`You have edited the pot amount to: $${amount}`)
                showAlert()
                setUpdate(!update)
            } else {
                setAlertMessage(result.message);
                showAlert()
            }
        })
        .catch(console.error)
    }

    function showContainers(event) {
        let target = event.target.id
        let gameContainer = document.getElementById("admin-input-game");
        let resultsContainer = document.getElementById("admin-input-results");
        let deactivateContainer = document.getElementById("admin-deactivate");
        let editContainer = document.getElementById('admin-edit-game')
        let makeAdminContainer = document.getElementById('add-admin')

        if (target === "game") {
            gameContainer.style.display = "initial";
            resultsContainer.style.display = "none";    
            deactivateContainer.style.display = "none";
            editContainer.style.display = "none";
            makeAdminContainer.style.display = "none";
        }
    
        if (target === "results") {
            gameContainer.style.display = "none";
            resultsContainer.style.display = "initial";
            deactivateContainer.style.display = "none"   
            editContainer.style.display = "none";
            makeAdminContainer.style.display = "none";
        }

        if (target === "deactivate") {
            gameContainer.style.display = "none";
            resultsContainer.style.display = "none";
            deactivateContainer.style.display = "initial"   
            editContainer.style.display = "none"; 
            makeAdminContainer.style.display = "none";
        }

        if (target === "edit") {
            gameContainer.style.display = "none";
            resultsContainer.style.display = "none";
            deactivateContainer.style.display = "none"   
            editContainer.style.display = "initial"; 
            makeAdminContainer.style.display = "none";
        }

        if (target === "makeadmin") {
            gameContainer.style.display = "none";
            resultsContainer.style.display = "none";
            deactivateContainer.style.display = "none"   
            editContainer.style.display = "none"; 
            makeAdminContainer.style.display = "initial";
        }
    }

    let btnContainer = document.getElementById("adminButtons");

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

    let todaydate = new Date();
    let year = todaydate.toLocaleString("default", { year: "numeric" });
    let month = todaydate.toLocaleString("default", { month: "2-digit" });
    let day = todaydate.toLocaleString("default", { day: "2-digit" });
    let today = year + "-" + month + "-" + day;

    return (
        <div id='admin-container'> 
            <div className="buttons-div" id="adminButtons">
                <span className="buttons" id="game" onClick={showContainers}>ADD</span>
                <span className="buttons" id="edit" onClick={showContainers}>EDIT</span>
                <span className="buttons" id="results" onClick={showContainers}>RESULTS</span>
                <span className="buttons" id="deactivate" onClick={showContainers}>WEEK INFO</span>
                <span className="buttons" id="makeadmin" onClick={showContainers}>USERS</span>
            </div>  
            <div id="admin-input-game">
                <h1>ADD GAME</h1>
                <div id="form-container">
                    <form id='input-game-form'>
                        <div className="inputs">
                            <label>Week:</label>
                            <select id='input-game-week'>
                                <option value='1'>1</option>
                                <option value='2'>2</option>
                                <option value='3'>3</option>
                                <option value='4'>4</option>
                                <option value='5'>5</option>
                                <option value='6'>6</option>
                                <option value='7'>7</option>
                                <option value='8'>8</option>
                                <option value='9'>9</option>
                                <option value='10'>10</option>
                                <option value='11'>11</option>
                                <option value='12'>12</option>
                                <option value='13'>13</option>
                                <option value='14'>14</option>
                                <option value='15'>15</option>
                                <option value='16'>16</option>
                                <option value='17'>17</option>
                                <option value='18'>18</option>
                                <option value='19'>19</option>
                                <option value='20'>20</option>
                                <option value='21'>21</option>
                                <option value='22'>22</option>
                                <option value='23'>23</option>
                                <option value='24'>24</option>
                                <option value='25'>25</option>
                                <option value='26'>26</option>
                                <option value='27'>27</option>
                                <option value='28'>28</option>
                                <option value='29'>29</option>
                                <option value='30'>30</option>
                            </select>
                            <br />
                            <label>Away Team:</label>
                            <input id='input-game-awayteam' type='text' placeholder="Away Team"></input>
                            <br />
                            <label>Home Team:</label>
                            <input id='input-game-hometeam' type='text' placeholder="Home Team"></input>
                            <br />
                            <label>Level:</label>
                            <select id='input-game-level'>
                                <option value="NFL">NFL</option>
                                <option value="NCAA FOOTBALL">NCAA FOOTBALL</option>
                                <option value="MLB">MLB</option>
                                <option value="NBA">NBA</option>
                                <option value="NHL">NHL</option>
                                <option value="NCAA MENS BBALL">NCAA MENS BBALL</option>
                                <option value="NCAA WOMENS BBALL">NCAA WOMENS BBALL</option>
                                <option value="MLS">MLS</option>
                                <option value="FIFA WORLD CUP">FIFA WORLD CUP</option>
                                <option value="PREMIER LEAGUE">PREMIER LEAGUE</option>
                                <option value="MMA">MMA</option>
                            </select>
                            <br />
                            <label>Date:</label>
                            <input id='input-game-date' type='date' placeholder="Date" defaultValue={today}></input>
                            <br />
                            <label>Time:</label>
                            <input id='input-game-time' type='time' placeholder="Time"></input>
                            <br />
                            <label>Primetime:</label>
                            <input id='input-game-primetime' type='checkbox' value='true'></input>
                            <br />
                            <label>Duration:</label>
                            <select id='input-game-duration'>
                                <option value="full-game">Full Game</option>
                                <option value="first-half">First Half</option>
                                <option value="second-half">Second Half</option>
                            </select>
                            <br />
                            <label>Betting Options:</label>
                            <br />
                            <input id='option1' type='checkbox' name='option' value='over' defaultChecked={true}></input>
                            <label>over</label><br />
                            <input id='option2' type='checkbox' name='option' value='under' defaultChecked={true}></input>
                            <label>under</label><br />
                            <input id='option3' type='checkbox' name='option' value='chalk' defaultChecked={true}></input>
                            <label>chalk</label><br />
                            <input id='option4' type='checkbox' name='option' value='dog' defaultChecked={true}></input>
                            <label>dog</label>
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
                            <button className="admin-submit" type='button' onClick={submitGame}>SUBMIT</button>
                        </div>
                    </form>
                </div>
            </div> 
            <div id="admin-edit-game">
                <div className="table">
                    <table>
                        <caption>EDIT GAMES</caption>
                        <thead>
                            <tr>
                                <th>AWAY TEAM</th>
                                <th>HOME TEAM</th>
                                <th>LEVEL</th>
                                <th>WEEK</th>
                                <th>DATE</th>
                                <th>TIME</th>
                                <th>DURATION</th>
                                <th>PRIMETIME</th>
                                <th>OVER</th>
                                <th>UNDER</th>
                                <th>CHALK</th>
                                <th>DOG</th>
                                <th>TOTAL POINTS</th>
                                <th>FAVORED TEAM</th>
                                <th>LINE</th>
                            </tr>
                        </thead>
                        <tbody>
                        {games ? games.map((game, index) => {
                            return (
                                <tr key={index}>
                                    <td id={`edit-awayteam-${index}`} contentEditable="true" suppressContentEditableWarning={true}>{game.awayteam}</td>
                                    <td id={`edit-hometeam-${index}`} contentEditable="true" suppressContentEditableWarning={true}>{game.hometeam}</td>
                                    <td>
                                        <select id={`edit-level-${index}`}>
                                            <option value={game.level}>{game.level}</option>
                                            { game.level !== "NFL" ? <option value="NFL">NFL</option> : null}
                                            { game.level !== "NCAA FOOTBALL" ? <option value="NCAA FOOTBALL">NCAA FOOTBALL</option> : null}
                                            { game.level !== "MLB" ? <option value="MLB">MLB</option> : null}
                                            { game.level !== "NBA" ? <option value="NBA">NBA</option> : null}
                                            { game.level !== "MLS" ? <option value="MLS">MLS</option> : null}
                                            { game.level !== "NCAA MENS BBALL" ? <option value="NCAA MENS BBALL">NCAA MENS BBALL</option> : null}
                                            { game.level !== "NCAA WOMENS BBALL" ? <option value="NCAA WOMENS BBALL">NCAA WOMENS BBALL</option> : null}
                                            { game.level !== "FIFA WORLD CUP" ? <option value="FIFA WORLD CUP">FIFA WORLD CUP</option> : null}
                                            { game.level !== "PREMIER LEAGUE" ? <option value="PREMIER LEAGUE">PREMIER LEAGUE</option> : null}
                                            { game.level !== "MMA" ? <option value="MMA">MMA</option> : null}
                                        </select>
                                    </td>
                                    <td>
                                        <select id={`edit-week-${index}`}>
                                            <option value={game.week}>{game.week}</option>
                                            { game.week !== 1 ? <option value='1'>1</option> : null}
                                            { game.week !== 2 ? <option value='2'>2</option> : null}
                                            { game.week !== 3 ? <option value='3'>3</option> : null}
                                            { game.week !== 4 ? <option value='4'>4</option> : null}
                                            { game.week !== 5 ? <option value='5'>5</option> : null}
                                            { game.week !== 6 ? <option value='6'>6</option> : null}
                                            { game.week !== 7 ? <option value='7'>7</option> : null}
                                            { game.week !== 8 ? <option value='8'>8</option> : null}
                                            { game.week !== 9 ? <option value='9'>9</option> : null}
                                            { game.week !== 10 ? <option value='10'>10</option> : null}
                                            { game.week !== 11 ? <option value='11'>11</option> : null}
                                            { game.week !== 12 ? <option value='12'>12</option> : null}
                                            { game.week !== 13 ? <option value='13'>13</option> : null}
                                            { game.week !== 14 ? <option value='14'>14</option> : null}
                                            { game.week !== 15 ? <option value='15'>15</option> : null}
                                            { game.week !== 16 ? <option value='16'>16</option> : null}
                                            { game.week !== 17 ? <option value='17'>17</option> : null}
                                            { game.week !== 18 ? <option value='18'>18</option> : null}
                                            { game.week !== 19 ? <option value='19'>19</option> : null}
                                            { game.week !== 20 ? <option value='20'>20</option> : null}
                                            { game.week !== 21 ? <option value='21'>21</option> : null}
                                            { game.week !== 22 ? <option value='22'>22</option> : null}
                                            { game.week !== 23 ? <option value='23'>23</option> : null}
                                            { game.week !== 24 ? <option value='24'>24</option> : null}
                                            { game.week !== 25 ? <option value='25'>25</option> : null}
                                            { game.week !== 26 ? <option value='26'>26</option> : null}
                                            { game.week !== 27 ? <option value='27'>27</option> : null}
                                            { game.week !== 28 ? <option value='28'>28</option> : null}
                                            { game.week !== 29 ? <option value='29'>29</option> : null}
                                            { game.week !== 30 ? <option value='30'>30</option> : null}
                                        </select>
                                    </td>
                                    <td>
                                        <input type='date' id={`edit-date-${index}`} defaultValue={game.date}></input>
                                    </td>
                                    <td>
                                        <input type='time' id={`edit-time-${index}`} defaultValue={game.time}></input>
                                    </td>
                                    <td>
                                        <select id={`edit-duration-${index}`}>
                                            <option value={game.duration}>{game.duration}</option>
                                            { game.duration !== "full-game" ? <option value="full-game">full-game</option> : null}
                                            { game.duration !== "first-half" ? <option value="first-half">first-half</option> : null}
                                            { game.duration !== "second-half" ? <option value="second-half">second-half</option> : null}
                                        </select>
                                    </td>
                                    <td>
                                        <input type='checkbox' defaultChecked={game.primetime ? true : false} id={`edit-primetime-${index}`}></input>
                                    </td>
                                    <td>
                                        <input type='checkbox' defaultChecked={game.over ? true : false} id={`edit-over-${index}`}></input>
                                    </td>
                                    <td>
                                        <input type='checkbox' defaultChecked={game.under ? true : false} id={`edit-under-${index}`}></input>
                                    </td>
                                    <td>
                                        <input type='checkbox' defaultChecked={game.chalk ? true : false} id={`edit-chalk-${index}`}></input>
                                    </td>
                                    <td>
                                        <input type='checkbox' defaultChecked={game.dog ? true : false} id={`edit-dog-${index}`}></input>
                                    </td>
                                    <td id={`edit-totalpoints-${index}`} contentEditable="true" suppressContentEditableWarning={true}>{game.totalpoints}</td>
                                    <td>
                                        <select id={`edit-favoredteam-${index}`}>
                                            <option value={game.favoredteam}>{game.favoredteam}</option>
                                            { game.favoredteam !== "home" ? <option value="home">home</option> : null}
                                            { game.favoredteam !== "away" ? <option value="away">away</option> : null}
                                        </select>
                                    </td>
                                    <td id={`edit-line-${index}`} contentEditable="true" suppressContentEditableWarning={true}>{game.line}</td>
                                    <td><button className="admin-submit" onClick={(event) => {editGame(event, index, game.id)}}>EDIT</button></td>
                                    <td><button className="admin-submit" onClick={(event) => {deleteGame(event, game.id)}}>DELETE</button></td>
                                </tr>
                            )
                        }) : <span>No games to display</span>}
                        </tbody>
                    </table>
                </div>
            </div> 
            <div id="admin-input-results">
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
                                                {game.totalpointsoutcome === "tbd" ? 
                                                <>
                                                    <option value=''>SELECT AN OUTCOME</option> 
                                                    {game.over ? <option value="over">O {game.totalpoints}</option> : null}
                                                    {game.under ? <option value="under">U {game.totalpoints}</option> : null}
                                                    <option value='push'>PUSH</option>
                                                </>  
                                                : <option value=''>{game.totalpointsoutcome} {game.totalpoints}</option>}
                                            </select>
                                            <br />
                                            </>
                                        : null}
                                        { game.line && (game.chalk || game.dog) ? 
                                            <>
                                            <label>Line:</label>
                                            <select id={`input-results-line-${index}`}>
                                                {game.lineoutcome === "tbd" ? 
                                                <>
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
                                                </> : game.favoredteam === 'home' && game.lineoutcome === "chalk" ?
                                                        <option value="">{game.hometeam} -{game.line}</option>
                                                    : game.favoredteam === "home" && game.lineoutcome === "dog" ?
                                                        <option value="">{game.awayteam} +{game.line}</option> 
                                                    : game.favoredteam === 'away' && game.lineoutcome === "chalk" ?
                                                        <option value="">{game.awayteam} -{game.line}</option>
                                                    : game.favoredteam === 'away' && game.lineoutcome === "dog" ?
                                                        <option value="">{game.hometeam} +{game.line}</option>
                                                    : null
                                                }
                                            </select>
                                            <br />
                                            </>
                                        : null}
                                    </div>
                                </div>
                            )
                        }) : <div>No games to input results</div>}
                        <br />
                        <div className="submit-button">
                            <button className="admin-submit" type='button' onClick={submitResults}>SUBMIT</button>
                        </div>
                    </form>
                </div>
            </div>
            <div id="admin-deactivate">
                <h3>Current Week Number: {games[0] ? games[0].week : <span>-</span>}</h3>
                <h3>Current Week's Pot: ${currentPot ? currentPot : <span>0</span>}</h3>
                <h2>START NEW POT AMOUNT</h2>
                <label htmlFor="pot-week">Week:</label>
                <input id='pot-week' placeholder="Week Number"></input><br />
                <label htmlFor="pot-amount">Pot Amount: $</label>
                <input id="pot-amount" placeholder="Pot Amount"></input>
                <button className='admin-submit' type='button' onClick={addPotAmount}>ADD POT AMOUNT</button>
                <h2>EDIT CURRENT POT AMOUNT</h2>
                <label>Current Week:</label>
                <input id='edit-pot-week' placeholder="Week Number"></input><br />
                <label>NEW Pot Amount: $</label>
                <input id="edit-pot-amount" placeholder={currentPot ? currentPot : 0}></input>
                <button className='admin-submit' type='button' onClick={editPotAmount}>EDIT POT AMOUNT</button>
                <h2>DECLARE THIS WEEK'S WINNER</h2>
                <select name="winner" id="winner">
                    <option>SELECT A WINNER</option>
                    {users.length ? users.map((user, index) => {
                        return (
                            <option value={user.id} key={index}>{user.username}</option>
                        )
                    }) : <option>No users to display</option>}
                </select>
                <button className='admin-submit' type="button" onClick={makeWinner}>MAKE WINNER</button>
                <h2>START NEW WEEK</h2>
                <p>In order to start a new week, you will want to deactivate all of the games from the current/previous week.</p>
                <label>What week number would you like to deactivate all of the games? </label>
                <input id='weeknumber' placeholder="Week Number"></input>
                <button className="admin-submit" type="button" onClick={deactivateWeek}>DEACTIVATE</button>
            </div>
            <div id='add-admin'>
                <div className="table">
                    <table>
                        <caption>ALL USERS</caption>
                        <thead>
                            <tr>
                                <th>User Id</th>
                                <th>Username</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Venmo</th>
                                <th>Admin Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            { users.length ? users.map((user, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.firstname}</td>
                                        <td>{user.lastname}</td>
                                        <td>{user.email}</td>
                                        <td>{user.venmo}</td>
                                        <td>{user.admin ? "True" : "False"}</td>
                                        <td><button type="button" className="admin-submit" onClick={() => {makeAdmin(user.id)}}>MAKE ADMIN</button></td>
                                        <td><button type="button" className="admin-submit" onClick={() => {deleteUser(user.id)}}>DELETE</button></td>
                                    </tr>
                                )
                            })
                            : <tr><td>No users to display</td></tr>}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
    )
}

export default Admin;