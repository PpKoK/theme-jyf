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

    themeToggle.addEventListener('click', (e) => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      // 创建扩散动画
      createThemeTransition(e, newTheme);
    });
  }

  // 创建主题切换的扩散动画（使用 clip-path）
  function createThemeTransition(event, newTheme) {
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
    
    if (newTheme === 'dark') {
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
        document.documentElement.setAttribute('data-theme', newTheme);
        document.body.setAttribute('data-color-scheme', newTheme);
        localStorage.setItem('theme', newTheme);
      }, 400);
      
    } else {
      // 切换到亮色：暗色圆形从整个屏幕缩小回来
      mask.style.clipPath = `circle(${maxDistance * 1.5}px at ${x}px ${y}px)`;
      
      // 立即切换主题
      document.documentElement.setAttribute('data-theme', newTheme);
      document.body.setAttribute('data-color-scheme', newTheme);
      localStorage.setItem('theme', newTheme);
      
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
          const isUpvoted = upvoteBtn.classList.contains('upvoted');
          
          // 调用 Halo API - 使用正确的端点
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
            // 切换所有相同文章的点赞按钮状态
            upvoteBtns.forEach(btn => {
              if (btn.dataset.name === postName) {
                btn.classList.toggle('upvoted');
                const btnCountSpan = btn.querySelector('.upvote-count');
                if (btnCountSpan) {
                  if (isUpvoted) {
                    const currentCount = parseInt(btnCountSpan.textContent) || 0;
                    btnCountSpan.textContent = Math.max(0, currentCount - 1);
                  } else {
                    const currentCount = parseInt(btnCountSpan.textContent) || 0;
                    btnCountSpan.textContent = currentCount + 1;
                  }
                }
              }
            });
            
            // 更新本地存储
            if (isUpvoted) {
              const index = upvotedPosts.indexOf(postName);
              if (index > -1) {
                upvotedPosts.splice(index, 1);
              }
            } else {
              upvotedPosts.push(postName);
            }
            
            localStorage.setItem('upvoted_posts', JSON.stringify(upvotedPosts));
            
            console.log('[Upvote] 点赞成功:', isUpvoted ? '取消' : '点赞');
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
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();