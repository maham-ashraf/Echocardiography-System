/**
 * Authentication & Session Management Module
 * Echocardiography Web System
 */

// ==========================================
// SESSION MANAGEMENT
// ==========================================

const SESSION_KEY = 'ecg_session';
const USERS_KEY = 'ecg_users';

// Predefined users for the system
const DEFAULT_USERS = [
    { email: 'admin@ecg.com', password: 'admin123', role: 'admin', name: 'Administrator' },
    { email: 'doctor@ecg.com', password: 'doctor123', role: 'doctor', name: 'Dr. Sarah Johnson' },
    { email: 'patient@ecg.com', password: 'patient123', role: 'patient', name: 'John Doe' },
    { email: 'tech@ecg.com', password: 'tech123', role: 'technologist', name: 'Michael Chen' }
];

// Initialize default users in localStorage
function initializeAuth() {
    if (!localStorage.getItem(USERS_KEY)) {
        localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
    }
}

// Get current session
function getSession() {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
}

// Check if user is logged in
function isLoggedIn() {
    const session = getSession();
    return session && session.loginStatus === true;
}

// Get current user role
function getCurrentRole() {
    const session = getSession();
    return session ? session.role : null;
}

// Get current user info
function getCurrentUser() {
    return getSession();
}

// Create new session
function createSession(user) {
    const session = {
        email: user.email,
        role: user.role,
        name: user.name,
        loginStatus: true,
        loginTime: new Date().toISOString()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
}

// Clear session (logout)
function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}

// Authenticate user credentials
function authenticate(email, password, role) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || DEFAULT_USERS;
    return users.find(u => 
        u.email === email && 
        u.password === password && 
        u.role === role
    ) || null;
}

// ==========================================
// ROUTE PROTECTION
// ==========================================

// Dashboard routes mapping
const DASHBOARD_ROUTES = {
    'admin': 'admin.html',
    'doctor': 'doctor.html',
    'patient': 'patient.html',
    'technologist': 'technologist.html'
};

// Check if current page matches user role
function checkPageAccess() {
    const currentPage = window.location.pathname.split('/').pop();
    const userRole = getCurrentRole();
    
    // Map pages to required roles
    const pageRoles = {
        'admin.html': 'admin',
        'doctor.html': 'doctor',
        'patient.html': 'patient',
        'technologist.html': 'technologist'
    };
    
    const requiredRole = pageRoles[currentPage];
    
    // If page doesn't require specific role, allow access
    if (!requiredRole) return true;
    
    // Check if user has correct role
    return userRole === requiredRole;
}

// Protect route - redirect if not authorized
function protectRoute() {
    // Check if logged in
    if (!isLoggedIn()) {
        redirectToLogin('Please login to access this page');
        return false;
    }
    
    // Check if correct role for this page
    if (!checkPageAccess()) {
        const userRole = getCurrentRole();
        const correctDashboard = DASHBOARD_ROUTES[userRole];
        
        if (correctDashboard) {
            alert('Access denied. Redirecting to your dashboard...');
            window.location.href = correctDashboard;
        } else {
            redirectToLogin('Session expired. Please login again.');
        }
        return false;
    }
    
    return true;
}

// Redirect to login page
function redirectToLogin(message) {
    clearSession();
    if (message) {
        sessionStorage.setItem('login_message', message);
    }
    window.location.href = 'login.html';
}

// Logout function
function logout() {
    clearSession();
    window.location.href = 'login.html';
}

// ==========================================
// UI UPDATES
// ==========================================

// Update user info in dashboard sidebar
function updateUserUI() {
    const session = getSession();
    if (!session) return;
    
    // Update name elements
    const nameElements = {
        'admin': 'adminName',
        'doctor': 'doctorName',
        'patient': 'patientName',
        'technologist': 'techName'
    };
    
    const nameEl = document.getElementById(nameElements[session.role]);
    if (nameEl) {
        nameEl.textContent = session.name;
    }
    
    // Update avatar initials
    const avatarElements = {
        'admin': 'adminAvatar',
        'doctor': 'doctorAvatar',
        'patient': 'patientAvatar',
        'technologist': 'techAvatar'
    };
    
    const avatarEl = document.getElementById(avatarElements[session.role]);
    if (avatarEl) {
        avatarEl.textContent = session.name.charAt(0).toUpperCase();
    }
    
    // Update role badge
    const userInfoRole = document.querySelector('.user-info p');
    if (userInfoRole) {
        userInfoRole.textContent = session.role;
    }
}

// Add logout button to sidebar
function addLogoutButton() {
    const sidebarFooter = document.querySelector('.sidebar-footer');
    if (!sidebarFooter) return;
    
    // Check if logout button already exists
    if (sidebarFooter.querySelector('.logout-btn')) return;
    
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'logout-btn';
    logoutBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Logout</span>
    `;
    logoutBtn.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.75rem;
        width: 100%;
        padding: 0.75rem 1rem;
        background: transparent;
        border: 1px solid var(--gray-200);
        border-radius: 8px;
        color: var(--gray-600);
        font-size: 0.9375rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
    `;
    
    logoutBtn.addEventListener('mouseover', () => {
        logoutBtn.style.background = 'rgba(220, 38, 38, 0.1)';
        logoutBtn.style.color = 'var(--primary-red)';
        logoutBtn.style.borderColor = 'var(--primary-red)';
    });
    
    logoutBtn.addEventListener('mouseout', () => {
        logoutBtn.style.background = 'transparent';
        logoutBtn.style.color = 'var(--gray-600)';
        logoutBtn.style.borderColor = 'var(--gray-200)';
    });
    
    logoutBtn.addEventListener('click', logout);
    
    sidebarFooter.insertBefore(logoutBtn, sidebarFooter.firstChild);
}

// Add session info display
function addSessionInfo() {
    const sidebarUser = document.querySelector('.sidebar-user');
    if (!sidebarUser) return;
    
    const session = getSession();
    if (!session) return;
    
    // Update user info display
    const userInfo = sidebarUser.querySelector('.user-info');
    if (userInfo) {
        const nameEl = userInfo.querySelector('h4');
        const roleEl = userInfo.querySelector('p');
        
        if (nameEl) nameEl.textContent = session.name;
        if (roleEl) roleEl.textContent = session.role.charAt(0).toUpperCase() + session.role.slice(1);
    }
    
    // Update avatar
    const avatar = sidebarUser.querySelector('.user-avatar');
    if (avatar) {
        avatar.textContent = session.name.charAt(0).toUpperCase();
    }
}

// ==========================================
// INITIALIZATION
// ==========================================

// Initialize authentication on page load
function initAuth() {
    initializeAuth();
    
    // Check if we're on a dashboard page
    const currentPage = window.location.pathname.split('/').pop();
    const dashboardPages = ['admin.html', 'doctor.html', 'patient.html', 'technologist.html'];
    
    if (dashboardPages.includes(currentPage)) {
        // Protect the route
        if (!protectRoute()) {
            return; // Stop execution if redirected
        }
        
        // Update UI with user info
        updateUserUI();
        addSessionInfo();
        
        // Add logout button after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                addLogoutButton();
            });
        } else {
            addLogoutButton();
        }
    }
}

// Auto-initialize
initAuth();

// Export functions for global access
window.Auth = {
    getSession,
    isLoggedIn,
    getCurrentRole,
    getCurrentUser,
    createSession,
    clearSession,
    authenticate,
    protectRoute,
    logout,
    redirectToLogin,
    updateUserUI,
    addLogoutButton,
    initializeAuth
};
