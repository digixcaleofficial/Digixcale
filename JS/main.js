async function loadComponents() {
    try {
        const basePath = './';

        // --- Load Header ---
        const headerRes = await fetch(`${basePath}components/header.html`);
        if (!headerRes.ok) throw new Error("Header not found");
        const headerData = await headerRes.text();
        
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            headerPlaceholder.innerHTML = headerData;
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

// Mobile Menu Toggle
function initMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle'); 
    const navClose = document.getElementById('nav-close');    

    if(navToggle && navMenu){
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
            navToggle.style.display = 'none';
        });
    }

    if(navClose && navMenu){
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
            navToggle.style.display = 'block';
        });
    }

    const navLinks = document.querySelectorAll('.menu');
    navLinks.forEach(n => n.addEventListener('click', () => {
        if(navMenu) navMenu.classList.remove('show-menu');
    }));
}

// Active Nav Link Highlighter
function setActiveLink() {
    let currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "") currentPage = "index.html";

    const navLinks = document.querySelectorAll('.menu');
    navLinks.forEach(link => {
        link.classList.remove('menu-active');
        const linkHref = link.getAttribute('href');

        if (linkHref && linkHref.includes(currentPage)) {
            link.classList.add('menu-active');
        } else if ((currentPage === "index.html" || currentPage === "") && (linkHref === "/" || linkHref.includes("index.html"))) {
            link.classList.add('menu-active');
        }
    });
}

// Main Portfolio Tab Switcher
function switchWorkTab(tabId, btnElement) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    btnElement.classList.add('active');
}

// Meta Ads: Reports vs Videos Switcher (Responsive Class-Based)
function filterMetaMediaType(selectedType, element) {
    document.querySelectorAll('.client-filter .client-pill').forEach(pill => {
        pill.classList.remove('active');
    });
    element.classList.add('active');

    const gridContainer = document.querySelector('#meta-ads .showcase-grid');
    if (gridContainer) {
        if (selectedType === 'video') {
            gridContainer.classList.add('is-video-view');
        } else {
            gridContainer.classList.remove('is-video-view');
        }
    }

    const cards = document.querySelectorAll('#meta-ads .showcase-card');
    cards.forEach(card => {
        if (card.getAttribute('data-type') === selectedType) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Video Editing Tab Sub-Category Switcher
function filterReelTab(category, btnElement) {
    document.querySelectorAll('.reel-filter .client-pill').forEach(pill => {
        pill.classList.remove('active');
    });
    btnElement.classList.add('active');

    const allReels = document.querySelectorAll('.reels-pure-grid .reel-item');
    allReels.forEach(reel => {
        if (reel.getAttribute('data-category') === category) {
            reel.style.display = 'block';
        } else {
            reel.style.display = 'none';
        }
    });
}

// Lazy Video Player (YouTube & Generic)
function playVideoFacade(container, embedUrl) {
    const separator = embedUrl.includes('?') ? '&' : '?';
    container.innerHTML = `
        <iframe 
            src="${embedUrl}${separator}autoplay=1" 
            title="Video Player" 
            style="width:100%;height:100%;border:none;border-radius:18px;" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
        </iframe>
    `;
    container.style.cursor = 'default';
    container.onclick = null;
}

// Instagram Reel Iframe Injector
function playInstagramFacade(container, rawUrl) {
    let cleanUrl = rawUrl.split('?')[0];
    if (!cleanUrl.endsWith('/')) cleanUrl += '/';
    const embedUrl = cleanUrl.includes('/embed/') ? cleanUrl : `${cleanUrl}embed/`;

    container.innerHTML = `
        <iframe 
            src="${embedUrl}" 
            title="Instagram Reel Player" 
            allowtransparency="true" 
            allowfullscreen="true" 
            frameborder="0" 
            scrolling="no" 
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture">
        </iframe>
    `;
    container.style.cursor = 'default';
    container.onclick = null;
}

// Google Drive Centered Player
function playDriveFacade(container, rawDriveUrl) {
    let fileId = '';

    const matchD = rawDriveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (matchD && matchD[1]) {
        fileId = matchD[1];
    } else if (rawDriveUrl.includes('id=')) {
        fileId = rawDriveUrl.split('id=')[1].split('&')[0];
    }

    if (!fileId) {
        console.error("Invalid Drive link:", rawDriveUrl);
        return;
    }

    const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;

    container.innerHTML = `
        <div class="drive-player-wrapper">
            <iframe 
                src="${previewUrl}" 
                title="Drive Reel" 
                allow="autoplay; fullscreen" 
                allowfullscreen>
            </iframe>
        </div>
    `;
    container.style.cursor = 'default';
    container.onclick = null;
}

// Lightbox Handlers
function openReportLightbox(imageSrc) {
    const modal = document.getElementById('reportLightbox');
    const modalImg = document.getElementById('lightboxImg');
    if (modal && modalImg) {
        modalImg.src = imageSrc;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeReportLightbox() {
    const modal = document.getElementById('reportLightbox');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeReportLightbox();
});

// Run Initialization on Load
document.addEventListener("DOMContentLoaded", () => {
    loadComponents();

    new Swiper('.testi-swiper', {
        loop: true,
        spaceBetween: 30,
        grabCursor: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
        }
    });
});