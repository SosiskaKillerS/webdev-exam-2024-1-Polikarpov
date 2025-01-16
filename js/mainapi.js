document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/goods?api_key=f8533eb0-259f-4ff3-92a5-0a88c32498d2';
    const productGrid = document.getElementById('productGrid');
    const loadMoreButton = document.getElementById('loadMoreButton');
    const applyButton = document.getElementById('apply-button');
    const sortOrderSelect = document.getElementById('sortOrder');
    const searchForm = document.querySelector('header form');
    const searchInput = document.querySelector('header form input[type="text"]');
    const notificationArea = document.getElementById('notificationArea');
    const notifications = document.getElementById('notifications');
    let allProducts = [];
    let filteredProducts = [];
    let currentIndex = 0;
    const itemsPerPage = 14;
    let cart = [];

    function displayProducts(startIndex, endIndex) {
        for (let i = startIndex; i < endIndex && i < filteredProducts.length; i++) {
            const product = filteredProducts[i];
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            const img = document.createElement('img');
            img.src = product.image_url;
            img.alt = product.name;

            const title = document.createElement('h3');
            title.textContent = product.name;

            const rating = document.createElement('div');
            rating.classList.add('rating');
            rating.innerHTML = `Рейтинг: ${product.rating} <span class="stars">${'★'.repeat(Math.round(product.rating))}</span>`;

            const price = document.createElement('div');
            price.classList.add('price');
            if (product.discount_price !== null) {
                const originalPrice = document.createElement('span');
                originalPrice.classList.add('original-price');
                originalPrice.textContent = `$${product.actual_price}`;

                const discountPrice = document.createElement('span');
                discountPrice.classList.add('discount');
                discountPrice.textContent = `$${product.discount_price}`;

                const discountPercent = document.createElement('span');
                discountPercent.classList.add('discount-percent');
                discountPercent.textContent = `(-${Math.round(((product.actual_price - product.discount_price) / product.actual_price) * 100)}%)`;

                price.appendChild(originalPrice);
                price.appendChild(discountPrice);
                price.appendChild(discountPercent);
            } else {
                price.textContent = `$${product.actual_price}`;
            }

            const button = document.createElement('button');
            button.textContent = 'Купить';
            button.addEventListener('click', () => addToCart(product));

            productCard.appendChild(img);
            productCard.appendChild(title);
            productCard.appendChild(rating);
            productCard.appendChild(price);
            productCard.appendChild(button);

            productGrid.appendChild(productCard);
        }

        if (endIndex >= filteredProducts.length) {
            loadMoreButton.style.display = 'none'; // Скрыть кнопку, если больше нет товаров
        } else {
            loadMoreButton.style.display = 'block'; // Показать кнопку, если есть еще товары
        }
    }

    function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `${message} <button class="close-button">×</button>`;

    const closeButton = notification.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        notification.remove();
        if (notifications.children.length === 0) {
            notificationArea.classList.remove('show');
        }
    });

    notifications.appendChild(notification);
    notificationArea.classList.add('show');
}


    function addToCart(product) {
        // Загрузите текущий список товаров из localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
        // Проверьте, есть ли уже такой товар в корзине
        const existingProduct = cart.find(item => item.id === product.id);
    
        if (existingProduct) {
            // Если товар уже в корзине, покажите уведомление
            showNotification(`${product.name} уже добавлен в корзину`);
        } else {
            // Если товара нет в корзине, добавьте его
            cart.push(product);
            // Сохраните обновленный список товаров в localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            // Покажите уведомление
            showNotification(`${product.name} добавлен в корзину`);
        }
    }
    


    function applyFilters() {
        const minPrice = document.getElementById('min-price').value;
        const maxPrice = document.getElementById('max-price').value;
        const discountOnly = document.getElementById('discount').checked;
        const categories = Array.from(document.querySelectorAll('.filter-section input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
        const sortOrder = sortOrderSelect.value;
        const searchQuery = searchInput.value.toLowerCase();

        console.log('Applying filters:', { minPrice, maxPrice, discountOnly, categories, sortOrder, searchQuery });

        filteredProducts = allProducts.filter(product => {
            const price = product.discount_price !== null ? product.discount_price : product.actual_price;
            const priceCondition = (!minPrice || price >= minPrice) && (!maxPrice || price <= maxPrice);
            const discountCondition = !discountOnly || (product.discount_price !== null);
            const categoryCondition = categories.length === 0 || categories.includes(product.sub_category);
            const searchCondition = !searchQuery || product.name.toLowerCase().includes(searchQuery);
            return priceCondition && discountCondition && categoryCondition && searchCondition;
        });

        // Apply sorting
        if (sortOrder === 'price_asc') {
            filteredProducts.sort((a, b) => {
                const priceA = a.discount_price !== null ? a.discount_price : a.actual_price;
                const priceB = b.discount_price !== null ? b.discount_price : b.actual_price;
                return priceA - priceB;
            });
        } else if (sortOrder === 'price_desc') {
            filteredProducts.sort((a, b) => {
                const priceA = a.discount_price !== null ? a.discount_price : a.actual_price;
                const priceB = b.discount_price !== null ? b.discount_price : b.actual_price;
                return priceB - priceA;
            });
        } else if (sortOrder === 'rating_asc') {
            filteredProducts.sort((a, b) => a.rating - b.rating);
        } else if (sortOrder === 'rating_desc') {
            filteredProducts.sort((a, b) => b.rating - a.rating);
        }

        console.log('Filtered products:', filteredProducts);

        currentIndex = 0;
        productGrid.innerHTML = ''; // Очистить текущие товары перед отображением новых
        displayProducts(currentIndex, currentIndex + itemsPerPage);
    }

    applyButton.addEventListener('click', applyFilters);
    sortOrderSelect.addEventListener('change', applyFilters);
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Предотвращаем отправку формы
        applyFilters();
    });

    loadMoreButton.addEventListener('click', function() {
        currentIndex += itemsPerPage;
        displayProducts(currentIndex, currentIndex + itemsPerPage);
    });

    // Initial load
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            allProducts = data;
            filteredProducts = data;
            displayProducts(currentIndex, currentIndex + itemsPerPage);
        })
        .catch(error => console.error('Error fetching data:', error));
});
