const AppState = {
    currentUser: null,
    users: [],
    requests: [],
    reports: [],
    messages: [],
    availability: [],
    locations: [],
    pricing: [],
    technologistVisits: []
};

// Initialize data from localStorage or set defaults
function initializeData() {
    // Users
    const storedUsers = localStorage.getItem('ecg_users');
    if (storedUsers) {
        AppState.users = JSON.parse(storedUsers);
    } else {
        // Create default admin
        AppState.users = [
            { id: 'admin_1', email: 'admin@ecg.com', name: 'System Administrator', role: 'admin', password: 'admin123' },
            { id: 'doc_1', email: 'doctor@ecg.com', name: 'Dr. Sarah Johnson', role: 'doctor', password: 'doctor123', specialty: 'Cardiologist' },
            { id: 'tech_1', email: 'tech@ecg.com', name: 'Michael Chen', role: 'technologist', password: 'tech123' },
            { id: 'pat_1', email: 'patient@ecg.com', name: 'John Smith', role: 'patient', password: 'patient123', phone: '+1 234-567-8900' }
        ];
        saveToStorage('ecg_users', AppState.users);
    }

    // Current User Session
    const currentSession = localStorage.getItem('ecg_current_user');
    if (currentSession) {
        AppState.currentUser = JSON.parse(currentSession);
    }

    // Requests
    const storedRequests = localStorage.getItem('ecg_requests');
    AppState.requests = storedRequests ? JSON.parse(storedRequests) : [];

    // Reports
    const storedReports = localStorage.getItem('ecg_reports');
    AppState.reports = storedReports ? JSON.parse(storedReports) : [];

    // Messages
    const storedMessages = localStorage.getItem('ecg_messages');
    AppState.messages = storedMessages ? JSON.parse(storedMessages) : [];

    // Availability
    const storedAvailability = localStorage.getItem('ecg_availability');
    if (storedAvailability) {
        AppState.availability = JSON.parse(storedAvailability);
    } else {
        // Generate default availability
        generateDefaultAvailability();
    }

    // Locations
    const storedLocations = localStorage.getItem('ecg_locations');
    if (storedLocations) {
        AppState.locations = JSON.parse(storedLocations);
    } else {
        generateDefaultLocations();
    }

    // Pricing
    const storedPricing = localStorage.getItem('ecg_pricing');
    if (storedPricing) {
        AppState.pricing = JSON.parse(storedPricing);
    } else {
        generateDefaultPricing();
    }

    // Technologist Visits
    const storedVisits = localStorage.getItem('ecg_visits');
    AppState.technologistVisits = storedVisits ? JSON.parse(storedVisits) : [];
}

// Save data to localStorage
function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Generate default availability for doctors and technologists
function generateDefaultAvailability() {
    const timeSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'
    ];

    // Doctors data
    const doctors = [
        { id: 'doc_1', name: 'Dr. Sarah Johnson', role: 'doctor', specialty: 'Cardiologist', image: '👩‍⚕️' },
        { id: 'doc_2', name: 'Dr. Michael Chen', role: 'doctor', specialty: 'Cardiac Surgeon', image: '👨‍⚕️' },
        { id: 'doc_3', name: 'Dr. Emily Williams', role: 'doctor', specialty: 'Heart Specialist', image: '👩‍⚕️' }
    ];

    // Technologists data
    const technologists = [
        { id: 'tech_1', name: 'James Anderson', role: 'technologist', specialty: 'Echo Technologist', image: '🔬' },
        { id: 'tech_2', name: 'Maria Garcia', role: 'technologist', specialty: 'Cardiac Sonographer', image: '🔬' },
        { id: 'tech_3', name: 'David Kim', role: 'technologist', specialty: 'Echo Technologist', image: '🔬' }
    ];

    // Generate availability for each person
    const generatePersonAvailability = (person) => {
        const isAvailable = Math.random() > 0.3; // 70% chance available
        const availableSlots = timeSlots.filter(() => Math.random() > 0.4);
        
        return {
            ...person,
            status: isAvailable ? 'available' : 'busy',
            nextAvailable: isAvailable ? 'Now' : getNextAvailableTime(),
            availableSlots: availableSlots,
            totalSlots: timeSlots.length
        };
    };

    AppState.availability = {
        doctors: doctors.map(generatePersonAvailability),
        technologists: technologists.map(generatePersonAvailability),
        lastUpdated: new Date().toISOString()
    };

    saveToStorage('ecg_availability', AppState.availability);
}

