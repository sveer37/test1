document.addEventListener('DOMContentLoaded', () => {
    // Basic User Data (Would normally come from a backend or JSON)
    const userData = {
        firstName: "Alex",
        lastName: "Carter",
        title: "Lead Product Designer",
        organization: "Nexus Innovations",
        email: "alex@example.com",
        phone: "+12345678900",
        url: "https://alexcarter.design",
        linkedin: "https://linkedin.com/in/alexcarter",
        twitter: "https://twitter.com/alex_designs"
    };

    // --- Layout Toggle ---
    const layoutToggleBtn = document.getElementById('layout-toggle-btn');
    const profileSection = document.getElementById('profile-section');
    
    layoutToggleBtn.addEventListener('click', () => {
        profileSection.classList.toggle('thumbnail-view');
        
        // Change icon based on state
        const icon = layoutToggleBtn.querySelector('i');
        if (profileSection.classList.contains('thumbnail-view')) {
            icon.classList.remove('fa-image-portrait');
            icon.classList.add('fa-address-card');
            showToast('Thumbnail view activated');
        } else {
            icon.classList.remove('fa-address-card');
            icon.classList.add('fa-image-portrait');
            showToast('Centered profile activated');
        }
    });

    const listToggleBtn = document.getElementById('list-toggle-btn');
    const linksSection = document.getElementById('links-section');

    listToggleBtn.addEventListener('click', () => {
        linksSection.classList.toggle('list-view');
        
        // Change icon based on state
        const icon = listToggleBtn.querySelector('i');
        if (linksSection.classList.contains('list-view')) {
            icon.classList.remove('fa-list');
            icon.classList.add('fa-grip');
            showToast('List view activated');
        } else {
            icon.classList.remove('fa-grip');
            icon.classList.add('fa-list');
            showToast('Grid view activated');
        }
    });

    // --- 3D Tilt Effect ---
    const card = document.getElementById('vcard');
    let bounds;
    
    function rotateToMouse(e) {
        bounds = card.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const leftX = mouseX - bounds.x;
        const topY = mouseY - bounds.y;
        
        const center = {
            x: leftX - bounds.width / 2,
            y: topY - bounds.height / 2
        };
        
        const distance = Math.sqrt(center.x ** 2 + center.y ** 2);
        
        // Max rotation angle in degrees
        const maxRotation = 10;
        
        // Calculate rotation based on distance from center
        const rotateX = (center.y / (bounds.height / 2)) * -maxRotation;
        const rotateY = (center.x / (bounds.width / 2)) * maxRotation;

        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale3d(1.02, 1.02, 1.02)
        `;
    }

    // Only enable tilt on non-touch devices
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', rotateToMouse);
        
        // Reset transform when mouse leaves the document
        document.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    }

    // --- Generate & Download VCF ---
    const saveBtn = document.getElementById('save-contact-btn');
    
    saveBtn.addEventListener('click', () => {
        // Construct VCF stringent string
        const vcfContent = `BEGIN:VCARD
VERSION:3.0
N:${userData.lastName};${userData.firstName};;;
FN:${userData.firstName} ${userData.lastName}
ORG:${userData.organization}
TITLE:${userData.title}
TEL;TYPE=WORK,VOICE:${userData.phone}
EMAIL;TYPE=PREF,INTERNET:${userData.email}
URL:${userData.url}
X-SOCIALPROFILE;type=linkedin:${userData.linkedin}
X-SOCIALPROFILE;type=twitter:${userData.twitter}
END:VCARD`;

        // Create Blob and Download
        const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${userData.firstName}_${userData.lastName}_Contact.vcf`;
        
        // Show visually that action happened
        saveBtn.innerHTML = '<i class="fa-solid fa-check"></i> Downloaded';
        setTimeout(() => {
            saveBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Save Contact';
        }, 3000);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showToast('Contact file downloaded!');
    });

    // --- Share Modal Logic ---
    const shareBtn = document.getElementById('share-btn');
    const modal = document.getElementById('share-modal');
    const closeBtn = document.querySelector('.close-btn');
    const copyLinkBtn = document.getElementById('copy-link-btn');
    
    shareBtn.addEventListener('click', () => {
        modal.classList.add('show');
    });
    
    function closeModal() {
        modal.classList.remove('show');
    }
    
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Copy link functionality
    copyLinkBtn.addEventListener('click', () => {
        // Assume current URL is the v-card URL
        navigator.clipboard.writeText(window.location.href).then(() => {
            copyLinkBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            showToast('Link copied to clipboard!');
            setTimeout(() => {
                copyLinkBtn.innerHTML = '<i class="fa-solid fa-link"></i> Copy Link';
                closeModal();
            }, 2000);
        });
    });

    // --- Toast Notification System ---
    const toast = document.getElementById('toast');
    let toastTimeout;
    
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // --- Footer Action Delegation ---
    const footerSaveBtn = document.getElementById('footer-save-btn');
    if (footerSaveBtn) {
        footerSaveBtn.addEventListener('click', () => saveBtn.click());
    }

    const footerShareBtn = document.getElementById('footer-share-btn');
    if (footerShareBtn) {
        footerShareBtn.addEventListener('click', () => shareBtn.click());
    }

    const footerQrBtn = document.getElementById('footer-qr-btn');
    if (footerQrBtn) {
        footerQrBtn.addEventListener('click', () => shareBtn.click());
    }
});
