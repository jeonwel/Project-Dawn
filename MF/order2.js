// JavaScript to toggle the sidebar
const eatIcon = document.querySelector('.eat-icon');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.querySelector('.sidebar-close');
const orderList = document.querySelector('.list-items');
const totalAmount = document.querySelector('.order-total');
const checkoutButton = document.querySelector('.checkout-btn');
const addButton = document.querySelector('.add-btn');
let total = 0;
let orders = {}; // Store orders with quantities

// Show sidebar when the eat icon is clicked
eatIcon.addEventListener('click', () => {
    sidebar.classList.add('show'); // Show the sidebar
});

// Show sidebar when addButton is clicked
addButton.addEventListener('click', () => {
    sidebar.classList.add('show'); // Show the sidebar
});

// Hide sidebar when the close button is clicked
sidebarClose.addEventListener('click', () => {
    sidebar.classList.remove('show'); // Hide the sidebar
});

// Add order functionality using the plus icon
document.querySelectorAll('.add-btn').forEach(icon => {
    icon.addEventListener('click', () => {
        const itemName = icon.getAttribute('data-name');
        const itemPrice = parseFloat(icon.getAttribute('data-price'));

        if (isNaN(itemPrice)) return; // Prevent adding if price is not valid

        // Check if the item already exists in the order
        if (orders[itemName]) {
            orders[itemName].quantity += 1; // Increase quantity
        } else {
            // Create a new order item
            orders[itemName] = { price: itemPrice, quantity: 1 };
        }

        // Update the order list and total amount
        updateOrderList();
    });
});

// Update the order list in the DOM
function updateOrderList() {
    orderList.innerHTML = ''; // Clear the current order list
    let hasOrders = false;

    for (const itemName in orders) {
        const orderItem = document.createElement('div');
        orderItem.classList.add('order-item');

        const itemText = document.createElement('span');
        itemText.classList.add('item-name');
        itemText.innerHTML = `${itemName}<br> - ₱ ${orders[itemName].price.toFixed(2)}`;
        itemText.style.fontSize = '16px'; 
        itemText.style.fontWeight = 'bold';

        const quantityControl = document.createElement('div');
        quantityControl.classList.add('quantity-control');

        const minusBtn = document.createElement('button');
        minusBtn.textContent = '-';
        minusBtn.classList.add('quantity-btn', 'minus-btn');
        minusBtn.addEventListener('click', () => updateQuantity(itemName, -1));

        const quantityDisplay = document.createElement('span');
        quantityDisplay.textContent = orders[itemName].quantity; // Displays the quantity
        quantityDisplay.classList.add('quantity-display');

        const plusBtn = document.createElement('button');
        plusBtn.textContent = '+';
        plusBtn.classList.add('quantity-btn', 'plus-btn');
        plusBtn.addEventListener('click', () => updateQuantity(itemName, 1));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => removeOrderItem(itemName));

        quantityControl.appendChild(minusBtn);
        quantityControl.appendChild(quantityDisplay);
        quantityControl.appendChild(plusBtn);

        orderItem.appendChild(itemText);
        orderItem.appendChild(quantityControl);
        orderItem.appendChild(deleteBtn);

        orderList.appendChild(orderItem);
        hasOrders = true;
    }

    // Update total amount
    total = Object.values(orders).reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalAmount.textContent = `Php ${total.toFixed(2)}`;

    // Show the sidebar if there are orders
    if (hasOrders) {
        sidebar.classList.add('show');
    } else {
        sidebar.classList.remove('show');
    }
}

// Update the quantity of an item, and remove if quantity hits 0
function updateQuantity(itemName, change) {
    if (orders[itemName]) {
        orders[itemName].quantity += change;

        if (orders[itemName].quantity <= 0) {
            removeOrderItem(itemName);
        } else {
            updateOrderList();
        }
    }
}

