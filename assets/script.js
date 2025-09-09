// Initialize sample data if not exists
if (!localStorage.getItem('all_events')) {
  localStorage.setItem('all_events', JSON.stringify([
    {
      club: 'Tech Club',
      clubType: 'Technical',
      clubColor: '#FF6B6B',
      name: 'Hackathon 2025',
      date: '2025-02-15',
      venue: 'Main Auditorium',
      participants: '150',
      prize: '₹50,000',
      regLink: 'https://example.com/hackathon',
      instaLink: 'https://instagram.com/techclub',
      websiteLink: 'https://techclub.edu',
      desc: '24-hour coding challenge with amazing prizes'
    },
    {
      club: 'Dance Club',
      clubType: 'Non-Technical',
      clubColor: '#4ECDC4',
      name: 'Dance Competition',
      date: '2025-02-20',
      venue: 'Open Air Theatre',
      participants: '80',
      prize: '₹25,000',
      regLink: 'https://example.com/dance',
      instaLink: 'https://instagram.com/danceclub',
      websiteLink: 'https://danceclub.edu',
      desc: 'Show your dance moves and win exciting prizes'
    }
  ]));
}

if (!localStorage.getItem('all_recruitments')) {
  localStorage.setItem('all_recruitments', JSON.stringify([
    {
      club: 'Tech Club',
      clubType: 'Technical',
      clubColor: '#FF6B6B',
      position: 'Web Developer',
      prereq: 'HTML, CSS, JavaScript',
      regLink: 'https://example.com/apply',
      websiteLink: 'https://techclub.edu',
      socialLink: 'https://instagram.com/techclub'
    },
    {
      club: 'Dance Club',
      clubType: 'Non-Technical',
      clubColor: '#4ECDC4',
      position: 'Dance Coordinator',
      prereq: 'Dance experience, leadership skills',
      regLink: 'https://example.com/dance-apply',
      websiteLink: 'https://danceclub.edu',
      socialLink: 'https://instagram.com/danceclub'
    }
  ]));
}

// Initialize sample clubs and students for testing
if (!localStorage.getItem('clubs')) {
  localStorage.setItem('clubs', JSON.stringify([
    {
      name: 'Tech Club',
      type: 'Technical',
      code: 'TECH001',
      color: '#FF6B6B',
      email: 'tech@college.edu',
      password: 'tech123'
    },
    {
      name: 'Dance Club',
      type: 'Non-Technical',
      code: 'DANCE001',
      color: '#4ECDC4',
      email: 'dance@college.edu',
      password: 'dance123'
    }
  ]));
}

if (!localStorage.getItem('students')) {
  localStorage.setItem('students', JSON.stringify([
    {
      name: 'John Doe',
      usn: '1MS21CS001',
      email: 'john@student.edu',
      password: 'student123'
    },
    {
      name: 'Jane Smith',
      usn: '1MS21CS002',
      email: 'jane@student.edu',
      password: 'student123'
    }
  ]));
}

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    if (body.classList.contains('light-mode')) {
      themeToggle.textContent = '☀️';
    } else {
      themeToggle.textContent = '🌙';
    }
  });
}

// Fade-up animation on load
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.fade-up').forEach(el => {
    el.style.animationDelay = (el.dataset.delay || 0) + 's';
    el.classList.add('animated');
  });
});

// Scroll reveal animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
  });
});

// Animation logic for the new layout
window.addEventListener('DOMContentLoaded', () => {
  const portal = document.getElementById('portal-section');
  const notice = document.getElementById('notice-section');
  const contact = document.getElementById('contact-section');
  
  // Show other sections after text animations complete
    setTimeout(() => {
        if (portal) portal.style.display = '';
        if (notice) notice.style.display = '';
        if (contact) contact.style.display = '';
    [portal, notice, contact].forEach((el, i) => {
          if (el) {
            el.classList.add('fade-up');
        el.style.animationDelay = (0.5 + i * 0.4) + 's';
          }
        });
  }, 2000); // Reduced time since we removed COEV animation
  
  // Add scroll reveal to notification board
  const noticeBoard = document.getElementById('notice-section');
  if (noticeBoard) {
    noticeBoard.classList.add('scroll-reveal');
  }
  
  // Filter upcoming events for the next 40 days
  function filterUpcomingEvents() {
    const today = new Date();
    const fortyDaysFromNow = new Date();
    fortyDaysFromNow.setDate(today.getDate() + 40);
    
    const events = JSON.parse(localStorage.getItem('all_events') || '[]');
    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today && eventDate <= fortyDaysFromNow;
    });
    
    return upcomingEvents;
  }
  
  // Update notice board with upcoming events
  function updateNoticeBoard() {
    const upcomingEvents = filterUpcomingEvents();
    const noticeBoard = document.getElementById('notice-board');
    
    if (noticeBoard) {
      if (upcomingEvents.length === 0) {
        noticeBoard.innerHTML = `
          <div style="
            text-align: center;
            padding: 40px;
            color: #EBD3F8;
            font-family: 'Montserrat', sans-serif;
            font-size: 1.2rem;
            opacity: 0.8;
          ">
            No upcoming events
          </div>
        `;
      } else {
        noticeBoard.innerHTML = upcomingEvents.map(event => `
          <div class="event-bar" style="
            background: rgba(173, 73, 225, 0.1);
            border: 2px solid ${event.clubColor};
            border-radius: 8px;
            padding: 20px;
            min-width: 300px;
            display: flex;
            flex-direction: column;
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
            overflow: hidden;
          " onmouseover="this.style.transform='translateY(-8px)';this.style.boxShadow='0 8px 24px ${event.clubColor}40'" onmouseout="this.style.transform='';this.style.boxShadow='none'">
            <div style="
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 2px;
              background: linear-gradient(90deg, transparent, ${event.clubColor}, transparent);
              transition: left 0.6s ease;
            "></div>
            <h4 style="
              font-family: 'Montserrat', sans-serif;
              font-size: 1.8rem;
              font-weight: 600;
              color: ${event.clubColor};
              margin-bottom: 8px;
            ">
              ${event.name}
            </h4>
            <p style="
              font-family: 'Montserrat', sans-serif;
              font-size: 0.9rem;
              color: #EBD3F8;
              margin-bottom: 4px;
            ">
              Organized by: ${event.club}
            </p>
            <p style="
              font-family: 'Montserrat', sans-serif;
              font-size: 0.9rem;
              color: #EBD3F8;
              opacity: 0.8;
            ">
              ${new Date(event.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} • ${event.venue}
            </p>
          </div>
        `).join('');
      }
    }
  }
  
  // Update notice board when page loads
  setTimeout(updateNoticeBoard, 2500);
});

