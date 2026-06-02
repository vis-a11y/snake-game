/* ==========================================================================
   GLOBAL CORE JS - PORTFOLIO STATE, INTERACTION & LAYOUT SHELL
   ========================================================================== */

// --- DEFAULT STATE INITS ---
const DEFAULT_SERVICES = [
    {
        icon: "fa-solid fa-code",
        title: "Web Development",
        description: "Engineering full-scale, fast-loading, and responsive web applications utilizing robust frontend and backend frameworks.",
        details: "Full-stack application development, RESTful APIs, SQL/NoSQL integrations, and secure authentication models."
    },
    {
        icon: "fa-solid fa-laptop-code",
        title: "Frontend Design",
        description: "Designing gorgeous user interfaces featuring premium glassmorphism layouts, fluid micro-interactions, and custom keyframes.",
        details: "Clean layout styling, custom CSS architectures, Figma to responsive HTML/React compilations, and CSS Grid systems."
    },
    {
        icon: "fa-solid fa-database",
        title: "Backend & APIs",
        description: "Building highly secure server structures, optimized database schemas, transaction managers, and modern cloud logic.",
        details: "Node.js/Express frameworks, robust database query optimizations, state management setups, and API security practices."
    },
    {
        icon: "fa-solid fa-mobile-screen-button",
        title: "Responsive Tuning",
        description: "Optimizing layouts to compile flawlessly across a diverse array of mobile devices, tablets, and large screen monitors.",
        details: "Mobile-first viewport frameworks, flexible image scaling, responsive fluid grids, and touch gesture interactions."
    },
    {
        icon: "fa-solid fa-shield-halved",
        title: "Security Audits",
        description: "Implementing state-of-the-art authentication protocols, session protection systems, and standard database encryption.",
        details: "Secure login sessions, input sanitization routines, CORS configurations, and sensitive database parameter storage."
    },
    {
        icon: "fa-solid fa-cloud",
        title: "Cloud Deployment",
        description: "Setting up CI/CD workflows, automated build scripts, and deploying static or full stack nodes to modern servers.",
        details: "Cloud hosting deployment platforms (Vercel, Render), Github Action integrations, and domain manager setups."
    }
];

const DEFAULT_SKILLS = [
    { name: "HTML5 & CSS3", percent: 95 },
    { name: "JavaScript (ES6+)", percent: 90 },
    { name: "React.js", percent: 85 },
    { name: "Node.js & Express", percent: 80 },
    { name: "MongoDB & PostgreSQL", percent: 75 },
    { name: "Git & Web Deployment", percent: 85 }
];

const DEFAULT_PROJECTS = [
    {
        id: "proj_1",
        title: "CampChat - Campus Social Media App",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
        video: "",
        github: "https://github.com/vishal-prajapati/campchat",
        demo: "https://campchat-media.vercel.app",
        description: "A secure and vibrant social connection platform specifically designed for campus university students. Features rich text messaging, post attachments, like systems, and user profiles."
    },
    {
        id: "proj_2",
        title: "DevQuest - Tech Learning Hub",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
        video: "",
        github: "https://github.com/vishal-prajapati/devquest",
        demo: "",
        description: "An gamified online learning web application with interactive programming pathways. Built utilizing React, Node.js, and complex SQL transaction engines."
    },
    {
        id: "proj_3",
        title: "AuraUI - Glassmorphism System",
        image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
        video: "",
        github: "https://github.com/vishal-prajapati/auraui",
        demo: "https://aura-ui-glass.vercel.app",
        description: "A lightweight, modern utility CSS/JS component framework based purely on premium frosted glassmorphism elements, micro-interactions, and pre-built responsive components."
    }
];

const DEFAULT_MESSAGES = [
    {
        id: "msg_1",
        name: "Aarav Mehta",
        email: "aarav@techventures.in",
        subject: "Full-Stack Project Collaboration",
        message: "Hi Vishal, loved looking through your modern portfolio. We have an upcoming client project requiring React and Node.js expertise. Let's arrange a call next week!",
        date: "2026-05-23T10:15:30.000Z"
    }
];

const DEFAULT_CONTACT_INFO = {
    email: "vishal@gmail.com",
    phone: "+91 9876543210",
    location: "Mumbai, India",
    availability: "Mon – Sat, 10am – 8pm IST"
};

// LocalStorage Fallback DB Inits
if (!localStorage.getItem("portfolio_services")) {
    localStorage.setItem("portfolio_services", JSON.stringify(DEFAULT_SERVICES));
}
if (!localStorage.getItem("portfolio_skills")) {
    localStorage.setItem("portfolio_skills", JSON.stringify(DEFAULT_SKILLS));
}
if (!localStorage.getItem("portfolio_projects")) {
    localStorage.setItem("portfolio_projects", JSON.stringify(DEFAULT_PROJECTS));
}
if (!localStorage.getItem("portfolio_messages")) {
    localStorage.setItem("portfolio_messages", JSON.stringify(DEFAULT_MESSAGES));
}
if (!localStorage.getItem("portfolio_contact_info")) {
    localStorage.setItem("portfolio_contact_info", JSON.stringify(DEFAULT_CONTACT_INFO));
}
if (localStorage.getItem("portfolio_isAdmin") === null) {
    localStorage.setItem("portfolio_isAdmin", "false");
}

