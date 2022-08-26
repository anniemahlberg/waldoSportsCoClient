import dateFormat from "dateformat";
import convertTime from 'convert-time';

const API_URL = 'https://floating-stream-77094.herokuapp.com/api'

function onlyOne(checkboxId, pick) {
    let checkbox = document.getElementById(checkboxId);
    let checkboxes = document.getElementsByName(pick)
    checkboxes.forEach((item) => {
        if (item !== checkbox) item.checked = false
    })
}

const Games = (props) => {
    const { games, token, setAlertMessage } = props;

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


    return (
        <div className='games'>
            <h1>GAMES</h1>
            <div>
                <form>
                    { games ? games.map((game, idx) => {
                        return (
                        <div key={idx} className='game'>
                            <div className="info">
                                { game.awayteam && game.hometeam ?
                                <h3 className="matchup">{game.awayteam} @ {game.hometeam}</h3>
                                : <h3 className="singleteam">{game.hometeam}</h3>}
                                <h5 className="level">{game.level}</h5>
                                {game.date ? <h5 className="date">Date: {dateFormat(Date(game.date), 'fullDate')}</h5> : null}
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
        </div>
    )
}

export default Games;