// Student Portal logic
if (window.location.pathname.includes('student.html')) {
  const authCard = document.getElementById('student-auth-card');
  const loginForm = document.getElementById('student-login-form');
  const signupForm = document.getElementById('student-signup-form');
  const dashboard = document.getElementById('student-dashboard');
  const authTitle = document.getElementById('student-auth-title');
  const toggleBtn = document.getElementById('student-toggle-btn');
  
  // Check if user is already logged in
          const currentUser = JSON.parse(localStorage.getItem('current_student'));
  if (currentUser) {
    loadStudentDashboard(currentUser);
  }
  
  // Toggle between login and signup
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        authTitle.textContent = 'Student Login';
        toggleBtn.textContent = 'Need an account? Sign up';
      } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        authTitle.textContent = 'Student Sign Up';
        toggleBtn.textContent = 'Already have an account? Login';
      }
    });
  }
  
  // Login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('student-login-email').value;
      const password = document.getElementById('student-login-password').value;
      
      if (!email || !password) {
        alert('Please fill in all fields');
        return;
      }
      
      const students = JSON.parse(localStorage.getItem('students') || '[]');
      const user = students.find(s => s.email === email && s.password === password);
      
      if (user) {
        localStorage.setItem('current_student', JSON.stringify(user));
        loadStudentDashboard(user);
      } else {
        alert('Invalid credentials. Please check your email and password.');
      }
    });
  }
  
  // Signup form submission
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('student-signup-name').value;
      const usn = document.getElementById('student-signup-usn').value;
      const email = document.getElementById('student-signup-email').value;
      const password = document.getElementById('student-signup-password').value;
      const confirmPassword = document.getElementById('student-signup-confirm').value;
      
      if (!name || !usn || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
      }
      
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      
      if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
      }
      
      const students = JSON.parse(localStorage.getItem('students') || '[]');
      const existingUser = students.find(s => s.email === email || s.usn === usn);
      
      if (existingUser) {
        alert('User already exists with this email or USN');
        return;
      }
      
      const newUser = { name, usn, email, password };
      students.push(newUser);
      localStorage.setItem('students', JSON.stringify(students));
              localStorage.setItem('current_student', JSON.stringify(newUser));
      loadStudentDashboard(newUser);
    });
  }
  
  function loadStudentDashboard(user) {
    document.getElementById('student-auth').style.display = 'none';
    document.getElementById('student-dashboard').style.display = 'block';
    
    // Add logout button to navbar
    const navbar = document.querySelector('.navbar');
    if (navbar && !document.querySelector('.logout-btn')) {
      const logoutBtn = document.createElement('button');
      logoutBtn.className = 'logout-btn';
      logoutBtn.textContent = 'Logout';
      logoutBtn.onclick = () => {
        localStorage.removeItem('current_student');
        window.location.reload();
      };
      navbar.appendChild(logoutBtn);
    }
    
    // Load certificate upload form
    const certForm = document.getElementById('certificate-upload-form');
    if (certForm) {
      certForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('certificate-file');
        if (fileInput.files[0]) {
          alert('Certificate uploaded successfully!');
          fileInput.value = '';
        }
      });
    }
    
    // Load sample notifications
    const notificationTable = document.getElementById('student-notification-table');
    if (notificationTable) {
      const events = JSON.parse(localStorage.getItem('all_events') || '[]');
      const upcomingEvents = events.filter(ev => {
        const eventDate = new Date(ev.date);
        const now = new Date();
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
        return eventDate >= now && eventDate <= nextMonth;
      });
      
      notificationTable.innerHTML = upcomingEvents.map(ev => `
        <tr>
          <td><a href="events.html" style="color: #AD49E1; text-decoration: none;">${ev.name}</a></td>
          <td>${ev.date}</td>
          <td>${ev.venue}</td>
        </tr>
      `).join('') || '<tr><td colspan="3">No upcoming events</td></tr>';
    }
    
    // Load event history
    const eventHistory = document.getElementById('student-event-history');
    if (eventHistory) {
      const pastEvents = events.filter(ev => new Date(ev.date) < new Date());
      eventHistory.innerHTML = pastEvents.map(ev => `
        <div class="glass-card" style="margin-bottom: 16px;">
          <h3>${ev.name}</h3>
          <p>Date: ${ev.date} | Venue: ${ev.venue}</p>
          <button class="neu-btn" onclick="uploadCertificate('${ev.name}')">Upload Certificate</button>
          <button class="neu-btn" onclick="window.location.href='feedback.html'">Give Feedback</button>
        </div>
      `).join('') || '<p>No past events</p>';
    }
  }
  
  window.uploadCertificate = function(eventName) {
    alert(`Certificate upload for ${eventName} - Feature coming soon!`);
  };
}

