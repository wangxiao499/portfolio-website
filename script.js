// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', function() {


    // 初始化所有功能
    initNavbar();
    initScrollAnimations();
    initSkillBars();
    initProjectsFilter();
    initCurrentYear();
    initStatsCounter();
    initMouseTrail();      // 鼠标拖尾效果
    initVideoPlayer();     // 视频播放功能
    initCustomCursor();    // 自定义鼠标指针
    initBackgroundMusic(); // 背景音乐初始化 - 添加这行

    // 初始化导航栏
    function initNavbar() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (!hamburger || !navMenu) return;

        // 切换移动端菜单
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.innerHTML = navMenu.classList.contains('active')
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });

        // 点击菜单项后关闭移动菜单
        document.querySelectorAll('.nav-menu a').forEach(item => {
            item.addEventListener('click', (e) => {
                // 如果是锚点链接
                if (item.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const targetId = item.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);

                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                }

                navMenu.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });

        // 导航栏滚动效果
        window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.navbar');
            if (!navbar) return;

            if (window.scrollY > 50) {
                navbar.style.padding = '10px 0';
                navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                navbar.style.padding = '15px 0';
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            }

            // 高亮当前部分
            highlightCurrentSection();
        });

        // 高亮当前滚动到的部分
        function highlightCurrentSection() {
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = window.scrollY + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-menu a').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
    }

    // 初始化滚动动画
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // 观察需要动画的元素
        document.querySelectorAll('.section, .project-card, .contact-card, .stat-card, .skill-category').forEach(element => {
            observer.observe(element);
        });

        // 添加滚动进度条
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });

        // 添加进度条样式
        const progressStyle = document.createElement('style');
        progressStyle.textContent = `
            .scroll-progress {
                position: fixed;
                top: 0;
                left: 0;
                height: 3px;
                background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
                z-index: 1001;
                transition: width 0.1s;
                box-shadow: 0 2px 5px rgba(108, 99, 255, 0.3);
            }
        `;
        document.head.appendChild(progressStyle);
    }

    // 初始化技能条动画
    function initSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.getAttribute('data-width');
                    entry.target.style.width = width + '%';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => observer.observe(bar));
    }

    // 初始化项目过滤器
    function initProjectsFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // 更新活动按钮
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // 过滤项目
                const filter = this.getAttribute('data-filter');

                projectCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.classList.add('animate-in');
                        }, 10);
                    } else {
                        card.style.display = 'none';
                        card.classList.remove('animate-in');
                    }
                });
            });
        });
    }

    // 初始化当前年份
    function initCurrentYear() {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    // 初始化统计数据计数器
    function initStatsCounter() {
        const statNumbers = document.querySelectorAll('.stat-number');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-count'));
                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;

                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        entry.target.textContent = Math.floor(current);
                    }, 16);

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(number => observer.observe(number));
    }

    // 初始化视频播放功能
    function initVideoPlayer() {
        const videoModal = document.getElementById('videoModal');
        const modalVideo = document.getElementById('modalVideo');
        const videoTitle = document.getElementById('videoTitle');
        const videoDescription = document.getElementById('videoDescription');
        const videoClose = document.getElementById('videoClose');

        // 视频播放按钮点击事件
        document.querySelectorAll('.view-project[data-video]').forEach(button => {
            button.addEventListener('click', function() {
                const videoSrc = this.getAttribute('data-video');
                const title = this.getAttribute('data-title');
                const description = this.getAttribute('data-description');

                // 设置视频信息
                modalVideo.src = videoSrc;
                videoTitle.textContent = title;
                videoDescription.textContent = description;

                // 显示模态框
                videoModal.classList.add('active');
                document.body.style.overflow = 'hidden';

                // 播放视频
                modalVideo.play();
            });
        });

        // 关闭视频模态框
        videoClose.addEventListener('click', function() {
            videoModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            modalVideo.pause();
            modalVideo.currentTime = 0;
        });

        // 点击模态框背景关闭
        videoModal.addEventListener('click', function(e) {
            if (e.target === videoModal) {
                videoModal.classList.remove('active');
                document.body.style.overflow = 'auto';
                modalVideo.pause();
                modalVideo.currentTime = 0;
            }
        });

        // ESC键关闭视频
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                videoModal.classList.remove('active');
                document.body.style.overflow = 'auto';
                modalVideo.pause();
                modalVideo.currentTime = 0;
            }
        });
    }

    // 初始化自定义鼠标指针和拖尾效果
    function initCustomCursor() {
        // 创建鼠标圆点
        const mouseDot = document.createElement('div');
        mouseDot.className = 'mouse-dot';
        document.body.appendChild(mouseDot);

        // 鼠标位置追踪
        let mouseX = 0, mouseY = 0;
        let dotX = 0, dotY = 0;
        const dotSpeed = 0.1;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // 动画循环
        function animateDot() {
            dotX += (mouseX - dotX) * dotSpeed;
            dotY += (mouseY - dotY) * dotSpeed;

            mouseDot.style.left = dotX + 'px';
            mouseDot.style.top = dotY + 'px';

            requestAnimationFrame(animateDot);
        }

        animateDot();

        // 鼠标悬停效果
        document.querySelectorAll('a, button, .project-card, .contact-card, .view-project, .view-details').forEach(el => {
            el.addEventListener('mouseenter', () => {
                mouseDot.classList.add('hover');
                document.body.classList.add('show-cursor');
            });

            el.addEventListener('mouseleave', () => {
                mouseDot.classList.remove('hover');
                document.body.classList.remove('show-cursor');
            });
        });

        // 初始化鼠标拖尾
        initMouseTrail();
    }
    // 初始化背景音乐 - 移除重复的函数定义
    function initBackgroundMusic() {
        const musicPlayer = document.getElementById('backgroundMusic');
        const musicToggle = document.getElementById('musicToggle');
        const volumeSlider = document.getElementById('volumeSlider');

        if (!musicPlayer || !musicToggle || !volumeSlider) {
            console.log('音乐播放器元素未找到');
            return;
        }

        // 检查是否静音状态
        const savedVolume = localStorage.getItem('backgroundMusicVolume');
        const savedMuted = localStorage.getItem('backgroundMusicMuted');

        if (savedVolume !== null) {
            musicPlayer.volume = parseFloat(savedVolume) / 100;
            volumeSlider.value = savedVolume;
        }

        if (savedMuted === 'true') {
            musicPlayer.muted = true;
            updateMusicToggleIcon(true);
        }

        // 切换播放/暂停
        musicToggle.addEventListener('click', function(e) {
            e.stopPropagation();

            if (musicPlayer.paused) {
                musicPlayer.play().catch(error => {
                    console.log('播放失败:', error);
                });
                updateMusicToggleIcon(false);
                localStorage.setItem('backgroundMusicMuted', 'false');
            } else {
                musicPlayer.pause();
                updateMusicToggleIcon(true);
                localStorage.setItem('backgroundMusicMuted', 'true');
            }

            // 添加动画效果
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });

        // 音量控制
        volumeSlider.addEventListener('input', function() {
            const volumeValue = parseInt(this.value);
            musicPlayer.volume = volumeValue / 100;
            localStorage.setItem('backgroundMusicVolume', volumeValue);

            // 如果静音但调节音量，则取消静音
            if (musicPlayer.muted && volumeValue > 0) {
                musicPlayer.muted = false;
                updateMusicToggleIcon(false);
                localStorage.setItem('backgroundMusicMuted', 'false');
            }
        });

        // 用户首次交互后播放音乐
        let userInteracted = false;

        const playOnInteraction = () => {
            if (!userInteracted && musicPlayer.paused) {
                userInteracted = true;
                musicPlayer.play().catch(error => {
                    console.log('交互后播放失败:', error);
                });
                updateMusicToggleIcon(false);
                localStorage.setItem('backgroundMusicMuted', 'false');

                // 移除事件监听器
                document.removeEventListener('click', playOnInteraction);
                document.removeEventListener('keydown', playOnInteraction);
                document.removeEventListener('touchstart', playOnInteraction);
            }
        };

        // 监听多种用户交互事件
        document.addEventListener('click', playOnInteraction);
        document.addEventListener('keydown', playOnInteraction);
        document.addEventListener('touchstart', playOnInteraction);

        // 更新音乐按钮图标
        function updateMusicToggleIcon(isMuted) {
            const volumeUpIcon = musicToggle.querySelector('.fa-volume-up');
            const volumeMuteIcon = musicToggle.querySelector('.fa-volume-mute');

            if (isMuted) {
                volumeUpIcon.style.display = 'none';
                volumeMuteIcon.style.display = 'inline';
            } else {
                volumeUpIcon.style.display = 'inline';
                volumeMuteIcon.style.display = 'none';
            }
        }

        // 初始化图标状态
        updateMusicToggleIcon(musicPlayer.paused || musicPlayer.muted);
    }

    // 初始化鼠标拖尾效果
    function initMouseTrail() {
        const trail = document.getElementById('mouseTrail');
        if (!trail) return;

        let mouseX = 0, mouseY = 0;
        let isMoving = false;
        let moveTimeout;
        let trailElements = [];
        const maxTrailElements = 20;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!isMoving) {
                trail.style.opacity = '1';
                isMoving = true;
            }

            clearTimeout(moveTimeout);
            moveTimeout = setTimeout(() => {
                trail.style.opacity = '0';
                isMoving = false;
            }, 300);

            // 创建拖尾点
            createTrailDot();
        });

        function createTrailDot() {
            // 创建新的拖尾点
            const trailDot = document.createElement('div');
            trailDot.className = 'mouse-trail-dot';
            trailDot.style.left = mouseX + 'px';
            trailDot.style.top = mouseY + 'px';

            // 随机颜色
            const hue = Math.random() * 60 + 200; // 蓝色到紫色范围
            const saturation = 70 + Math.random() * 30;
            const lightness = 50 + Math.random() * 20;
            trailDot.style.background = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

            // 随机大小
            const size = 4 + Math.random() * 8;
            trailDot.style.width = size + 'px';
            trailDot.style.height = size + 'px';

            document.body.appendChild(trailDot);

            // 添加到数组
            trailElements.push(trailDot);

            // 限制拖尾点数量
            if (trailElements.length > maxTrailElements) {
                const oldDot = trailElements.shift();
                if (oldDot && oldDot.parentNode) {
                    oldDot.parentNode.removeChild(oldDot);
                }
            }

            // 自动移除动画结束的点
            setTimeout(() => {
                if (trailDot.parentNode) {
                    trailDot.parentNode.removeChild(trailDot);
                    trailElements = trailElements.filter(dot => dot !== trailDot);
                }
            }, 600);
        }

        // 鼠标悬停时的拖尾效果增强
        document.querySelectorAll('a, button, .project-card, .contact-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                // 增加拖尾密度
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => createTrailDot(), i * 50);
                }
            });
        });
    }

    // 页面加载动画
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');

        // 添加加载完成样式
        const loadStyle = document.createElement('style');
        loadStyle.textContent = `
            body.loaded .hero-text h1 {
                animation: none;
            }
            
            body::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: var(--light-color);
                z-index: 9999;
                animation: fadeOut 1s 0.5s forwards;
            }
            
            @keyframes fadeOut {
                to { opacity: 0; visibility: hidden; }
            }
            
            /* 暗色主题 */
            .dark-theme {
                --dark-color: #f8f9fa;
                --light-color: #1a1a1a;
                --white: #2d2d2d;
                --gray-color: #a0aec0;
                background: #1a1a1a;
                color: #f8f9fa;
            }
            
            .dark-theme .navbar {
                background: rgba(45, 45, 45, 0.95) !important;
                backdrop-filter: blur(10px);
            }
            
            .dark-theme .nav-menu a {
                color: #e2e8f0;
            }
            
            .dark-theme .nav-menu a:hover,
            .dark-theme .nav-menu a.active {
                color: var(--primary-color);
            }
            
            .dark-theme .hero {
                background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            }
            
            .dark-theme .hero-text h1 {
                background: linear-gradient(135deg, #f8f9fa, var(--primary-color));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            
            .dark-theme .skill-category,
            .dark-theme .project-card,
            .dark-theme .contact-card,
            .dark-theme .timeline-content,
            .dark-theme .stat-card,
            .dark-theme .social-section {
                background: #2d2d2d;
                color: #f8f9fa;
            }
            
            .dark-theme .project-content p,
            .dark-theme .skill-info span,
            .dark-theme .timeline-content p,
            .dark-theme .contact-content p,
            .dark-theme .social-section p {
                color: #a0aec0;
            }
            
            .dark-theme .footer {
                background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            }
            
            .dark-theme .skill-bar {
                background-color: #4a5568;
            }
            
            .dark-theme .info-item {
                background: #2d2d2d;
                border-left-color: var(--primary-color);
            }
            
            .dark-theme .info-label {
                color: #e2e8f0;
            }
            
            .dark-theme .video-modal-content {
                background: #2d2d2d;
            }
            
            .dark-theme .video-info h3 {
                color: #f8f9fa;
            }
            
            .dark-theme .video-info p {
                color: #a0aec0;
            }
        `;
        document.head.appendChild(loadStyle);
    });

    // 错误处理
    window.addEventListener('error', function(e) {
        console.error('JavaScript错误:', e.error);
    });
});