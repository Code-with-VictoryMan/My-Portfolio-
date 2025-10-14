document.addEventListener('DOMContentLoaded', async () => {

    // --- Key DOM elements (hoisted and validated) ---
    const accountIcon = document.querySelector('.navbar-account');
    const logoutButton = document.getElementById('logout-button');
    const navUsername = document.getElementById('nav-username');
    const dropdownUsername = document.getElementById('dropdown-username');

    // ==== FETCH AND DISPLAY PROJECTS DYNAMICALLY ====
    const projectsRow = document.querySelector('#projects .row-inner');
    if (projectsRow) {
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
                // No need to re-init modal logic thanks to event delegation below.
            })
            .catch(error => {
                console.error('Error fetching projects:', error);
                projectsRow.innerHTML = '<p>Could not load projects.</p>';
            });
    }

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

        // Update the background image safely
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
        setInterval(nextSlide, 5000); // 5 seconds
    }
    showSlide(currentSlide);

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

    // ==== MODAL LOGIC (using event delegation so dynamically added cards work) ====
    const modal = document.getElementById('project-modal');
    let modalTitle, modalDescription, modalTechStack, modalLinks, modalBackdrop, closeModalBtn;
    if (modal) {
        closeModalBtn = modal.querySelector('.modal-close');
        modalTitle = document.getElementById('modal-title');
        modalDescription = document.getElementById('modal-description');
        modalTechStack = document.getElementById('modal-tech-stack');
        modalLinks = document.getElementById('modal-links');
        modalBackdrop = modal.querySelector('.modal-backdrop');

        const openModal = (card) => {
            if (!card) return;
            if (modalTitle) modalTitle.textContent = card.dataset.title || '';
            if (modalDescription) modalDescription.textContent = card.dataset.description || '';
            if (modalTechStack) modalTechStack.textContent = card.dataset.tech || '';
            const image = card.dataset.image || '';
            if (modalBackdrop) modalBackdrop.style.backgroundImage = `linear-gradient(to top, #000000, transparent 50%), url('${image}')`;

            if (modalLinks) modalLinks.innerHTML = '';
            const liveUrl = card.dataset.liveUrl;
            if (liveUrl && modalLinks) {
                const liveLink = document.createElement('a');
                liveLink.href = liveUrl;
                liveLink.textContent = '\u25b6 View Live Site';
                liveLink.target = '_blank';
                modalLinks.appendChild(liveLink);
            }

            const repoUrl = card.dataset.repoUrl;
            if (repoUrl && modalLinks) {
                const repoLink = document.createElement('a');
                repoLink.href = repoUrl;
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

        // delegation: listen for clicks on any project-card
        document.addEventListener('click', (e) => {
            const card = e.target.closest && e.target.closest('.project-card');
            if (card) {
                // only open modal if card has a title/data
                if (card.dataset && card.dataset.title) openModal(card);
            }
        });

        if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (event) => {
            if (event.target === modal) closeModal();
        });
    }

    // ---- Logout handling (consolidated) ----
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            // If there's a dedicated login page, redirect. Otherwise reload to update UI.
            if (window.location.pathname.endsWith('login.html')) {
                window.location.reload();
            } else {
                window.location.href = 'login.html';
            }
        });
    }

    // ==== AUTH0 CONFIGURATION (optional - guarded) ====
    let auth0Client = null;
    try {
        if (typeof createAuth0Client === 'function') {
            auth0Client = await createAuth0Client({
                domain: 'YOUR_AUTH0_DOMAIN',
                client_id: 'YOUR_AUTH0_CLIENT_ID',
                authorizationParams: {
                    redirect_uri: window.location.origin
                }
            });

            // Handle redirect callback when returning from Auth0
            if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
                await auth0Client.handleRedirectCallback();
                window.history.replaceState({}, document.title, '/');
            }

            const isAuthenticated = await auth0Client.isAuthenticated();
            if (isAuthenticated) {
                const user = await auth0Client.getUser();
                const username = (user && (user.name || user.email)) || '';
                if (navUsername) {
                    navUsername.textContent = username;
                    navUsername.style.display = 'block';
                }
                if (dropdownUsername) dropdownUsername.textContent = username;

                if (logoutButton) {
                    logoutButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        auth0Client.logout({ logoutParams: { returnTo: window.location.origin } });
                    });
                }
            } else {
                // Not authenticated: hide dropdown username
                if (accountIcon) {
                    const dropdown = accountIcon.querySelector('.dropdown-menu');
                    if (dropdown) dropdown.style.display = 'none';
                }
                if (navUsername) navUsername.style.display = 'none';

                if (accountIcon) {
                    accountIcon.addEventListener('click', (e) => {
                        e.preventDefault();
                        auth0Client.loginWithRedirect();
                    });
                }
            }
        }
    } catch (err) {
        // If Auth0 SDK isn't available or there's an error, continue without Auth0
        console.warn('Auth0 not initialized or unavailable:', err);
    }

    // ==== LOGIN & LOGOUT LOGIC (fallback/local modal) ====
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const loginModalCloseBtn = loginModal ? loginModal.querySelector('.modal-close') : null;
    const errorMessage = document.getElementById('error-message');

    // --- Function to update the UI based on login state ---
    function updateUserUI() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const username = localStorage.getItem('username');

        if (isLoggedIn === 'true' && username) {
            if (navUsername) {
                navUsername.textContent = username;
                navUsername.style.display = 'block';
            }
            if (dropdownUsername) dropdownUsername.textContent = username;
            if (accountIcon) {
                const dropdown = accountIcon.querySelector('.dropdown-menu');
                if (dropdown) dropdown.style.display = '';
            }
        } else {
            if (accountIcon) {
                const dropdown = accountIcon.querySelector('.dropdown-menu');
                if (dropdown) dropdown.style.display = 'none';
            }
            if (navUsername) navUsername.style.display = 'none';
        }
    }

    // --- Initial check when page loads ---
    updateUserUI();

    // Handle click on the main account icon (shows local login modal if not authenticated)
    if (accountIcon) {
        accountIcon.addEventListener('click', (e) => {
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            if (isLoggedIn !== 'true') {
                e.stopPropagation();
                if (loginModal) loginModal.classList.add('active');
            }
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
                    if (loginModal) loginModal.classList.remove('active');
                    updateUserUI();
                } else {
                    if (errorMessage) errorMessage.textContent = data.message;
                }
            } catch (error) {
                if (errorMessage) errorMessage.textContent = 'An error occurred. Please try again.';
            }
        });
    }

    // Handle closing the login modal
    if (loginModal && loginModalCloseBtn) {
        loginModalCloseBtn.addEventListener('click', () => loginModal.classList.remove('active'));
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) loginModal.classList.remove('active');
        });
    }

    // Local logout handler (reloads page after clearing storage)
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            window.location.reload();
        });
    }
});