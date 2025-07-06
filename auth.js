// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAst0D_TTLNV8z5aDI6f9ygbDkTdjMn6sM",
  authDomain: "education-hub-dff77.firebaseapp.com",
  projectId: "education-hub-dff77",
  storageBucket: "education-hub-dff77.appspot.com",
  messagingSenderId: "60385674016",
  appId: "1:60385674016:web:b33272f86fef00f7204d45",
  measurementId: "G-LLE19MTYBS"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.classList.add(savedTheme);
        updateThemeIcon(savedTheme);
    }
    
    // Password visibility toggle
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye-slash');
        });
    });
    
    // Check auth state
    auth.onAuthStateChanged(user => {
        if (user && window.location.pathname.includes('index.html')) {
            // User is signed in, redirect to dashboard
            window.location.href = 'dashboard.html';
        }
    });

    // Form submissions
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
    }
    
    if (document.getElementById('signupForm')) {
        document.getElementById('signupForm').addEventListener('submit', handleSignup);
    }
    
    if (document.getElementById('forgotForm')) {
        document.getElementById('forgotForm').addEventListener('submit', handleForgotPassword);
    }
});

// Theme functions
function toggleTheme() {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        updateThemeIcon('light');
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        updateThemeIcon('dark');
    }
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-toggle i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-exclamation-triangle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
    return password.length >= 6;
}

// Form handlers
async function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const email = form.querySelector('#loginEmail').value.trim();
    const password = form.querySelector('#loginPassword').value.trim();
    const btn = form.querySelector('#loginBtn');
    
    // Reset errors
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    
    // Validate
    let isValid = true;
    
    if (!email) {
        document.getElementById('emailError').textContent = 'Email is required';
        isValid = false;
    } else if (!validateEmail(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email';
        isValid = false;
    }
    
    if (!password) {
        document.getElementById('passwordError').textContent = 'Password is required';
        isValid = false;
    }
    
    if (!isValid) return;
    
    btn.classList.add('loading');
    
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        showToast('Login successful! Redirecting...', 'success');
        setTimeout(() => window.location.href = 'dashboard.html', 1500);
    } catch (error) {
        showToast(getFirebaseError(error), 'error');
    } finally {
        btn.classList.remove('loading');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const form = e.target;
    const name = form.querySelector('#signupName').value.trim();
    const email = form.querySelector('#signupEmail').value.trim();
    const password = form.querySelector('#signupPassword').value.trim();
    const confirmPassword = form.querySelector('#confirmPassword').value.trim();
    const btn = form.querySelector('#signupBtn');
    
    // Reset errors
    document.getElementById('nameError').textContent = '';
    document.getElementById('signupEmailError').textContent = '';
    document.getElementById('signupPasswordError').textContent = '';
    document.getElementById('confirmPasswordError').textContent = '';
    
    // Validate
    let isValid = true;
    
    if (!name) {
        document.getElementById('nameError').textContent = 'Full name is required';
        isValid = false;
    }
    
    if (!email) {
        document.getElementById('signupEmailError').textContent = 'Email is required';
        isValid = false;
    } else if (!validateEmail(email)) {
        document.getElementById('signupEmailError').textContent = 'Please enter a valid email';
        isValid = false;
    }
    
    if (!password) {
        document.getElementById('signupPasswordError').textContent = 'Password is required';
        isValid = false;
    } else if (!validatePassword(password)) {
        document.getElementById('signupPasswordError').textContent = 'Password must be at least 6 characters';
        isValid = false;
    }
    
    if (password !== confirmPassword) {
        document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
        isValid = false;
    }
    
    if (!isValid) return;
    
    btn.classList.add('loading');
    
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await db.collection('users').doc(userCredential.user.uid).set({
            name: name,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        showToast('Account created successfully!', 'success');
        setTimeout(() => window.location.href = 'dashboard.html', 1500);
    } catch (error) {
        showToast(getFirebaseError(error), 'error');
    } finally {
        btn.classList.remove('loading');
    }
}

async function handleForgotPassword(e) {
    e.preventDefault();
    
    const form = e.target;
    const email = form.querySelector('#forgotEmail').value.trim();
    const btn = form.querySelector('#forgotBtn');
    
    // Reset error
    document.getElementById('forgotEmailError').textContent = '';
    
    // Validate
    if (!email) {
        document.getElementById('forgotEmailError').textContent = 'Email is required';
        return;
    } else if (!validateEmail(email)) {
        document.getElementById('forgotEmailError').textContent = 'Please enter a valid email';
        return;
    }
    
    btn.classList.add('loading');
    
    try {
        await auth.sendPasswordResetEmail(email);
        showToast('Password reset link sent to your email', 'success');
    } catch (error) {
        showToast(getFirebaseError(error), 'error');
    } finally {
        btn.classList.remove('loading');
    }
}

function getFirebaseError(error) {
    switch (error.code) {
        case 'auth/email-already-in-use':
            return 'Email already in use';
        case 'auth/invalid-email':
            return 'Invalid email';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters';
        case 'auth/user-not-found':
            return 'User not found';
        case 'auth/wrong-password':
            return 'Wrong password';
        default:
            return 'An error occurred. Please try again.';
    }
}
