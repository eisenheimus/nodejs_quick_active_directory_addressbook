// Динамически устанавливаем top для thead
const stickyTop = document.querySelector('.sticky-top');
const thead = document.querySelector('thead');
if (stickyTop && thead) {
    const updateTheadTop = () => {
        thead.style.top = stickyTop.offsetHeight + 'px';
    };
    updateTheadTop();
    window.addEventListener('resize', updateTheadTop);
}

// Сортировка таблицы
const table = document.getElementById('addressTable');
const headers = table.querySelectorAll('th[data-sort="text"]');
let currentSort = { column: null, direction: 'asc' };

headers.forEach((header, index) => {
    header.addEventListener('click', () => {
        const colIndex = index + 1; // +1 первый столбец - аватар
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr:not(#noResults)'));

        // Определяем направление сортировки
        let direction = 'asc';
        if (currentSort.column === colIndex && currentSort.direction === 'asc') {
            direction = 'desc';
        }
        currentSort = { column: colIndex, direction };

        // Сортируем строки
        rows.sort((a, b) => {
            const aText = a.cells[colIndex]?.textContent.trim().toLowerCase() || '';
            const bText = b.cells[colIndex]?.textContent.trim().toLowerCase() || '';

            if (aText < bText) return direction === 'asc' ? -1 : 1;
            if (aText > bText) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        // Перестраиваем таблицу
        rows.forEach(row => tbody.appendChild(row));

        // Обновляем иконки
        headers.forEach(h => {
            h.classList.remove('sorted');
            h.querySelector('.sort-icon').textContent = '⇅';
        });
        header.classList.add('sorted');
        header.querySelector('.sort-icon').textContent = direction === 'asc' ? '↑' : '↓';
    });
});

document.getElementById('searchInput').addEventListener('input', function () {
    const filter = this.value.toLowerCase().trim();
    const table = document.getElementById('addressTable');
    const rows = table.querySelectorAll('tbody tr');
    let visibleCount = 0;

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (filter === '' || text.includes(filter)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });

    // Показываем сообщение если ничего не найдено
    let noResults = document.getElementById('noResults');
    if (visibleCount === 0 && filter !== '') {
        if (!noResults) {
            noResults = document.createElement('tr');
            noResults.id = 'noResults';
            noResults.innerHTML = '<td colspan="7" class="no-results">Ничего не найдено</td>';
            table.querySelector('tbody').appendChild(noResults);
        }
        noResults.style.display = '';
    } else if (noResults) {
        noResults.style.display = 'none';
    }
});
