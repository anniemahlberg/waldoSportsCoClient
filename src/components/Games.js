import { useEffect } from "react";
import dateFormat, { masks } from "dateformat";
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
    const { games, setGames, token } = props;

    useEffect(() => {
        const fetchAllGames = async () => {
            try {
                const response = await fetch(`${API_URL}/games`);
                const data = await response.json();
                setGames(data.games);
            } catch (error) {
                console.log(error);
            }
        }    

        fetchAllGames();

        const fetchAllPicks = async () => {
            try {
                const response = await fetch(`${API_URL}/picks`)
                const data = await response.json()
                console.log(data)
            } catch (error) {
                console.log(error);
            }
        }

        fetchAllPicks();
    }, [])

    const postPick = async (pickData) => {
        const { picks } = pickData
        await fetch(`${API_URL}/picks/addPick`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                picks
            })
        }).then(response => response.json())
        .then(result => {
            if (!result.name) {
                console.log(result)
                alert("You have made your picks!")
            } else {
                alert(result.message)
            }
        })
        .catch(console.error)
    }

    const submitGame = (event) => {
        event.preventDefault();
        // variables are dogCheckbox0, chalkCheckbox0, overCheckbox0, underCheckbox0
        let variablesArr = [];
        games.map((game, idx) => {
            let chalkteam = "";
            let dogteam = "";

            if (game.favoredteam === 'home') {
                chalkteam = game.hometeam;
                dogteam = game.awayteam;
            }

            if (game.favoredteam === 'away') {
                chalkteam = game.awayteam;
                dogteam = game.hometeam;
            }

            if (game.dog) {
                if (document.getElementById(`dog-${idx}`).checked) {
                    window['dogCheckbox' + idx] = `${dogteam} ${document.getElementById(`label-dog-${idx}`).innerText}`
                    variablesArr.push(window['dogCheckbox' + idx])
                }
            } else if (!game.dog) {
                window['dogCheckbox' + idx] = false
            }

            if (game.chalk) {
                if (document.getElementById(`chalk-${idx}`).checked) {
                    window['chalkCheckbox' + idx] = `${chalkteam} ${document.getElementById(`label-chalk-${idx}`).innerText}`
                    variablesArr.push(window['chalkCheckbox' + idx])
                }
            } else if (!game.chalk) {
                window['chalkCheckbox' + idx] = false
            }

            if (game.over) {
                if (document.getElementById(`over-${idx}`).checked) {
                    window['overCheckbox' + idx] = `${game.awayteam} vs. ${game.hometeam} ${document.getElementById(`label-over-${idx}`).innerText}`
                    variablesArr.push(window['overCheckbox' + idx])
                }
            } else if (!game.over) {
                window['overCheckbox' + idx] = false
            }

            if (game.under) {
                if (document.getElementById(`under-${idx}`).checked) {
                    window['underCheckbox' + idx] = `${game.awayteam} vs. ${game.hometeam} ${document.getElementById(`label-under-${idx}`).innerText}`
                    variablesArr.push(window['underCheckbox' + idx])
                }
            } else if (!game.under) {
                window['underCheckbox' + idx] = false
            }
        })

        let pickData = {
            picks: variablesArr
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
                                    </> : null}
                                { game.awayteam && game.hometeam && game.favoredteam === 'away' ? <>
                                    { game.chalk ? <><input type='checkbox' id={`chalk-${idx}`} name={`spread-${idx}`} onChange={() => onlyOne(`dog-${idx}`, `spread-${idx}`)}></input>
                                    <label id={`label-chalk-${idx}`}>-{game.line}</label></> : null}
                                    { game.dog ? <><input type='checkbox' id={`dog-${idx}`} name={`spread-${idx}`} onChange={() => onlyOne(`chalk-${idx}`, `spread-${idx}`)}></input>
                                    <label id={`label-dog-${idx}`}>+{game.line}</label></> : null}
                                    </> : null}
                            </div>
                            <div className="total">
                                { game.awayteam && game.hometeam && game.totalpoints ? <>
                                    { game.over ? <><input type='checkbox' id={`over-${idx}`} name={`total-${idx}`} onChange={() => onlyOne(`over-${idx}`, `total-${idx}`)}></input>
                                    <label id={`label-over-${idx}`}>OVER {game.totalpoints}</label></> : null}
                                    { game.under ? <><input type='checkbox' id={`under-${idx}`} name={`total-${idx}`} onChange={() => onlyOne(`under-${idx}`, `total-${idx}`)}></input>
                                    <label id={`label-under-${idx}`}>UNDER {game.totalpoints}</label></> : null}
                                    </> : null}
                            </div>
                        </div>
                        )
                    }) : <div>No games to display</div>}
                    <br />
                    <div className="submit-button">
                        <input type='button' onClick={submitGame} value='SUBMIT'></input>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Games;