// Club Portal logic
if (window.location.pathname.includes('club.html')) {
  const colorPalette = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
    '#FAD7A0', '#A9DFBF', '#F9E79F', '#D5A6BD', '#A3E4D7'
  ];
  
  function getAvailableColors() {
    // Exclude purple shades and provide a wide range of colors
    return [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
      '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
      '#F9E79F', '#A9CCE3', '#FAD7A0', '#D5A6BD', '#A3E4D7',
      '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
      '#F9E79F', '#A9CCE3', '#FAD7A0', '#D5A6BD', '#A3E4D7',
      '#FFB6C1', '#87CEEB', '#98FB98', '#F0E68C', '#DDA0DD',
      '#FFA07A', '#20B2AA', '#87CEFA', '#DDA0DD', '#F0E68C'
    ].filter(color => {
      // Filter out purple shades
      const rgb = hexToRgb(color);
      if (!rgb) return true;
      
      // Check if it's a purple shade (high red and blue, low green)
      const { r, g, b } = rgb;
      const isPurple = r > 150 && b > 150 && g < 150;
      return !isPurple;
    });
  }
  
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  
  function renderColorOptions() {
    const colorSelect = document.getElementById('club-signup-color');
    if (colorSelect) {
      const availableColors = getAvailableColors();
      colorSelect.innerHTML = '<option value="">Select Club Color</option>' +
        availableColors.map(color => `<option value="${color}" style="background-color: ${color}; color: white;">${color}</option>`).join('');
    }
  }
  
  const authCard = document.getElementById('club-auth-card');
  const loginForm = document.getElementById('club-login-form');
  const signupForm = document.getElementById('club-signup-form');
  const dashboard = document.getElementById('club-dashboard');
  const authTitle = document.getElementById('club-auth-title');
  const toggleBtn = document.getElementById('club-toggle-btn');
  
  // Check if club is already logged in
  const currentClub = JSON.parse(localStorage.getItem('currentClub'));
  if (currentClub) {
    setupClubDashboard(currentClub);
  }
  
  // Render color options
  renderColorOptions();
  
  // Toggle between login and signup
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        authTitle.textContent = 'Club Login';
        toggleBtn.textContent = 'Need an account? Sign up';
      } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        authTitle.textContent = 'Club Sign Up';
        toggleBtn.textContent = 'Already have an account? Login';
        renderColorOptions();
      }
    });
  }
  
  // Login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('club-login-name').value;
      const code = document.getElementById('club-login-code').value;
      
      if (!name || !code) {
        alert('Please fill in all fields');
        return;
      }
      
      const clubs = JSON.parse(localStorage.getItem('clubs') || '[]');
      const club = clubs.find(c => c.name === name && c.code === code);
      
      if (club) {
        localStorage.setItem('currentClub', JSON.stringify(club));
        setupClubDashboard(club);
      } else {
        alert('Invalid credentials. Please check your club name and code.');
      }
    });
  }
  
  // Signup form submission
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('club-signup-name').value;
      const type = document.getElementById('club-signup-type').value;
      const code = document.getElementById('club-signup-code').value;
      const color = document.getElementById('club-signup-color').value;
      const email = document.getElementById('club-signup-email').value;
      const password = document.getElementById('club-signup-password').value;
      const cert = document.getElementById('club-signup-cert').files[0];
      
      if (!name || !type || !code || !color || !email || !password || !cert) {
        alert('Please fill in all fields');
        return;
      }
      
      if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
      }
      
      if (code.length < 4) {
        alert('Club code must be at least 4 characters long');
        return;
      }
      
      const clubs = JSON.parse(localStorage.getItem('clubs') || '[]');
      const existingClub = clubs.find(c => c.name === name || c.code === code);
      
      if (existingClub) {
        alert('Club already exists with this name or code');
        return;
      }
      
      const newClub = { name, type, code, color, email, password };
      clubs.push(newClub);
      localStorage.setItem('clubs', JSON.stringify(clubs));
      localStorage.setItem('currentClub', JSON.stringify(newClub));
      
      // Send email notification (simulated)
      alert('Registration successful! Details sent to msrakshith.0506@gmail.com');
      setupClubDashboard(newClub);
    });
  }
  
  function setupClubDashboard(club) {
    document.getElementById('club-auth').style.display = 'none';
    document.getElementById('club-dashboard').style.display = 'block';
    
    // Add logout button to navbar
    const navbar = document.querySelector('.navbar');
    if (navbar && !document.querySelector('.logout-btn')) {
      const logoutBtn = document.createElement('button');
      logoutBtn.className = 'logout-btn';
      logoutBtn.textContent = 'Logout';
      logoutBtn.onclick = () => {
        localStorage.removeItem('currentClub');
        window.location.reload();
      };
      navbar.appendChild(logoutBtn);
    }
    
    // Event registration form
    const registerEventBtn = document.getElementById('register-event-btn');
    const eventFormSection = document.getElementById('club-event-form-section');
    
    if (registerEventBtn && eventFormSection) {
      registerEventBtn.addEventListener('click', () => {
        eventFormSection.style.display = 'block';
        document.getElementById('club-recruitment-form-section').style.display = 'none';
      });
      
      const eventForm = document.getElementById('club-event-form');
      if (eventForm) {
        // Add character limit to description field
        const descField = document.getElementById('event-desc');
        if (descField) {
          descField.maxLength = 400;
          descField.addEventListener('input', function() {
            const remaining = 400 - this.value.length;
            const counter = document.getElementById('char-counter');
            if (counter) {
              counter.textContent = `${remaining} characters remaining`;
              counter.style.color = remaining < 50 ? '#ff6b6b' : '#e6e6ff';
            }
          });
        }
        
        eventForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const eventData = {
            club: club.name,
            clubType: club.type,
            clubColor: club.color,
            name: document.getElementById('event-name').value,
            date: document.getElementById('event-date').value,
            venue: document.getElementById('event-venue').value,
            participants: document.getElementById('event-participants').value,
            prize: document.getElementById('event-prize').value,
            regLink: document.getElementById('event-reg-link').value,
            instaLink: document.getElementById('event-insta-link').value,
            websiteLink: document.getElementById('event-website-link').value,
            desc: document.getElementById('event-desc').value
          };
          
          // Validate description length
          if (eventData.desc.length > 400) {
            alert('Description must be 400 characters or less');
            return;
          }
          
          const events = JSON.parse(localStorage.getItem('all_events') || '[]');
          events.push(eventData);
          localStorage.setItem('all_events', JSON.stringify(events));
          
          alert('Event registered successfully!');
          eventForm.reset();
          eventFormSection.style.display = 'none';
        });
      }
    }
    
    // Recruitment upload form
    const uploadRecruitmentBtn = document.getElementById('upload-recruitment-btn');
    const recruitmentFormSection = document.getElementById('club-recruitment-form-section');
    
    if (uploadRecruitmentBtn && recruitmentFormSection) {
      uploadRecruitmentBtn.addEventListener('click', () => {
        recruitmentFormSection.style.display = 'block';
        document.getElementById('club-event-form-section').style.display = 'none';
      });
      
      const recruitmentForm = document.getElementById('club-recruitment-form');
      if (recruitmentForm) {
        recruitmentForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const recruitmentData = {
            club: club.name,
            clubType: club.type,
            clubColor: club.color,
            position: document.getElementById('recruitment-position').value,
            prereq: document.getElementById('recruitment-prereq').value,
            entryTimeline: document.getElementById('recruitment-timeline').value,
            contact: document.getElementById('recruitment-contact')?.value || '',
            email: document.getElementById('recruitment-email')?.value || '',
            regLink: document.getElementById('recruitment-reg-link').value,
            websiteLink: document.getElementById('recruitment-website-link').value,
            socialLink: document.getElementById('recruitment-social-link').value
          };
          
          const recruitments = JSON.parse(localStorage.getItem('all_recruitments') || '[]');
          recruitments.push(recruitmentData);
          localStorage.setItem('all_recruitments', JSON.stringify(recruitments));
          
          alert('Recruitment posted successfully!');
          recruitmentForm.reset();
          recruitmentFormSection.style.display = 'none';
        });
      }
    }
  }
}