// Helper function to get next available time
function getNextAvailableTime() {
    const times = ['Today 5:00 PM', 'Tomorrow 9:00 AM', 'Tomorrow 2:00 PM', 'In 2 hours'];
    return times[Math.floor(Math.random() * times.length)];
}

// Generate default locations
function generateDefaultLocations() {
    AppState.locations = [
        {
            id: 'loc_1',
            name: 'Downtown Medical Center',
            address: '123 Healthcare Ave, Downtown',
            phone: '+1 234-567-8901',
            areas: ['Downtown', 'Financial District', 'City Center'],
            services: ['Echo', 'ECG', 'Consultation']
        },
        {
            id: 'loc_2',
            name: 'Northside Clinic',
            address: '456 North Street, Northside',
            phone: '+1 234-567-8902',
            areas: ['Northside', 'Uptown', 'Hills District'],
            services: ['Echo', 'ECG']
        },
        {
            id: 'loc_3',
            name: 'Rural Health Station',
            address: '789 Country Road, Rural Area',
            phone: '+1 234-567-8903',
            areas: ['Rural North', 'Rural East', 'Remote Villages'],
            services: ['Echo', 'Basic Checkup', 'Telemedicine']
        }
    ];
    saveToStorage('ecg_locations', AppState.locations);
}

// Generate default pricing
function generateDefaultPricing() {
    AppState.pricing = [
        {
            id: 'price_1',
            name: 'Basic Echocardiogram',
            description: 'Standard 2D Echo with basic measurements',
            price: 150,
            features: ['2D Echocardiogram', 'Basic Measurements', 'Digital Report', '15-min Consultation'],
            featured: false
        },
        {
            id: 'price_2',
            name: 'Complete Cardiac Package',
            description: 'Full cardiac evaluation with Doppler',
            price: 299,
            features: ['2D & Doppler Echo', 'Complete Measurements', 'Color Doppler', '30-min Specialist Consultation', 'Priority Scheduling'],
            featured: true
        },
        {
            id: 'price_3',
            name: 'Home Visit Service',
            description: 'Echo services at your doorstep',
            price: 399,
            features: ['Home Visit by Technologist', 'Portable Echo Equipment', 'Complete 2D Echo', 'Digital Report within 24h', 'Follow-up Call'],
            featured: false
        }
    ];
    saveToStorage('ecg_pricing', AppState.pricing);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Generate unique ID
function generateId(prefix = 'id') {
    return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
}

// Get current timestamp
function getTimestamp() {
    return new Date().toISOString();
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Format time
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Show alert message
function showAlert(container, message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} fade-in`;
    alertDiv.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>${message}</span>
    `;
    
    if (typeof container === 'string') {
        container = document.querySelector(container);
    }
    
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
    
    return alertDiv;
}

// Show modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Hide modal
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Form validation
function validateForm(formElement) {
    let isValid = true;
    const inputs = formElement.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        const errorElement = input.parentElement.querySelector('.form-error');
        
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            if (errorElement) {
                errorElement.textContent = 'This field is required';
                errorElement.classList.add('visible');
            }
        } else {
            input.classList.remove('error');
            if (errorElement) {
                errorElement.classList.remove('visible');
            }
            
            // Email validation
            if (input.type === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    input.classList.add('error');
                    if (errorElement) {
                        errorElement.textContent = 'Please enter a valid email';
                        errorElement.classList.add('visible');
                    }
                }
            }
            
            // Phone validation
            if (input.type === 'tel') {
                const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
                if (!phoneRegex.test(input.value)) {
                    isValid = false;
                    input.classList.add('error');
                    if (errorElement) {
                        errorElement.textContent = 'Please enter a valid phone number';
                        errorElement.classList.add('visible');
                    }
                }
            }
        }
    });
    
    return isValid;
}

// Clear form
function clearForm(formElement) {
    formElement.reset();
    formElement.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    formElement.querySelectorAll('.form-error').forEach(el => {
        el.classList.remove('visible');
        el.textContent = '';
    });
}

// ==========================================
// AUTHENTICATION
// ==========================================

