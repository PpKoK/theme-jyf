// Jyf Theme - Main JavaScript

(function() {
  'use strict';

  // ==================== 暗夜模式 ====================
  function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.body.setAttribute('data-color-scheme', savedTheme);
  }

  function toggleTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      document.body.setAttribute('data-color-scheme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
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
    const backToTop = document.querySelector('.back-to-top');
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
        
        // 初始化灯箱并打开到当前图片
        const gallery = lightGallery(galleryContainer, {
          plugins: [lgZoom, lgThumbnail],
          speed: 500,
          thumbnail: true,
          animateThumb: true,
          zoomFromOrigin: false,
          allowMediaOverlap: true,
          toggleThumb: true
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

  // ==================== 初始化 ====================
  function init() {
    initTheme();
    toggleTheme();
    initSearch();
    initMobileMenu();
    initDropdownMenu();
    initBackToTop();
    initHeatmap();
    initLightGallery();
    initHighlight();
    initFriendLinks();
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();