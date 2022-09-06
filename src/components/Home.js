import "../style/home.css"

const Home = () => {
    let returnedObj = {
        chosenQuote: null,
        chosenAuthor: null
    }

    function randomQuote() {
        let randomQuotes = [
            "Quit while you’re ahead. All the best gamblers do.",
            "Hoping to recoup is what ruins the gambler.",
            "If you don’t gamble, you’ll never win.",
            "Show me a gambler and I’ll show you a loser.",
            "A dollar won is twice as sweet as a dollar earned.",
            "If there weren’t luck involved, I would win every time."
        ]

        let authors = [
            "Baltasar Gracián",
            'Irish proverb',
            'Charles Bukowski',
            "Mario Puzo",
            "Paul Newman",
            "Phil Hellmuth"
        ]

        let randomNumber = Math.floor(Math.random() * 6)

        returnedObj.chosenQuote = randomQuotes[randomNumber]
        returnedObj.chosenAuthor = authors[randomNumber]
    }

    randomQuote()

    return (
        <div id="home">
            <p id="quote">"{returnedObj.chosenQuote}"</p>
            <p id="author">- {returnedObj.chosenAuthor}</p>
        </div>
    )
}

export default Home;