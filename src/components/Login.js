const API_URL = 'https://floating-stream-77094.herokuapp.com/api'

const Login = (props) => {
    const { setToken } = props;
    const submitLogin = async (event) => {
        const userNameInput = document.getElementById('login-username').value;
        const password1Input = document.getElementById('login-password').value;
        event.preventDefault();
        
        let userData = {
            username: userNameInput,
            password: password1Input
        };
        
        await getUserToken(userData)
    }
    
    const getUserToken = async (userData) => {

        const user = await fetch(`${API_URL}/users/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                    username: userData.username,
                    password: userData.password
            })
        }).then(response => response.json())
        .then(result => {
            if (!result.name) {
                setToken(result.token)
                alert("You have logged in!")
            } else {
                alert(result.message);
            }
        })
        .catch(console.error)
    }

    return (
        <div className="login">
            <h1>LOGIN</h1>
            <div id='login-container'>
                <form id='login-form'>
                    <div className='inputs'>
                        <label>Username:</label>
                        <input id='login-username' type='text' placeholder="Enter Username"></input>
                        <br />
                        <label>Password:</label>
                        <input id='login-password' type='password' placeholder="Enter Password"></input>
                        <br />
                    </div>
                    <div className='submit-button'>
                        <button type="submit" onClick={submitLogin}>SUBMIT</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;