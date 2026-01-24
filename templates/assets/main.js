// Jyf Theme - Main JavaScript

(function() {
  'use strict';

  // ==================== 页面加载进度条 ====================
  function initPageLoadingBar() {
    // 创建进度条元素
    const loadingBar = document.createElement('div');
    loadingBar.className = 'page-loading-bar loading';
    document.body.appendChild(loadingBar);
    
    let progress = 0;
    let interval;
    
    // 模拟加载进度 - 使用更智能的增长算法
    function updateProgress() {
      if (progress < 90) {
        // 根据当前进度调整增长速度：开始快，后面慢
        const remaining = 90 - progress;
        const increment = Math.random() * (remaining / 10) + 1;
        progress = Math.min(progress + increment, 90);
        loadingBar.style.width = progress + '%';
      }
    }
    
    // 开始模拟加载
    interval = setInterval(updateProgress, 150);
    
    // 页面加载完成
    function completeLoading() {
      clearInterval(interval);
      progress = 100;
      loadingBar.style.width = '100%';
      loadingBar.classList.remove('loading');
      loadingBar.classList.add('complete');
      
      // 动画完成后移除元素
      setTimeout(() => {
        loadingBar.remove();
      }, 800);
    }
    
    // 监听页面加载完成
    if (document.readyState === 'complete') {
      completeLoading();
    } else {
      window.addEventListener('load', completeLoading);
    }
    
    console.log('[PageLoading] 顶部进度条已初始化');
  }

  // ==================== 全屏加载动画 ====================
  function initPageLoadingOverlay() {
    // 创建全屏加载遮罩
    const overlay = document.createElement('div');
    overlay.className = 'page-loading-overlay';
    
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    
    overlay.appendChild(spinner);
    document.body.appendChild(overlay);
    
    // 页面加载完成后隐藏
    function hideOverlay() {
      overlay.classList.add('hidden');
      setTimeout(() => {
        overlay.remove();
      }, 500);
    }
    
    // 监听页面加载完成
    if (document.readyState === 'complete') {
      hideOverlay();
    } else {
      window.addEventListener('load', hideOverlay);
    }
    
    console.log('[PageLoading] 全屏加载动画已初始化');
  }

  // ==================== 居中进度条 ====================
  function initPageLoadingCenter() {
    // 创建全屏容器
    const container = document.createElement('div');
    container.className = 'page-loading-center';
    
    // 创建进度条容器
    const progressBar = document.createElement('div');
    progressBar.className = 'loading-progress-bar';
    
    // 创建进度条填充
    const progressFill = document.createElement('div');
    progressFill.className = 'loading-progress-fill';
    progressBar.appendChild(progressFill);
    
    // 创建进度文本
    const progressText = document.createElement('div');
    progressText.className = 'loading-progress-text';
    progressText.textContent = 'Loading 0%';
    
    container.appendChild(progressBar);
    container.appendChild(progressText);
    document.body.appendChild(container);
    
    let progress = 0;
    let interval;
    
    // 模拟加载进度 - 使用更智能的增长算法
    function updateProgress() {
      if (progress < 90) {
        // 根据当前进度调整增长速度
        const remaining = 90 - progress;
        const increment = Math.random() * (remaining / 10) + 1;
        progress = Math.min(progress + increment, 90);
        progressFill.style.width = progress + '%';
        progressText.textContent = 'Loading ' + Math.floor(progress) + '%';
      }
    }
    
    // 开始模拟加载
    interval = setInterval(updateProgress, 150);
    
    // 页面加载完成
    function completeLoading() {
      clearInterval(interval);
      progress = 100;
      progressFill.style.width = '100%';
      progressText.textContent = 'Loading 100%';
      
      // 延迟后隐藏
      setTimeout(() => {
        container.classList.add('hidden');
        setTimeout(() => {
          container.remove();
        }, 500);
      }, 300);
    }
    
    // 监听页面加载完成
    if (document.readyState === 'complete') {
      completeLoading();
    } else {
      window.addEventListener('load', completeLoading);
    }
    
    console.log('[PageLoading] 居中进度条已初始化');
  }

  // ==================== 图片懒加载 ====================
  function initLazyLoad() {
    // 使用 Intersection Observer API 实现懒加载
    if ('IntersectionObserver' in window) {
      const lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            
            if (src) {
              // 开始加载图片
              img.src = src;
              img.removeAttribute('data-src');
              
              // 图片加载完成后添加类
              img.addEventListener('load', function() {
                img.classList.add('lazy-loaded');
              });
              
              // 停止观察该图片
              observer.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px 0px', // 提前 50px 开始加载
        threshold: 0.01
      });
      
      // 观察所有带 data-src 的图片
      function observeLazyImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
          lazyImageObserver.observe(img);
        });
      }
      
      // 初始化
      observeLazyImages();
      
      // 监听动态添加的图片
      const mutationObserver = new MutationObserver(() => {
        observeLazyImages();
      });
      
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      console.log('[LazyLoad] 图片懒加载已初始化');
    } else {
      // 不支持 IntersectionObserver 的浏览器，直接加载所有图片
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('lazy-loaded');
      });
      console.log('[LazyLoad] 浏览器不支持 IntersectionObserver，直接加载所有图片');
    }
  }

  // ==================== 图片加载动画 ====================
  function initImageLoading() {
    // 为所有图片添加加载动画
    function addLoadingToImages() {
      // 选择需要添加加载动画的图片
      const images = document.querySelectorAll('.post-card-cover img, .post-content img, .photo-item img, .moment-media-item img, .link-logo img');
      
      images.forEach(img => {
        const parent = img.parentElement;
        
        // 如果图片还没加载完成
        if (!img.complete) {
          parent.classList.add('image-loading');
          
          // 图片加载完成
          img.addEventListener('load', function() {
            parent.classList.add('loaded');
            setTimeout(() => {
              parent.classList.remove('image-loading', 'loaded');
            }, 300);
          });
          
          // 图片加载失败
          img.addEventListener('error', function() {
            parent.classList.remove('image-loading');
          });
        }
      });
    }
    
    // 初始化
    addLoadingToImages();
    
    // 监听动态添加的图片
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          addLoadingToImages();
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    console.log('[ImageLoading] 图片加载动画已初始化');
  }

  // ==================== 暗夜模式 ====================
  function initTheme() {
    const configTheme = window.themeConfig?.colorScheme || 'light';
    
    // 如果配置是 auto，则始终跟随系统，忽略 localStorage
    // 如果配置不是 auto，则使用 localStorage 或配置值
    let themeMode, currentTheme;
    
    if (configTheme === 'auto') {
      // 配置为 auto 时，始终跟随系统
      themeMode = 'auto';
      currentTheme = getSystemTheme();
      // 清除可能存在的手动设置
      localStorage.removeItem('theme');
      
      // 隐藏主题切换按钮
      const themeToggle = document.querySelector('.theme-toggle');
      if (themeToggle) {
        themeToggle.style.display = 'none';
      }
    } else {
      // 配置不是 auto 时，优先使用用户手动设置
      const savedTheme = localStorage.getItem('theme');
      themeMode = savedTheme || configTheme;
      currentTheme = themeMode;
      
      // 显示主题切换按钮
      const themeToggle = document.querySelector('.theme-toggle');
      if (themeToggle) {
        themeToggle.style.display = '';
      }
    }
    
    // 设置初始主题
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.body.setAttribute('data-color-scheme', currentTheme);
    updateThemeColor(currentTheme);
    console.log('[Theme] 初始化 - 配置:', configTheme, '模式:', themeMode, '显示:', currentTheme);
    
    // 监听系统主题变化
    if (window.matchMedia) {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      darkModeQuery.addEventListener('change', (e) => {
        const config = window.themeConfig?.colorScheme || 'light';
        
        // 只有配置为 auto 时才自动切换
        if (config === 'auto') {
          const newTheme = e.matches ? 'dark' : 'light';
          document.documentElement.setAttribute('data-theme', newTheme);
          document.body.setAttribute('data-color-scheme', newTheme);
          updateThemeColor(newTheme);
          console.log('[Theme] 系统主题已变化，自动切换到:', newTheme);
        }
      });
    }
  }
  
  // 更新浏览器主题颜色
  function updateThemeColor(theme) {
    // 获取或创建 theme-color meta 标签
    let metaThemeColor = document.querySelector('meta[name="theme-color"]:not([media])');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    
    // 根据主题设置颜色
    const themeColors = {
      light: '#FAFAFA',  // 浅色模式背景色
      dark: '#292a2d'    // 深色模式背景色
    };
    
    metaThemeColor.content = themeColors[theme] || themeColors.light;
    console.log('[Theme] 更新浏览器主题颜色:', metaThemeColor.content);
  }
  
  // 获取系统主题
  function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function toggleTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', (e) => {
      const configTheme = window.themeConfig?.colorScheme || 'light';
      
      // 如果配置是 auto，不允许手动切换（因为会自动跟随系统）
      if (configTheme === 'auto') {
        console.log('[Theme] 当前配置为跟随系统，无法手动切换');
        return;
      }
      
      const currentTheme = document.documentElement.getAttribute('data-theme');
      
      // 简单双态切换：light <-> dark
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      // 添加临时类来触发图标旋转
      if (newTheme === 'dark') {
        themeToggle.classList.add('switching-to-dark');
      } else {
        themeToggle.classList.add('switching-to-light');
      }
      
      // 保存用户选择
      localStorage.setItem('theme', newTheme);
      
      // 创建扩散动画 - 传入当前主题和目标主题
      createThemeTransition(e, currentTheme, newTheme);
      
      console.log('[Theme] 切换主题: 从', currentTheme, '到', newTheme);
    });
  }

  // 创建主题切换的扩散动画（使用 clip-path）
  function createThemeTransition(event, fromTheme, toTheme) {
    // 获取点击位置
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // 计算需要的圆形半径（覆盖整个屏幕）
    const maxDistance = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    
    // 创建遮罩层 - 始终使用暗色
    const mask = document.createElement('div');
    mask.className = 'theme-transition-mask to-dark';
    
    document.body.appendChild(mask);
    
    const themeToggle = document.querySelector('.theme-toggle');
    
    // 判断是切换到暗色还是亮色
    const switchingToDark = toTheme === 'dark';
    
    if (switchingToDark) {
      // 切换到暗色：暗色圆形从点击位置扩散出去
      mask.style.clipPath = `circle(0px at ${x}px ${y}px)`;
      
      // 使用双 RAF 确保初始状态已渲染
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // 扩散到覆盖整个屏幕
          mask.style.clipPath = `circle(${maxDistance * 1.5}px at ${x}px ${y}px)`;
        });
      });
      
      // 在动画中途切换主题
      setTimeout(() => {
        document.documentElement.setAttribute('data-theme', toTheme);
        document.body.setAttribute('data-color-scheme', toTheme);
        updateThemeColor(toTheme);
        
        // 移除临时类
        if (themeToggle) {
          themeToggle.classList.remove('switching-to-dark');
        }
      }, 400);
      
    } else {
      // 切换到亮色：暗色圆形从整个屏幕缩小回来
      mask.style.clipPath = `circle(${maxDistance * 1.5}px at ${x}px ${y}px)`;
      
      // 立即切换主题
      document.documentElement.setAttribute('data-theme', toTheme);
      document.body.setAttribute('data-color-scheme', toTheme);
      updateThemeColor(toTheme);
      
      // 移除临时类
      if (themeToggle) {
        themeToggle.classList.remove('switching-to-light');
      }
      
      // 使用双 RAF 确保主题切换已渲染
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // 圆形缩小到点击位置
          mask.style.clipPath = `circle(0px at ${x}px ${y}px)`;
        });
      });
    }
    
    // 动画完成后移除遮罩
    setTimeout(() => {
      mask.remove();
    }, 800);
  }

  // ==================== 热力图 ====================
  function initHeatmap() {
    const heatmapContainer = document.getElementById('post-heatmap');
    if (!heatmapContainer) return;

    const daysContainer = heatmapContainer.querySelector('.heatmap-days');
    const monthsContainer = heatmapContainer.querySelector('.heatmap-months');
    const yearContainer = heatmapContainer.querySelector('.heatmap-year');
    const tooltip = document.getElementById('heatmap-tooltip');

    if (!daysContainer || !monthsContainer || !tooltip) return;
    
    // 检查数据是否存在
    if (!window.postHeatmapData || !window.postHeatmapData.allPosts) {
      console.warn('[Heatmap] 数据未加载');
      return;
    }

    // 设置年份
    if (yearContainer) {
      yearContainer.textContent = new Date().getFullYear();
    }

    /**
     * 获取当前年份的开始日期（1月1日所在周的周日）
     */
    function getYearStartDate() {
      const today = new Date();
      const currentYear = today.getFullYear();
      
      // 获取当前年份的1月1日
      const yearStart = new Date(currentYear, 0, 1);
      
      // 调整到1月1日所在周的周日（一周的开始）
      const day = yearStart.getDay();
      if (day !== 0) {
        yearStart.setDate(yearStart.getDate() - day);
      }
      
      return yearStart;
    }

    /**
     * 生成日期数组（按周排列：每列是一周的7天）
     */
    function generateDates() {
      const dates = [];
      const startDate = getYearStartDate();
      const today = new Date();
      const currentYear = today.getFullYear();
      
      // 获取当前年份的12月31日
      const yearEnd = new Date(currentYear, 11, 31);
      yearEnd.setHours(23, 59, 59, 999);
      
      // 按周（列）循环，每周7天（行）
      for (let week = 0; week < 53; week++) {
        for (let day = 0; day < 7; day++) {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + week * 7 + day);
          
          // 添加当前年份内的所有日期
          if (date.getFullYear() === currentYear && date <= yearEnd) {
            dates.push(date);
          }
        }
      }
      
      return dates;
    }

    /**
     * 统计每天的文章数量
     */
    function countPostsByDate() {
      const postCounts = {};
      const posts = window.postHeatmapData?.allPosts || [];
      
      posts.forEach(post => {
        if (!post.date) return;
        
        const date = new Date(post.date);
        const dateKey = formatDate(date);
        
        if (!postCounts[dateKey]) {
          postCounts[dateKey] = {
            count: 0,
            titles: []
          };
        }
        
        postCounts[dateKey].count++;
        postCounts[dateKey].titles.push(post.title);
      });
      
      return postCounts;
    }

    /**
     * 格式化日期为 YYYY-MM-DD
     */
    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    /**
     * 格式化日期为显示格式
     */
    function formatDisplayDate(date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}年${month}月${day}日`;
    }

    /**
     * 根据文章数量获取热力等级 (0-4)
     */
    function getLevel(count) {
      if (count === 0) return 0;
      if (count === 1) return 1;
      if (count === 2) return 2;
      if (count <= 4) return 3;
      return 4;
    }

    /**
     * 生成月份标签
     */
    function generateMonthLabels(dates) {
      const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
      const monthLabels = [];
      let lastMonth = -1;
      let weekIndex = 0;
      
      // 按周分组
      for (let i = 0; i < dates.length; i += 7) {
        const date = dates[i];
        const month = date.getMonth();
        
        if (month !== lastMonth) {
          monthLabels.push({
            month: months[month],
            weekIndex: weekIndex
          });
          lastMonth = month;
        }
        
        weekIndex++;
      }
      
      return monthLabels;
    }

    /**
     * 渲染月份标签
     */
    function renderMonthLabels(dates) {
      const monthLabels = generateMonthLabels(dates);
      
      monthLabels.forEach(label => {
        const span = document.createElement('span');
        span.textContent = label.month;
        span.style.gridColumn = `${label.weekIndex + 1} / span 4`;
        monthsContainer.appendChild(span);
      });
    }

    /**
     * 渲染热力图
     */
    function renderHeatmap() {
      const dates = generateDates();
      const postCounts = countPostsByDate();
      
      // 清空容器
      daysContainer.innerHTML = '';
      monthsContainer.innerHTML = '';
      
      // 渲染月份标签
      renderMonthLabels(dates);
      
      // 渲染日期格子
      dates.forEach(date => {
        const dateKey = formatDate(date);
        const data = postCounts[dateKey] || { count: 0, titles: [] };
        const level = getLevel(data.count);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'heatmap-day';
        dayElement.dataset.date = dateKey;
        dayElement.dataset.level = level;
        dayElement.dataset.count = data.count;
        
        // 添加悬停事件
        dayElement.addEventListener('mouseenter', (e) => {
          showTooltip(e, date, data);
        });
        
        dayElement.addEventListener('mouseleave', () => {
          hideTooltip();
        });
        
        daysContainer.appendChild(dayElement);
      });
      
      console.log('[Heatmap] 已渲染热力图，共', window.postHeatmapData?.allPosts?.length || 0, '篇文章');
    }

    /**
     * 显示 Tooltip
     */
    function showTooltip(event, date, data) {
      const dateStr = formatDisplayDate(date);
      const count = data.count;
      
      let content = `<div><strong>${dateStr}</strong></div>`;
      
      if (count === 0) {
        content += '<div>没有发布文章</div>';
      } else {
        content += `<div>发布了 ${count} 篇文章</div>`;
        if (data.titles.length > 0) {
          content += '<div style="margin-top: 4px; max-width: 200px;">';
          data.titles.slice(0, 3).forEach(title => {
            content += `<div style="margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">• ${title}</div>`;
          });
          if (data.titles.length > 3) {
            content += `<div style="margin-top: 2px;">...</div>`;
          }
          content += '</div>';
        }
      }
      
      tooltip.innerHTML = content;
      
      // 先显示 tooltip 以获取其尺寸
      tooltip.style.opacity = '0';
      tooltip.style.display = 'block';
      
      // 获取元素位置（相对于视口）
      const dayRect = event.target.getBoundingClientRect();
      
      // 获取热力图容器位置（相对于视口）
      const containerRect = heatmapContainer.getBoundingClientRect();
      
      // 获取 tooltip 尺寸
      const tooltipRect = tooltip.getBoundingClientRect();
      
      // 计算相对于容器的位置
      let left = dayRect.left - containerRect.left + dayRect.width / 2 - tooltipRect.width / 2;
      let top = dayRect.top - containerRect.top - tooltipRect.height - 8;
      
      // 如果上方空间不足，显示在下方
      if (dayRect.top - containerRect.top < tooltipRect.height + 20) {
        top = dayRect.bottom - containerRect.top + 8;
      }
      
      // 防止左右超出容器
      const padding = 10;
      if (left < padding) {
        left = padding;
      }
      const containerWidth = containerRect.width;
      if (left + tooltipRect.width > containerWidth - padding) {
        left = containerWidth - tooltipRect.width - padding;
      }
      
      // 应用位置
      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';
      tooltip.style.opacity = '';
      tooltip.style.display = '';
      tooltip.classList.add('show');
    }

    /**
     * 隐藏 Tooltip
     */
    function hideTooltip() {
      tooltip.classList.remove('show');
    }

    // 渲染热力图
    renderHeatmap();
  }

  // ==================== 返回顶部 ====================
  function initBackToTop() {
    const backToTop = document.querySelector('.jyf-fhdb');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // ==================== 图片灯箱 ====================
  function initLightGallery() {
    if (typeof lightGallery === 'undefined') return;
    
    // 为文章内容中的图片添加灯箱
    const contentImages = document.querySelectorAll('.post-content img');
    if (contentImages.length === 0) return;
    
    // 创建灯箱容器
    const galleryContainer = document.createElement('div');
    galleryContainer.id = 'lightgallery';
    galleryContainer.style.display = 'none';
    
    contentImages.forEach(img => {
      // 为每个图片添加点击事件
      img.style.cursor = 'pointer';
      img.addEventListener('click', function() {
        // 清空容器
        galleryContainer.innerHTML = '';
        
        // 添加所有图片
        contentImages.forEach(image => {
          const a = document.createElement('a');
          a.href = image.src;
          a.dataset.src = image.src;
          if (image.alt) {
            a.dataset.subHtml = `<h4>${image.alt}</h4>`;
          }
          galleryContainer.appendChild(a);
        });
        
        // 添加到body
        if (!document.getElementById('lightgallery')) {
          document.body.appendChild(galleryContainer);
        }
        
        // 初始化灯箱并打开到当前图片（不显示缩略图）
        const gallery = lightGallery(galleryContainer, {
          plugins: [lgZoom],
          speed: 500,
          thumbnail: false,
          zoomFromOrigin: false,
          allowMediaOverlap: true
        });
        
        // 找到当前图片的索引并打开
        const index = Array.from(contentImages).indexOf(img);
        gallery.openGallery(index);
      });
    });
  }

  // ==================== 代码高亮 ====================
  function initHighlight() {
    // highlight.js 已在 layout.html 中初始化
    // 这里不需要再次初始化
  }

  // ==================== 友链随机切换 ====================
  function initFriendLinks() {
    const container = document.getElementById('friend-links-container');
    if (!container || !window.allFriendLinks || window.allFriendLinks.length === 0) {
      return;
    }
    
    // 随机选择5个友链
    function getRandomLinks() {
      const links = [...window.allFriendLinks];
      const selected = [];
      const count = Math.min(5, links.length);
      
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * links.length);
        selected.push(links[randomIndex]);
        links.splice(randomIndex, 1);
      }
      
      return selected;
    }
    
    // 渲染友链
    function renderLinks() {
      const links = getRandomLinks();
      const html = links.map((link, index) => {
        const separator = index < links.length - 1 ? ' · ' : '';
        return `<a href="${link.url}" target="_blank" rel="noopener">${link.name}</a>${separator}`;
      }).join('');
      
      container.innerHTML = html;
    }
    
    // 初始渲染
    renderLinks();
    
    // 每5秒切换一次
    setInterval(renderLinks, 5000);
  }

  // ==================== 移动端菜单 ====================
  function initMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navCenter = document.querySelector('.nav-center');
    
    if (!menuToggle || !navCenter) return;
    
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navCenter.classList.toggle('active');
      
      // 防止背景滚动，添加body类
      if (navCenter.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
        document.body.classList.add('menu-open');
      } else {
        document.body.style.overflow = '';
        document.body.classList.remove('menu-open');
      }
    });
    
    // 点击菜单项后关闭菜单（排除有子菜单的项）
    const navLinks = navCenter.querySelectorAll('a');
    navLinks.forEach(link => {
      // 检查是否是有子菜单的父链接
      const parentItem = link.closest('.nav-item.has-dropdown');
      const isParentLink = parentItem && link.classList.contains('nav-link');
      
      // 如果不是父链接，点击后关闭菜单
      if (!isParentLink) {
        link.addEventListener('click', () => {
          menuToggle.classList.remove('active');
          navCenter.classList.remove('active');
          document.body.style.overflow = '';
          document.body.classList.remove('menu-open');
        });
      }
    });
    
    // 点击菜单外部关闭
    navCenter.addEventListener('click', (e) => {
      if (e.target === navCenter) {
        menuToggle.classList.remove('active');
        navCenter.classList.remove('active');
        document.body.style.overflow = '';
        document.body.classList.remove('menu-open');
      }
    });
  }
  
  // ==================== 下拉菜单 ====================
  function initDropdownMenu() {
    // 移动端：点击展开/收起下拉菜单
    if (window.innerWidth <= 768) {
      const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');
      
      dropdownItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        
        if (link) {
          link.addEventListener('click', (e) => {
            // 如果有子菜单，阻止默认跳转，改为展开/收起
            e.preventDefault();
            item.classList.toggle('active');
          });
        }
      });
    }
  }

  // ==================== 搜索功能占位 ====================
  function initSearch() {
    // 搜索功能由插件提供，这里只是占位
  }

  // ==================== 文章目录 ====================
  function initPostTOC() {
    const tocContainer = document.getElementById('post-toc');
    const postContent = document.querySelector('.post-content');
    
    console.log('[TOC] 初始化文章目录');
    console.log('[TOC] tocContainer:', tocContainer);
    console.log('[TOC] postContent:', postContent);
    
    if (!tocContainer || !postContent) {
      console.log('[TOC] 目录容器或文章内容不存在，跳过初始化');
      return;
    }
    
    // 获取所有标题
    const headings = postContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
    console.log('[TOC] 找到标题数量:', headings.length);
    
    if (headings.length === 0) {
      console.log('[TOC] 文章没有标题，隐藏目录');
      // 如果没有标题，隐藏目录
      const tocWrapper = document.querySelector('.post-toc');
      if (tocWrapper) {
        tocWrapper.style.display = 'none';
      }
      return;
    }
    
    // 为每个标题添加 ID
    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }
    });
    
    // 生成目录结构
    function generateTOC() {
      const toc = [];
      let currentLevel = 0;
      let currentParent = toc;
      const stack = [{ level: 0, children: toc }];
      
      headings.forEach((heading) => {
        const level = parseInt(heading.tagName.substring(1));
        const item = {
          id: heading.id,
          text: heading.textContent,
          level: level,
          children: []
        };
        
        // 找到合适的父级
        while (stack.length > 0 && stack[stack.length - 1].level >= level) {
          stack.pop();
        }
        
        const parent = stack[stack.length - 1];
        parent.children.push(item);
        stack.push(item);
      });
      
      return toc;
    }
    
    // 渲染目录
    function renderTOC(items, container) {
      if (items.length === 0) return;
      
      const ul = document.createElement('ul');
      
      items.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${item.id}`;
        a.textContent = item.text;
        a.dataset.id = item.id;
        
        // 点击平滑滚动
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.getElementById(item.id);
          if (target) {
            const offset = 80; // 顶部偏移量
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
            
            // 更新 URL hash
            history.pushState(null, null, `#${item.id}`);
          }
        });
        
        li.appendChild(a);
        
        // 递归渲染子项
        if (item.children && item.children.length > 0) {
          renderTOC(item.children, li);
        }
        
        ul.appendChild(li);
      });
      
      container.appendChild(ul);
    }
    
    // 滚动高亮
    function highlightTOC() {
      const scrollTop = window.scrollY;
      const offset = 100;
      
      let activeHeading = null;
      
      // 找到当前可见的标题
      headings.forEach(heading => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= offset) {
          activeHeading = heading;
        }
      });
      
      // 移除所有 active 类
      const tocLinks = tocContainer.querySelectorAll('a');
      tocLinks.forEach(link => link.classList.remove('active'));
      
      // 添加 active 类到当前标题
      if (activeHeading) {
        const activeLink = tocContainer.querySelector(`a[data-id="${activeHeading.id}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    }
    
    // 生成并渲染目录
    const tocData = generateTOC();
    console.log('[TOC] 生成的目录数据:', tocData);
    renderTOC(tocData, tocContainer);
    console.log('[TOC] 目录渲染完成');
    
    // 监听滚动事件
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          highlightTOC();
          ticking = false;
        });
        ticking = true;
      }
    });
    
    // 初始高亮
    highlightTOC();
  }

  // ==================== 文章点赞功能 ====================
  function initPostUpvote() {
    // 支持两种点赞按钮：浮动按钮和内联按钮
    const upvoteBtns = document.querySelectorAll('.post-upvote-btn, .post-upvote-btn-inline');
    if (upvoteBtns.length === 0) return;
    
    upvoteBtns.forEach(upvoteBtn => {
      const postName = upvoteBtn.dataset.name;
      const countSpan = upvoteBtn.querySelector('.upvote-count');
      
      if (!postName) {
        console.error('[Upvote] 文章名称未找到');
        return;
      }
      
      // 检查是否已点赞
      const upvotedPosts = JSON.parse(localStorage.getItem('upvoted_posts') || '[]');
      if (upvotedPosts.includes(postName)) {
        upvoteBtn.classList.add('upvoted');
      }
      
      upvoteBtn.addEventListener('click', async () => {
        try {
          // 检查是否已经点赞
          const isUpvoted = upvoteBtn.classList.contains('upvoted');
          
          // 如果已经点赞，直接返回，不允许取消
          if (isUpvoted) {
            console.log('[Upvote] 已经点赞过了，不能取消');
            return;
          }
          
          // 调用 Halo API - 点赞
          const response = await fetch(`/apis/api.halo.run/v1alpha1/trackers/upvote`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              group: 'content.halo.run',
              plural: 'posts',
              name: postName
            })
          });
          
          if (response.ok) {
            // 获取最新的文章统计信息
            try {
              const statsResponse = await fetch(`/apis/api.console.halo.run/v1alpha1/posts/${postName}`);
              if (statsResponse.ok) {
                const postData = await statsResponse.json();
                const newUpvoteCount = postData.stats?.upvote || 0;
                
                // 更新所有相同文章的点赞按钮
                upvoteBtns.forEach(btn => {
                  if (btn.dataset.name === postName) {
                    // 标记为已点赞
                    btn.classList.add('upvoted');
                    
                    // 更新计数 - 使用最新的统计数据
                    const btnCountSpan = btn.querySelector('.upvote-count');
                    if (btnCountSpan) {
                      btnCountSpan.textContent = newUpvoteCount;
                    }
                  }
                });
                
                console.log('[Upvote] 点赞成功，最新点赞数:', newUpvoteCount);
              } else {
                // 如果获取统计信息失败，使用本地计算
                console.warn('[Upvote] 无法获取最新统计信息，使用本地计算');
                upvoteBtns.forEach(btn => {
                  if (btn.dataset.name === postName) {
                    btn.classList.add('upvoted');
                    
                    const btnCountSpan = btn.querySelector('.upvote-count');
                    if (btnCountSpan) {
                      const currentCount = parseInt(btnCountSpan.textContent) || 0;
                      btnCountSpan.textContent = currentCount + 1;
                    }
                  }
                });
              }
            } catch (statsError) {
              console.error('[Upvote] 获取统计信息失败:', statsError);
              // 使用本地计算作为后备方案
              upvoteBtns.forEach(btn => {
                if (btn.dataset.name === postName) {
                  btn.classList.add('upvoted');
                  
                  const btnCountSpan = btn.querySelector('.upvote-count');
                  if (btnCountSpan) {
                    const currentCount = parseInt(btnCountSpan.textContent) || 0;
                    btnCountSpan.textContent = currentCount + 1;
                  }
                }
              });
            }
            
            // 更新本地存储 - 添加到已点赞列表
            if (!upvotedPosts.includes(postName)) {
              upvotedPosts.push(postName);
            }
            localStorage.setItem('upvoted_posts', JSON.stringify(upvotedPosts));
          } else {
            console.error('[Upvote] API 响应错误:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('[Upvote] 错误详情:', errorText);
          }
        } catch (error) {
          console.error('[Upvote] 点赞失败:', error);
        }
      });
    });
    
    console.log('[Upvote] 点赞功能已初始化，按钮数量:', upvoteBtns.length);
  }

  // ==================== 图库功能 ====================
  function initPhotoGallery() {
    const waterfallContainer = document.getElementById('photo-waterfall');
    if (!waterfallContainer) return;
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    const photoItems = document.querySelectorAll('.photo-item');
    const noPhotos = document.querySelector('.no-photos');
    
    console.log('[Photos] 初始化图库功能');
    console.log('[Photos] 图片数量:', photoItems.length);
    
    // 分类筛选
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const targetGroup = this.dataset.group;
        
        // 更新按钮状态
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // 筛选图片
        let visibleCount = 0;
        photoItems.forEach(item => {
          const itemGroup = item.getAttribute('data-group');
          if (targetGroup === 'all' || itemGroup === targetGroup) {
            item.style.display = 'block';
            visibleCount++;
          } else {
            item.style.display = 'none';
          }
        });
        
        // 显示/隐藏空状态
        if (visibleCount === 0) {
          if (noPhotos) noPhotos.style.display = 'block';
          waterfallContainer.style.display = 'none';
        } else {
          if (noPhotos) noPhotos.style.display = 'none';
          waterfallContainer.style.display = 'block';
        }
        
        console.log('[Photos] 筛选分类:', targetGroup, '可见图片:', visibleCount);
      });
    });
    
    // 初始化灯箱
    if (typeof lightGallery !== 'undefined' && photoItems.length > 0) {
      console.log('[Photos] lightGallery 已加载');
      
      // 为每个图片添加点击事件
      photoItems.forEach((item) => {
        item.addEventListener('click', function(e) {
          e.preventDefault();
          
          // 获取当前可见的图片
          const visibleItems = Array.from(photoItems).filter(photo => {
            const display = window.getComputedStyle(photo).display;
            return display !== 'none';
          });
          
          console.log('[Photos] 可见图片数量:', visibleItems.length);
          
          // 创建临时容器
          const galleryContainer = document.createElement('div');
          galleryContainer.id = 'photo-lightgallery';
          galleryContainer.style.display = 'none';
          
          // 添加可见图片到容器
          visibleItems.forEach(photo => {
            const a = document.createElement('a');
            const imgSrc = photo.getAttribute('data-src');
            const subHtml = photo.getAttribute('data-sub-html') || '';
            
            a.href = imgSrc;
            a.setAttribute('data-src', imgSrc);
            if (subHtml) {
              a.setAttribute('data-sub-html', subHtml);
            }
            galleryContainer.appendChild(a);
          });
          
          // 移除旧容器
          const oldGallery = document.getElementById('photo-lightgallery');
          if (oldGallery) {
            oldGallery.remove();
          }
          
          // 添加到 body
          document.body.appendChild(galleryContainer);
          
          try {
            // 初始化灯箱（禁用缩略图）
            const gallery = lightGallery(galleryContainer, {
              plugins: [lgZoom],
              speed: 500,
              thumbnail: false,
              zoomFromOrigin: false,
              allowMediaOverlap: true,
              download: false,
              counter: true,
              loop: true,
              slideDelay: 400
            });
            
            // 找到当前图片在可见图片中的索引
            const currentIndex = visibleItems.indexOf(item);
            console.log('[Photos] 打开灯箱，索引:', currentIndex);
            
            // 监听关闭事件（在容器元素上监听）
            galleryContainer.addEventListener('lgAfterClose', function() {
              setTimeout(() => {
                if (gallery && gallery.destroy) {
                  gallery.destroy();
                }
                galleryContainer.remove();
              }, 100);
            });
            
            // 打开灯箱
            setTimeout(() => {
              gallery.openGallery(currentIndex);
            }, 50);
          } catch (error) {
            console.error('[Photos] 灯箱初始化失败:', error);
            galleryContainer.remove();
          }
        });
      });
      
      console.log('[Photos] 灯箱功能已初始化');
    } else {
      console.warn('[Photos] lightGallery 未加载或无图片');
    }
  }

  // ==================== 瞬间点赞功能 ====================
  function initMomentUpvote() {
    const upvoteBtns = document.querySelectorAll('.moment-upvote-btn');
    if (upvoteBtns.length === 0) return;
    
    console.log('[Moment Upvote] 初始化瞬间点赞功能');
    
    // 检查本地存储的点赞状态
    const upvotedMoments = JSON.parse(localStorage.getItem('upvoted_moments') || '[]');
    
    upvoteBtns.forEach(btn => {
      const momentName = btn.dataset.name;
      
      // 恢复点赞状态
      if (upvotedMoments.includes(momentName)) {
        btn.classList.add('upvoted');
      }
      
      btn.addEventListener('click', async function() {
        const isUpvoted = this.classList.contains('upvoted');
        const countSpan = this.querySelector('.upvote-count');
        
        try {
          // 调用 Halo API
          const response = await fetch(`/apis/api.halo.run/v1alpha1/trackers/upvote`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              group: 'moment.halo.run',
              plural: 'moments',
              name: momentName
            })
          });
          
          if (response.ok) {
            // 切换状态
            this.classList.toggle('upvoted');
            
            // 更新本地存储
            if (isUpvoted) {
              const index = upvotedMoments.indexOf(momentName);
              if (index > -1) {
                upvotedMoments.splice(index, 1);
              }
              // 减少计数
              const currentCount = parseInt(countSpan.textContent) || 0;
              countSpan.textContent = Math.max(0, currentCount - 1);
            } else {
              upvotedMoments.push(momentName);
              // 增加计数
              const currentCount = parseInt(countSpan.textContent) || 0;
              countSpan.textContent = currentCount + 1;
            }
            
            localStorage.setItem('upvoted_moments', JSON.stringify(upvotedMoments));
            
            console.log('[Moment Upvote] 点赞成功:', isUpvoted ? '取消' : '点赞');
          } else {
            console.error('[Moment Upvote] API 响应错误:', response.status);
          }
        } catch (error) {
          console.error('[Moment Upvote] 点赞失败:', error);
        }
      });
    });
    
    console.log('[Moment Upvote] 点赞功能已初始化，共', upvoteBtns.length, '个瞬间');
  }

  // ==================== 滚动进度条 ====================
  function initScrollProgress() {
    // 创建进度条元素
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    // 更新进度条
    function updateProgress() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      // 计算滚动百分比
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      
      // 更新进度条宽度
      progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    }
    
    // 监听滚动事件
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    });
    
    // 初始更新
    updateProgress();
    
    console.log('[ScrollProgress] 滚动进度条已初始化');
  }

  // ==================== 页面加载速度统计 ====================
  function initPageLoadTime() {
    window.addEventListener('load', () => {
      // 延迟一小段时间确保 loadEventEnd 已经有值
      setTimeout(() => {
        // 使用 Performance API 计算页面加载时间
        if (window.performance && window.performance.timing) {
          const timing = window.performance.timing;
          const loadTime = timing.loadEventEnd - timing.navigationStart;
          
          // 确保时间是正数
          if (loadTime > 0) {
            const loadTimeSeconds = (loadTime / 1000).toFixed(2);
            
            // 更新页面加载时间显示
            const loadTimeElement = document.getElementById('page-load-time');
            if (loadTimeElement) {
              loadTimeElement.textContent = loadTimeSeconds + 's';
            }
            
            console.log('[PageLoadTime] 页面加载时间:', loadTimeSeconds + 's');
          } else {
            console.warn('[PageLoadTime] 加载时间计算异常:', loadTime);
          }
        }
      }, 100);
    });
  }

  // ==================== 背景萤火虫效果 ====================
  function initFireflies() {
    // 从配置中获取萤火虫数量，默认0（关闭）
    const fireflyCount = parseInt(window.themeConfig?.fireflyCount) || 0;
    
    // 如果数量为0，则不启用萤火虫效果
    if (fireflyCount === 0) {
      console.log('[Fireflies] 萤火虫效果未启用');
      return;
    }
    
    // 创建萤火虫容器
    const container = document.createElement('div');
    container.className = 'firefly-container';
    document.body.appendChild(container);
    
    for (let i = 0; i < fireflyCount; i++) {
      const firefly = document.createElement('div');
      firefly.className = 'firefly';
      
      // 随机起始位置
      const startX = Math.random() * 100;
      const startY = 100 + Math.random() * 20; // 从底部稍微下方开始
      
      // 随机水平移动距离（-200px 到 200px）
      const moveX = (Math.random() - 0.5) * 400;
      
      firefly.style.left = startX + '%';
      firefly.style.top = startY + '%';
      firefly.style.setProperty('--firefly-x', moveX + 'px');
      
      container.appendChild(firefly);
    }
    
    console.log('[Fireflies] 背景萤火虫效果已初始化，数量:', fireflyCount);
  }

  // ==================== 初始化 ====================
  function init() {
    initTheme();
    toggleTheme();
    initSearch();
    initMobileMenu();
    initDropdownMenu();
    initBackToTop();
    initScrollProgress();
    initHeatmap();
    initLightGallery();
    initHighlight();
    initFriendLinks();
    initPostTOC();
    initPostUpvote();
    initPhotoGallery();
    initMomentUpvote();
    initPageLoadTime();
    initFireflies();
  }

  // 立即初始化页面加载动画（在页面开始加载时）
  // 根据配置选择加载动画类型
  const loadingType = window.themeConfig?.loadingAnimationType || 'progressbar';
  
  if (loadingType === 'progressbar') {
    // 顶部进度条
    initPageLoadingBar();
  } else if (loadingType === 'spinner') {
    // 居中圆环
    initPageLoadingOverlay();
  } else if (loadingType === 'center-progress') {
    // 居中进度条
    initPageLoadingCenter();
  }

  // 页面加载完成后初始化其他功能
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      initLazyLoad();
      initImageLoading();
    });
  } else {
    init();
    initLazyLoad();
    initImageLoading();
  }
})();