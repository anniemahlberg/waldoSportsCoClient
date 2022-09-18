import '../style/pick6.css'

const API_URL = 'https://floating-stream-77094.herokuapp.com/api'

const Pick6 = (props) => {

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

    return (
        <div>
            <div className="buttons-div">
                <span className="buttons" id="p6rules" onClick={showContainers}>RULES</span>
                <span className="buttons" id="pick6" onClick={showContainers}>PICK 6</span>
            </div>
            <div id="pick6-rules">
                <h1>GAME UNDER CONSTRUCTION</h1>
            </div>
            <div id="pick6-games">
                <h1>GAME UNDER CONSTRUCTION</h1>
            </div>
        </div>
    )
}

export default Pick6