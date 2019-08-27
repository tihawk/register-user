
console.log('Hello');

const form = document.querySelector('form');
const usernameField = document.getElementById('username');

form.onchange = () => {

    let formData = new FormData(form);

    let firstName = formData.get('firstName');
    let lastName = formData.get('lastName');
    let username = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;

    if(firstName != "" && lastName != "") {
        console.log(`set a username ${username}`);
        usernameField.setAttribute('value', username);
    }
}