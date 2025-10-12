if (data.success) {
    // Save credentials (username and login status)
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);

    // Redirect to the home page immediately
    window.location.href = 'index.html';
}