// Global System Variables
let db = null;
let usingFirebase = false;

// --- DYNAMIC SCRIPTS LOADER ---
async function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
    });
}

// --- BOOTSTRAP SYSTEM STATE ---
async function bootstrapSystem() {
    try {
        await loadScript("firebase-config.js");
        
        if (isFirebaseConfigured()) {
            console.log("🔥 Configured Firebase credentials detected! Bootstrapping Firebase SDKs...");
            
            await loadScript("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
            await loadScript("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js");
            
            firebase.initializeApp(firebaseConfig);
            db = firebase.firestore();
            usingFirebase = true;
            
            console.log("🚀 Firestore connection active. Synchronizing default structures...");
            await initializeFirestoreDefaults();
        } else {
            console.log("ℹ️ No remote Firebase credentials detected. Operating in LocalStorage Fallback.");
        }
    } catch (e) {
        console.error("⚠️ Firebase initialization failure, reverting to LocalStorage mode.", e);
        usingFirebase = false;
    } finally {
        initializeUIElements();
    }
}

// Populate Firestore with default portfolios if clean
async function initializeFirestoreDefaults() {
    try {
        const servicesSnap = await db.collection("services").limit(1).get();
        if (servicesSnap.empty) {
            console.log("Populating Firestore with default services...");
            for (let i = 0; i < DEFAULT_SERVICES.length; i++) {
                const s = DEFAULT_SERVICES[i];
                await db.collection("services").add({
                    icon: s.icon,
                    title: s.title,
                    description: s.description,
                    details: s.details,
                    order: Date.now() + i
                });
            }
        }

        const skillsSnap = await db.collection("skills").limit(1).get();
        if (skillsSnap.empty) {
            console.log("Populating Firestore with default skills...");
            for (let i = 0; i < DEFAULT_SKILLS.length; i++) {
                const s = DEFAULT_SKILLS[i];
                await db.collection("skills").add({
                    name: s.name,
                    percent: s.percent,
                    order: Date.now() + i
                });
            }
        }

        const projectsSnap = await db.collection("projects").limit(1).get();
        if (projectsSnap.empty) {
            console.log("Populating Firestore with default projects...");
            for (let i = 0; i < DEFAULT_PROJECTS.length; i++) {
                const p = DEFAULT_PROJECTS[i];
                await db.collection("projects").add({
                    title: p.title,
                    image: p.image,
                    video: p.video,
                    github: p.github,
                    demo: p.demo,
                    description: p.description,
                    createdAt: Date.now() - (i * 10000)
                });
            }
        }
    } catch (e) {
        console.warn("Could not synchronize remote database defaults.", e);
    }
}

// --- BOOTSTRAP ON LOAD ---
document.addEventListener("DOMContentLoaded", () => {
    const tContainer = document.createElement("div");
    tContainer.className = "toast-container";
    tContainer.id = "toast-container";
    document.body.appendChild(tContainer);

    bootstrapSystem();
});

// Setup static UI elements and real-time triggers
function initializeUIElements() {
    injectHeaderAndFooter();
    injectAdminBanner();
    setupScrollEffects();

    const currentPage = window.location.pathname.split("/").pop();
    setupPageSynchronizations(currentPage);
}

// --- REAL-TIME PORT STATE SYNCHRONIZATION ---
function setupPageSynchronizations(pageName) {
    if (pageName === "services.html") {
        if (usingFirebase) {
            db.collection("services").orderBy("order", "asc").onSnapshot(snapshot => {
                const services = [];
                snapshot.forEach(doc => {
                    services.push({ id: doc.id, ...doc.data() });
                });
                renderServicesDOM(services);
            }, err => {
                console.error("Services listener error, loading LocalStorage.", err);
                renderServicesDOM(getServicesLocal());
            });
        } else {
            renderServicesDOM(getServicesLocal());
        }
    } else if (pageName === "skills.html") {
        if (usingFirebase) {
            db.collection("skills").orderBy("order", "asc").onSnapshot(snapshot => {
                const skills = [];
                snapshot.forEach(doc => {
                    skills.push({ id: doc.id, name: doc.data().name, percent: doc.data().percent });
                });
                renderSkillsDOM(skills);
            }, err => {
                console.error("Skills listener error, loading LocalStorage.", err);
                renderSkillsDOM(getSkillsLocal());
            });
        } else {
            renderSkillsDOM(getSkillsLocal());
        }
    } else if (pageName === "projects.html") {
        if (usingFirebase) {
            db.collection("projects").orderBy("createdAt", "desc").onSnapshot(snapshot => {
                const projects = [];
                snapshot.forEach(doc => {
                    projects.push({ id: doc.id, ...doc.data() });
                });
                renderProjectsDOM(projects);
            }, err => {
                console.error("Projects listener error, loading LocalStorage.", err);
                renderProjectsDOM(getProjectsLocal());
            });
        } else {
            renderProjectsDOM(getProjectsLocal());
        }
    } else if (pageName === "contact.html") {
        // Always load contact info for everyone
        loadContactInfo();

        // Show admin edit button if admin
        if (isAdmin()) {
            const editBtn = document.getElementById("edit-contact-btn");
            if (editBtn) editBtn.style.display = "inline-flex";

            // Load admin inbox
            if (usingFirebase) {
                db.collection("messages").orderBy("date", "desc").onSnapshot(snapshot => {
                    const messages = [];
                    snapshot.forEach(doc => {
                        messages.push({ id: doc.id, ...doc.data() });
                    });
                    renderAdminMessagesDOM(messages);
                }, err => {
                    console.error("Messages listener error, loading LocalStorage.", err);
                    renderAdminMessagesDOM(getMessagesLocal());
                });
            } else {
                renderAdminMessagesDOM(getMessagesLocal());
            }
        }
    }
}

// --- AUTHENTICATION Checks ---
function isAdmin() {
    return localStorage.getItem("portfolio_isAdmin") === "true";
}

// --- LOCAL GETTERS (Fallbacks) ---
function getServicesLocal() {
    return JSON.parse(localStorage.getItem("portfolio_services"));
}
function getSkillsLocal() {
    return JSON.parse(localStorage.getItem("portfolio_skills"));
}
function getProjectsLocal() {
    return JSON.parse(localStorage.getItem("portfolio_projects"));
}
function getMessagesLocal() {
    return JSON.parse(localStorage.getItem("portfolio_messages"));
}

// --- TOAST NOTIFICATIONS ---
function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let icon = "fa-check-circle";
    if (type === "error") icon = "fa-exclamation-circle";
    if (type === "info") icon = "fa-info-circle";

    toast.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px;">
            <i class="fas ${icon}" style="font-size:1.2rem;"></i>
            <span>${message}</span>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.transform = "translateX(120%)";
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 400);
    }, 4500);
}

