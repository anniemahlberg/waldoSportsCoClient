import convertTime from 'convert-time';
import { showAlert } from "./Alert";
import '../style/picks.css'

const API_URL = 'https://floating-stream-77094.herokuapp.com/api'

function onlyOne(checkboxId, pick) {
    let checkbox = document.getElementById(checkboxId);
    let checkboxes = document.getElementsByName(pick)
    checkboxes.forEach((item) => {
        if (item !== checkbox) item.checked = false
    })
}

const Picks = (props) => {
    const { games, token, setAlertMessage, update, setUpdate, sortedGames } = props;

    const postPick = async (pickData) => {
        const { picks } = pickData
        let alert = ""

        if (picks.length > 15) {
            setAlertMessage("You can only make 15 picks!")
            showAlert()
            return
        }

        for (let i = 0; i < picks.length; i++) {
            await fetch(`${API_URL}/picks/addPick`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    gameid: picks[i].gameId,
                    type: picks[i].type,
                    bet: picks[i].bet,
                    text: picks[i].text,
                    lock: picks[i].lock,
                    worth: picks[i].worth
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
            alert = "You have made your picks!!"
        }

        setAlertMessage(alert)
        showAlert();
        setUpdate(!update)
    }

    const submitPick = () => {
        let picksArr = [];
        sortedGames.map((game, idx) => {
            let chalkteam = "";
            let dogteam = ""

            if (game.favoredteam === 'home') {
                chalkteam = game.hometeam;
                dogteam = game.awayteam;
            }

            if (game.favoredteam === 'away') {
                chalkteam = game.awayteam;
                dogteam = game.hometeam;
            }

            if (game.dog || game.chalk) {
                let pick = {
                    gameId: game.id
                }

                if (document.getElementById(`dog-${idx}`).checked) {
                    let dog = `${dogteam} ${document.getElementById(`label-dog-${idx}`).innerText}`
                    pick.type = "line"
                    pick.bet = "dog"
                    pick.text = dog
                    if (document.getElementById(`spreadlock-${idx}`).checked) {
                        pick.lock = true;
                        if (game.primetime) {
                            pick.worth = 7
                        } else {
                            pick.worth = 5
                        }
                    } else {
                        pick.lock = false
                        if (game.primetime) {
                            pick.worth = 2
                        } else {
                            pick.worth = 1
                        }
                    }
                } else if (document.getElementById(`chalk-${idx}`).checked) {
                    let chalk = `${chalkteam} ${document.getElementById(`label-chalk-${idx}`).innerText}`
                    pick.type = "line"
                    pick.bet = "chalk"
                    pick.text = chalk
                    if (document.getElementById(`spreadlock-${idx}`).checked) {
                        pick.lock = true
                        if (game.primetime) {
                            pick.worth = 7
                        } else {
                            pick.worth = 5
                        }
                    } else {
                        pick.lock = false
                        if (game.primetime) {
                            pick.worth = 2
                        } else {
                            pick.worth = 1
                        }
                    }
                }

                if (pick.type) {
                    picksArr.push(pick)
                }
            } 


            if (game.over || game.under) {
                let pick = {
                    gameId: game.id
                }

                if (document.getElementById(`over-${idx}`).checked) {
                    let over = `${game.awayteam} vs. ${game.hometeam} ${document.getElementById(`label-over-${idx}`).innerText}`
                    pick.type = "totalpoints"
                    pick.bet = "over"
                    pick.text = over;
                    if (document.getElementById(`totalpointslock-${idx}`).checked) {
                        pick.lock = true
                        if (game.primetime) {
                            pick.worth = 7
                        } else {
                            pick.worth = 5
                        }
                    } else {
                        pick.lock = false
                        if (game.primetime) {
                            pick.worth = 2
                        } else {
                            pick.worth = 1
                        }
                    }
                } else if (document.getElementById(`under-${idx}`).checked) {
                    let under = `${game.awayteam} vs. ${game.hometeam} ${document.getElementById(`label-under-${idx}`).innerText}`
                    pick.type = "totalpoints"
                    pick.bet = "under"
                    pick.text = under;
                    if (document.getElementById(`totalpointslock-${idx}`).checked) {
                        pick.lock = true
                        if (game.primetime) {
                            pick.worth = 7
                        } else {
                            pick.worth = 5
                        }
                    } else {
                        pick.lock = false
                        if (game.primetime) {
                            pick.worth = 2
                        } else {
                            pick.worth = 1
                        }
                    }
                }

                if (pick.type) {
                    picksArr.push(pick)
                }
            } 
        })

        let pickData = {
            picks: picksArr
        }
        postPick(pickData)
    }

    const postParlay = async (parlayData) => {
        const { parlayPicks } = parlayData
        let alert = ""

        for (let i = 0; i < parlayPicks.length; i++) {
            await fetch(`${API_URL}/parlays/addParlayPick`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    parlaynumber: parlayPicks[i].parlaynumber,
                    gameid: parlayPicks[i].gameId,
                    type: parlayPicks[i].type,
                    bet: parlayPicks[i].bet,
                    text: parlayPicks[i].text,
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
            alert = "You have made your parlay!!"
        }

        setAlertMessage(alert)
        showAlert();
        setUpdate(!update)
    }

    function submitParlay1() {
        let parlaysArr = [];
        sortedGames.map((game, idx) => {
            let chalkteam = "";
            let dogteam = ""

            if (game.favoredteam === 'home') {
                chalkteam = game.hometeam;
                dogteam = game.awayteam;
            }

            if (game.favoredteam === 'away') {
                chalkteam = game.awayteam;
                dogteam = game.hometeam;
            }

            if (game.dog || game.chalk) {
                let parlayPick = {
                    gameId: game.id,
                    parlaynumber: 1
                }

                if (document.getElementById(`parlay1-dog-${idx}`).checked) {
                    let dog = `${dogteam} ${document.getElementById(`label-parlay1-dog-${idx}`).innerText}`
                    parlayPick.type = "line"
                    parlayPick.bet = "dog"
                    parlayPick.text = dog
                } else if (document.getElementById(`parlay1-chalk-${idx}`).checked) {
                    let chalk = `${chalkteam} ${document.getElementById(`label-parlay1-chalk-${idx}`).innerText}`
                    parlayPick.type = "line"
                    parlayPick.bet = "chalk"
                    parlayPick.text = chalk
                }

                if (parlayPick.type) {
                    parlaysArr.push(parlayPick)
                }
            } 


            if (game.over || game.under) {
                let parlayPick = {
                    gameId: game.id,
                    parlaynumber: 1
                }

                if (document.getElementById(`parlay1-over-${idx}`).checked) {
                    let over = `${game.awayteam} vs. ${game.hometeam} ${document.getElementById(`label-parlay1-over-${idx}`).innerText}`
                    parlayPick.type = "totalpoints"
                    parlayPick.bet = "over"
                    parlayPick.text = over;
                } else if (document.getElementById(`parlay1-under-${idx}`).checked) {
                    let under = `${game.awayteam} vs. ${game.hometeam} ${document.getElementById(`label-parlay1-under-${idx}`).innerText}`
                    parlayPick.type = "totalpoints"
                    parlayPick.bet = "under"
                    parlayPick.text = under;
                }

                if (parlayPick.type) {
                    parlaysArr.push(parlayPick)
                }
            } 
        })

        let parlayData = {
            parlayPicks: parlaysArr
        }

        if (parlaysArr.length < 2) {
            setAlertMessage("You must make at least 2 picks for a parlay")
            showAlert()
        } else if (parlaysArr.length > 6) {
            setAlertMessage("You can only make up to 6 picks for a parlay")
            showAlert()
        } else {
            postParlay(parlayData)
        }
    }

    function showContainers(event) {
        let target = event.target.id
        let picksContainer = document.getElementById("makepicks");
        let parlay1Container = document.getElementById('parlay1-container');
        let picksButton = document.getElementById('picks')
        let parlayButton = document.getElementById('parlay1')

        if (target === "picks") {
            picksContainer.style.display = "initial";
            parlay1Container.style.display = "none";
            picksButton.style.backgroundColor = "white";
            picksButton.style.color = "black";
            parlayButton.style.backgroundColor = "black";
            parlayButton.style.color = "white";
        }

        if (target === 'parlay1') {
            picksContainer.style.display = "none"
            parlay1Container.style.display = "initial";
            parlayButton.style.backgroundColor = "white";
            parlayButton.style.color = "black";
            picksButton.style.backgroundColor = "black";
            picksButton.style.color = "white";
        }
    }

    function checkTime(date, time) {
        const currentDate = new Date()
        const comparedDate = new Date(new Date(`${date}T${time}-0500`))

        if (currentDate > comparedDate) {
            return true
        } else {
            return false
        }
    }

    return (
        <div className='games'>
            <div className="buttons-div">
                <span className="buttons" id="picks" onClick={showContainers}>PICKS</span>
                <span className="buttons" id="parlay1" onClick={showContainers}>PARLAY</span>
            </div>
            <div id="makepicks">
                <form id="picks-form">
                    { sortedGames ? sortedGames.map((game, idx) => {
                        return (
                        <div key={idx} className='game'>
                            <div className='info'>
                                {game.date && game.time ? <p className="date">{new Date(`${game.date}T${game.time}`).toDateString()} at {convertTime(game.time)} CT</p> : null}
                                <p className="level" id={`level-${idx}`}>{game.level} {game.primetime ? <span>PRIMETIME</span> : null}</p>
                                {checkTime(game.date, game.time) === true ? <p>GAME DISABLED</p> : null }
                            </div>
                            <div className='gamestuff'>
                                <div className="matchup">
                                    { game.awayteam && game.hometeam ? <>
                                        <h3 className="matchup-away">{game.awayteam.toUpperCase()}</h3>
                                        <h3 className="matchup-home">{game.hometeam.toUpperCase()}</h3>
                                    </>
                                    : <h3 className="singleteam">{game.hometeam}</h3>}
                                </div>
                                <div className="spread">
                                    { game.awayteam && game.hometeam && game.favoredteam === 'home' ? <>
                                        { game.dog ? <>
                                        <input className="pick-checkbox" type='checkbox' id={`dog-${idx}`} name={`spread-${idx}`} onChange={() => onlyOne(`dog-${idx}`, `spread-${idx}`)} disabled={checkTime(game.date, game.time) === true ? true : false }></input>
                                        <label htmlFor={`dog-${idx}`} id={`label-dog-${idx}`} className="pick-checkbox-label">
                                            +{game.line}</label></> : null}
                                        { game.chalk ? <>
                                        <input className="pick-checkbox" type='checkbox' id={`chalk-${idx}`} name={`spread-${idx}`} onChange={() => onlyOne(`chalk-${idx}`, `spread-${idx}`)} disabled={checkTime(game.date, game.time) === true ? true : false }></input>
                                        <label htmlFor={`chalk-${idx}`} id={`label-chalk-${idx}`} className="pick-checkbox-label">
                                            -{game.line}</label></> : null}
                                        { game.dog || game.chalk ? <>
                                        <input className="lock-checkbox" type='checkbox' id={`spreadlock-${idx}`} name={`spreadlock-${idx}`} disabled={checkTime(game.date, game.time) === true ? true : false }></input>                                        
                                        <label htmlFor={`spreadlock-${idx}`} id={`label-spreadlock-${idx}`} className="lock-checkbox-label">
                                            LOCK</label> </> : null}
                                        </> : null}
                                    { game.awayteam && game.hometeam && game.favoredteam === 'away' ? <>
                                        { game.chalk ? <>
                                        <input className="pick-checkbox" type='checkbox' id={`chalk-${idx}`} name={`spread-${idx}`} onChange={() => onlyOne(`chalk-${idx}`, `spread-${idx}`)} disabled={checkTime(game.date, game.time) === true ? true : false }></input>
                                        <label htmlFor={`chalk-${idx}`} id={`label-chalk-${idx}`} className="pick-checkbox-label">
                                            -{game.line}</label></> : null}
                                        { game.dog ? <>
                                        <input className="pick-checkbox" type='checkbox' id={`dog-${idx}`} name={`spread-${idx}`} onChange={() => onlyOne(`dog-${idx}`, `spread-${idx}`)} disabled={checkTime(game.date, game.time) === true ? true : false }></input>
                                        <label htmlFor={`dog-${idx}`} id={`label-dog-${idx}`} className="pick-checkbox-label">
                                            +{game.line}</label></> : null}
                                        { game.dog || game.chalk ? <>
                                        <input className="lock-checkbox" type='checkbox' id={`spreadlock-${idx}`} name={`spreadlock-${idx}`} disabled={checkTime(game.date, game.time) === true ? true : false }></input>
                                        <label htmlFor={`spreadlock-${idx}`} id={`label-spreadlock-${idx}`} className="lock-checkbox-label">
                                            LOCK</label> </> :null}
                                        </> : null}
                                </div>
                                <div className="total">
                                    { game.awayteam && game.hometeam && game.totalpoints ? <>
                                        { game.over ? <>
                                        <input className="pick-checkbox" type='checkbox' id={`over-${idx}`} name={`total-${idx}`} onChange={() => onlyOne(`over-${idx}`, `total-${idx}`)} disabled={checkTime(game.date, game.time) === true ? true : false }></input>
                                        <label htmlFor={`over-${idx}`} id={`label-over-${idx}`} className="pick-checkbox-label">
                                            O {game.totalpoints}</label></> : null}
                                        { game.under ? <>
                                        <input className="pick-checkbox" type='checkbox' id={`under-${idx}`} name={`total-${idx}`} onChange={() => onlyOne(`under-${idx}`, `total-${idx}`)} disabled={checkTime(game.date, game.time) === true ? true : false }></input>
                                        <label htmlFor={`under-${idx}`} id={`label-under-${idx}`} className="pick-checkbox-label">
                                            U {game.totalpoints}</label></> : null}
                                        { game.over || game.under ? <>
                                        <input className="lock-checkbox" type='checkbox' id={`totalpointslock-${idx}`} name={`totalpointslock-${idx}`} disabled={checkTime(game.date, game.time) === true ? true : false }></input>
                                        <label htmlFor={`totalpointslock-${idx}`} id={`label-totalpointslock-${idx}`} className="lock-checkbox-label">
                                            LOCK</label> </> :null}
                                        </> : null}
                                </div>
                            </div>
                        </div>
                        )
                    }) : <div>No games to display</div>}
                    <br />
                    <div className="submit-button">
                        <input type='button' onClick={submitPick} value='SUBMIT PICKS'></input>
                    </div>
                </form>
            </div>
            <div id='parlay1-container'>
                <form id="parlay-form">
                    { sortedGames ? sortedGames.map((game, idx) => {
                        return (
                        <div key={idx} className='parlay1game'>
                            <div className='info'>
                                {game.date && game.time ? <p className="date">{new Date(`${game.date}T${game.time}`).toDateString()} at {convertTime(game.time)} CT</p> : null}
                                <p className="level" id={`level-${idx}`}>{game.level} {game.primetime ? <span>PRIMETIME</span> : null}</p>
                                {checkTime(game.date, game.time) === true ? <p>GAME DISABLED</p> : null }
                            </div>
                            <div className='gamestuff'>
                                <div className="matchup">
                                    { game.awayteam && game.hometeam ? <>
                                        <h3 className="matchup-away">{game.awayteam.toUpperCase()}</h3>
                                        <h3 className="matchup-home">{game.hometeam.toUpperCase()}</h3>
                                    </>
                                    : <h3 className="singleteam">{game.hometeam}</h3>}
                                </div>
                                <div className="spread">
                                    { game.awayteam && game.hometeam && game.favoredteam === 'home' ? <>
                                        { game.dog ? <><input className="pick-checkbox" type='checkbox' id={`parlay1-dog-${idx}`} name={`parlay1-spread-${idx}`} onChange={() => onlyOne(`parlay1-dog-${idx}`, `parlay1-spread-${idx}`)} disabled={checkTime(game.date, game.time) === true ? true : false }></input>
                                        <label htmlFor={`parlay1-dog-${idx}`} className="pick-checkbox-label" id={`label-parlay1-dog-${idx}`}>+{game.line}</label></> : null}
                                        { game.chalk ? <><input className="pick-checkbox" type='checkbox' id={`parlay1-chalk-${idx}`} name={`parlay1-spread-${idx}`} onChange={() => onlyOne(`parlay1-chalk-${idx}`, `parlay1-spread-${idx}`)} disabled={checkTime(game.date, game.time) === true ? true : false }></input>
                                        <label htmlFor={`parlay1-chalk-${idx}`} className="pick-checkbox-label" id={`label-parlay1-chalk-${idx}`}>-{game.line}</label></> : null}
                                        </> : null}
                                    { game.awayteam && game.hometeam && game.favoredteam === 'away' ? <>
                                        { game.chalk ? <><input className="pick-checkbox" type='checkbox' id={`parlay1-chalk-${idx}`} name={`parlay1-spread-${idx}`} onChange={() => onlyOne(`parlay1-chalk-${idx}`, `parlay1-spread-${idx}`)} disabled={checkTime(game.date, game.time) === true ? true : false }></input>
                                        <label htmlFor={`parlay1-chalk-${idx}`} className="pick-checkbox-label" id={`label-parlay1-chalk-${idx}`}>-{game.line}</label></> : null}
                                        { game.dog ? <><input className="pick-checkbox" type='checkbox' id={`parlay1-dog-${idx}`} name={`parlay1-spread-${idx}`} onChange={() => onlyOne(`parlay1-dog-${idx}`, `parlay1-spread-${idx}`)} disabled={checkTime(game.date, game.time) === true ? true : false }></input>
                                        <label htmlFor={`parlay1-dog-${idx}`}className="pick-checkbox-label" id={`label-parlay1-dog-${idx}`}>+{game.line}</label></> : null}
                                        </> : null}
                                </div>
                                <div className="total">
                                    { game.awayteam && game.hometeam && game.totalpoints ? <>
                                        { game.over ? <><input className="pick-checkbox" type='checkbox' id={`parlay1-over-${idx}`} name={`parlay1-total-${idx}`} onChange={() => onlyOne(`parlay1-over-${idx}`, `parlay1-total-${idx}`)} disabled={checkTime(game.date, game.time) === true ? true : false }></input>
                                        <label htmlFor={`parlay1-over-${idx}`} className="pick-checkbox-label" id={`label-parlay1-over-${idx}`}>O {game.totalpoints}</label></> : null}
                                        { game.under ? <><input className="pick-checkbox" type='checkbox' id={`parlay1-under-${idx}`} name={`parlay1-total-${idx}`} onChange={() => onlyOne(`parlay1-under-${idx}`, `parlay1-total-${idx}`)} disabled={checkTime(game.date, game.time) === true ? true : false }></input>
                                        <label htmlFor={`parlay1-under-${idx}`}className="pick-checkbox-label" id={`label-parlay1-under-${idx}`}>U {game.totalpoints}</label></> : null}
                                        </> : null}
                                </div>
                            </div>
                        </div>
                        )
                    }) : <div>No games to display</div>}
                    <br />
                    <div className="submit-button">
                        <input type='button' onClick={submitParlay1} value='SUBMIT PARLAY'></input>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Picks;