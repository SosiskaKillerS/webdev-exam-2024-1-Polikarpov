document.addEventListener('DOMContentLoaded', function() {
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');
    const totalWithDelivery = document.getElementById('totalWithDelivery');
    const deliveryCost = 5;
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function displayCartItems() {
        cartItems.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'Корзина пуста :-(';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.fontSize = '18px';
            cartItems.appendChild(emptyMessage);
        } else {
            cart.forEach(product => {
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
                button.textContent = 'Удалить';
                button.addEventListener('click', () => removeFromCart(product));

                productCard.appendChild(img);
                productCard.appendChild(title);
                productCard.appendChild(rating);
                productCard.appendChild(price);
                productCard.appendChild(button);

                cartItems.appendChild(productCard);

                total += product.discount_price !== null ? product.discount_price : product.actual_price;
            });
        }

        // Обновляем итоговую стоимость
        totalPrice.textContent = `Cтоимость товара: ${total} $`;
        totalWithDelivery.textContent = `Итоговая стоимость товара: ${total + deliveryCost} $`;
    }

    function removeFromCart(product) {
        cart = cart.filter(item => item.id !== product.id);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
    }

    function showNotification(message, type = 'success', redirectUrl = null) {
        const notificationArea = document.getElementById('notificationArea');
        const notifications = document.getElementById('notifications');
        const notification = document.createElement('div');
        notification.classList.add('notification', type);
        notification.textContent = message;

        if (redirectUrl) {
            const redirectButton = document.createElement('button');
            redirectButton.textContent = 'Перейти на главную страницу';
            redirectButton.addEventListener('click', () => {
                window.location.href = redirectUrl;
            });
            notification.appendChild(redirectButton);
        }

        notifications.appendChild(notification);

        notificationArea.classList.add('show');

        setTimeout(() => {
            notifications.removeChild(notification);
            if (notifications.children.length === 0) {
                notificationArea.classList.remove('show');
            }
        }, 5000);
    }

    function clearCart() {
        console.log('Clearing cart...');
        cart = [];
        localStorage.removeItem('cart');
        displayCartItems();
    }

    function clearForm(form) {
        console.log('Clearing form...');
        form.reset();
    }

    function handleOrderSubmit(event) {
        event.preventDefault();

        if (cart.length === 0) {
            showNotification('Корзина пуста. Заказ нельзя оформить.', 'error');
            return;
        }

        const form = event.target;
        const formData = new FormData(form);

        const orderData = {
            full_name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            subscribe: formData.get('newsletter') === 'on' ? 1 : 0,
            delivery_address: formData.get('address'),
            delivery_date: formData.get('delivery-date'),
            delivery_interval: formData.get('delivery-time'),
            comment: formData.get('comments'),
            good_ids: cart.map(product => product.id)
        };

        // Преобразование даты в формат "dd.mm.yyyy"
        const dateParts = orderData.delivery_date.split('-');
        orderData.delivery_date = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;

        // Преобразование временного интервала в формат "hh:mm-hh:mm"
        const timeMapping = {
            morning: '08:00-12:00',
            afternoon: '12:00-14:00',
            evening: '14:00-18:00',
            night: '18:00-22:00'
        };
        orderData.delivery_interval = timeMapping[orderData.delivery_interval];

        // Создаем заказ
        fetch('https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders?api_key=f8533eb0-259f-4ff3-92a5-0a88c32498d2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error();
            }
            return response.json();
        })
        .then(data => {
            console.log('Response data:', data); // Логирование ответа
            if (data.success) {
                showNotification('Заказ оформлен успешно!', 'success', 'page2.html');
                clearCart();
                clearForm(form);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    const orderForm = document.querySelector('.order-form form');
    orderForm.addEventListener('submit', handleOrderSubmit);

    displayCartItems();
});
