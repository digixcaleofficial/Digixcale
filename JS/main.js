async function loadComponents() {
    try {
        // --- Determine Base Path ---
        // Agar hum kisi folder ke andar hain (e.g., /Html/), toh path '../' hoga
        const basePath = './';

        // --- Load Header ---
        const headerRes = await fetch(`${basePath}components/header.html`);
        if (!headerRes.ok) throw new Error("Header not found");
        const headerData = await headerRes.text();
        
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            headerPlaceholder.innerHTML = headerData;
            
            // 🔥 CRITICAL FIX: Header HTML inject hone ke baad hi menu initialize karo
            // Thoda timeout diya hai taaki browser DOM ko update kar sake
            setTimeout(() => {
                initMobileMenu();
                setActiveLink();
            }, 50); 
        }

        // --- Load Footer ---
        const footerRes = await fetch(`${basePath}components/footer.html`);
        if (!footerRes.ok) throw new Error("Footer not found");
        const footerData = await footerRes.text();
        
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = footerData;
            setActiveLink();
        }

    } catch (error) {
        console.error("Error loading components:", error);
    }
}

// 2. Initialize Mobile Menu (Hamburger Logic)
function initMobileMenu() {
    // Ab ye elements pakka milenge kyunki humne wait kiya hai
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle'); 
    const navClose = document.getElementById('nav-close');    

    /* --- MENU SHOW --- */
    if(navToggle && navMenu){
        navToggle.addEventListener('click', () =>{
            navMenu.classList.add('show-menu');
        });
    }

    /* --- MENU HIDDEN (Close Button) --- */
    if(navClose && navMenu){
        navClose.addEventListener('click', () =>{
            navMenu.classList.remove('show-menu');
        });
    }

    /* --- REMOVE MENU ON LINK CLICK --- */
    const navLinks = document.querySelectorAll('.menu');
    const linkAction = () =>{
        if(navMenu) navMenu.classList.remove('show-menu');
    }
    navLinks.forEach(n => n.addEventListener('click', linkAction));
}

function setActiveLink() {
    // 1. Current Page ka naam nikalo (e.g., "services.html")
    let currentPage = window.location.pathname.split("/").pop();

    // Agar root path ("/") hai toh index.html maan lo
    if (currentPage === "") currentPage = "index.html";

    // 2. Saare menu links select karo
    const navLinks = document.querySelectorAll('.menu');

    navLinks.forEach(link => {
        // Pehle sabse active class hatao (Reset)
        link.classList.remove('menu-active');

        // Link ka href check karo
        const linkHref = link.getAttribute('href');

        // Logic: Agar link ke href mein current page ka naam hai
        if (linkHref.includes(currentPage)) {
            link.classList.add('menu-active');
        } 
        // Special Case: Agar Home page hai aur href "/" ya "index.html" hai
        else if ((currentPage === "index.html" || currentPage === "") && (linkHref === "/" || linkHref.includes("index.html"))) {
            link.classList.add('menu-active');
        }
    });
}

// 3. Fix Navigation Links based on location
function fixNavLinks(basePath) {
    if (basePath === './') return;

    const links = document.querySelectorAll('a');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('../')) {
            if(href === 'index.html' || href === '/') {
                link.setAttribute('href', '../index.html');
            }
        }
    });
}

// 4. Run on Load
document.addEventListener("DOMContentLoaded", loadComponents);