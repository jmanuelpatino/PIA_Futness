document.querySelector('button[type="submit"]').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = "createaccount.html";
});

function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);

    window.location.href = "createaccount.html";
}