// Login function
function login(email, password, role) {
    const user = AppState.users.find(u => 
        u.email === email && 
        u.password === password && 
        u.role === role
    );
    
    if (user) {
        AppState.currentUser = { ...user, password: undefined };
        saveToStorage('ecg_current_user', AppState.currentUser);
        return { success: true, user: AppState.currentUser };
    }
    
    return { success: false, error: 'Invalid credentials or role' };
}

// Logout function
function logout() {
    AppState.currentUser = null;
    localStorage.removeItem('ecg_current_user');
    window.location.href = 'index.html';
}

// Check authentication and redirect
function checkAuth(requiredRole) {
    const currentUser = AppState.currentUser;
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return false;
    }
    
    if (requiredRole && currentUser.role !== requiredRole) {
        // Redirect to correct dashboard
        const dashboardMap = {
            'admin': 'pages/admin.html',
            'doctor': 'pages/doctor.html',
            'patient': 'pages/patient.html',
            'technologist': 'pages/technologist.html'
        };
        
        if (dashboardMap[currentUser.role]) {
            window.location.href = dashboardMap[currentUser.role];
        } else {
            window.location.href = 'index.html';
        }
        return false;
    }
    
    return true;
}

// Update UI with user info
function updateUserUI() {
    const user = AppState.currentUser;
    if (!user) return;
    
    // Update sidebar user info
    const userNameEl = document.querySelector('.user-info h4');
    const userRoleEl = document.querySelector('.user-info p');
    const userAvatarEl = document.querySelector('.user-avatar');
    
    if (userNameEl) userNameEl.textContent = user.name;
    if (userRoleEl) userRoleEl.textContent = user.role;
    if (userAvatarEl) userAvatarEl.textContent = user.name.charAt(0).toUpperCase();
}

// ==========================================
// REQUEST MANAGEMENT
// ==========================================

// Create new request
function createRequest(requestData) {
    const request = {
        id: generateId('req'),
        ...requestData,
        status: 'pending',
        createdAt: getTimestamp(),
        updatedAt: getTimestamp()
    };
    
    AppState.requests.push(request);
    saveToStorage('ecg_requests', AppState.requests);
    
    return request;
}

// Update request status
function updateRequestStatus(requestId, status, reason = '') {
    const request = AppState.requests.find(r => r.id === requestId);
    if (request) {
        request.status = status;
        request.reason = reason;
        request.updatedAt = getTimestamp();
        saveToStorage('ecg_requests', AppState.requests);
        return request;
    }
    return null;
}

// Get requests by patient
function getRequestsByPatient(patientId) {
    return AppState.requests.filter(r => r.patientId === patientId);
}

// Get all pending requests
function getPendingRequests() {
    return AppState.requests.filter(r => r.status === 'pending');
}

// ==========================================
// REPORT MANAGEMENT
// ==========================================

// Create new report
function createReport(reportData) {
    const report = {
        id: generateId('rep'),
        ...reportData,
        status: 'pending',
        adminApproved: false,
        doctorReviewed: false,
        createdAt: getTimestamp(),
        updatedAt: getTimestamp()
    };
    
    AppState.reports.push(report);
    saveToStorage('ecg_reports', AppState.reports);
    
    return report;
}

// Update report
function updateReport(reportId, updates) {
    const report = AppState.reports.find(r => r.id === reportId);
    if (report) {
        Object.assign(report, updates, { updatedAt: getTimestamp() });
        saveToStorage('ecg_reports', AppState.reports);
        return report;
    }
    return null;
}

// Approve report (admin)
function approveReport(reportId) {
    return updateReport(reportId, { adminApproved: true, status: 'approved' });
}

// Send report to doctor
function sendToDoctor(reportId) {
    return updateReport(reportId, { status: 'sent_to_doctor', sentToDoctorAt: getTimestamp() });
}

// Doctor review report
function reviewReport(reportId, reviewData) {
    return updateReport(reportId, { 
        doctorReviewed: true, 
        status: 'reviewed',
        doctorComments: reviewData.comments,
        reviewedAt: getTimestamp()
    });
}

// Get reports for doctor
function getReportsForDoctor() {
    return AppState.reports.filter(r => r.status === 'sent_to_doctor' || r.status === 'reviewed');
}

// Get reports for patient
function getReportsForPatient(patientId) {
    return AppState.reports.filter(r => r.patientId === patientId && r.doctorReviewed);
}

