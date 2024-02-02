function submitSignInForm() {
    var newName = document.getElementById('newName').value;
    var newEmail = document.getElementById('newEmail').value;
    var newKey = document.getElementById('newPassword').value;

    fetch(`http://127.0.0.1:8000/signin/email=${newEmail}&key=${newKey}&name=${newName}`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: ``,
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            return response.json().then(error => Promise.reject(error));
        }
    })
    .then(data => {
        console.log('Sign In Result:', data);

        if (data.message === "申請完了") {
            window.location.href = 'login.html';
        } else {
            displaySignInResult(data.message);
        }
    })
    .catch(error => {
        if (error.validation_error) {
            console.error('Validation Error:', error.validation_error);
            displaySignInResult("Validation Error: " + JSON.stringify(error.validation_error));
        } else {
            console.error('Error:', error);
        }
    });
}