// Events Page logic
if (window.location.pathname.includes('events.html')) {
  const eventCardsDiv = document.getElementById('event-cards');
  const searchInput = document.getElementById('event-search');
  const filterClub = document.getElementById('event-filter-club');
  const filterType = document.getElementById('event-filter-type');
  
  let events = JSON.parse(localStorage.getItem('all_events') || '[]');
  
  // Add sample events if none exist
  if (events.length === 0) {
    events = [
      {
        club: 'Tech Club',
        clubType: 'Technical',
        clubColor: '#4ECDC4',
        name: 'Hackathon 2024',
        date: '2025-02-15',
        venue: 'Main Auditorium',
        participants: 150,
        prize: '$5000',
        regLink: '#',
        instaLink: '#',
        websiteLink: '#',
        desc: '24-hour coding challenge with amazing prizes!'
      },
      {
        club: 'Cultural Club',
        clubType: 'Non-Technical',
        clubColor: '#FF6B6B',
        name: 'Music Festival',
        date: '2025-02-20',
        venue: 'Open Air Theatre',
        participants: 200,
        prize: '$3000',
        regLink: '#',
        instaLink: '#',
        websiteLink: '#',
        desc: 'Annual music festival featuring local bands!'
      },
      {
        club: 'Dance Club',
        clubType: 'Non-Technical',
        clubColor: '#45B7D1',
        name: 'Dance Competition',
        date: '2025-02-25',
        venue: 'Auditorium Hall',
        participants: 80,
        prize: '$2000',
        regLink: '#',
        instaLink: '#',
        websiteLink: '#',
        desc: 'Show your dance moves and win exciting prizes!'
      }
    ];
    localStorage.setItem('all_events', JSON.stringify(events));
  }
  
  // Populate club filter
  const clubs = [...new Set(events.map(ev => ev.club))];
  filterClub.innerHTML = '<option value="">All Clubs</option>' +
    clubs.map(club => `<option value="${club}">${club}</option>`).join('');
  
  function renderEvents() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedClub = filterClub.value;
    const selectedType = filterType.value;
    
    const filtered = events.filter(ev => {
      const matchesSearch = ev.name.toLowerCase().includes(searchTerm) ||
                           ev.desc.toLowerCase().includes(searchTerm);
      const matchesClub = !selectedClub || ev.club === selectedClub;
      const matchesType = !selectedType || ev.clubType === selectedType;
      
      return matchesSearch && matchesClub && matchesType;
    });
    
    eventCardsDiv.innerHTML = filtered.map((ev, index) => `
      <div class="event-card glare-hover" style="
        border: 4px solid ${ev.clubColor};
        border-radius: 16px;
        box-shadow: 0 4px 16px 2px ${ev.clubColor}55, 0 0 8px 2px ${ev.clubColor}99;
        background: rgba(235, 211, 248, 0.1);
        backdrop-filter: blur(12px);
        padding: 20px;
        max-width: 320px; min-width: 280px; min-height: 160px; max-height: 180px;
        margin: 16px auto;
        position: relative;
        display: flex; flex-direction: column; justify-content: space-between;
        transition: box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        animation: cardSlideIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) both;
        overflow: visible;
      " onmouseover="this.style.transform='translateY(-10px) scale(1.03)';this.style.boxShadow='0 8px 32px 4px ${ev.clubColor}99, 0 0 16px 4px ${ev.clubColor}cc';" onmouseout="this.style.transform='';this.style.boxShadow='0 4px 16px 2px ${ev.clubColor}55, 0 0 8px 2px ${ev.clubColor}99';">
        <div style="
          position: absolute; top: -38px; left: -4px;
          background: ${ev.clubColor};
          color: #fff;
          font-family: 'Inter', sans-serif;
          font-weight: bold;
          font-size: 18px;
          padding: 8px 20px 8px 16px;
          border-radius: 12px 12px 0 0;
          letter-spacing: 1px;
          z-index: 2;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border: 4px solid ${ev.clubColor};
          border-bottom: none;
        ">
          ${ev.club}
        </div>
        <div style="display: flex; align-items: center; margin-top: 15px; margin-bottom: 6px;">
          <div style="flex: 1; font-family: 'Inter', sans-serif; font-weight: 900; font-size: 18px; color: ${ev.clubColor}; letter-spacing: 0.5px;">
            ${ev.name}
          </div>
        </div>
        <div style="margin-top: 6px;">
          <div style="font-family: 'Inter', sans-serif; color: #AD49E1; font-weight: bold; margin-bottom: 4px; font-size: 14px;">${ev.desc.length > 80 ? ev.desc.substring(0, 80) + '...' : ev.desc}</div>
          <div style="font-family: 'Inter', sans-serif; color: #AD49E1; font-weight: bold; margin-bottom: 4px; font-size: 14px;">date: <span style="color: #EBD3F8; font-weight: normal;">${ev.date}</span></div>
          <div style="font-family: 'Inter', sans-serif; color: #AD49E1; font-weight: bold; margin-bottom: 4px; font-size: 14px;">venue: <span style="color: #EBD3F8; font-weight: normal;">${ev.venue}</span></div>
          <div style="font-family: 'Inter', sans-serif; color: #AD49E1; font-weight: bold; margin-bottom: 4px; font-size: 14px;">prize: <span style="color: #EBD3F8; font-weight: normal;">${ev.prize || 'TBD'}</span></div>
        </div>
        <div style="position: absolute; top: 15px; right: 8px; display: flex; gap: 4px; align-items: center;">
          <a href="${ev.instaLink}" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
            <div style="
              display: inline-block;
              background: ${ev.clubColor};
              color: #fff;
              font-weight: bold;
              font-family: 'Inter', sans-serif;
              font-size: 18px;
              width: 32px; height: 32px; line-height: 32px;
              text-align: center;
              border-radius: 4px;
              box-shadow: 0 2px 8px rgba(173, 73, 225, 0.3);
              transition: all 0.3s ease;
              position: relative;
              overflow: hidden;
            " onmouseover="this.style.transform='translateY(-2px)';this.style.background='#7A1CAC';this.style.boxShadow='0 4px 12px rgba(173, 73, 225, 0.5)'" onmouseout="this.style.transform='';this.style.background='${ev.clubColor}';this.style.boxShadow='0 2px 8px rgba(173, 73, 225, 0.3)'">
              IN
            </div>
          </a>
          <a href="${ev.websiteLink}" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
            <div style="
              display: inline-block;
              background: ${ev.clubColor};
              color: #fff;
              font-weight: bold;
              font-family: 'Inter', sans-serif;
              font-size: 18px;
              width: 32px; height: 32px; line-height: 32px;
              text-align: center;
              border-radius: 4px;
              box-shadow: 0 2px 8px rgba(173, 73, 225, 0.3);
              transition: all 0.3s ease;
              position: relative;
              overflow: hidden;
            " onmouseover="this.style.transform='translateY(-2px)';this.style.background='#7A1CAC';this.style.boxShadow='0 4px 12px rgba(173, 73, 225, 0.5)'" onmouseout="this.style.transform='';this.style.background='${ev.clubColor}';this.style.boxShadow='0 2px 8px rgba(173, 73, 225, 0.3)'">
              G
            </div>
          </a>
        </div>
        <div style="position: absolute; right: -4px; bottom: -20px; display: flex; align-items: center;">
          <div style="
            width: 120px; height: 36px;
            background: ${ev.clubColor};
            clip-path: polygon(0 0, 100% 0, 100% 100%, 20% 100%);
            position: relative;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 4px solid ${ev.clubColor};
            border-top: none;
          ">
            <a href="${ev.regLink}" target="_blank" rel="noopener noreferrer" style="
              background: ${ev.clubColor};
              color: #fff;
              font-family: 'Inter', sans-serif;
              font-weight: bold;
              font-size: 14px;
              padding: 8px 20px;
              text-decoration: none;
              box-shadow: 0 2px 8px rgba(173, 73, 225, 0.3);
              transition: all 0.3s ease;
              position: absolute;
              left: 0; right: 0; top: 0; bottom: 0;
              display: flex; align-items: center; justify-content: center;
              clip-path: polygon(0 0, 100% 0, 100% 100%, 20% 100%);
            " onmouseover="this.style.background='#7A1CAC';this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 12px rgba(173, 73, 225, 0.5)'" onmouseout="this.style.background='${ev.clubColor}';this.style.transform='';this.style.boxShadow='0 2px 8px rgba(173, 73, 225, 0.3)'">
              REGISTER
            </a>
          </div>
        </div>
      </div>
    `).join('') || '<div style="opacity:0.7;text-align:center;grid-column:1/-1;">No events found.</div>';

    // Add keyframes for slide-in animation if not present
    if (!document.getElementById('eventCardAnimStyles')) {
      const style = document.createElement('style');
      style.id = 'eventCardAnimStyles';
      style.innerHTML = `
      @keyframes cardSlideIn {
        from {
          opacity: 0;
          transform: translateY(30px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      `;
      document.head.appendChild(style);
    }

    // Add keyframes for pop-in animation if not present
    if (!document.getElementById('eventCardAnimStyles')) {
      const style = document.createElement('style');
      style.id = 'eventCardAnimStyles';
      style.innerHTML = `
      @keyframes cardPopIn {
        0% { opacity: 0; transform: scale(0.7) translateY(40px); }
        80% { opacity: 1; transform: scale(1.05) translateY(-6px); }
        100% { opacity: 1; transform: scale(1) translateY(0); }
      }
      `;
      document.head.appendChild(style);
    }
  }
  
  searchInput.addEventListener('input', renderEvents);
  filterClub.addEventListener('change', renderEvents);
  filterType.addEventListener('change', renderEvents);
  renderEvents();
}

