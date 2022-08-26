const API_URL = 'https://floating-stream-77094.herokuapp.com/api'

const Register = (props) => {   
    const { setAlertMessage } = props;
    const postUser = async (userData) => {
        const { username, password, firstname, lastname, email, venmo } = userData;
        await fetch(`${API_URL}/users/register`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                    username,
                    password,
                    firstname,
                    lastname,
                    email,
                    venmo
            })
        }).then(response => response.json())
        .then(result => {
            if (!result.name) {
                console.log(result)
                setAlertMessage('You have registered!')
            } else {
                setAlertMessage(result.message);
            }
        })
        .catch(console.error)
    }

    const submitRegistration = async (event) => {
        const usernameInput = document.getElementById('register-username').value;
        const password1Input = document.getElementById('register-password1').value;
        const password2Input = document.getElementById('register-password2').value;
        const firstnameInput = document.getElementById('register-firstname').value;
        const lastnameInput = document.getElementById('register-lastname').value;
        const emailInput = document.getElementById('register-email').value;
        const venmoInput = document.getElementById('register-venmo').value;

        let userData = {};
        event.preventDefault();
        
        if (usernameInput === "" || password1Input === "" || password2Input === "" || firstnameInput === "" || lastnameInput === "" || emailInput === "" || venmoInput === "") {
            setAlertMessage("Make sure to fill out each field.");
        } else if (usernameInput.length < 6 || password1Input.length < 6) {
            setAlertMessage("Username and password must be at least 6 characters long.")
        } else if (password1Input === password2Input) {
            userData = {
                username: usernameInput,
                password: password1Input,
                firstname: firstnameInput,
                lastname: lastnameInput,
                email: emailInput,
                venmo: venmoInput
            };
            
            await postUser(userData);
        } else {
            setAlertMessage("The passwords you entered do not match, try again!")
        } 
    }
    
    return (
        <div className="register">
            <h1>REGISTER</h1>
            <div id="form-container">
                <form id='register-form'>
                    <div className="inputs">
                        <label>First Name:</label>
                        <input id='register-firstname' type='text' placeholder="First Name"></input>
                        <br />
                        <label>Last Name:</label>
                        <input id='register-lastname' type='text' placeholder="Last Name"></input>
                        <br />
                        <label>Email:</label>
                        <input id='register-email' type='email' placeholder="Email"></input>
                        <br />
                        <label>Venmo:</label>
                        <input id='register-venmo' type='text' placeholder="Venmo"></input>
                        <br />
                        <label>Username:</label>
                        <input id='register-username' type='text' placeholder="Create a Username"></input>
                        <br />
                        <label>Password:</label>
                        <input id='register-password1' type='password' placeholder="Create a Password"></input>
                        <br />
                        <label>Confirm Password:</label>
                        <input id='register-password2' type='password' placeholder="Confirm Password"></input>
                        <br />
                    </div>
                    <div className="submit-button">
                        <button type="submit" onClick={submitRegistration}>SUBMIT</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register;