import "../style/home.css"
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { showAlert } from "./Alert";
import { fetchAllUsers } from "../axios-services";
const API_URL = 'https://floating-stream-77094.herokuapp.com/api'
TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo('en-US')

const Home = (props) => {
    const { users, allPosts, user, token, setAlertMessage, setUpdate, update } = props
    let returnedObj = {
        chosenQuote: null,
        chosenAuthor: null
    }
    
    const collectMessageData = async () => {
        const messageInput = document.getElementById('messageInput').value;
        const username = user.username
        let messageData = {}

        messageData = {
            username,
            message: messageInput
        };

        await sendMessage(messageData);
    }

    const sendMessage = async (messageData) => {
        const { username, message } = messageData;
        await fetch(`${API_URL}/posts/addPost`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                    username, message
            })
        }).then(response => response.json())
        .then(result => {
            if (!result.name) {
                setAlertMessage('You have added a new post!')
                showAlert()
                setUpdate(!update)
                document.getElementById("messageInput").value = null;
            } else {
                setAlertMessage(result.message);
                showAlert()
            }
        })
        .catch(console.error)
    }

    const likeMessage = async (event, id) => {
        event.preventDefault()

        await fetch(`${API_URL}/posts/post/id/likePost/${id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(response => response.json())
        .then(result => {
            if (!result.name) {
                setAlertMessage('You have liked a post!')
                showAlert()
                setUpdate(!update)
            } else {
                setAlertMessage(result.message);
                showAlert()
            }
        })
        .catch(console.error)
    }

    async function deleteMessage(event, id) {
        event.preventDefault()
        await fetch(`${API_URL}/posts/deletePost/${id}`, {
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

    function randomQuote() {
        let randomQuotes = [
            "Quit while you’re ahead. All the best gamblers do.",
            "Hoping to recoup is what ruins the gambler.",
            "If you don’t gamble, you’ll never win.",
            "A dollar won is twice as sweet as a dollar earned.",
            "If there weren’t luck involved, I would win every time.",
            "At gambling, the deadly sin is to mistake bad play for bad luck.",
            "A gambler never makes the same mistake twice. It’s usually three or more times.",
            "The second-worst thing in the world is betting on a golf game and losing. The worst is not betting at all.",
            "I bet on my team every night. I didn't bet on my team four nights a week. I was wrong,  I bet on my team to win every night because I love my team, I believe in my team, I did everything in my power every night to win that game.",
            "I bet 1500 total I don’t have a gambling problem",
            "Life's too short to bet the under.",
            "Don't be afraid to fade yourself"
        ]

        let authors = [
            "Baltasar Gracián",
            'Irish proverb',
            'Charles Bukowski',
            "Paul Newman",
            "Phil Hellmuth",
            "Ian Fleming",
            "Terrence 'VP Pappy' Murphy",
            "Bobby Riggs",
            "Pete Rose",
            "Calvin 'Big Parlay' Ridley",
            "Dan 'Big Cat' Katz",
            "Dan 'Big Cat' Katz"
        ]

        let randomNumber = Math.floor(Math.random() * 12)

        returnedObj.chosenQuote = randomQuotes[randomNumber]
        returnedObj.chosenAuthor = authors[randomNumber]
    }


    function getCharacterCount() {
        let characterCount = document.getElementById("messageInput").value.length;
        document.getElementById("characterCount").innerHTML = characterCount

        if (characterCount > 250) {
            document.getElementById("characterCount").style.color = "red"
        } else {
            document.getElementById("characterCount").style.color = "black"
        }
    }

    randomQuote()

    return (
        <div id="home">
            <div id="quoteSection">
                <p id="quote">"{returnedObj.chosenQuote}"</p>
                <p id="author">- {returnedObj.chosenAuthor}</p>
            </div>
            <div id="adminSection">
            </div>
            <div id="messageBoardSection">
                <div id="posts">
                    <div>
                        { allPosts && users ? allPosts.map((post, idx) => {
                            let thisUser = users.find((thisuser) => thisuser.username === post.username)
                            const numberOfCrowns = thisUser.wins
                            const numberOfCrownsArray = []

                            for (let i = 0; i < numberOfCrowns; i++) {
                                numberOfCrownsArray.push("x")
                            }

                            return (
                                <div key={idx} id="individualPost" style={thisUser && thisUser.currentwinner ? {backgroundColor: "#f9d25ece"} : null}>
                                    <p>{post.username}
                                        {numberOfCrowns > 0 ? numberOfCrownsArray.map((index) => {
                                            return (
                                                <span key={index} id={`crownImages-${post.username}`}><img className='crownimg' src='https://i.ibb.co/84QXZfm/132-1325417-black-and-white-crown-emoji-fairytale-icon-hd-removebg-preview.png' width='20px'></img></span>
                                            )
                                        }) : null}
                                        <span id="timeposted">{timeAgo.format(new Date(post.time))}</span>
                                    </p>
                                    <p>{post.message}</p>
                                    <button id="likeButton" onClick={(event) => likeMessage(event, post.id)} disabled={(post.names && post.names.includes(user.username)) || post.username === user.username ? true : false }><img id="likeimg" src="https://i.ibb.co/mB7Vw5p/286-2863936-png-file-svg-youtube-like-button-white-transparent-removebg-preview.png"></img> {post.likes} likes</button>
                                    {post.username === user.username ? <button id="deletePostButton" onClick={(event) => deleteMessage(event, post.id)}>DELETE</button> : null}
                                </div>
                            )

                        }) : <div>No games to display</div>}
                    </div>
                </div>
                <div id="typeMessage">
                        <input id="messageInput" placeholder="Type Message Here..." onChange={getCharacterCount}></input>
                        <span><span id="characterCount"></span>/250</span>
                        <input type='submit' id="sendMessage" value='SEND' className="admin-submit" onClick={collectMessageData}></input>
                </div>
            </div>
        </div>
    )
}

export default Home;