// Calendar Page logic
if (window.location.pathname.includes('calendar.html')) {
  const calendarGrid = document.getElementById('calendar-grid');
  const prevYearBtn = document.getElementById('prev-year');
  const nextYearBtn = document.getElementById('next-year');
  const yearSpan = document.getElementById('calendar-year');

  const eventPopup = document.getElementById('event-popup');
  const popupHeader = document.getElementById('popup-header');
  const popupDate = document.getElementById('popup-date');
  const popupContent = document.getElementById('popup-content');
  
  let currentYear = 2025;
  let selectedDate = null;
  let events = JSON.parse(localStorage.getItem('all_events') || '[]');
  
  function renderCalendar(year) {
    yearSpan.textContent = year;
    calendarGrid.innerHTML = '';
    
    for (let month = 0; month < 12; month++) {
      const monthDiv = document.createElement('div');
      monthDiv.className = 'calendar-month';
      
      const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
      monthDiv.innerHTML = `
        <div class="calendar-month-title" data-text="${monthName}">${monthName}</div>
        <div class="calendar-days">
          ${generateDays(year, month)}
        </div>
      `;
      
      calendarGrid.appendChild(monthDiv);
    }
  }
  
  function generateDays(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    let daysHTML = '';
    const currentDate = new Date();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      daysHTML += '<div class="calendar-day empty"></div>';
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      // Format date as YYYY-MM-DD to match event dates exactly
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = events.filter(ev => ev.date === dateStr);
      const isEventDay = dayEvents.length > 0;
      const isToday = date.toDateString() === currentDate.toDateString();
      
      let dayClass = 'calendar-day';
      if (isEventDay) dayClass += ' event-day';
      if (isToday) dayClass += ' today';
      if (selectedDate && dateStr === selectedDate) dayClass += ' selected';
      
      const eventColor = isEventDay ? dayEvents[0].clubColor : '';
      
      daysHTML += `
        <div class="${dayClass}" 
             data-date="${dateStr}"
             ${isEventDay ? `style="--club-color: ${eventColor};"` : ''}
             onclick="showEventsForDate('${dateStr}')">
          ${day}
        </div>
      `;
    }
    
    // Calculate how many empty cells we need to complete the grid
    const totalCells = startDayOfWeek + daysInMonth;
    const remainingCells = 42 - totalCells; // 6 rows * 7 days = 42
    
    // Add remaining empty cells to complete the grid
    for (let i = 0; i < remainingCells; i++) {
      daysHTML += '<div class="calendar-day empty"></div>';
    }
    
    return daysHTML;
  }
  
  window.showEventsForDate = function(dateStr) {
    selectedDate = dateStr;
    const dayEvents = events.filter(ev => ev.date === dateStr);
    
    if (dayEvents.length > 0) {
      const formattedDate = new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      popupDate.textContent = formattedDate;
      popupContent.innerHTML = dayEvents.map(ev => `
        <div class="event-info">
          <div class="event-name">${ev.name}</div>
          <div class="event-club" style="--club-color: ${ev.clubColor};">${ev.club}</div>
          <div class="event-details">
            <div><strong>Venue:</strong> ${ev.venue}</div>
            <div><strong>Date:</strong> ${ev.date}</div>
            ${ev.participants ? `<div><strong>Participants:</strong> ${ev.participants}</div>` : ''}
            ${ev.prize ? `<div><strong>Prize:</strong> ${ev.prize}</div>` : ''}
          </div>
          <div class="event-links">
            ${ev.regLink ? `<a href="${ev.regLink}" class="event-link-btn" target="_blank">📝 Register</a>` : ''}
            ${ev.websiteLink ? `<a href="${ev.websiteLink}" class="event-link-btn" target="_blank">🌐 Website</a>` : ''}
            ${ev.instaLink ? `<a href="${ev.instaLink}" class="event-link-btn" target="_blank">📸 Instagram</a>` : ''}
          </div>
        </div>
      `).join('');
      
      // Set the club color for the popup header
      const firstEvent = dayEvents[0];
      popupHeader.style.setProperty('--club-color', firstEvent.clubColor);
      
      // Show popup with fade-in animation
      eventPopup.classList.add('show');
      
      // Add click outside to close
      eventPopup.addEventListener('click', function(e) {
        if (e.target === eventPopup) {
          closeEventPopup();
        }
      });
    }
  };
  
  window.closeEventPopup = function() {
    eventPopup.classList.remove('show');
  };
  
  prevYearBtn.onclick = () => { currentYear--; renderCalendar(currentYear); };
  nextYearBtn.onclick = () => { currentYear++; renderCalendar(currentYear); };
  renderCalendar(currentYear);
}

