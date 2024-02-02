function submitLoginForm() {
    var loginEmail = document.getElementById('loginEmail').value;
    var loginPassword = document.getElementById('loginPassword').value;

    fetch(`http://127.0.0.1:8000/login/authenticate?email=${loginEmail}&key=${loginPassword}`)
        .then(response => response.json())
        .then(data => {
            console.log('Login Result:', data);

            if (data.detail === "Success") {
                var encodedemail = encodeURIComponent(loginEmail);
                var encodedpassword = encodeURIComponent(loginPassword);
            
                window.location.href = `index.html?email=${encodedemail}&password=${encodedpassword}`;
            } else {
                displayLoginResult(data.detail);
            }
        })
        .catch(error => console.error('Error:', error));
}

function displayLoginResult(result) {
    var loginResultDiv = document.getElementById('loginResult');
    loginResultDiv.textContent = result;
}
