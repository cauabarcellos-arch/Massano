document.addEventListener('DOMContentLoaded', () => {
    initTopbar();
    initMobileMenu();
    initNavigation();
    initScrollSpy();
    initForms();
    initCounters();
    initLoadingScreen();
    initSmoothScroll();
    initInputMasks();
    initBackToTop();
});

function initTopbar() {
    const topbar = document.getElementById('topbar');
    if (!topbar) return;
    window.addEventListener('scroll', () => {
        topbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const topbar = document.getElementById('topbar');
    if (!menuToggle || !topbar) return;

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        topbar.classList.toggle('menu-open');
    });

    document.addEventListener('click', (e) => {
        if (!topbar.contains(e.target) && topbar.classList.contains('menu-open')) {
            topbar.classList.remove('menu-open');
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) topbar.classList.remove('menu-open');
    });
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) link.classList.add('active');
        
        link.addEventListener('click', () => {
            document.getElementById('topbar')?.classList.remove('menu-open');
        });
    });
}

function initScrollSpy() {
    const sections = document.querySelectorAll('.page-section[id]');
    const navLinks = document.querySelectorAll('.nav a');
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}` || link.getAttribute('href').includes(`#${id}`)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-20% 0px -80% 0px' });

    sections.forEach(section => observer.observe(section));
}

function initCounters() {
    const statNumbers = document.querySelectorAll('.stat-card strong');
    if (!statNumbers.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const targetText = stat.textContent;
                const match = targetText.match(/^([+-]?\d+)([+%]?)$/);
                if (!match) return;
                
                const targetNumber = parseInt(match[1], 10);
                const suffix = match[2] || '';
                let current = 0;
                const increment = targetNumber / 50;
                
                const updateCounter = () => {
                    current += increment;
                    if (current >= targetNumber) {
                        stat.textContent = targetNumber + suffix;
                        return;
                    }
                    stat.textContent = Math.round(current) + suffix;
                    requestAnimationFrame(updateCounter);
                };
                
                updateCounter();
                observer.unobserve(stat);
            }
        });
    });

    statNumbers.forEach(stat => observer.observe(stat));
}

function initForms() {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
        form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => validateInput(input));
            input.addEventListener('blur', () => validateInput(input));
        });
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateInput(input)) isValid = false;
    });

    if (!isValid) {
        showNotification('Preencha todos os campos corretamente.', 'error');
        return;
    }

    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    setTimeout(() => {
        showNotification('Mensagem enviada com sucesso!', 'success');
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }, 1500);
}

function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMsg = '';

    if (input.hasAttribute('required') && !value) {
        isValid = false;
        errorMsg = 'Campo obrigatório';
    } else if (input.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        isValid = false;
        errorMsg = 'E-mail inválido';
    } else if (input.type === 'tel' && value) {
        const digits = value.replace(/\D/g, '');
        if (digits.length < 10 || digits.length > 11) {
            isValid = false;
            errorMsg = 'Telefone inválido';
        }
    }

    const parent = input.parentElement;
    const existingError = parent.querySelector('.error-message');
    if (existingError) existingError.remove();

    if (!isValid) {
        input.style.borderColor = 'var(--danger)';
        const error = document.createElement('span');
        error.className = 'error-message';
        error.textContent = errorMsg;
        error.style.color = 'var(--danger)';
        error.style.fontSize = '0.875rem';
        error.style.marginTop = '0.25rem';
        error.style.display = 'block';
        parent.appendChild(error);
    } else {
        input.style.borderColor = 'var(--success)';
    }

    return isValid;
}

function showNotification(message, type = 'success') {
    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.textContent = message;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

function initLoadingScreen() {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loading);

    window.addEventListener('load', () => {
        setTimeout(() => {
            loading.classList.add('hidden');
            setTimeout(() => loading.remove(), 500);
        }, 500);
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const topbarHeight = document.getElementById('topbar')?.offsetHeight || 0;
                window.scrollTo({
                    top: target.offsetTop - topbarHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initInputMasks() {
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            if (value.length > 2) value = `(${value.slice(0,2)}) ${value.slice(2)}`;
            if (value.length > 10) value = value.slice(0,10) + '-' + value.slice(10);
            e.target.value = value;
        });
    });
}

function initBackToTop() {
    const btn = document.createElement('button');
    btn.innerHTML = '↑';
    btn.setAttribute('aria-label', 'Voltar ao topo');
    btn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary), var(--primary-light));
        color: white;
        border: none;
        cursor: pointer;
        font-size: 1.5rem;
        box-shadow: var(--shadow-lg);
        opacity: 0;
        visibility: hidden;
        transition: var(--transition);
        z-index: 99;
    `;
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.style.opacity = '1';
            btn.style.visibility = 'visible';
        } else {
            btn.style.opacity = '0';
            btn.style.visibility = 'hidden';
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}