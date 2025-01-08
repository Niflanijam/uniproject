document.getElementById('logoutLink').addEventListener('click', function(event) {
    event.preventDefault(); 

    fetch('/logout', {
        method: 'GET',
        credentials: 'include' // Include cookies in request
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/login'; // Redirect to login page
        } else {
            return response.text().then(text => { throw new Error(text); });
        }
    })
    .catch(error => {
        alert(`Logout failed: ${error.message}`);
    });
});







































