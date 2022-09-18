import "../style/profile.css"
import { showAlert } from "./Alert";

const API_URL = 'https://floating-stream-77094.herokuapp.com/api'

const MyInfo = (props) => {
    const { users, user, token, setAlertMessage } = props;
    const me = users.find(thisuser => thisuser.username === user.username)

    async function editMe() {
        const username = document.getElementById("me-username").innerText
        const firstname = document.getElementById("me-firstname").innerText
        const lastname = document.getElementById("me-lastname").innerText
        const email = document.getElementById("me-email").innerText
        const venmo = document.getElementById("me-venmo").innerText

        await fetch(`${API_URL}/users/${me.id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                username, firstname, lastname, email, venmo
            })
        }).then(response => response.json())
        .then(result => {
            if (!result.name) {
                setAlertMessage("You have updated your user information!")
                sessionStorage.setItem('username', result.user.username)
                showAlert()
                setUpdate(!update)
            } else {
                setAlertMessage(result.message);
                showAlert()
            }
        })
        .catch(console.error)
    }

    return (
        <div id="profile-myinfo-container">
            <div className="buttons-div" id="profileButtons">
                <span className="buttons" id="profile-myinfo">MY INFO</span>
            </div>
            {me ? <>
            <div className="computertable">
                <table>
                    <caption>My Info</caption>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Venmo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td id="me-username" contentEditable="true" suppressContentEditableWarning={true}>{me.username}</td>
                            <td id="me-firstname" contentEditable="true" suppressContentEditableWarning={true}>{me.firstname}</td>
                            <td id="me-lastname" contentEditable="true" suppressContentEditableWarning={true}>{me.lastname}</td>
                            <td id="me-email" contentEditable="true" suppressContentEditableWarning={true}>{me.email}</td>
                            <td id="me-venmo" contentEditable="true" suppressContentEditableWarning={true}>{me.venmo}</td>
                            <td><button type="button" className="profile-button" onClick={editMe}>EDIT</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="mobiletable">
                <table>
                    <caption>My Info</caption>
                    <tbody>
                        <tr>
                            <th>Username</th>
                            <td id="me-username" contentEditable="true" suppressContentEditableWarning={true}>{me.username}</td>
                        </tr>
                        <tr>
                            <th>First Name</th>
                            <td id="me-firstname" contentEditable="true" suppressContentEditableWarning={true}>{me.firstname}</td>                      
                        </tr>
                        <tr>
                            <th>Last Name</th>
                            <td id="me-lastname" contentEditable="true" suppressContentEditableWarning={true}>{me.lastname}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td id="me-email" contentEditable="true" suppressContentEditableWarning={true}>{me.email}</td>
                        </tr>
                        <tr>
                            <th>Venmo</th>
                            <td id="me-venmo" contentEditable="true" suppressContentEditableWarning={true}>{me.venmo}</td>
                        </tr>
                        <tr>
                            <td colSpan={2}><button className="profile-button" type="button" onClick={editMe}>EDIT</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
                </>
            : <div>No user to display</div>}
        </div>
    )
}

export default MyInfo;