// --- CORE LAYOUT GENERATOR ---
function injectHeaderAndFooter() {
    const header = document.getElementById("header");
    if (header) {
        const activePage = window.location.pathname.split("/").pop() || "dashboard.html";
        
        header.innerHTML = `
            <a href="dashboard.html" class="logo">VP.</a>
            <button class="mobile-nav-toggle" id="mobile-toggle" aria-label="Toggle Menu">
                <i class="fas fa-bars"></i>
            </button>
            <ul id="navbar">
                <li><a href="dashboard.html" class="${activePage === 'dashboard.html' ? 'active' : ''}">Home</a></li>
                <li><a href="about.html" class="${activePage === 'about.html' ? 'active' : ''}">About</a></li>
                <li><a href="services.html" class="${activePage === 'services.html' ? 'active' : ''}">Services</a></li>
                <li><a href="skills.html" class="${activePage === 'skills.html' ? 'active' : ''}">Skills</a></li>
                <li><a href="projects.html" class="${activePage === 'projects.html' ? 'active' : ''}">Projects</a></li>
                <li><a href="contact.html" class="${activePage === 'contact.html' ? 'active' : ''}">Contact</a></li>
                ${isAdmin() 
                    ? `<li><a href="#" onclick="handleLogout(event)" class="btn btn-secondary" style="padding: 6px 15px; margin-left: 10px; border-color: rgba(239, 68, 68, 0.4); color: #f87171;">Logout</a></li>`
                    : `<li><a href="login.html" class="btn btn-primary" style="padding: 6px 20px; margin-left: 10px; color: var(--text-dark);">Sign In</a></li>`
                }
            </ul>
        `;

        const toggleBtn = document.getElementById("mobile-toggle");
        const navbar = document.getElementById("navbar");
        
        if (toggleBtn && navbar) {
            toggleBtn.addEventListener("click", () => {
                navbar.classList.toggle("active");
                toggleBtn.querySelector("i").classList.toggle("fa-bars");
                toggleBtn.querySelector("i").classList.toggle("fa-times");
            });

            navbar.querySelectorAll("a").forEach(link => {
                link.addEventListener("click", () => {
                    navbar.classList.remove("active");
                    toggleBtn.querySelector("i").classList.add("fa-bars");
                    toggleBtn.querySelector("i").classList.remove("fa-times");
                });
            });
        }
    }

    if (!document.querySelector(".main-footer")) {
        const footer = document.createElement("footer");
        footer.className = "main-footer";
        footer.innerHTML = `
            <div class="footer-content">
                <a href="dashboard.html" class="logo" style="font-size:2rem; margin-bottom: 5px;">VP.</a>
                <div class="footer-links">
                    <a href="dashboard.html">Home</a>
                    <a href="about.html">About</a>
                    <a href="services.html">Services</a>
                    <a href="skills.html">Skills</a>
                    <a href="projects.html">Projects</a>
                    <a href="contact.html">Contact</a>
                </div>
                <div class="footer-social">
                    <a href="#" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
                    <a href="#" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
                    <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                    <a href="#" aria-label="Twitter"><i class="fa-brands fa-x-twitter"></i></a>
                </div>
                <div class="footer-copyright">
                    &copy; ${new Date().getFullYear()} Vishal Prajapati. All rights reserved. Cloud Database Synchronized.
                </div>
            </div>
        `;
        document.body.appendChild(footer);
    }
}

