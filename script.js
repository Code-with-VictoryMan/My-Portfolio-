document.addEventListener('DOMContentLoaded', async () => {

    // ==== FETCH AND DISPLAY PROJECTS DYNAMICALLY ====
const projectsRow = document.querySelector('#projects .row-inner');

fetch('http://localhost:3000/api/projects')
    .then(response => response.json())
    .then(projects => {
        projects.forEach(project => {
            // Create a new project card element
            const card = document.createElement('div');
            card.className = 'project-card';
            
            // Set the data attributes for the modal
            card.dataset.title = project.title;
            card.dataset.image = project.imageLarge;
            card.dataset.description = project.description;
            card.dataset.tech = project.tech;
            card.dataset.liveUrl = project.liveUrl;
            card.dataset.repoUrl = project.repoUrl;
            
            // Add the thumbnail image inside the card
            card.innerHTML = `<img src="${project.imageThumb}" alt="${project.title} Thumbnail">`;
            
            // Add the new card to the row
            projectsRow.appendChild(card);
        });
        // You might need to re-initialize the modal logic if it doesn't find the new cards.
    })
    .catch(error => {
        console.error('Error fetching projects:', error);
        projectsRow.innerHTML = '<p>Could not load projects.</p>';
    });

    // ==== NAVBAR SCROLL EFFECT ====
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // ==== SMOOTH SCROLLING FOR NAV LINKS ====
    document.querySelectorAll('.navbar-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ==== HERO SLIDESHOW LOGIC ====
    const slides = document.querySelectorAll('.hero-slide');
    const heroSection = document.querySelector('.hero');
    let currentSlide = 0;

    function showSlide(index) {
        if (!slides.length || !heroSection) return;

        slides.forEach(slide => slide.classList.remove('active'));
        
        const activeSlide = slides[index];
        const newImage = activeSlide.dataset.image;

        // FIX: This part was missing. It changes the background image.
        if (newImage) {
            heroSection.style.backgroundImage = `linear-gradient(to top, #000000 10%, transparent 50%), url('${newImage}')`;
        }
        
        activeSlide.classList.add('active');
    }

    function nextSlide() {
        if (slides.length === 0) return;
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    if (slides.length > 1) {
        setInterval(nextSlide, 5000); // Set to 5 seconds as requested
    }
    showSlide(currentSlide); // Show the first slide immediately

    // ==== CAROUSEL ARROW LOGIC ====
    document.querySelectorAll('.row').forEach(row => {
        const rowInner = row.querySelector('.row-inner');
        const leftBtn = row.querySelector('.scroll-btn.left');
        const rightBtn = row.querySelector('.scroll-btn.right');
        if (!rowInner || !leftBtn || !rightBtn) return;

        const manageArrowVisibility = () => {
            const scrollLeft = rowInner.scrollLeft;
            const scrollWidth = rowInner.scrollWidth;
            const clientWidth = rowInner.clientWidth;
            leftBtn.disabled = scrollLeft <= 0;
            rightBtn.disabled = scrollLeft + clientWidth >= scrollWidth - 1;
        };
        rightBtn.addEventListener('click', () => rowInner.scrollBy({ left: rowInner.clientWidth * 0.8, behavior: 'smooth' }));
        leftBtn.addEventListener('click', () => rowInner.scrollBy({ left: -rowInner.clientWidth * 0.8, behavior: 'smooth' }));
        rowInner.addEventListener('scroll', manageArrowVisibility);
        manageArrowVisibility();
    });
    
    // ==== MODAL LOGIC ====
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('project-modal');
    if (modal) {
        const closeModalBtn = modal.querySelector('.modal-close');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const modalTechStack = document.getElementById('modal-tech-stack');
        const modalLinks = document.getElementById('modal-links');
        const modalBackdrop = modal.querySelector('.modal-backdrop');

        const openModal = (card) => {
            modalTitle.textContent = card.dataset.title || '';
            modalDescription.textContent = card.dataset.description || '';
            modalTechStack.textContent = card.dataset.tech || '';
            const image = card.dataset.image || '';
            modalBackdrop.style.backgroundImage = `linear-gradient(to top, #000000, transparent 50%), url('${image}')`;
            
            modalLinks.innerHTML = ''; 
            const liveUrl = card.dataset.liveUrl;
            if (liveUrl) {
                const liveLink = document.createElement('a');
                liveLink.href = liveUrl;
                liveLink.textContent = '▶ View Live Site';
                liveLink.target = '_blank';
                modalLinks.appendChild(liveLink);
            }
            
            const repoUrl = card.dataset.repoUrl;
            if (repoUrl) {
                const repoLink = document.createElement('a');
                repoLink.href = repoUrl;
                // FIX: This now uses the flexible text from HTML, or defaults to 'View on GitHub'.
                repoLink.textContent = card.dataset.repoText || 'View on Wikipedia';
                repoLink.target = '_blank';
                repoLink.className = 'btn-repo';
                modalLinks.appendChild(repoLink);
            }

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        projectCards.forEach(card => {
            // Only add the click listener if the card is meant to open a modal (has a title)
            if (card.dataset.title) {
                card.addEventListener('click', () => openModal(card));
            }
        });

        closeModalBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (event) => {
            if (event.target === modal) closeModal();
        });
    }

 // Add event listener for the logout button
if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();

        // These two lines clear the saved credentials
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');

        // This line redirects to the login page
        window.location.href = 'login.html';
    });
}

d // ==== AUTH0 CONFIGURATION ====
    const auth0 = await auth0.createAuth0Client({
        domain: 'YOUR_AUTH0_DOMAIN',
        clientId: 'YOUR_AUTH0_CLIENT_ID',
        authorizationParams: {
            redirect_uri: window.location.origin
        }
    });

    // --- Key elements ---
    const accountIcon = document.querySelector('.navbar-account');
    const logoutButton = document.getElementById('logout-button');
    const navUsername = document.getElementById('nav-username');
    const dropdownUsername = document.getElementById('dropdown-username');

    // --- This part handles the redirect back from Auth0 after login ---
    if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
        await auth0.handleRedirectCallback();
        window.history.replaceState({}, document.title, "/");
    }

    // --- This part checks if the user is logged in and updates the UI ---
    const isAuthenticated = await auth0.isAuthenticated();

    if (isAuthenticated) {
        // SCENARIO 1: USER IS LOGGED IN
        const user = await auth0.getUser();
        const username = user.name || user.email;

        // Display the username
        if (navUsername) navUsername.textContent = username;
        if (navUsername) navUsername.style.display = 'block';
        if (dropdownUsername) dropdownUsername.textContent = username;

        // Make the logout button work
        if (logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                auth0.logout({ logoutParams: { returnTo: window.location.origin } });
            });
        }
    } else {
        // SCENARIO 2: USER IS LOGGED OUT
        const dropdown = accountIcon.querySelector('.dropdown-menu');
        if (dropdown) dropdown.style.display = 'none'; // Hide dropdown
        if (navUsername) navUsername.style.display = 'none'; // Hide username

        // When the account icon is clicked, redirect to the Auth0 login page
        if (accountIcon) {
            accountIcon.addEventListener('click', (e) => {
                e.preventDefault();
                auth0.loginWithRedirect();
            });
        }
    }

    // ... (Your other JavaScript for slideshows, modals, etc. goes here) ..


