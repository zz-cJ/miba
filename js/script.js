document.addEventListener('DOMContentLoaded', function () {
    // 图片懒加载
    const lazyLoad = () => {
        const lazyImages = document.querySelectorAll('img[data-src]');
        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => {
                observer.observe(img);
            });
        } else {
            const lazyLoadThrottle = () => {
                requestAnimationFrame(() => {
                    lazyImages.forEach(img => {
                        if (img.getBoundingClientRect().top <= window.innerHeight && img.getBoundingClientRect().bottom >= 0) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                    });
                });
            };

            window.addEventListener('scroll', lazyLoadThrottle);
            window.addEventListener('resize', lazyLoadThrottle);
            lazyLoadThrottle();
        }
    };

    // 初始化懒加载
    lazyLoad();

    // 搜索功能
    const debounce = (fn, delay) => {
        let timer = null;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(this, args);
            }, delay);
        };
    };

    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('input', debounce((e) => {
        const keyword = e.target.value.trim().toLowerCase();
        const allCards = document.querySelectorAll('.photo-card');
        allCards.forEach(card => {
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const photographer = card.querySelector('p')?.textContent.toLowerCase() || '';
            const altText = card.querySelector('img')?.alt.toLowerCase() || '';
            const combinedText = `${title} ${photographer} ${altText}`;
            card.style.display = combinedText.includes(keyword) ? 'block' : 'none';
        });
    }, 200));

    // 窗口调整时保持图片比例
    window.addEventListener('resize', () => {
        requestAnimationFrame(() => {
            document.querySelectorAll('.photo-card').forEach(card => {
                if (card.classList.contains('photography-card')) {
                    card.style.height = card.offsetWidth * 0.75 + 'px';
                } else if (card.classList.contains('coser-card')) {
                    card.style.height = card.offsetWidth * 1.333 + 'px';
                }
            });
        });
    });
});


// 监听输入框输入事件
document.getElementById('search-input').addEventListener('input', function () {
    searchContent();
});

function searchContent() {
    var searchTerm = document.getElementById('search-input').value.toLowerCase();
    var tables = document.getElementsByTagName('table');
    for (var i = 0; i < tables.length; i++) {
        var table = tables[i];
        var rows = table.getElementsByTagName('tr');
        for (var j = 1; j < rows.length; j++) { // 从第 1 行开始，跳过表头
            var row = rows[j];
            var cells = row.getElementsByTagName('td');
            var hasMatch = false;
            for (var k = 0; k < cells.length; k++) {
                var cell = cells[k];
                var originalText = cell.textContent;
                var newText = originalText;
                if (searchTerm) {
                    var pattern = new RegExp(searchTerm, 'gi');
                    newText = originalText.replace(pattern, function (match) {
                        return '<span class="highlight">' + match + '</span>';
                    });
                    cell.innerHTML = newText;
                } else {
                    cell.textContent = originalText;
                }
                if (originalText.toLowerCase().includes(searchTerm)) {
                    hasMatch = true;
                }
            }
            if (hasMatch) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    }
}