import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Register,
         Login,
         InputGames,
         Games
} from './components';

const API_URL = 'https://floating-stream-77094.herokuapp.com/api'


const App = () => {
    const [games, setGames] = useState([]);
    const [token, setToken] = useState([]);

    return (
        <div>
            <h1>Welcome to Waldo Sports Co!</h1>
            <Login setToken={setToken} />
            <Register />
            <InputGames token={token}/>
            <Games games={games} setGames={setGames} token={token}/>
        </div>
    )
}

const appElement = document.getElementById('app');
const root = ReactDOM.createRoot(appElement);
root.render(<App />);