// Recruitments Page logic
if (window.location.pathname.includes('recruitments.html')) {
  const recruitCardsDiv = document.getElementById('recruitment-cards');
  const searchInput = document.getElementById('search-recruitments');
  const filterClub = document.getElementById('filter-club');
  const sortRecruitments = document.getElementById('sort-recruitments');
  let recruitments = JSON.parse(localStorage.getItem('all_recruitments') || '[]');
  
  // Add sample recruitments if none exist
  if (recruitments.length === 0) {
    recruitments = [
      {
        club: 'Tech Club',
        clubType: 'Technical',
        clubColor: '#4ECDC4',
        position: 'Web Developer',
        prereq: 'HTML, CSS, JavaScript',
        entryTimeline: '2 weeks',
        regLink: '#',
        websiteLink: '#',
        socialLink: '#'
      },
      {
        club: 'Cultural Club',
        clubType: 'Non-Technical',
        clubColor: '#FF6B6B',
        position: 'Event Coordinator',
        prereq: 'Leadership skills',
        entryTimeline: '1 week',
        regLink: '#',
        websiteLink: '#',
        socialLink: '#'
      },
      {
        club: 'Sports Club',
        clubType: 'Non-Technical',
        clubColor: '#45B7D1',
        position: 'Team Manager',
        prereq: 'Sports knowledge',
        entryTimeline: '3 weeks',
        regLink: '#',
        websiteLink: '#',
        socialLink: '#'
      },
      {
        club: 'Design Club',
        clubType: 'Technical',
        clubColor: '#96CEB4',
        position: 'UI/UX Designer',
        prereq: 'Figma, Adobe Creative Suite',
        entryTimeline: '2 weeks',
        regLink: '#',
        websiteLink: '#',
        socialLink: '#'
      }
    ];
    localStorage.setItem('all_recruitments', JSON.stringify(recruitments));
  }
  

  
  // Populate filter options
  function populateFilters() {
    const clubs = [...new Set(recruitments.map(rec => rec.club))];
    filterClub.innerHTML = '<option value="">All Clubs</option>' + 
      clubs.map(club => `<option value="${club}">${club}</option>`).join('');
  }
  
  // Render recruitment cards
  function renderRecruitments(recruitmentsToRender = recruitments) {
    recruitCardsDiv.innerHTML = recruitmentsToRender.map((rec, i) => `
      <div class="recruitment-card glare-hover" style="border-color:${rec.clubColor};animation-delay:${i * 0.1}s;">
        <div class="recruitment-header">
          <div class="recruitment-club" style="color:${rec.clubColor}">${rec.club}</div>
        </div>
        <div class="recruitment-content">
          <div class="recruitment-details">
            <div class="recruitment-detail">
              <span class="recruitment-detail-label">Position:</span>
              <span class="recruitment-detail-value">${rec.position}</span>
            </div>
            <div class="recruitment-detail">
              <span class="recruitment-detail-label">Pre-req:</span>
              <span class="recruitment-detail-value">${rec.prereq || 'None'}</span>
            </div>
            <div class="recruitment-detail">
              <span class="recruitment-detail-label">Last Date:</span>
              <span class="recruitment-detail-value">${rec.entryTimeline || 'TBD'}</span>
            </div>
            <div class="recruitment-detail">
              <span class="recruitment-detail-label">Type:</span>
              <span class="recruitment-detail-value">${rec.clubType}</span>
            </div>
            ${rec.contact ? `<div class="recruitment-detail">
              <span class="recruitment-detail-label">Contact:</span>
              <span class="recruitment-detail-value">${rec.contact}</span>
            </div>` : ''}
            ${rec.email ? `<div class="recruitment-detail">
              <span class="recruitment-detail-label">Email:</span>
              <span class="recruitment-detail-value">${rec.email}</span>
            </div>` : ''}
          </div>
          <div class="recruitment-links">
            <a href="${rec.regLink}" class="recruitment-link" target="_blank">Apply Now</a>
            <a href="${rec.websiteLink}" class="recruitment-link" target="_blank">Website</a>
            <a href="${rec.socialLink}" class="recruitment-link" target="_blank">Social</a>
          </div>
        </div>
      </div>
    `).join('') || '<div style="opacity:0.7;text-align:center;grid-column:1/-1;">No recruitments found.</div>';
  }
  
  // Filter and search functionality
  function filterRecruitments() {
    let filtered = [...recruitments];
    
    // Search filter
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(rec => 
        rec.club.toLowerCase().includes(searchTerm) ||
        rec.position.toLowerCase().includes(searchTerm) ||
        rec.prereq.toLowerCase().includes(searchTerm) ||
        rec.clubType.toLowerCase().includes(searchTerm)
      );
    }
    
    // Club filter
    const selectedClub = filterClub.value;
    if (selectedClub) {
      filtered = filtered.filter(rec => rec.club === selectedClub);
    }
    
    // Sort
    const sortBy = sortRecruitments.value;
    switch (sortBy) {
      case 'alphabetical':
        filtered.sort((a, b) => a.club.localeCompare(b.club));
        break;
      case 'oldest':
        // Since we don't have timestamps, we'll sort by club name
        filtered.sort((a, b) => a.club.localeCompare(b.club));
        break;
      case 'newest':
      default:
        // Reverse alphabetical for "newest"
        filtered.sort((a, b) => b.club.localeCompare(a.club));
        break;
    }
    
    renderRecruitments(filtered);
  }
  
  // Event listeners
  searchInput.addEventListener('input', filterRecruitments);
  filterClub.addEventListener('change', filterRecruitments);
  sortRecruitments.addEventListener('change', filterRecruitments);
  
  // Initialize
  populateFilters();
  renderRecruitments();
}

