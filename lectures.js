document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.overlay');
    const logoutBtn = document.getElementById('logoutBtn');
    const contentSections = document.querySelectorAll('.content-section');
    const menuItems = document.querySelectorAll('.menu-item:not(.dropdown)');
    const dropdownItems = document.querySelectorAll('.dropdown-container a');
    const cardBtns = document.querySelectorAll('.card-btn');
    const showAnswerBtns = document.querySelectorAll('.show-answer');
    const settingsForm = document.querySelector('.settings-form');

    // Toggle Sidebar
    function toggleSidebar() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    }

    // Change Active Section
    function changeActiveSection(sectionId) {
        // Hide all sections
        contentSections.forEach(section => {
            section.classList.remove('active-section');
        });

        // Show selected section
        const activeSection = document.getElementById(`${sectionId}-section`);
        if (activeSection) {
            activeSection.classList.add('active-section');
        }

        // Update active menu item
        menuItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === sectionId) {
                item.classList.add('active');
            }
        });

        // Close sidebar on mobile
        if (window.innerWidth < 992) {
            toggleSidebar();
        }
    }

    // Event Listeners
    menuToggle.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);

    // Menu Item Clicks
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.dataset.section;
            changeActiveSection(sectionId);
        });
    });

    // Dropdown Item Clicks
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.dataset.section;
            changeActiveSection(sectionId);
        });
    });

    // Card Button Clicks
    cardBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const sectionId = this.dataset.section;
            changeActiveSection(sectionId);
        });
    });

    // MCQ Answer Toggles
    showAnswerBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            answer.classList.toggle('hidden');
            this.textContent = answer.classList.contains('hidden') ? 'Show Answer' : 'Hide Answer';
        });
    });

    // Settings Form
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const theme = document.getElementById('themeSelect').value;
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            alert('Settings saved successfully!');
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // In a real app, clear session/tokens here
            window.location.href = 'index.html';
        });
    }

    // Load Saved Theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (document.getElementById('themeSelect')) {
        document.getElementById('themeSelect').value = savedTheme;
    }

    // Show dashboard by default
    changeActiveSection('dashboard');
});