function injectAdminBanner() {
    if (isAdmin() && !document.getElementById("admin-banner-global")) {
        const banner = document.createElement("div");
        banner.className = "admin-banner";
        banner.id = "admin-banner-global";
        banner.innerHTML = `
            <span><i class="fas fa-user-shield"></i> <strong>Admin Session Active</strong> — Upgrades publish globally to Cloud DB!</span>
            <button onclick="handleLogout(event)">Sign Out</button>
        `;
        // Append to body — position:fixed means DOM position doesn't matter
        document.body.appendChild(banner);
        // Header ~76px + banner ~50px + small buffer = 130px
        document.body.style.paddingTop = "130px";
    } else {
        document.body.style.paddingTop = "76px";
    }
}

function setupScrollEffects() {
    window.addEventListener("scroll", () => {
        const header = document.getElementById("header");
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
            // Keep admin banner flush below header as it resizes on scroll
            const adminBanner = document.getElementById("admin-banner-global");
            if (adminBanner) {
                adminBanner.style.top = header.getBoundingClientRect().height + "px";
            }
        }

        const scrollProgress = document.getElementById("scroll-progress");
        if (scrollProgress) {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const percentage = windowHeight > 0 ? (window.scrollY / windowHeight) * 100 : 0;
            scrollProgress.style.width = `${percentage}%`;
        }
    });
}

function handleLogout(e) {
    if (e) e.preventDefault();
    localStorage.setItem("portfolio_isAdmin", "false");
    showToast("Successfully signed out of admin session.", "info");
    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 1000);
}

// ==========================================================================
// BUSINESS OPERATIONS & CRUD DATA CONTROLLER
// ==========================================================================

// --- 0. SERVICES OPERATIONS ---
function renderServicesDOM(services) {
    const container = document.getElementById("services-container");
    const adminForm = document.querySelector(".service-form");

    if (!container) return;

    if (adminForm) {
        if (isAdmin()) {
            adminForm.style.display = "flex";
            adminForm.classList.add("admin-section");
            if (!adminForm.querySelector("h3")) {
                const headerText = document.createElement("h3");
                headerText.innerHTML = `<i class="fas fa-plus-circle"></i> Add New Portfolio Service`;
                adminForm.insertAdjacentElement("afterbegin", headerText);
            }
        } else {
            adminForm.style.display = "none";
        }
    }

    container.innerHTML = "";

    if (!services || services.length === 0) {
        container.innerHTML = `<p class="text-muted" style="grid-column:1/-1; text-align:center; padding: 40px 0;">No services found. Add services as Admin.</p>`;
        return;
    }

    services.forEach((s, idx) => {
        const card = document.createElement("div");
        card.className = "service-box glass-card";
        const serviceKey = s.id || idx;

        card.innerHTML = `
            <div class="service-icon-wrapper">
                <i class="${escapeHTML(s.icon || 'fa-solid fa-code')}"></i>
            </div>
            <h3>${escapeHTML(s.title)}</h3>
            <p>${escapeHTML(s.description)}</p>
            <a href="#" class="btn btn-secondary" onclick="triggerServiceInfo(event, '${escapeHTML(s.title)}', '${escapeHTML(s.details)}')">Read More</a>
            ${isAdmin() ? `<button class="btn-danger" onclick="deleteService('${serviceKey}')" style="width:100%; display:flex; justify-content:center; align-items:center; gap:8px; margin-top:20px; border:none; padding:10px; border-radius:10px; cursor:pointer; font-weight:700;"><i class="fas fa-trash-alt"></i> Delete Service</button>` : ""}
        `;
        container.appendChild(card);
    });
}

async function addService() {
    const titleInput = document.getElementById("serviceTitle");
    const iconInput = document.getElementById("serviceIcon");
    const descInput = document.getElementById("serviceDescription");
    const detailsInput = document.getElementById("serviceDetails");

    if (!titleInput || !descInput || !detailsInput) return;

    const title = titleInput.value.trim();
    const icon = iconInput ? iconInput.value : "fa-solid fa-code";
    const description = descInput.value.trim();
    const details = detailsInput.value.trim();

    if (!title) {
        showToast("Please enter a valid service title.", "error");
        return;
    }
    if (!description) {
        showToast("Please write a service description.", "error");
        return;
    }
    if (!details) {
        showToast("Please write detailed read-more explanation.", "error");
        return;
    }

    if (usingFirebase) {
        try {
            await db.collection("services").add({
                icon,
                title,
                description,
                details,
                order: Date.now()
            });
            showToast(`Added service "${title}" to Cloud Database.`, "success");
        } catch (e) {
            console.error("Firebase service write error", e);
            showToast("Failed to write to Cloud Database.", "error");
        }
    } else {
        const services = getServicesLocal();
        const newService = {
            id: "serv_" + Date.now(),
            icon,
            title,
            description,
            details
        };
        services.push(newService);
        localStorage.setItem("portfolio_services", JSON.stringify(services));
        showToast(`Added service "${title}" successfully.`, "success");
        renderServicesDOM(services);
    }

    titleInput.value = "";
    if (descInput) descInput.value = "";
    if (detailsInput) detailsInput.value = "";
}

