import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await fetch('https://floating-stream-77094.herokuapp.com/api/users');

                const data = await response.json();

                console.log("this is your data: ", data);

            } catch (error) {
                console.log(error);
            }
        }

        fetchAllUsers();
    }, [])
    return (
        <div>
            <h1>Welcome to Waldo Sports Co!</h1>
        </div>
    )
}

const appElement = document.getElementById('app');
const root = ReactDOM.createRoot(appElement);
root.render(<App />);