// ==== LOGIN & LOGOUT LOGIC ====
const accountIcon = document.querySelector('.navbar-account');
const logoutButton = document.getElementById('logout-button');
const navUsername = document.getElementById('nav-username');
const dropdownUsername = document.getElementById('dropdown-username');

// --- Login Modal Elements ---
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const loginModalCloseBtn = loginModal.querySelector('.modal-close');
const errorMessage = document.getElementById('error-message');

// --- Function to update the UI based on login state ---
function updateUserUI() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('username');

    if (isLoggedIn === 'true' && username) {
        // If logged in, display the username
        navUsername.textContent = username;
        navUsername.style.display = 'block';
        if (dropdownUsername) dropdownUsername.textContent = username;
        
        // Ensure the dropdown menu is visible on hover for logged-in users
        const dropdown = accountIcon.querySelector('.dropdown-menu');
        if (dropdown) dropdown.style.display = '';
    } else {
        // If not logged in, hide dropdown and username placeholders
        const dropdown = accountIcon.querySelector('.dropdown-menu');
        if (dropdown) dropdown.style.display = 'none';
        if (navUsername) navUsername.style.display = 'none';
    }
}

// --- Initial check when page loads ---
updateUserUI();

// --- Event Listeners ---

// Handle click on the main account icon
if (accountIcon) {
    accountIcon.addEventListener('click', (e) => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn !== 'true') {
            // If not logged in, show the login modal
            e.stopPropagation(); // Prevents dropdown from trying to open
            loginModal.classList.add('active');
        }
        // If logged in, the default CSS hover behavior for the dropdown will work
    });
}

// Handle login form submission
if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: usernameInput, password: passwordInput })
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', usernameInput);
                loginModal.classList.remove('active'); // Close the modal
                updateUserUI(); // Update the navbar to show the username
            } else {
                errorMessage.textContent = data.message;
            }
        } catch (error) {
            errorMessage.textContent = 'An error occurred. Please try again.';
        }
    });
}

// Handle closing the login modal
if (loginModal) {
    loginModalCloseBtn.addEventListener('click', () => loginModal.classList.remove('active'));
    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) loginModal.classList.remove('active');
    });
}

// Handle logout button
if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        window.location.reload(); // Reload the page to reset to logged-out state
    });
}
});