// ==========================================
// CHAT SYSTEM
// ==========================================

// Send message
function sendMessage(messageData) {
    const message = {
        id: generateId('msg'),
        ...messageData,
        timestamp: getTimestamp()
    };
    
    AppState.messages.push(message);
    saveToStorage('ecg_messages', AppState.messages);
    
    return message;
}

// Get conversation between two users
function getConversation(user1Id, user2Id) {
    return AppState.messages.filter(m => 
        (m.senderId === user1Id && m.receiverId === user2Id) ||
        (m.senderId === user2Id && m.receiverId === user1Id)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

// ==========================================
// AVAILABILITY MANAGEMENT
// ==========================================

// Add availability slot
function addAvailabilitySlot(day, time) {
    const daySchedule = AppState.availability.find(a => a.day === day);
    if (daySchedule) {
        const existingSlot = daySchedule.slots.find(s => s.time === time);
        if (!existingSlot) {
            daySchedule.slots.push({ time: time, available: true, booked: false });
            daySchedule.slots.sort((a, b) => a.time.localeCompare(b.time));
            saveToStorage('ecg_availability', AppState.availability);
            return true;
        }
    }
    return false;
}

// Remove availability slot
function removeAvailabilitySlot(day, time) {
    const daySchedule = AppState.availability.find(a => a.day === day);
    if (daySchedule) {
        const slotIndex = daySchedule.slots.findIndex(s => s.time === time);
        if (slotIndex > -1) {
            daySchedule.slots.splice(slotIndex, 1);
            saveToStorage('ecg_availability', AppState.availability);
            return true;
        }
    }
    return false;
}

// Book slot
function bookSlot(day, time) {
    const daySchedule = AppState.availability.find(a => a.day === day);
    if (daySchedule) {
        const slot = daySchedule.slots.find(s => s.time === time && s.available && !s.booked);
        if (slot) {
            slot.booked = true;
            saveToStorage('ecg_availability', AppState.availability);
            return true;
        }
    }
    return false;
}

// ==========================================
// TECHNOLOGIST VISITS
// ==========================================

// Assign visit to technologist
function assignVisit(visitData) {
    const visit = {
        id: generateId('visit'),
        ...visitData,
        status: 'assigned',
        assignedAt: getTimestamp()
    };
    
    AppState.technologistVisits.push(visit);
    saveToStorage('ecg_visits', AppState.technologistVisits);
    
    return visit;
}

// Complete visit with report
function completeVisit(visitId, reportData) {
    const visit = AppState.technologistVisits.find(v => v.id === visitId);
    if (visit) {
        visit.status = 'completed';
        visit.reportSubmitted = true;
        visit.reportData = reportData;
        visit.completedAt = getTimestamp();
        saveToStorage('ecg_visits', AppState.technologistVisits);
        return visit;
    }
    return null;
}

// Get visits for technologist
function getVisitsForTechnologist(techId) {
    return AppState.technologistVisits.filter(v => v.technologistId === techId);
}

// ==========================================
// SALARY CALCULATION (Admin Feature)
// ==========================================

function calculateSalary(userId, month, year) {
    const baseSalary = {
        'admin': 5000,
        'doctor': 8000,
        'technologist': 4000,
        'patient': 0
    };
    
    const user = AppState.users.find(u => u.id === userId);
    if (!user) return null;
    
    const base = baseSalary[user.role] || 3000;
    const bonus = Math.floor(Math.random() * 1000); // Random bonus for demo
    const deductions = Math.floor(base * 0.15); // 15% deductions
    
    return {
        userId: userId,
        userName: user.name,
        role: user.role,
        month: month,
        year: year,
        baseSalary: base,
        bonus: bonus,
        deductions: deductions,
        netSalary: base + bonus - deductions
    };
}

// ==========================================
// FILE UPLOAD SIMULATION
// ==========================================

function simulateFileUpload(fileInput, callback) {
    const file = fileInput.files[0];
    if (!file) {
        callback(null, 'No file selected');
        return;
    }
    
    // Simulate upload delay
    const uploadTime = Math.random() * 1000 + 500;
    
    setTimeout(() => {
        const fileData = {
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: getTimestamp(),
            url: URL.createObjectURL(file) // For preview
        };
        
        callback(fileData, null);
    }, uploadTime);
}

// ==========================================
// DOM MANIPULATION HELPERS
// ==========================================

// Create element with attributes
function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    Object.keys(attributes).forEach(key => {
        if (key === 'textContent') {
            element.textContent = attributes[key];
        } else if (key === 'innerHTML') {
            element.innerHTML = attributes[key];
        } else {
            element.setAttribute(key, attributes[key]);
        }
    });
    
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });
    
    return element;
}

