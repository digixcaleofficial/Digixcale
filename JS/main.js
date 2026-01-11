// 1. Function to Load Components
async function loadComponents() {
    try {
        // Load Header
        const headerRes = await fetch('/components/header.html');
        const headerData = await headerRes.text();
        document.getElementById('header-placeholder').innerHTML = headerData;

        // Load Footer
        const footerRes = await fetch('/components/footer.html');
        const footerData = await footerRes.text();
        document.getElementById('footer-placeholder').innerHTML = footerData;

        // Header Load hone ke baad hi ye functions chalenge

    } catch (error) {
        console.error("Error loading components:", error);
    }
}