async function deleteService(key) {
    if (usingFirebase) {
        try {
            await db.collection("services").doc(key).delete();
            showToast("Service deleted from Cloud Database.", "info");
        } catch (e) {
            console.error("Firebase deletion error", e);
            showToast("Failed to delete from Cloud Database.", "error");
        }
    } else {
        const services = getServicesLocal();
        let targetIndex = typeof key === 'string' && key.startsWith('serv_') 
            ? services.findIndex(s => s.id === key) 
            : parseInt(key);

        if (targetIndex !== -1) {
            const removed = services.splice(targetIndex, 1)[0];
            localStorage.setItem("portfolio_services", JSON.stringify(services));
            showToast(`Deleted service: "${removed.title}"`, "info");
            renderServicesDOM(services);
        }
    }
}

// --- 1. SKILLS OPERATIONS ---
function renderSkillsDOM(skills) {
    const container = document.getElementById("skills-container");
    const adminForm = document.querySelector(".skill-form");
    
    if (!container) return;

    if (adminForm) {
        adminForm.style.display = isAdmin() ? "flex" : "none";
    }

    container.innerHTML = "";

    if (!skills || skills.length === 0) {
        container.innerHTML = `<p class="text-muted" style="grid-column:1/-1; text-align:center;">No skills defined. Add skills as Admin.</p>`;
        return;
    }

    skills.forEach((skill, index) => {
        const skillBox = document.createElement("div");
        skillBox.className = "skill-box glass-card";
        skillBox.style.padding = "25px";
        skillBox.style.borderRadius = "16px";
        
        const deleteTrigger = isAdmin() 
            ? `<button class="delete-btn btn-danger" onclick="deleteSkill('${skill.id || index}')" style="padding:6px 12px; font-size:0.8rem; border-radius:6px; margin-top:15px; font-weight:700;"><i class="fas fa-trash"></i> Delete</button>` 
            : "";

        skillBox.innerHTML = `
            <div class="skill-info">
                <h3>${escapeHTML(skill.name)}</h3>
                <span>${skill.percent}%</span>
            </div>
            <div class="skill-bar">
                <div class="skill-progress" style="width: 0%; transition: width 1.2s cubic-bezier(0.1, 0.8, 0.2, 1);"></div>
            </div>
            ${deleteTrigger}
        `;
        container.appendChild(skillBox);

        setTimeout(() => {
            const bar = skillBox.querySelector(".skill-progress");
            if (bar) bar.style.width = `${skill.percent}%`;
        }, 100 * index);
    });
}

async function addSkill() {
    const nameInput = document.getElementById("skillName");
    const percentInput = document.getElementById("skillPercent");
    
    if (!nameInput || !percentInput) return;

    const name = nameInput.value.trim();
    const percent = parseInt(percentInput.value);

    if (!name) {
        showToast("Please enter a valid skill name.", "error");
        return;
    }
    if (isNaN(percent) || percent < 0 || percent > 100) {
        showToast("Skill proficiency must be between 0% and 100%.", "error");
        return;
    }

    if (usingFirebase) {
        try {
            await db.collection("skills").add({
                name,
                percent,
                order: Date.now()
            });
            showToast(`Successfully added skill "${name}" to Cloud Database.`, "success");
        } catch (e) {
            console.error("Firebase write error", e);
            showToast("Failed to write to Cloud Database.", "error");
        }
    } else {
        const skills = getSkillsLocal();
        skills.push({ name, percent });
        localStorage.setItem("portfolio_skills", JSON.stringify(skills));
        showToast(`Successfully added skill: "${name}"`, "success");
        renderSkillsDOM(skills);
    }
    
    nameInput.value = "";
    percentInput.value = "";
}

async function deleteSkill(key) {
    if (usingFirebase) {
        try {
            await db.collection("skills").doc(key).delete();
            showToast("Skill deleted from Cloud Database.", "info");
        } catch (e) {
            console.error("Firebase deletion error", e);
            showToast("Failed to delete from Cloud Database.", "error");
        }
    } else {
        const skills = getSkillsLocal();
        const removed = skills.splice(parseInt(key), 1)[0];
        localStorage.setItem("portfolio_skills", JSON.stringify(skills));
        showToast(`Deleted skill: "${removed.name}"`, "info");
        renderSkillsDOM(skills);
    }
}