// Toggle element visibility
function toggleVisibility(element, show) {
    if (typeof element === 'string') {
        element = document.querySelector(element);
    }
    if (element) {
        element.classList.toggle('hidden', !show);
    }
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==========================================
// INITIALIZE APPLICATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    
    // Close modal on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close modal on close button click
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-overlay');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    // Tab functionality
    document.querySelectorAll('.tabs').forEach(tabContainer => {
        const buttons = tabContainer.querySelectorAll('.tab-btn');
        const contents = tabContainer.parentElement.querySelectorAll('.tab-content');
        
        buttons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                if (contents[index]) {
                    contents[index].classList.add('active');
                }
            });
        });
    });
});

// ==========================================
// ANIMATIONS & SCROLL EFFECTS
// ==========================================

// Intersection Observer for scroll reveal animations
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    if (revealElements.length === 0) return;
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing after reveal
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
}

// Smooth alert dismissal with animation
function dismissAlert(alertElement) {
    if (!alertElement) return;
    
    alertElement.classList.add('hiding');
    
    setTimeout(() => {
        alertElement.remove();
    }, 300);
}

// Enhanced showAlert with animation
function showAnimatedAlert(container, message, type = 'info', duration = 5000) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>${message}</span>
        <button onclick="dismissAlert(this.parentElement)" style="margin-left: auto; background: none; border: none; cursor: pointer; padding: 4px;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    `;
    
    if (typeof container === 'string') {
        container = document.querySelector(container);
    }
    
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);
        
        // Auto dismiss after duration
        if (duration > 0) {
            setTimeout(() => {
                dismissAlert(alertDiv);
            }, duration);
        }
    }
    
    return alertDiv;
}

// Parallax effect for hero section (subtle)
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        
        if (rate < 400) { // Limit the effect
            hero.style.backgroundPositionY = `${rate * 0.5}px`;
        }
    }, { passive: true });
}

// Button ripple effect
function initButtonRipples() {
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                left: ${x}px;
                top: ${y}px;
                width: 20px;
                height: 20px;
                margin-left: -10px;
                margin-top: -10px;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Add ripple keyframes dynamically
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyles);

// Initialize all animations on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure DOM is fully rendered
    setTimeout(() => {
        initScrollAnimations();
        initNavbarScroll();
        initParallax();
        initButtonRipples();
    }, 100);
});

// Export functions for global access
window.AppState = AppState;
window.generateId = generateId;
window.getTimestamp = getTimestamp;
window.formatDate = formatDate;
window.formatTime = formatTime;
window.showAlert = showAlert;
window.showModal = showModal;
window.hideModal = hideModal;
window.validateForm = validateForm;
window.clearForm = clearForm;
window.login = login;
window.logout = logout;
window.checkAuth = checkAuth;
window.updateUserUI = updateUserUI;
window.createRequest = createRequest;
window.updateRequestStatus = updateRequestStatus;
window.getRequestsByPatient = getRequestsByPatient;
window.getPendingRequests = getPendingRequests;
window.createReport = createReport;
window.updateReport = updateReport;
window.approveReport = approveReport;
window.sendToDoctor = sendToDoctor;
window.reviewReport = reviewReport;
window.getReportsForDoctor = getReportsForDoctor;
window.getReportsForPatient = getReportsForPatient;
window.sendMessage = sendMessage;
window.getConversation = getConversation;
window.addAvailabilitySlot = addAvailabilitySlot;
window.removeAvailabilitySlot = removeAvailabilitySlot;
window.bookSlot = bookSlot;
window.assignVisit = assignVisit;
window.completeVisit = completeVisit;
window.getVisitsForTechnologist = getVisitsForTechnologist;
window.calculateSalary = calculateSalary;
window.simulateFileUpload = simulateFileUpload;
window.createElement = createElement;
window.toggleVisibility = toggleVisibility;
window.saveToStorage = saveToStorage;
