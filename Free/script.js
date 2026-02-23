const topbar = document.getElementById("topbar");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelectorAll(".nav a[data-section]");

if (menuToggle && topbar) {
    menuToggle.addEventListener("click", () => {
        topbar.classList.toggle("menu-open");
    });
}

function setActiveSection(sectionId) {
    navLinks.forEach((link) => {
        link.classList.toggle("active", link.dataset.section === sectionId);
    });
}

const currentHash = window.location.hash ? window.location.hash.replace("#", "") : "inicio";
setActiveSection(currentHash);

document.querySelectorAll(".nav a").forEach((anchor) => {
    anchor.addEventListener("click", () => {
        if (anchor.dataset.section) {
            setActiveSection(anchor.dataset.section);
        }
        if (topbar) {
            topbar.classList.remove("menu-open");
        }
    });
});

const sections = document.querySelectorAll(".page-section[id]");

if (sections.length > 0) {
    const getScrollOffset = () => {
        const topbarHeight = topbar ? topbar.offsetHeight : 0;
        return topbarHeight + 24;
    };

    const updateActiveSectionOnScroll = () => {
        const marker = window.scrollY + getScrollOffset();
        let activeSectionId = sections[0].id;

        sections.forEach((section) => {
            if (section.offsetTop <= marker) {
                activeSectionId = section.id;
            }
        });

        setActiveSection(activeSectionId);
    };

    window.addEventListener("scroll", updateActiveSectionOnScroll, { passive: true });
    window.addEventListener("resize", updateActiveSectionOnScroll);
    updateActiveSectionOnScroll();
}

const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        alert("Obrigado pelo contato! Entraremos em contato em breve.");
        this.reset();
    });
}
