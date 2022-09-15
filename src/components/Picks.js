import convertTime from 'convert-time';
import { showAlert } from "./Alert";
import '../style/picks.css'
import { useEffect } from 'react';
import { fetchAllPicks } from '../axios-services';

const API_URL = 'https://floating-stream-77094.herokuapp.com/api'

const Picks = (props) => {
    const { token, setAlertMessage, update, setUpdate, sortedGames, myPicks, setPicks, setMyPicks, user, weeklyPicks } = props;

    useEffect(() => {
        const getMyPicks = async () => {
            const allPicks = await fetchAllPicks()
            setPicks(allPicks)
            if (user.username) {
                const mypicks = allPicks.filter(pick => {
                    const myWeeklyPick = weeklyPicks.find(weeklyPick => weeklyPick.username === user.username)
                    if (myWeeklyPick) {
                        return myWeeklyPick.id === pick.weeklyid
                    }
                })
                setMyPicks(mypicks)
            }
        }

        getMyPicks()
    }, [update])

    const postPick = async (pickData) => {
        const { picks } = pickData
        let alert = ""

        if (picks.length + myPicks.length > 20) {
            setAlertMessage(`You can only make 20 picks!`)
            showAlert()
            return
        }

        let locksLength = 0;
        for (let i = 0; i < picks.length; i++) {
            if (picks[i].lock) {
                locksLength++
            }
        }

        for (let i = 0; i < myPicks.length; i++) {
            if (myPicks[i].lock) {
                locksLength++
            }
        }
        
        if (locksLength < 3) {
            setAlertMessage("You must lock at least 3 picks!")
            showAlert()
            return
        }

        if (locksLength > 7) {
            setAlertMessage("You can only lock 7 picks!")
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

        document.getElementById("confirmation-container").style.display = "none"
        setAlertMessage(alert)
        showAlert();
        setUpdate(!update)
    }

    const submitPick = (event) => {
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

        if (event.target.id === "confirm-button") {
            document.getElementById("confirmation-container").style.display = "initial"
            confirmPick(pickData)
        }

        if (event.target.id === "submit-button") {
            postPick(pickData)
        }
    }

    function confirmPick(data) {
        const { picks } = data
        let confirmationContainer = document.getElementById("confirm-picks");
        let confirmationHTML = "";
        let total = 0;

        for (let i = 0; i < picks.length; i++) {
            let pick = picks[i];
            total += pick.worth

            let pickHTML = 
            `<tr>
                <td>${i+1}</td>
                <td>${pick.text}</td>
                <td>${pick.lock ? "LOCK" : ""}</td>
                <td>${pick.worth}</td>
            </tr>`

            confirmationHTML += pickHTML
        }

        confirmationContainer.innerHTML += confirmationHTML += 
            `<tr>
                <td></td>
                <td></td>
                <th>Potential</th>
                <td>${total}</td>
            </tr>`
    }

    function confirmEditPick() {
        let confirmationContainer = document.getElementById("confirm-picks");
        confirmationContainer.innerHTML = ""
        document.getElementById("confirmation-container").style.display = "none"
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

        document.getElementById("confirmation-container").style.display = "none"
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
        } else if (event.target.id === "confirm-parlay-button"){
            document.getElementById("parlay-confirmation-container").style.display = "initial"
            confirmParlay(parlayData)
        } else if (event.target.id === "submit-parlay-button") {
            postParlay(parlayData)
        }
    }

    function confirmParlay(data) {
        const { parlayPicks } = data
        let parlayConfirmationContainer = document.getElementById("confirm-parlay");
        let parlayConfirmationHTML = "";

        for (let i = 0; i < parlayPicks.length; i++) {
            let parlay = parlayPicks[i];

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

    function showContainers(event) {
        let target = event.target.id
        let picksContainer = document.getElementById("makepicks");
        let parlay1Container = document.getElementById('parlay1-container');
        let picksButton = document.getElementById('picks')
        let parlayButton = document.getElementById('parlay1')
        let rulesContainer = document.getElementById("rules-container")
        let rulesButton = document.getElementById("rules")
        let filterButton = document.getElementById("filterpicks")
        let filterContainer = document.getElementById("filter-options")

        if (target === "picks") {
            picksContainer.style.display = "initial";
            parlay1Container.style.display = "none";
            picksButton.style.backgroundColor = "white";
            picksButton.style.color = "black";
            parlayButton.style.backgroundColor = "black";
            parlayButton.style.color = "white";
            rulesContainer.style.display = "none"
            rulesButton.style.backgroundColor = "black"
            rulesButton.style.color = "white";
        }

        if (target === 'parlay1') {
            picksContainer.style.display = "none"
            parlay1Container.style.display = "initial";
            parlayButton.style.backgroundColor = "white";
            parlayButton.style.color = "black";
            picksButton.style.backgroundColor = "black";
            picksButton.style.color = "white";
            rulesContainer.style.display = "none"
            rulesButton.style.backgroundColor = "black"
            rulesButton.style.color = "white";
        }

        if (target === 'rules') {
            picksContainer.style.display = "none"
            parlay1Container.style.display = "none";
            parlayButton.style.backgroundColor = "black";
            parlayButton.style.color = "white";
            picksButton.style.backgroundColor = "black";
            picksButton.style.color = "white";
            rulesContainer.style.display = "flex"
            rulesButton.style.backgroundColor = "white"
            rulesButton.style.color = "black";
            filterContainer.style.display = "none";
            filterButton.style.backgroundColor = "black";
            filterButton.style.color = "white"
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
                if (!game[i].innerHTML.toLowerCase().includes(input)) {
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

    function randomPic() {
        let randomPics = [
            'https://i.ibb.co/KmVz12h/IMG-0533.jpg',
            'https://i.ibb.co/pwWQwtj/65100601234-C3-FB3-D89-069-E-4-F6-D-A05-D-467-E19815-E67.jpg',
            'https://i.ibb.co/T259v46/66337169993-C2004769-7756-4-E71-912-D-656-D661-DCB95.jpg',
            'https://i.ibb.co/qmtgN6j/66337172944-7240-F41-C-4-D1-E-44-DE-B43-C-52945834-B979.jpg'
        ]

        let randomNumber = Math.floor(Math.random() * 4)
        return randomPics[randomNumber]     
    }

    let randomPicture = randomPic()
    function showPic() {
        randomPic()
        document.getElementById("randompic").style.display = "initial";
        function hidePic() {
            document.getElementById("randompic").style.display = "none";
        }
        setTimeout(hidePic, 1000)   
    }

    function onlyOne(checkboxId, pick) {
        let checkbox = document.getElementById(checkboxId);
        let checkboxes = document.getElementsByName(pick)
        checkboxes.forEach((item) => {
            if (item !== checkbox) item.checked = false
        })
        getNumberOfPicks()
    }

    let prevLocks = 0;
    myPicks.forEach((pick) => {
        if (pick.lock) {
            prevLocks++
        }
    })
    
    function getNumberOfPicks() {
        const picks = myPicks.length + document.querySelectorAll("input[type=checkbox][class='pick-checkbox']:checked").length
        const locks = prevLocks + document.querySelectorAll("input[type=checkbox][class='lock-checkbox']:checked").length
        document.getElementById("numofpicks").innerHTML = picks
        document.getElementById("numoflocks").innerHTML = locks
        
    }

    return (
        <div className='games'>
            <div className="buttons-div">
                <span className="buttons" id="rules" onClick={showContainers}>RULES</span>
                <span className="buttons" id="picks" onClick={showContainers}>PICKS</span>
                <span className="buttons" id="parlay1" onClick={showContainers}>PARLAY</span>
                <span className="buttons" id="filterpicks" onClick={showFilters}>FILTER</span>
            </div>
            <div id="rules-container">
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
            <div id="makepicks">
                <div id="totals">
                    <p>Number of Picks: <span id="numofpicks">{myPicks ? myPicks.length : 0}</span></p>
                    <p>Number of Locks: <span id="numoflocks">{myPicks ? prevLocks : 0}</span></p>
                </div>
                <form id="picks-form">
                    { sortedGames ? sortedGames.map((game, idx) => {
                        return (
                        <div key={idx} className='game'>
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
                                        { game.dog ? <>
                                        <input className="pick-checkbox" type='checkbox' id={`dog-${idx}`} name={`spread-${idx}`} onChange={() => onlyOne(`dog-${idx}`, `spread-${idx}`)} disabled={checkTime(game.date, game.time) === true ? true : false }></input>
                                        <label htmlFor={`dog-${idx}`} id={`label-dog-${idx}`} className="pick-checkbox-label">
                                            +{game.line}</label></> : null}
                                        { game.chalk ? <>
                                        <input className="pick-checkbox" type='checkbox' id={`chalk-${idx}`} name={`spread-${idx}`} onChange={() => onlyOne(`chalk-${idx}`, `spread-${idx}`)} disabled={checkTime(game.date, game.time) === true ? true : false }></input>
                                        <label htmlFor={`chalk-${idx}`} id={`label-chalk-${idx}`} className="pick-checkbox-label">
                                            -{game.line}</label></> : null}
                                        { game.dog || game.chalk ? <>
                                        <input className="lock-checkbox" type='checkbox' id={`spreadlock-${idx}`} name={`spreadlock-${idx}`} onChange={() => getNumberOfPicks()} disabled={checkTime(game.date, game.time) === true ? true : false }></input>                                        
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
                                        <input className="lock-checkbox" type='checkbox' id={`spreadlock-${idx}`} name={`spreadlock-${idx}`} onChange={() => getNumberOfPicks()} disabled={checkTime(game.date, game.time) === true ? true : false }></input>
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
                                        <input className="lock-checkbox" type='checkbox' id={`totalpointslock-${idx}`} name={`totalpointslock-${idx}`} onChange={() => getNumberOfPicks()} disabled={checkTime(game.date, game.time) === true ? true : false }></input>
                                        <label htmlFor={`totalpointslock-${idx}`} id={`label-totalpointslock-${idx}`} className="lock-checkbox-label" >
                                            LOCK</label> </> :null}
                                        </> : null}
                                </div>
                            </div>
                        </div>
                        )
                    }) : <div>No games to display</div>}
                    <br />
                    <div className="submit-button">
                        <input id="confirm-button" type='button' onClick={(e) => submitPick(e)} value='CONFIRM PICKS'></input>
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
            <div  className="table" id="confirmation-container">
                <table>
                    <caption>CONFIRM PICKS</caption>
                    <thead>
                        <tr>
                            <th></th>
                            <th>PICK</th>
                            <th>LOCK</th>
                            <th>WORTH</th>
                        </tr>
                    </thead>
                    <tbody id="confirm-picks"></tbody>
                    <tfoot>
                        <tr>
                            <td><input type="button" value="BACK TO PICKS" onClick={confirmEditPick}></input></td>
                            <td><input type="button" onClick={showPic} value="?"></input></td>
                            <td><input type="button" value="SUBMIT PICKS" id="submit-button" onClick={(e) => submitPick(e)}></input></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div  className="table" id="parlay-confirmation-container">
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
            <div id="randompic">
                <img src={randomPicture}></img>
            </div>
        </div>
    )
}

export default Picks;