// --- 2. PROJECTS OPERATIONS ---
function renderProjectsDOM(projects) {
    const container = document.getElementById("projects-container");
    const adminForm = document.querySelector(".project-form");

    if (!container) return;

    if (adminForm) {
        if (isAdmin()) {
            adminForm.style.display = "flex";
            adminForm.classList.add("admin-section");
            if (!adminForm.querySelector("h3")) {
                const headerText = document.createElement("h3");
                headerText.innerHTML = `<i class="fas fa-plus-circle"></i> Add New Portfolio Project`;
                adminForm.insertAdjacentElement("afterbegin", headerText);
            }
        } else {
            adminForm.style.display = "none";
        }
    }

    container.innerHTML = "";

    if (!projects || projects.length === 0) {
        container.innerHTML = `<p class="text-muted" style="grid-column:1/-1; text-align:center; padding: 40px 0;">No portfolio projects found. Add them as Admin.</p>`;
        return;
    }

    projects.forEach((proj, idx) => {
        const card = document.createElement("div");
        card.className = "project-card glass-card";
        
        let mediaTag = `<img src="${escapeHTML(proj.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80')}" alt="${escapeHTML(proj.title)}">`;
        if (proj.video && (proj.video.endsWith(".mp4") || proj.video.includes("youtube.com") || proj.video.includes("youtu.be"))) {
            if (proj.video.endsWith(".mp4")) {
                mediaTag = `
                    <video autoplay loop muted playsinline controls style="width: 100%; height: 220px; object-fit: cover;">
                        <source src="${escapeHTML(proj.video)}" type="video/mp4">
                    </video>
                `;
            } else {
                mediaTag = `<div style="position:relative; width:100%; height:220px; background:#0f172a; display:flex; justify-content:center; align-items:center; border-bottom:1px solid var(--border-light);"><i class="fab fa-youtube" style="font-size:3rem; color:red;"></i><span style="font-size:0.8rem; position:absolute; bottom:15px; color:var(--text-muted);">Video Demo Linked</span></div>`;
            }
        }

        const projectKey = proj.id || idx;

        card.innerHTML = `
            ${mediaTag}
            <div class="project-content">
                <h3 class="gradient-text">${escapeHTML(proj.title)}</h3>
                <p>${escapeHTML(proj.description)}</p>
                <div class="project-links">
                    ${proj.github ? `<a href="${escapeHTML(proj.github)}" target="_blank"><i class="fab fa-github"></i> Repository</a>` : ""}
                    ${proj.demo ? `<a href="${escapeHTML(proj.demo)}" target="_blank" class="demo-link" style="background:var(--grad-primary); color:var(--text-dark);"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ""}
                </div>
                ${isAdmin() ? `<button class="delete-project btn-danger" onclick="deleteProject('${projectKey}')" style="width:100%; display:flex; justify-content:center; align-items:center; gap:8px; margin-top:20px;"><i class="fas fa-trash-alt"></i> Delete Project</button>` : ""}
            </div>
        `;
        container.appendChild(card);
    });
}

async function addProject() {
    const titleInput = document.getElementById("projectTitle");
    const imgInput = document.getElementById("projectImage");
    const videoInput = document.getElementById("projectVideo");
    const gitInput = document.getElementById("projectGithub");
    const demoInput = document.getElementById("projectDemo");
    const descInput = document.getElementById("projectDescription");

    if (!titleInput || !descInput) return;

    const title = titleInput.value.trim();
    const image = imgInput ? imgInput.value.trim() : "";
    const video = videoInput ? videoInput.value.trim() : "";
    const github = gitInput ? gitInput.value.trim() : "";
    const demo = demoInput ? demoInput.value.trim() : "";
    const description = descInput.value.trim();

    if (!title) {
        showToast("Please enter a valid project title.", "error");
        return;
    }
    if (!description) {
        showToast("Please write a project description.", "error");
        return;
    }

    if (usingFirebase) {
        try {
            await db.collection("projects").add({
                title,
                image,
                video,
                github,
                demo,
                description,
                createdAt: Date.now()
            });
            showToast(`Added project "${title}" to Cloud Database.`, "success");
        } catch (e) {
            console.error("Firebase project write error", e);
            showToast("Failed to write to Cloud Database.", "error");
        }
    } else {
        const projects = getProjectsLocal();
        const newProj = {
            id: "proj_" + Date.now(),
            title,
            image,
            video,
            github,
            demo,
            description
        };
        projects.unshift(newProj);
        localStorage.setItem("portfolio_projects", JSON.stringify(projects));
        showToast(`Added project "${title}" successfully.`, "success");
        renderProjectsDOM(projects);
    }

    titleInput.value = "";
    if (imgInput) imgInput.value = "";
    if (videoInput) videoInput.value = "";
    if (gitInput) gitInput.value = "";
    if (demoInput) demoInput.value = "";
    descInput.value = "";
}

async function deleteProject(key) {
    if (usingFirebase) {
        try {
            await db.collection("projects").doc(key).delete();
            showToast("Project deleted from Cloud Database.", "info");
        } catch (e) {
            console.error("Firebase deletion error", e);
            showToast("Failed to delete from Cloud Database.", "error");
        }
    } else {
        const projects = getProjectsLocal();
        let targetIndex = typeof key === 'string' && key.startsWith('proj_') 
            ? projects.findIndex(p => p.id === key) 
            : parseInt(key);

        if (targetIndex !== -1) {
            const removed = projects.splice(targetIndex, 1)[0];
            localStorage.setItem("portfolio_projects", JSON.stringify(projects));
            showToast(`Deleted project: "${removed.title}"`, "info");
            renderProjectsDOM(projects);
        }
    }
}

// --- 3. CONTACT & MESSAGES OPERATIONS ---
async function sendMessage() {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email-msg");
    const subjectInput = document.getElementById("subject");
    const msgInput = document.getElementById("message");

    if (!nameInput || !emailInput || !msgInput) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput ? subjectInput.value.trim() : "No Subject";
    const message = msgInput.value.trim();

    if (!name || !email || !message) {
        showToast("Please fill in all required fields (Name, Email, Message).", "error");
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showToast("Please enter a valid email address.", "error");
        return;
    }

    // Disable button during send
    const sendBtn = document.getElementById("send-msg-btn");
    if (sendBtn) { sendBtn.disabled = true; sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'; }

    if (usingFirebase) {
        try {
            await db.collection("messages").add({
                name,
                email,
                subject,
                message,
                date: new Date().toISOString()
            });
            showToast("Your message was uploaded securely to the Cloud! I will respond shortly.", "success");
        } catch (e) {
            console.error("Firebase message write error", e);
            showToast("Failed to send message online.", "error");
        }
    } else {
        const messages = getMessagesLocal();
        const newMsg = {
            id: "msg_" + Date.now(),
            name,
            email,
            subject,
            message,
            date: new Date().toISOString()
        };
        messages.unshift(newMsg);
        localStorage.setItem("portfolio_messages", JSON.stringify(messages));
        showToast("Your message has been saved locally! I will respond shortly.", "success");
    }

    nameInput.value = "";
    emailInput.value = "";
    if (subjectInput) subjectInput.value = "";
    msgInput.value = "";

    // Re-enable button
    if (sendBtn) { sendBtn.disabled = false; sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message'; }
}

function renderAdminMessagesDOM(messages) {
    let inboxSection = document.getElementById("admin-inbox-section");
    const wrapper = document.querySelector(".contact-wrapper");

    if (!inboxSection && wrapper) {
        inboxSection = document.createElement("div");
        inboxSection.className = "admin-section";
        inboxSection.id = "admin-inbox-section";
        wrapper.appendChild(inboxSection);
    }

    if (!inboxSection) return;

    const count = messages ? messages.length : 0;
    inboxSection.innerHTML = `
        <h3><i class="fas fa-envelope-open-text"></i> Received Messages Inbox (${count})</h3>
    `;

    if (!messages || messages.length === 0) {
        inboxSection.innerHTML += `
            <div class="inbox-empty">
                <i class="fas fa-inbox"></i>
                <p>No messages received yet. When visitors send a message, it will appear here.</p>
            </div>
        `;
        return;
    }

    const cardsGrid = document.createElement("div");
    cardsGrid.className = "inbox-cards";

    messages.forEach((msg, idx) => {
        const msgDate = new Date(msg.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        const messageKey = msg.id || idx;

        const card = document.createElement("div");
        card.className = "inbox-card";
        card.innerHTML = `
            <div class="inbox-card-header">
                <div>
                    <div class="inbox-sender">${escapeHTML(msg.name)}</div>
                    <div class="inbox-email">${escapeHTML(msg.email)}</div>
                </div>
                <div class="inbox-date">${msgDate}</div>
            </div>
            <div class="inbox-subject">${escapeHTML(msg.subject || 'No Subject')}</div>
            <div class="inbox-body">${escapeHTML(msg.message)}</div>
            <div class="inbox-actions">
                <a href="mailto:${escapeHTML(msg.email)}?subject=Re: ${encodeURIComponent(msg.subject || '')}" class="inbox-reply-btn">
                    <i class="fas fa-reply"></i> Reply
                </a>
                <button class="inbox-del-btn" onclick="deleteMessage('${messageKey}')">
                    <i class="fas fa-trash-alt"></i> Delete
                </button>
            </div>
        `;
        cardsGrid.appendChild(card);
    });

    inboxSection.appendChild(cardsGrid);
}

async function deleteMessage(key) {
    if (usingFirebase) {
        try {
            await db.collection("messages").doc(key).delete();
            showToast("Message deleted from Cloud Database.", "info");
        } catch (e) {
            console.error("Firebase deletion error", e);
            showToast("Failed to delete from Cloud Database.", "error");
        }
    } else {
        const messages = getMessagesLocal();
        let targetIndex = typeof key === 'string' && key.startsWith('msg_')
            ? messages.findIndex(m => m.id === key)
            : parseInt(key);

        if (targetIndex !== -1) {
            messages.splice(targetIndex, 1);
            localStorage.setItem("portfolio_messages", JSON.stringify(messages));
            showToast("Message deleted from inbox.", "info");
            renderAdminMessagesDOM(messages);
        }
    }
}

// --- 4. CONTACT INFO OPERATIONS (Admin Editable) ---
function getContactInfoLocal() {
    return JSON.parse(localStorage.getItem("portfolio_contact_info")) || DEFAULT_CONTACT_INFO;
}

async function loadContactInfo() {
    let info = DEFAULT_CONTACT_INFO;

    if (usingFirebase) {
        try {
            const doc = await db.collection("settings").doc("contactInfo").get();
            if (doc.exists) {
                info = doc.data();
            } else {
                // Seed Firestore with defaults
                await db.collection("settings").doc("contactInfo").set(DEFAULT_CONTACT_INFO);
            }
        } catch (e) {
            console.warn("Could not load contact info from Firestore, using local.", e);
            info = getContactInfoLocal();
        }
    } else {
        info = getContactInfoLocal();
    }

    // Populate the view-mode fields
    const viewEmail = document.getElementById("view-email");
    const viewPhone = document.getElementById("view-phone");
    const viewLocation = document.getElementById("view-location");
    const viewAvailability = document.getElementById("view-availability");

    if (viewEmail) viewEmail.textContent = info.email || DEFAULT_CONTACT_INFO.email;
    if (viewPhone) viewPhone.textContent = info.phone || DEFAULT_CONTACT_INFO.phone;
    if (viewLocation) viewLocation.textContent = info.location || DEFAULT_CONTACT_INFO.location;
    if (viewAvailability) viewAvailability.textContent = info.availability || DEFAULT_CONTACT_INFO.availability;
}

function toggleContactEdit() {
    const viewBlock = document.getElementById("contact-details-view");
    const editBlock = document.getElementById("contact-details-edit");
    const editLabel = document.getElementById("edit-contact-label");
    const editIcon = document.getElementById("edit-contact-icon");

    if (!viewBlock || !editBlock) return;

    const isEditing = editBlock.style.display !== "none";

    if (isEditing) {
        // Switch back to view mode
        viewBlock.style.display = "flex";
        editBlock.style.display = "none";
        if (editLabel) editLabel.textContent = "Edit Info";
        if (editIcon) editIcon.className = "fas fa-pen";
    } else {
        // Switch to edit mode — populate edit inputs from view fields
        const viewEmail = document.getElementById("view-email");
        const viewPhone = document.getElementById("view-phone");
        const viewLocation = document.getElementById("view-location");
        const viewAvailability = document.getElementById("view-availability");

        document.getElementById("edit-email").value = viewEmail ? viewEmail.textContent : "";
        document.getElementById("edit-phone").value = viewPhone ? viewPhone.textContent : "";
        document.getElementById("edit-location").value = viewLocation ? viewLocation.textContent : "";
        document.getElementById("edit-availability").value = viewAvailability ? viewAvailability.textContent : "";

        viewBlock.style.display = "none";
        editBlock.style.display = "block";
        if (editLabel) editLabel.textContent = "Cancel";
        if (editIcon) editIcon.className = "fas fa-times";
    }
}

function cancelContactEdit() {
    const viewBlock = document.getElementById("contact-details-view");
    const editBlock = document.getElementById("contact-details-edit");
    const editLabel = document.getElementById("edit-contact-label");
    const editIcon = document.getElementById("edit-contact-icon");

    if (viewBlock) viewBlock.style.display = "flex";
    if (editBlock) editBlock.style.display = "none";
    if (editLabel) editLabel.textContent = "Edit Info";
    if (editIcon) editIcon.className = "fas fa-pen";
}

async function saveContactInfo() {
    const email = (document.getElementById("edit-email").value || "").trim();
    const phone = (document.getElementById("edit-phone").value || "").trim();
    const location = (document.getElementById("edit-location").value || "").trim();
    const availability = (document.getElementById("edit-availability").value || "").trim();

    if (!email) {
        showToast("Email is required.", "error");
        return;
    }

    const info = { email, phone, location, availability };

    if (usingFirebase) {
        try {
            await db.collection("settings").doc("contactInfo").set(info, { merge: true });
            showToast("Contact info updated in Cloud Database!", "success");
        } catch (e) {
            console.error("Firebase contact info write error", e);
            showToast("Failed to save contact info to Cloud.", "error");
        }
    } else {
        localStorage.setItem("portfolio_contact_info", JSON.stringify(info));
        showToast("Contact info updated locally!", "success");
    }

    // Update view-mode DOM
    const viewEmail = document.getElementById("view-email");
    const viewPhone = document.getElementById("view-phone");
    const viewLocation = document.getElementById("view-location");
    const viewAvailability = document.getElementById("view-availability");

    if (viewEmail) viewEmail.textContent = email;
    if (viewPhone) viewPhone.textContent = phone;
    if (viewLocation) viewLocation.textContent = location;
    if (viewAvailability) viewAvailability.textContent = availability;

    // Switch back to view mode
    cancelContactEdit();
}

// --- UTILITIES ---
function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// Hook functions to window context for raw inline onclick handlers
window.triggerServiceInfo = function(e, serviceTitle, detailsText) {
    if (e) e.preventDefault();
    showToast(`${serviceTitle}: ${detailsText}`, "info");
};
window.addService = addService;
window.deleteService = deleteService;
window.addSkill = addSkill;
window.deleteSkill = deleteSkill;
window.addProject = addProject;
window.deleteProject = deleteProject;
window.sendMessage = sendMessage;
window.deleteMessage = deleteMessage;
window.handleLogout = handleLogout;
window.toggleContactEdit = toggleContactEdit;
window.cancelContactEdit = cancelContactEdit;
window.saveContactInfo = saveContactInfo;