// Remove an order item from the list and update total
function removeOrderItem(itemName) {
    delete orders[itemName]; // Remove from the orders object
    updateOrderList(); // Update the displayed order list
}

// Checkout functionality
checkoutButton.addEventListener('click', () => {
    if (total > 0) {
        // Get the selected dine option and payment option
        const dineOption = document.querySelector('select[name="dine-option"]').value;
        const paymentOption = document.querySelector('select[name="pay-option"]').value;

        // Retrieve the last orderId from localStorage, or start from 0 if not available
        let lastOrderId = parseInt(localStorage.getItem('lastOrderId')) || 0;

        // Increment the orderId
        lastOrderId++;

        // Store the updated orderId back into localStorage for the next order
        localStorage.setItem('lastOrderId', lastOrderId.toString());

        const orderSummary = {
            orderId: lastOrderId,  // Order ID
            dineOption: dineOption,
            paymentOption: paymentOption,
            total: total,
            orders: orders  // The user's orders
        };

        // Store the orderSummary in localStorage for the checkout page
        localStorage.setItem('orderSummary', JSON.stringify(orderSummary));

        // Store order summary into salesData for the Sales Management page
        let salesData = JSON.parse(localStorage.getItem('salesData')) || [];
        const salesOrder = {
            orderId: lastOrderId,
            summary: Object.keys(orders).join(", "),  // Summary of ordered items
            diningPreference: dineOption,
            paymentMethod: paymentOption,
            total: `Php ${total.toFixed(2)}`
        };
        salesData.push(salesOrder);
        localStorage.setItem('salesData', JSON.stringify(salesData)); // Store the updated sales data

        // Redirect to the order summary page
        window.location.href = 'ordersummary.html';  // Change this path if necessary
    } else {
        alert('Your order is empty. Please add items to your order before checking out.');
    }
});

// Search Functionality
document.getElementById('searchInput').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const cards = document.querySelectorAll('.card');
    const sections = document.querySelectorAll('.section-header');

    let categoryFound = false;
    let itemFound = false;

    // Show all sections and cards by default when the search term is empty
    if (searchTerm.trim() === "") {
        sections.forEach(section => {
            section.classList.remove('hidden');  // Show all sections
        });
        cards.forEach(card => {
            card.style.display = '';  // Show all cards
        });
        return;  // Exit early as we don't need to search
    }

    // Hide all sections initially
    sections.forEach(section => {
        section.classList.add('hidden');
    });

    // Check if the search term matches any category (section title)
    sections.forEach(section => {
        const categoryTitle = section.querySelector('.section-heading').textContent.toLowerCase();
        if (categoryTitle.includes(searchTerm)) {
            section.classList.remove('hidden');  // Show the matching category
            categoryFound = true;
        }
    });

    // If no category found, check for items
    if (!categoryFound) {
        cards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();

            // Check if the title or description includes the search term
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = '';  // Show the card
                itemFound = true;

                // Get the parent section of the card and show it if not already shown
                const section = card.closest('.section-header');
                if (section && section.classList.contains('hidden')) {
                    section.classList.remove('hidden');  // Show the section if it contains matching cards
                }
            } else {
                card.style.display = 'none';  // Hide the card
            }
        });

        // If no items match, show message (optional)
        if (!itemFound) {
            console.log("No items found.");  // Replace with a UI message if needed
        }
    }
});
// Show menu items when clicked
document.addEventListener('DOMContentLoaded', function () {
    const menuLinks = document.querySelectorAll('.menu-item a');

    menuLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default jump behavior
            const targetId = this.getAttribute('href'); // Get the target ID
            const targetElement = document.querySelector(targetId); // Find the element

            // Hide all other sections
            const allSections = document.querySelectorAll('.section-header');
            allSections.forEach(section => {
                section.classList.add('hidden');
            });

            // Show the clicked section
            targetElement.classList.remove('hidden');

            // Smooth scrolling
            targetElement.scrollIntoView({ behavior: 'smooth' });
        });
    });
});
