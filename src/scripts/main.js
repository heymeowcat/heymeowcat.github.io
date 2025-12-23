document.addEventListener('DOMContentLoaded', () => {
    const username = "heymeowcat";
    const userApiUrl = `https://api.github.com/users/${username}`;
    const reposApiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`;

    // Initialize Static Projects
    const staticProjects = document.querySelectorAll('.static-project');
    const existingProjectNames = new Set();
    
    staticProjects.forEach(card => {
        const name = card.getAttribute('data-name');
        if (name) existingProjectNames.add(name);
        
        // Add tilt effect listeners to static cards
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
    });

    // Fetch User Data
    fetch(userApiUrl)
        .then(response => response.json())
        .then(userData => {
            const nameElement = document.getElementById("github-name");
            if (nameElement) {
                nameElement.textContent = userData.name || username;
                // Trigger entrance animation for name
                nameElement.style.opacity = '1';
                nameElement.style.transform = 'translateY(0)';
            }
        })
        .catch(err => console.error("Error fetching user data:", err));

    // Fetch Repos
    fetch(reposApiUrl)
        .then(response => response.json())
        .then(data => {
            const sortedRepos = data
                .filter((repo) => 
                    repo.description && 
                    repo.language !== null &&
                    !existingProjectNames.has(repo.name) // Filter out static projects
                )
                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

            const skillsSet = new Set();
            sortedRepos.forEach(repo => {
                if (repo.language) {
                    repo.language.split(",").forEach((lang) => skillsSet.add(lang.trim()));
                }
                if (repo.topics) {
                    repo.topics.forEach((topic) => skillsSet.add(topic));
                }
            });

            renderSkills(Array.from(skillsSet).slice(0, 8)); // Limit skills
            renderProjects(sortedRepos);
        })
        .catch(err => console.error("Error fetching repos:", err));

    function renderSkills(skills) {
        const skillsContainer = document.getElementById("github-skills");
        if (!skillsContainer) return;
        
        skills.forEach((skill, index) => {
            const chip = document.createElement("span");
            chip.className = "chip";
            chip.textContent = skill;
            chip.style.animationDelay = `${index * 0.1}s`;
            skillsContainer.appendChild(chip);
            // Add a space for SEO text extraction
            skillsContainer.appendChild(document.createTextNode(" "));
        });
    }

    function renderProjects(repos) {
        const projectsContainer = document.getElementById("github-projects");
        if (!projectsContainer) return;
        const initialDelayOffset = document.querySelectorAll('.static-project').length * 0.1;

        repos.forEach((repo, index) => {
            const technologies = repo.language
                ? repo.language.split(",").slice(0, 3).join(", ")
                : "";

            const projectCard = document.createElement("div");
            projectCard.className = "project-card glass";
            projectCard.style.animationDelay = `${initialDelayOffset + (index * 0.1)}s`; // Staggered animation with offset
            
            projectCard.innerHTML = `
                <div class="card-content">
                    <h3>${repo.name}</h3>
                    <p class="project-description">${repo.description}</p>
                    <div class="card-meta">
                        <span class="date">${formatDate(repo.updated_at)}</span>
                        ${technologies ? `<span class="tech">${technologies}</span>` : ''}
                    </div>
                    <a href="${repo.html_url}" target="_blank" class="project-link">View Project <span class="arrow">→</span></a>
                </div>
                <div class="card-glow"></div>
            `;
            
            // Add tilt effect listeners
            projectCard.addEventListener('mousemove', handleTilt);
            projectCard.addEventListener('mouseleave', resetTilt);
            
            projectsContainer.appendChild(projectCard);
            
            if (typeof revealObserver !== 'undefined') {
                revealObserver.observe(projectCard);
            }
        });
    }

    function formatDate(dateString) {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // 3D Tilt Effect
    function handleTilt(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        
        // Move glow
        const glow = card.querySelector('.card-glow');
        if (glow) {
            glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.1) 0%, transparent 80%)`;
        }
    }

    function resetTilt(e) {
        const card = e.currentTarget;
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        const glow = card.querySelector('.card-glow');
        if (glow) {
            glow.style.background = 'none';
        }
    }

    // Custom Cursor
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.addEventListener('mousedown', () => cursor.classList.add('active'));
    document.addEventListener('mouseup', () => cursor.classList.remove('active'));

    
    const canvas = document.getElementById("hero-canvas");
    const ctx = canvas.getContext("2d");
    const heroContent = document.getElementById("hero-content");
    const letterBoxes = document.querySelectorAll(".letter-box");
    
    let canvasW, canvasH;
    let canvasParticles = [];
    const particleCount = 200;
    
    let heroMouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let heroScroll = { y: 0, targetY: 0, progress: 0 };
    
    function resizeCanvas() {
        if (!canvas) return;
        canvasW = canvas.width = window.innerWidth;
        canvasH = canvas.height = window.innerHeight;
        initHeroParticles();
    }
    
    class HeroParticle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvasW;
            this.y = Math.random() * canvasH;
            this.z = Math.random() * canvasW;
            this.pz = this.z;
        }
        update() {
            const warpIntensity = 1 + heroScroll.progress * 4;
            let speed = (0.5 + Math.abs(heroMouse.x * 5)) * warpIntensity;
            this.z -= speed;
            if (this.z < 1) {
                this.reset();
                this.z = canvasW;
                this.pz = this.z;
            }
        }
        draw() {
            let sx = (this.x - canvasW / 2) * (canvasW / this.z) + canvasW / 2;
            let sy = (this.y - canvasH / 2) * (canvasW / this.z) + canvasH / 2;
            let r = Math.min(canvasW / this.z, 2.5); 
            
            let psx = (this.x - canvasW / 2) * (canvasW / this.pz) + canvasW / 2;
            let psy = (this.y - canvasH / 2) * (canvasW / this.pz) + canvasH / 2;
    
            const alpha = Math.min(1, r / 5); 
    
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 242, 255, ${alpha * 0.5})`;
            ctx.lineWidth = r;
            ctx.moveTo(sx, sy);
            ctx.lineTo(psx, psy);
            ctx.stroke();
    
            ctx.beginPath();
            ctx.fillStyle = `rgba(200, 250, 255, ${alpha})`;
            ctx.arc(sx, sy, r, 0, Math.PI * 2);
            ctx.fill();
    
            this.pz = this.z;
        }
    }
    
    function initHeroParticles() {
        canvasParticles = [];
        const count = window.innerWidth < 768 ? 100 : particleCount;
        for (let i = 0; i < count; i++) {
            canvasParticles.push(new HeroParticle());
        }
    }
    
    window.addEventListener("mousemove", (e) => {
        heroMouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        heroMouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    
    window.addEventListener("scroll", () => {
        heroScroll.targetY = window.scrollY;
        heroScroll.progress = Math.min(1, window.scrollY / 250);
    });
    
    function animateHero() {
        if (!canvas) return;
        
        ctx.clearRect(0, 0, canvasW, canvasH);
    
        heroMouse.x += (heroMouse.targetX - heroMouse.x) * 0.1;
        heroMouse.y += (heroMouse.targetY - heroMouse.y) * 0.1;
        heroScroll.y += (heroScroll.targetY - heroScroll.y) * 0.1;
    
        canvasParticles.forEach(p => { p.update(); p.draw(); });
    
        if (heroContent) {
            const rx = heroMouse.y * -8;
            const ry = heroMouse.x * 12;
            heroContent.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        }
    
        letterBoxes.forEach((box, i) => {
            const deltaIndex = 5 - (2 * i);
            const translateX = deltaIndex * 110 * heroScroll.progress;
    
            const letterWindow = 1 / 6;
            const letterStart = i * letterWindow;
            const letterEnd = letterStart + letterWindow;
            
            let letterProgress = 0;
            if (heroScroll.progress >= letterStart && heroScroll.progress <= letterEnd) {
                letterProgress = (heroScroll.progress - letterStart) / letterWindow;
            } else if (heroScroll.progress > letterEnd) {
                letterProgress = 1;
            }
            
            let rotation;
            if (i < 3) {
                rotation = letterProgress * 180;
            } else {
                rotation = 180 + (letterProgress * 180);
            }
            
            const scalePulse = 1 + Math.sin(letterProgress * Math.PI) * 0.1;
            const yOffset = Math.sin(letterProgress * Math.PI) * -10;
            
            box.style.transform = `
                translateX(${translateX}%) 
                rotateX(${rotation}deg) 
                rotateY(${rotation}deg) 
                scale(${scalePulse}) 
                translateY(${yOffset}px)
            `;
            
            if (letterProgress > 0 && letterProgress < 1) {
                box.classList.add('flipping');
            } else {
                box.classList.remove('flipping');
            }
        });
    
        requestAnimationFrame(animateHero);
    }
    
    if (canvas) {
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        animateHero();
    }
   

    
    let lastScrollY = window.pageYOffset;
    let scrollVelocity = 0;
    let isScrolling = false;
    let scrollTimeout;
    let mouseX = 0;
    let mouseY = 0;
    
    const shapeDirections = [
        { x: 1, y: 0.3 },    
        { x: -1, y: 0.2 },   
        { x: 0.5, y: -0.5 } 
    ];
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        updateShapePositions();
    });
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.pageYOffset;
        scrollVelocity = currentScrollY - lastScrollY;
        isScrolling = true;
        lastScrollY = currentScrollY;
        
        updateShapePositions();
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
            smoothStopShapes();
        }, 150);
    });
    
    function updateShapePositions() {
        const shapes = document.querySelectorAll('.shape');
        const scrollY = window.pageYOffset;
        
        shapes.forEach((shape, index) => {
            const direction = shapeDirections[index] || { x: 0, y: 1 };
            const speed = (index + 1) * 20;
            const mouseXOffset = (window.innerWidth / 2 - mouseX) / speed;
            const mouseYOffset = (window.innerHeight / 2 - mouseY) / speed;
            
            const scrollXOffset = scrollY * direction.x * 0.8;
            const scrollYOffset = scrollY * direction.y * 0.8;
            
            const finalX = mouseXOffset + scrollXOffset;
            const finalY = mouseYOffset + scrollYOffset;
            const rotation = scrollY * 0.03 * (index + 1);
            const scale = 1 + (Math.sin(scrollY * 0.002) * 0.15);
            
            shape.style.transform = `translate(${finalX}px, ${finalY}px) rotate(${rotation}deg) scale(${scale})`;
            const opacity = 0.5 + Math.abs(Math.sin(scrollY * 0.001)) * 0.2;
            shape.style.opacity = opacity;
        });
    }
    
    function smoothStopShapes() {
        const shapes = document.querySelectorAll('.shape');
        shapes.forEach((shape) => {
            shape.style.transition = 'transform 0.8s ease-out, opacity 0.8s ease-out';
        });
        
        setTimeout(() => {
            shapes.forEach((shape) => {
                shape.style.transition = 'transform 0.1s ease-out, opacity 0.2s ease-out';
            });
        }, 800);
    }

    // Particle Click Effect
    document.addEventListener('click', (e) => {
        for (let i = 0; i < 6; i++) {
            createParticle(e.clientX, e.clientY);
        }
    });

    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'particle-effect';
        
        const tx = (Math.random() - 0.5) * 100;
        const ty = (Math.random() - 0.5) * 100;
        
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.project-card, .tech-item, .stat-card, .about-description');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal', 'active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // Counter Animation for Stats
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    animateCounter(stat, target);
                });
            }
        });
    }, { threshold: 0.5 });

    if (statNumbers.length > 0) {
        statsObserver.observe(statNumbers[0].parentElement.parentElement);
    }

    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const duration = 2000;
        const stepTime = duration / 50;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, stepTime);
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
