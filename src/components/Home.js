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
            "A dollar won is twice as sweet as a dollar earned.",
            "If there weren’t luck involved, I would win every time.",
            "At gambling, the deadly sin is to mistake bad play for bad luck.",
            "A gambler never makes the same mistake twice. It’s usually three or more times.",
            "The second-worst thing in the world is betting on a golf game and losing. The worst is not betting at all.",
            "I bet on my team every night. I didn't bet on my team four nights a week. I was wrong,  I bet on my team to win every night because I love my team, I believe in my team, I did everything in my power every night to win that game.",
            "I bet 1500 total I don’t have a gambling problem",
            "Life's too short to bet the under."
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
            "Dan 'Big Cat' Katz"
        ]

        let randomNumber = Math.floor(Math.random() * 11)

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