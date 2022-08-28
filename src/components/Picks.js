import dateFormat from "dateformat";
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
    const { games, token, setAlertMessage, update, setUpdate } = props;

    const postPick = async (pickData) => {
        const { picks } = pickData
        let alert = ""

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
        games.map((game, idx) => {
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
        games.map((game, idx) => {
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
        } else if (parlaysArr.length > 4) {
            setAlertMessage("You can only make up to 4 picks for a parlay")
            showAlert()
        } else {
            postParlay(parlayData)
        }
    }

    function submitParlay2() {
        let parlaysArr = [];
        games.map((game, idx) => {
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
                    parlaynumber: 2
                }

                if (document.getElementById(`parlay2-dog-${idx}`).checked) {
                    let dog = `${dogteam} ${document.getElementById(`label-parlay2-dog-${idx}`).innerText}`
                    parlayPick.type = "line"
                    parlayPick.bet = "dog"
                    parlayPick.text = dog
                } else if (document.getElementById(`parlay2-chalk-${idx}`).checked) {
                    let chalk = `${chalkteam} ${document.getElementById(`label-parlay2-chalk-${idx}`).innerText}`
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
                    parlaynumber: 2
                }

                if (document.getElementById(`parlay2-over-${idx}`).checked) {
                    let over = `${game.awayteam} vs. ${game.hometeam} ${document.getElementById(`label-parlay2-over-${idx}`).innerText}`
                    parlayPick.type = "totalpoints"
                    parlayPick.bet = "over"
                    parlayPick.text = over;
                } else if (document.getElementById(`parlay2-under-${idx}`).checked) {
                    let under = `${game.awayteam} vs. ${game.hometeam} ${document.getElementById(`label-parlay2-under-${idx}`).innerText}`
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
            setAlertMessage("You must have at least 2 picks for a parlay")
            showAlert()
        } else if (parlaysArr.length > 2) {
            setAlertMessage("If you have 2 parlays, you can only make 2 picks for each")
            showAlert()
        } else {
            postParlay(parlayData)
        }
    }

    function showContainers(event) {
        let target = event.target.id
        let picksContainer = document.getElementById("makepicks");
        let parlaysContainer = document.getElementById("makeparlays");
        let parlay1Container = document.getElementById('parlay1-container');
        let parlay2Container = document.getElementById('parlay2-container');

        if (target === "picks") {
            picksContainer.style.display = "initial";
            parlaysContainer.style.display = "none";    
        }
    
        if (target === "parlays") {
            picksContainer.style.display = "none";
            parlaysContainer.style.display = "initial";    
        }

        if (target === 'parlay1') {
            parlay1Container.style.display = "initial";
            parlay2Container.style.display = "none";
        }

        if (target === 'parlay2') {
            parlay1Container.style.display = "none";
            parlay2Container.style.display = "initial";
        }
      }

      function searchGames(event) {
        let input = event.target.id
        let games = document.getElementsByClassName("game")
        let parlays1 = document.getElementsByClassName("parlay1game")
        let parlays2 = document.getElementsByClassName("parlay2game")
        for (let i = 0; i < games.length; i++) {
            if (input === "all") {
                games[i].style.display = "initial"
            } else if (document.getElementById(`level-${i}`)) {
                if (document.getElementById(`level-${i}`).innerText !== input) {
                    games[i].style.display = "none"
                } else {
                    games[i].style.display = "initial"
                }
            }

            if (input === "parlay-all") {
                parlays1[i].style.display = "initial"
                parlays2[i].style.display = "initial"

            } else if (document.getElementById(`level-${i}`)) {
                if (`parlay-${document.getElementById(`level-${i}`).innerText}` !== input) {
                    parlays1[i].style.display = "none"
                    parlays2[i].style.display = "none"

                } else {
                    parlays1[i].style.display = "initial"
                    parlays2[i].style.display = "initial"

                }
            }
        }
      }

    return (
        <div className='games'>
            <div>
                <span className="buttons" id="picks" onClick={showContainers}>PICKS</span>
                <span className="buttons" id="parlays" onClick={showContainers}>PARLAYS</span>
            </div>
            <br />
            <div id="makepicks">
                <h2>PICKS</h2>
                <div>
                    <span className="buttons" id="all" onClick={searchGames}>ALL</span>
                    <span className="buttons" id="NFL" onClick={searchGames}>NFL</span>
                    <span className="buttons" id="NCAA" onClick={searchGames}>NCAA</span>
                    <span className="buttons" id="MLB" onClick={searchGames}>MLB</span>
                    <span className="buttons" id="NBA" onClick={searchGames}>NBA</span>
                    <span className="buttons" id="NHL" onClick={searchGames}>NHL</span>
                </div>
                <br />
                <form>
                    { games ? games.map((game, idx) => {
                        return (
                        <div key={idx} className='game'>
                            <div className="info">
                                { game.awayteam && game.hometeam ?
                                <h3 className="matchup">{game.awayteam} @ {game.hometeam}</h3>
                                : <h3 className="singleteam">{game.hometeam}</h3>}
                                <h5 className="level" id={`level-${idx}`}>{game.level}</h5>
                                {game.date ? <h5 className="date">Date: {dateFormat(game.date, 'fullDate')}</h5> : null}
                                {game.time ? <h5 className="time">Time: {convertTime(game.time)} CT</h5> : null}
                                {game.primetime ? <h5>PRIMETIME</h5> : null}
                            </div>
                            <div className="spread">
                                { game.awayteam && game.hometeam && game.favoredteam === 'home' ? <>
                                    { game.dog ? <><input type='checkbox' id={`dog-${idx}`} name={`spread-${idx}`} onChange={() => onlyOne(`dog-${idx}`, `spread-${idx}`)}></input>
                                    <label id={`label-dog-${idx}`}>+{game.line}</label></> : null}
                                    { game.chalk ? <><input type='checkbox' id={`chalk-${idx}`} name={`spread-${idx}`} onChange={() => onlyOne(`chalk-${idx}`, `spread-${idx}`)}></input>
                                    <label id={`label-chalk-${idx}`}>-{game.line}</label></> : null}
                                    { game.dog || game.chalk ? <><input type='checkbox' id={`spreadlock-${idx}`} name={`spreadlock-${idx}`}></input>
                                    <label id={`label-spreadlock-${idx}`}>LOCK</label> </> : null}
                                    </> : null}
                                { game.awayteam && game.hometeam && game.favoredteam === 'away' ? <>
                                    { game.chalk ? <><input type='checkbox' id={`chalk-${idx}`} name={`spread-${idx}`} onChange={() => onlyOne(`dog-${idx}`, `spread-${idx}`)}></input>
                                    <label id={`label-chalk-${idx}`}>-{game.line}</label></> : null}
                                    { game.dog ? <><input type='checkbox' id={`dog-${idx}`} name={`spread-${idx}`} onChange={() => onlyOne(`chalk-${idx}`, `spread-${idx}`)}></input>
                                    <label id={`label-dog-${idx}`}>+{game.line}</label></> : null}
                                    { game.dog || game.chalk ? <><input type='checkbox' id={`spreadlock-${idx}`} name={`spreadlock-${idx}`}></input>
                                    <label id={`label-spreadlock-${idx}`}>LOCK</label> </> :null}
                                    </> : null}
                            </div>
                            <div className="total">
                                { game.awayteam && game.hometeam && game.totalpoints ? <>
                                    { game.over ? <><input type='checkbox' id={`over-${idx}`} name={`total-${idx}`} onChange={() => onlyOne(`over-${idx}`, `total-${idx}`)}></input>
                                    <label id={`label-over-${idx}`}>OVER {game.totalpoints}</label></> : null}
                                    { game.under ? <><input type='checkbox' id={`under-${idx}`} name={`total-${idx}`} onChange={() => onlyOne(`under-${idx}`, `total-${idx}`)}></input>
                                    <label id={`label-under-${idx}`}>UNDER {game.totalpoints}</label></> : null}
                                    { game.over || game.under ? <><input type='checkbox' id={`totalpointslock-${idx}`} name={`totalpointslock-${idx}`}></input>
                                    <label id={`label-totalpointslock-${idx}`}>LOCK</label> </> :null}
                                    </> : null}
                            </div>
                        </div>
                        )
                    }) : <div>No games to display</div>}
                    <br />
                    <div className="submit-button">
                        <input type='button' onClick={submitPick} value='SUBMIT'></input>
                    </div>
                </form>
            </div>
            <div id="makeparlays">
                <h2>PARLAY</h2>
                <div>
                    <span className="buttons" id="parlay1" onClick={showContainers}>PARLAY 1</span>
                    <span className="buttons" id="parlay2" onClick={showContainers}>PARLAY 2</span>
                </div>
                <br />
                <br />
                <div>
                    <span className="buttons" id="parlay-all" onClick={searchGames}>ALL</span>
                    <span className="buttons" id="parlay-NFL" onClick={searchGames}>NFL</span>
                    <span className="buttons" id="parlay-NCAA" onClick={searchGames}>NCAA</span>
                    <span className="buttons" id="parlay-MLB" onClick={searchGames}>MLB</span>
                    <span className="buttons" id="parlay-NBA" onClick={searchGames}>NBA</span>
                    <span className="buttons" id="parlay-NHL" onClick={searchGames}>NHL</span>
                </div>
                <br />
                <div id='parlay1-container'>
                    <form>
                        { games ? games.map((game, idx) => {
                            return (
                            <div key={idx} className='parlay1game'>
                                <div className="info">
                                    { game.awayteam && game.hometeam ?
                                    <h3 className="matchup">{game.awayteam} @ {game.hometeam}</h3>
                                    : <h3 className="singleteam">{game.hometeam}</h3>}
                                    <h5 className="level" id={`level-${idx}`}>{game.level}</h5>
                                    {game.date ? <h5 className="date">Date: {dateFormat(game.date, 'fullDate')}</h5> : null}
                                    {game.time ? <h5 className="time">Time: {convertTime(game.time)} CT</h5> : null}
                                    {game.primetime ? <h5>PRIMETIME</h5> : null}
                                </div>
                                <div className="spread">
                                    { game.awayteam && game.hometeam && game.favoredteam === 'home' ? <>
                                        { game.dog ? <><input type='checkbox' id={`parlay1-dog-${idx}`} name={`parlay1-spread-${idx}`} onChange={() => onlyOne(`parlay1-dog-${idx}`, `parlay1-spread-${idx}`)}></input>
                                        <label id={`label-parlay1-dog-${idx}`}>+{game.line}</label></> : null}
                                        { game.chalk ? <><input type='checkbox' id={`parlay1-chalk-${idx}`} name={`parlay1-spread-${idx}`} onChange={() => onlyOne(`parlay1-chalk-${idx}`, `parlay1-spread-${idx}`)}></input>
                                        <label id={`label-parlay1-chalk-${idx}`}>-{game.line}</label></> : null}
                                        </> : null}
                                    { game.awayteam && game.hometeam && game.favoredteam === 'away' ? <>
                                        { game.chalk ? <><input type='checkbox' id={`parlay1-chalk-${idx}`} name={`parlay1-spread-${idx}`} onChange={() => onlyOne(`parlay1-dog-${idx}`, `parlay1-spread-${idx}`)}></input>
                                        <label id={`label-parlay1-chalk-${idx}`}>-{game.line}</label></> : null}
                                        { game.dog ? <><input type='checkbox' id={`parlay1-dog-${idx}`} name={`parlay1-spread-${idx}`} onChange={() => onlyOne(`parlay1-chalk-${idx}`, `parlay1-spread-${idx}`)}></input>
                                        <label id={`label-parlay1-dog-${idx}`}>+{game.line}</label></> : null}
                                        </> : null}
                                </div>
                                <div className="total">
                                    { game.awayteam && game.hometeam && game.totalpoints ? <>
                                        { game.over ? <><input type='checkbox' id={`parlay1-over-${idx}`} name={`parlay1-total-${idx}`} onChange={() => onlyOne(`parlay1-over-${idx}`, `parlay1-total-${idx}`)}></input>
                                        <label id={`label-parlay1-over-${idx}`}>OVER {game.totalpoints}</label></> : null}
                                        { game.under ? <><input type='checkbox' id={`parlay1-under-${idx}`} name={`parlay1-total-${idx}`} onChange={() => onlyOne(`parlay1-under-${idx}`, `parlay1-total-${idx}`)}></input>
                                        <label id={`label-parlay1-under-${idx}`}>UNDER {game.totalpoints}</label></> : null}
                                        </> : null}
                                </div>
                            </div>
                            )
                        }) : <div>No games to display</div>}
                        <br />
                        <div className="submit-button">
                            <input type='button' onClick={submitParlay1} value='SUBMIT'></input>
                        </div>
                    </form>
                </div>
                <div id='parlay2-container'>
                    <form>
                        { games ? games.map((game, idx) => {
                            return (
                            <div key={idx} className='parlay2game'>
                                <div className="info">
                                    { game.awayteam && game.hometeam ?
                                    <h3 className="matchup">{game.awayteam} @ {game.hometeam}</h3>
                                    : <h3 className="singleteam">{game.hometeam}</h3>}
                                    <h5 className="level">{game.level}</h5>
                                    {game.date ? <h5 className="date">Date: {dateFormat(game.date, 'fullDate')}</h5> : null}
                                    {game.time ? <h5 className="time">Time: {convertTime(game.time)} CT</h5> : null}
                                    {game.primetime ? <h5>PRIMETIME</h5> : null}
                                </div>
                                <div className="spread">
                                    { game.awayteam && game.hometeam && game.favoredteam === 'home' ? <>
                                        { game.dog ? <><input type='checkbox' id={`parlay2-dog-${idx}`} name={`parlay2-spread-${idx}`} onChange={() => onlyOne(`parlay2-dog-${idx}`, `parlay2-spread-${idx}`)}></input>
                                        <label id={`label-parlay2-dog-${idx}`}>+{game.line}</label></> : null}
                                        { game.chalk ? <><input type='checkbox' id={`parlay2-chalk-${idx}`} name={`parlay2-spread-${idx}`} onChange={() => onlyOne(`parlay2-chalk-${idx}`, `parlay2-spread-${idx}`)}></input>
                                        <label id={`label-parlay2-chalk-${idx}`}>-{game.line}</label></> : null}
                                        </> : null}
                                    { game.awayteam && game.hometeam && game.favoredteam === 'away' ? <>
                                        { game.chalk ? <><input type='checkbox' id={`parlay2-chalk-${idx}`} name={`parlay2-spread-${idx}`} onChange={() => onlyOne(`parlay2-dog-${idx}`, `parlay2-spread-${idx}`)}></input>
                                        <label id={`label-parlay2-chalk-${idx}`}>-{game.line}</label></> : null}
                                        { game.dog ? <><input type='checkbox' id={`parlay2-dog-${idx}`} name={`parlay2-spread-${idx}`} onChange={() => onlyOne(`parlay2-chalk-${idx}`, `parlay2-spread-${idx}`)}></input>
                                        <label id={`label-parlay2-dog-${idx}`}>+{game.line}</label></> : null}
                                        </> : null}
                                </div>
                                <div className="total">
                                    { game.awayteam && game.hometeam && game.totalpoints ? <>
                                        { game.over ? <><input type='checkbox' id={`parlay2-over-${idx}`} name={`parlay2-total-${idx}`} onChange={() => onlyOne(`parlay2-over-${idx}`, `parlay2-total-${idx}`)}></input>
                                        <label id={`label-parlay2-over-${idx}`}>OVER {game.totalpoints}</label></> : null}
                                        { game.under ? <><input type='checkbox' id={`parlay2-under-${idx}`} name={`parlay2-total-${idx}`} onChange={() => onlyOne(`parlay2-under-${idx}`, `parlay2-total-${idx}`)}></input>
                                        <label id={`label-parlay2-under-${idx}`}>UNDER {game.totalpoints}</label></> : null}
                                        </> : null}
                                </div>
                            </div>
                            )
                        }) : <div>No games to display</div>}
                        <br />
                        <div className="submit-button">
                            <input type='button' onClick={submitParlay2} value='SUBMIT'></input>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Picks;