// Feedback Page logic
if (window.location.pathname.includes('feedback.html')) {
  const clubDropdownsDiv = document.getElementById('club-dropdowns');
  const feedbackFormSection = document.getElementById('feedback-form-section');
  const seeFeedbackSection = document.getElementById('see-feedback-section');
  
  let clubs = JSON.parse(localStorage.getItem('clubs') || '[]');
  let events = JSON.parse(localStorage.getItem('all_events') || '[]');
  let feedbacks = JSON.parse(localStorage.getItem('all_feedbacks') || '[]');
  
  // Add sample data if none exists
  if (clubs.length === 0) {
    clubs = [
      { name: 'Tech Club', type: 'Technical' },
      { name: 'Cultural Club', type: 'Non-Technical' }
    ];
  }
  
  if (events.length === 0) {
    events = [
      { name: 'Hackathon 2024', club: 'Tech Club' },
      { name: 'Music Festival', club: 'Cultural Club' }
    ];
  }
  
  // Render club dropdowns
  clubDropdownsDiv.innerHTML = clubs.map((club, clubIdx) => `
    <div class="glass-card" style="margin-bottom: 16px;">
      <button class="neu-btn" onclick="showClubEvents(${clubIdx})" style="width: 100%; text-align: left;">
        ${club.name} (${club.type})
      </button>
      <div id="club-events-${clubIdx}" style="display: none; margin-top: 16px;">
        ${events.filter(ev => ev.club === club.name).map((ev, eventIdx) => `
          <div style="margin-bottom: 8px;">
            <button class="neu-btn" onclick="selectFeedbackEvent(${clubIdx}, ${eventIdx})" style="width: 100%; text-align: left; font-size: 0.9rem;">
              ${ev.name}
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
  
  window.showClubEvents = function(clubIdx) {
    const eventsDiv = document.getElementById(`club-events-${clubIdx}`);
    eventsDiv.style.display = eventsDiv.style.display === 'none' ? 'block' : 'none';
  };
  
  window.selectFeedbackEvent = function(clubIdx, eventIdx) {
    const club = clubs[clubIdx];
    const clubEvents = events.filter(ev => ev.club === club.name);
    const event = clubEvents[eventIdx];
    
    feedbackFormSection.innerHTML = `
      <div class="glass-card">
        <h3>Give Feedback for ${event.name}</h3>
        <form id="feedback-form">
          <input type="text" placeholder="Name" required class="input-field">
          <input type="text" placeholder="USN" required class="input-field">
          <input type="text" placeholder="Branch" required class="input-field">
          <input type="text" placeholder="Year" required class="input-field">
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" class="input-field">
          <div style="margin: 16px 0;">
            <label class="feedback-form-label">Overall Event Rating:</label>
            <div class="feedback-rating">
              <label><input type="radio" name="overall" value="5" required> 5</label>
              <label><input type="radio" name="overall" value="4"> 4</label>
              <label><input type="radio" name="overall" value="3"> 3</label>
              <label><input type="radio" name="overall" value="2"> 2</label>
              <label><input type="radio" name="overall" value="1"> 1</label>
            </div>
          </div>
          <textarea placeholder="Additional comments..." class="input-field" rows="4"></textarea>
          <button type="submit" class="neu-btn">Submit Feedback</button>
        </form>
      </div>
    `;
    
    seeFeedbackSection.innerHTML = `
      <div class="glass-card">
        <h3>See Feedback for ${event.name}</h3>
        <div class="feedback-list">
          ${feedbacks.filter(f => f.event === event.name).map(f => `
            <div class="feedback-item">
              <strong>${f.name}</strong> (${f.usn}) - ${f.branch} ${f.year}
              <div>Rating: ${f.overall}/5</div>
              <div>${f.comments}</div>
              ${f.cert ? '<span class="feedback-cert">✓ Certificate verified</span>' : ''}
            </div>
          `).join('') || '<p>No feedback yet</p>'}
        </div>
      </div>
    `;
    
    feedbackFormSection.style.display = 'block';
    seeFeedbackSection.style.display = 'block';
    
    // Handle feedback form submission
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
      feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(feedbackForm);
        const feedback = {
          club: club.name,
          event: event.name,
          name: feedbackForm.querySelector('input[type="text"]').value,
          usn: feedbackForm.querySelectorAll('input[type="text"]')[1].value,
          branch: feedbackForm.querySelectorAll('input[type="text"]')[2].value,
          year: feedbackForm.querySelectorAll('input[type="text"]')[3].value,
          overall: feedbackForm.querySelector('input[name="overall"]:checked').value,
          comments: feedbackForm.querySelector('textarea').value,
          cert: feedbackForm.querySelector('input[type="file"]').files[0] ? 'Yes' : 'No'
        };
        
        feedbacks.push(feedback);
        localStorage.setItem('all_feedbacks', JSON.stringify(feedbacks));
        alert('Feedback submitted successfully!');
        feedbackForm.reset();
      });
    }
  };
} 