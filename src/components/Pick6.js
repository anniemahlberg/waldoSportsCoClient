import '../style/pick6.css'
import convertTime from 'convert-time';
import { showAlert } from "./Alert";

const API_URL = 'https://floating-stream-77094.herokuapp.com/api'

const Pick6 = (props) => {
    const { token, setAlertMessage, update, setUpdate, sortedGames, myPicks, setPicks, setMyPicks, user, weeklyPicks } = props;

    const postParlay = async (picksixData) => {
        const { picksixPicks } = picksixData
        let alert = ""

        for (let i = 0; i < picksixPicks.length; i++) {
            await fetch(`${API_URL}/picksix/addPicksixPick`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    picknumber: picksixPicks[i].picknumber,
                    gameid: picksixPicks[i].gameId,
                    type: picksixPicks[i].type,
                    bet: picksixPicks[i].bet,
                    text: picksixPicks[i].text,
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

        document.getElementById("parlay-confirmation-container").style.display = "none"
        setAlertMessage(alert)
        showAlert();
        setUpdate(!update)
    }

    function submitParlay1(event) {
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
                let picksixPick = {
                    gameId: game.id,
                    picknumber: 1
                }

                if (document.getElementById(`parlay1-dog-${idx}`).checked) {
                    let dog = `${dogteam} ${document.getElementById(`label-parlay1-dog-${idx}`).innerText}`
                    picksixPick.type = "line"
                    picksixPick.bet = "dog"
                    picksixPick.text = dog
                } else if (document.getElementById(`parlay1-chalk-${idx}`).checked) {
                    let chalk = `${chalkteam} ${document.getElementById(`label-parlay1-chalk-${idx}`).innerText}`
                    picksixPick.type = "line"
                    picksixPick.bet = "chalk"
                    picksixPick.text = chalk
                }

                if (picksixPick.type) {
                    parlaysArr.push(picksixPick)
                }
            } 


            if (game.over || game.under) {
                let picksixPick = {
                    gameId: game.id,
                    picknumber: 1
                }

                if (document.getElementById(`parlay1-over-${idx}`).checked) {
                    let over = `${game.awayteam} vs. ${game.hometeam} ${document.getElementById(`label-parlay1-over-${idx}`).innerText}`
                    picksixPick.type = "totalpoints"
                    picksixPick.bet = "over"
                    picksixPick.text = over;
                } else if (document.getElementById(`parlay1-under-${idx}`).checked) {
                    let under = `${game.awayteam} vs. ${game.hometeam} ${document.getElementById(`label-parlay1-under-${idx}`).innerText}`
                    picksixPick.type = "totalpoints"
                    picksixPick.bet = "under"
                    picksixPick.text = under;
                }

                if (picksixPick.type) {
                    parlaysArr.push(picksixPick)
                }
            } 
        })

        let picksixData = {
            picksixPicks: parlaysArr
        }

        if (parlaysArr.length < 6) {
            setAlertMessage("You must make at least 6 picks for a parlay")
            showAlert()
        } else if (parlaysArr.length > 6) {
            setAlertMessage("You can only make up to 6 picks for a parlay")
            showAlert()
        } else if (event.target.id === "confirm-parlay-button"){
            document.getElementById("parlay-confirmation-container").style.display = "initial"
            confirmParlay(picksixData)
        } else if (event.target.id === "submit-parlay-button") {
            postParlay(picksixData)
        }
    }

    function confirmParlay(data) {
        const { picksixPicks } = data
        let parlayConfirmationContainer = document.getElementById("confirm-parlay");
        let parlayConfirmationHTML = "";

        for (let i = 0; i < picksixPicks.length; i++) {
            let parlay = picksixPicks[i];

            let parlayHTML = 
            `<tr>
                <td>${i+1}</td>
                <td>${parlay.text}</td>
            </tr>`

            parlayConfirmationHTML += parlayHTML
        }

        parlayConfirmationContainer.innerHTML += parlayConfirmationHTML;
    }

    function confirmEditParlay() {
        let parlayConfirmationContainer = document.getElementById("confirm-parlay");
        parlayConfirmationContainer.innerHTML = ""
        document.getElementById("parlay-confirmation-container").style.display = "none"
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

    function onlyOne(checkboxId, pick) {
        let checkbox = document.getElementById(checkboxId);
        let checkboxes = document.getElementsByName(pick)
        checkboxes.forEach((item) => {
            if (item !== checkbox) item.checked = false
        })
    }

    function showContainers(event) {
        let target = event.target.id
        let rulesContainer = document.getElementById("pick6-rules");
        let picksContainer = document.getElementById('pick6-games');
        let rulesButton = document.getElementById('p6rules')
        let picksButton = document.getElementById('pick6')
        let mineContainer = document.getElementById("pick6-mine")
        let leagueContainer = document.getElementById("pick6-league")
        let mineButton = document.getElementById("p6mine")
        let leagueButton = document.getElementById("p6league")


        if (target === "pick6") {
            picksContainer.style.display = "initial";
            rulesContainer.style.display = "none";
            mineContainer.style.display = "none";
            leagueContainer.style.display = "none";
            picksButton.style.backgroundColor = "white";
            picksButton.style.color = "black";
            rulesButton.style.backgroundColor = "black"
            rulesButton.style.color = "white";
            mineButton.style.backgroundColor = "black"
            mineButton.style.color = "white";
            leagueButton.style.backgroundColor = "black"
            leagueButton.style.color = "white";
        }

        if (target === "p6rules") {
            picksContainer.style.display = "none";
            rulesContainer.style.display = "initial";
            mineContainer.style.display = "none";
            leagueContainer.style.display = "none";
            picksButton.style.backgroundColor = "black";
            picksButton.style.color = "white";
            rulesButton.style.backgroundColor = "white"
            rulesButton.style.color = "black";
            mineButton.style.backgroundColor = "black"
            mineButton.style.color = "white";
            leagueButton.style.backgroundColor = "black"
            leagueButton.style.color = "white";
        }
    }

    function showFilters() {
        let filterButton = document.getElementById("filterpicks")
        let filterContainer = document.getElementById("filter-options")

        if (filterButton.style.backgroundColor === "white") {
            filterButton.style.backgroundColor = "black";
            filterButton.style.color = "white"
            filterContainer.style.display = "none"

        } else {
            filterButton.style.backgroundColor = "white";
            filterButton.style.color = "black";
            filterContainer.style.display = "flex"
        }
    }

    function filterPicks(event) {
        const game = document.getElementsByClassName("game")
        const parlay1game = document.getElementsByClassName("parlay1game")
        let input = event.target.value.toLowerCase()
        let id = event.target.id

        if (document.getElementById(id).checked && id !== "ALL") {
            for (let i = 0; i < game.length; i++) {
                if (input == "soccer" && (game[i].innerHTML.toLowerCase().includes("mls") || game[i].innerHTML.toLowerCase().includes("fifa") || game[i].innerHTML.toLowerCase().includes("premier"))) {
                    game[i].style.display = "initial"
                    parlay1game[i].style.display = "initial"
                } else if (!game[i].innerHTML.toLowerCase().includes(input)) {
                    game[i].style.display = "none"
                    parlay1game[i].style.display = "none"
                } else {
                    game[i].style.display = "initial"
                    parlay1game[i].style.display = "initial"
                }
            }
        } else {
            for (let i = 0; i < game.length; i++) {
                game[i].style.display = "initial"
                parlay1game[i].style.display = "initial"
            }
        }

    }

    return (
        <div>
            <div className="buttons-div">
                <span className="buttons" id="p6rules" onClick={showContainers}>RULES</span>
                <span className="buttons" id="pick6" onClick={showContainers}>PICK 6</span>
                <span className="buttons" id="filterpicks" onClick={showFilters}>FILTER</span>
            </div>
            <div id="pick6-rules">
                <div id="howto">
                    <h2><span style={{color: "#4ab5a3ac"}}>--- </span>HOW TO PLAY<span style={{color: "#4ab5a3ac"}}> ---</span></h2>
                    <ul>
                        <li>Venmo @WaldoSportsCo $10 to play</li>
                        <li>Place a maximum of 20 bets for the week</li>
                        <li>Each correct bet is worth +1 point. Each incorrect bet is -1.</li>
                        <li>You need to “Lock” at least 3 bets. These are the bets you are most confident in and are worth extra points. You can lock a maximum of 7 bets.</li>
                        <li>Each correctly chosen locked pick is worth +5 points. Each incorrect locked pick is worth -5 points.</li>
                        <li>We have some featured matchups designated as “Primetime”. Each primetime game is worth &#xb1; 2 points.</li>
                        <li>If you lock a primetime game, that game is worth &#xb1; 7 points.</li>
                        <li>You can also create an optional parlay for bonus points. Just click on the parlay tab and make a 2 to 6 game parlay.</li>
                    </ul>
                </div>
                <div id="pot">
                    <h2><span style={{color: "#4ab5a3ac"}}>--- </span>POT<span style={{color: "#4ab5a3ac"}}> ---</span></h2>
                    <ul>
                        <li>Weekly points winner takes the pot.</li>
                        <li>7% of the weekly pot goes to the season pot for the highest scoring bettor from weeks 1-18</li>
                        <li>Must play at least 14 weeks to qualify for season pot.</li>
                    </ul>
                </div>
                <div className="points">
                    <h2><span style={{color: "#4ab5a3ac"}}>--- </span>POINTS<span style={{color: "#4ab5a3ac"}}> ---</span></h2>
                    <p>PICKS</p>
                    <ul>
                        <li>Standard Bet: &#xb1; 1 point</li>
                        <li>Primetime Bet: &#xb1; 2 points</li>
                        <li>Lock Bet: &#xb1; 5 points</li>
                        <li>Primetime Lock Bets: &#xb1; 7 points</li>
                    </ul>
                    <p>PARLAYS</p>
                    <ul>
                        <li>2 game parlay: +4/-2</li>
                        <li>3 game parlay: +10/-3</li>
                        <li>4 game parlay: +20/-4</li>
                        <li>5 game parlay: +30/-5</li>
                        <li>6 game parlay: +60/-6</li>
                    </ul>
                </div>
            </div>
            <div id="filter-options" className="filter-options">
                <input className="filter-checkbox" type="radio" name="filter-radio" id="ALL" onChange={(e) => filterPicks(e)}></input>
                <label htmlFor="ALL">ALL GAMES</label>
                <h4>LEVEL</h4>
                <input className="filter-checkbox" type="radio" name="filter-radio" id="NFL" value="NFL" onChange={(e) => filterPicks(e)}></input>
                <label htmlFor="NFL">NFL</label>
                <input className="filter-checkbox" type="radio" name="filter-radio" id="NCAA" value="NCAA" onChange={(e) => filterPicks(e)}></input>
                <label htmlFor="NCAA">NCAA</label>
                <input className="filter-checkbox" type="radio" name="filter-radio" id="MLB" value="MLB" onChange={(e) => filterPicks(e)}></input>
                <label htmlFor="MLB">MLB</label>
                <input className="filter-checkbox" type="radio" name="filter-radio" id="NBA" value="NBA" onChange={(e) => filterPicks(e)}></input>
                <label htmlFor="NBA">NBA</label>
                <input className="filter-checkbox" type="radio" name="filter-radio" id="NHL" value="NHL" onChange={(e) => filterPicks(e)}></input>
                <label htmlFor="NHL">NHL</label>
                <input className="filter-checkbox" type="radio" name="filter-radio" id="SOCCER" value="SOCCER" onChange={(e) => filterPicks(e)}></input>
                <label htmlFor="SOCCER">SOCCER</label>
                <input className="filter-checkbox" type="radio" name="filter-radio" id="MMA" value="MMA" onChange={(e) => filterPicks(e)}></input>
                <label htmlFor="MMA">MMA</label>
                <h4>PRIMETIME</h4>
                <input className="filter-checkbox" type="radio" name="filter-radio" id="PRIMETIME" value="PRIMETIME" onChange={(e) => filterPicks(e)}></input>
                <label htmlFor="PRIMETIME">PRIMETIME</label>
                <h4>WEEKDAY</h4>
                <input className="filter-checkbox" type="radio" name="filter-radio" id="MONDAY" value="mon" onChange={(e) => filterPicks(e)}></input>
                <label htmlFor="MONDAY">MON</label>
                <input className="filter-checkbox" type="radio" name="filter-radio" id="TUESDAY" value="tue" onChange={(e) => filterPicks(e)}></input>
                <label htmlFor="TUESDAY">TU</label>
                <input className="filter-checkbox" type="radio" name="filter-radio" id="WEDNESDAY" value="wed" onChange={(e) => filterPicks(e)}></input>
                <label htmlFor="WEDNESDAY">WED</label>
                <input className="filter-checkbox" type="radio" name="filter-radio" id="THURSDAY" value="thu" onChange={(e) => filterPicks(e)}></input>
                <label htmlFor="THURSDAY">TH</label>
                <input className="filter-checkbox" type="radio" name="filter-radio" id="FRIDAY" value="fri" onChange={(e) => filterPicks(e)}></input>
                <label htmlFor="FRIDAY">FRI</label>
                <input className="filter-checkbox" type="radio" name="filter-radio" id="SATURDAY" value="sat" onChange={(e) => filterPicks(e)}></input>
                <label htmlFor="SATURDAY">SAT</label>
                <input className="filter-checkbox" type="radio" name="filter-radio" id="SUNDAY" value="sun" onChange={(e) => filterPicks(e)}></input>
                <label htmlFor="SUNDAY">SUN</label>
            </div>
            <div id="pick6-games">
                <form id="pick6-form">
                    { sortedGames ? sortedGames.map((game, idx) => {
                        return (
                        <div key={idx} className='picksixgame'>
                            <div className='info'>
                                {game.date && game.time ? <p className="date">{new Date(`${game.date}T${game.time}`).toDateString()} at {convertTime(game.time)} CT</p> : null}
                                <p className="level" id={`level-${idx}`}>{game.level} {game.primetime ? <span>PRIMETIME</span> : null}</p>
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
                        <input type='button' onClick={submitParlay1} id="confirm-parlay-button" value='CONFIRM PARLAY'></input>
                    </div>
                </form>
            </div>
            <div className="parlay-table" id="parlay-confirmation-container">
                <table>
                    <caption>CONFIRM PARLAY</caption>
                    <thead>
                        <tr>
                            <th></th>
                            <th>PICK</th>
                        </tr>
                    </thead>
                    <tbody id="confirm-parlay"></tbody>
                    <tfoot>
                        <tr>
                            <td><input type="button" value="BACK TO PARLAY" onClick={confirmEditParlay}></input></td>
                            <td><input type="button" value="SUBMIT PARLAY" id="submit-parlay-button" onClick={(e) => submitParlay1(e)}></input></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}

export default Pick6