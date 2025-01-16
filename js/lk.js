document.addEventListener('DOMContentLoaded', function() {
    function loadOrders() {
        fetch('https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders?api_key=f8533eb0-259f-4ff3-92a5-0a88c32498d2')
        .then(response => response.json())
        .then(data => {
            const ordersTableBody = document.querySelector('.orders tbody');
            ordersTableBody.innerHTML = '';

            data.orders.forEach((order, index) => {
                const row = document.createElement('tr');

                const orderNumber = document.createElement('td');
                orderNumber.textContent = index + 1;

                const orderDate = document.createElement('td');
                orderDate.textContent = new Date(order.created_at).toLocaleString();

                const orderItems = document.createElement('td');
                orderItems.textContent = order.products.map(product => product.name).join(', ');

                const orderTotal = document.createElement('td');
                orderTotal.textContent = `$${order.total_price}`;

                const orderDelivery = document.createElement('td');
                orderDelivery.textContent = `${new Date(order.delivery_date).toLocaleDateString()} ${order.delivery_time}`;

                const orderActions = document.createElement('td');
                orderActions.innerHTML = `
                    <a href="#" class="icon-link"><i class="fas fa-eye"></i></a>
                    <a href="#" class="icon-link"><i class="fas fa-edit"></i></a>
                    <a href="#" class="icon-link"><i class="fas fa-trash"></i></a>
                `;

                row.appendChild(orderNumber);
                row.appendChild(orderDate);
                row.appendChild(orderItems);
                row.appendChild(orderTotal);
                row.appendChild(orderDelivery);
                row.appendChild(orderActions);

                ordersTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    loadOrders();
});
