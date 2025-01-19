document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'f8533eb0-259f-4ff3-92a5-0a88c32498d2';
    const apiUrl = `https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders?api_key=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const ordersTableBody = document.getElementById('ordersTableBody');
            data.forEach(order => {
                const row = document.createElement('tr');

                const idCell = document.createElement('td');
                idCell.textContent = order.id;
                row.appendChild(idCell);

                const createdAtCell = document.createElement('td');
                createdAtCell.textContent = new Date(order.created_at).toLocaleString();
                row.appendChild(createdAtCell);

                const goodsCell = document.createElement('td');
                goodsCell.textContent = order.good_ids.join(', ');
                row.appendChild(goodsCell);

                const totalCostCell = document.createElement('td');
                // Предположим, что стоимость каждого товара равна его идентификатору (для примера)
                const totalCost = order.good_ids.reduce((sum, goodId) => sum + goodId, 0);
                totalCostCell.textContent = totalCost;
                row.appendChild(totalCostCell);

                const deliveryCell = document.createElement('td');
                deliveryCell.textContent = `${order.delivery_date} ${order.delivery_interval}`;
                row.appendChild(deliveryCell);

                const actionsCell = document.createElement('td');

                const viewButton = document.createElement('button');
                viewButton.classList.add('view-button'); // Добавляем класс для стилизации кнопки

                const viewIcon = document.createElement('i');
                viewIcon.classList.add('fas', 'fa-eye');
                viewButton.appendChild(viewIcon);

                viewButton.addEventListener('click', () => {
                    openViewModal(order);
                });
                actionsCell.appendChild(viewButton);

                const editButton = document.createElement('button');
                editButton.classList.add('edit-button'); // Добавляем класс для стилизации кнопки

                const editIcon = document.createElement('i');
                editIcon.classList.add('fas', 'fa-edit');
                editButton.appendChild(editIcon);

                editButton.addEventListener('click', () => {
                    openEditModal(order);
                });
                actionsCell.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-button'); // Добавляем класс для стилизации кнопки

                const deleteIcon = document.createElement('i');
                deleteIcon.classList.add('fas', 'fa-trash');
                deleteButton.appendChild(deleteIcon);

                deleteButton.addEventListener('click', () => {
                    deleteOrder(order.id);
                });
                actionsCell.appendChild(deleteButton);
                row.appendChild(actionsCell);

                ordersTableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Ошибка при получении данных:', error);
        });

    function deleteOrder(orderId) {
        const deleteUrl = `https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders/${orderId}?api_key=${apiKey}`;
        fetch(deleteUrl, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            console.log('Заказ удален:', data);
            // Обновить таблицу после удаления заказа
            location.reload();
        })
        .catch(error => {
            console.error('Ошибка при удалении заказа:', error);
        });
    }

    function openEditModal(order) {
        const modal = document.getElementById('editOrderModal');
        const createdAt = document.getElementById('createdAt');
        const editFullName = document.getElementById('editFullName');
        const editPhone = document.getElementById('editPhone');
        const editEmail = document.getElementById('editEmail');
        const editDeliveryAddress = document.getElementById('editDeliveryAddress');
        const editDeliveryDate = document.getElementById('editDeliveryDate');
        const editDeliveryInterval = document.getElementById('editDeliveryInterval');
        const totalCost = document.getElementById('totalCost');

        createdAt.value = new Date(order.created_at).toLocaleString();
        editFullName.value = order.full_name;
        editPhone.value = order.phone;
        editEmail.value = order.email;
        editDeliveryAddress.value = order.delivery_address;
        editDeliveryDate.value = order.delivery_date;
        editDeliveryInterval.value = order.delivery_interval;
        totalCost.value = order.good_ids.reduce((sum, goodId) => sum + goodId, 0);

        modal.style.display = 'block';

        const closeButton = document.getElementById('closeEditModal');
        closeButton.onclick = function() {
            modal.style.display = 'none';
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }

        const editOrderForm = document.getElementById('editOrderForm');
        editOrderForm.onsubmit = function(event) {
            event.preventDefault();
            const updatedOrder = {
                full_name: editFullName.value,
                phone: editPhone.value,
                email: editEmail.value,
                delivery_address: editDeliveryAddress.value,
                delivery_date: editDeliveryDate.value,
                delivery_interval: editDeliveryInterval.value
            };
            updateOrder(order.id, updatedOrder);
            modal.style.display = 'none';
        }
    }

    function openViewModal(order) {
        const modal = document.getElementById('viewOrderModal');
        const viewCreatedAt = document.getElementById('viewCreatedAt');
        const viewFullName = document.getElementById('viewFullName');
        const viewPhone = document.getElementById('viewPhone');
        const viewEmail = document.getElementById('viewEmail');
        const viewDeliveryAddress = document.getElementById('viewDeliveryAddress');
        const viewDeliveryDate = document.getElementById('viewDeliveryDate');
        const viewDeliveryInterval = document.getElementById('viewDeliveryInterval');
        const viewTotalCost = document.getElementById('viewTotalCost');

        viewCreatedAt.value = new Date(order.created_at).toLocaleString();
        viewFullName.value = order.full_name;
        viewPhone.value = order.phone;
        viewEmail.value = order.email;
        viewDeliveryAddress.value = order.delivery_address;
        viewDeliveryDate.value = order.delivery_date;
        viewDeliveryInterval.value = order.delivery_interval;
        viewTotalCost.value = order.good_ids.reduce((sum, goodId) => sum + goodId, 0);

        modal.style.display = 'block';

        const closeButton = document.getElementById('closeViewModal');
        closeButton.onclick = function() {
            modal.style.display = 'none';
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }
    }

    function updateOrder(orderId, updatedOrder) {
        const updateUrl = `https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders/${orderId}?api_key=${apiKey}`;
        fetch(updateUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedOrder)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Заказ обновлен:', data);
            // Обновить таблицу после обновления заказа
            location.reload();
        })
        .catch(error => {
            console.error('Ошибка при обновлении заказа:', error);
        });
    }
});
