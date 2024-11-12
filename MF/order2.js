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

addButton.addEventListener('click', () => {
    sidebar.classList.add('show'); // Show the sidebar
});

// Show the sidebar when the eat icon is clicked
eatIcon.addEventListener('click', () => {
    sidebar.classList.add('show'); // Show the sidebar
});

// Hide the sidebar when the close button is clicked
sidebarClose.addEventListener('click', () => {
    sidebar.classList.remove('show'); // Hide the sidebar
});

// Add order functionality using the plus icon
document.querySelectorAll('.add-btn').forEach(icon => {
    icon.addEventListener('click', () => {
        const itemName = icon.getAttribute('data-name');
        const itemPrice = parseFloat(icon.getAttribute('data-price'));

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
    for (const itemName in orders) {
        const orderItem = document.createElement('div');
        orderItem.classList.add('order-item');

        const itemText = document.createElement('span');
        itemText.textContent = `${itemName} - Php ${orders[itemName].price.toFixed(2)}`; // Removed "x" from here

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
    }

    // Update total amount
    total = Object.values(orders).reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalAmount.textContent = `Php ${total.toFixed(2)}`;

    // Show the sidebar if there are orders
    if (total > 0) {
        sidebar.classList.add('show'); // Show the sidebar if there are items in the order
    } else {
        sidebar.classList.remove('show'); // Hide the sidebar if there are no items in the order
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
        const dineOption = document.querySelector('input[name="dine-option"]:checked').value; 
        const paymentOption = document.querySelector('input[name="pay-option"]:checked').value; 

        // Retrieve the last orderId from localStorage, or start from 0 if not available
        let lastOrderId = parseInt(localStorage.getItem('lastOrderId')) || 0;
        
        // Increment the orderId
        lastOrderId++;

        // Use the lastOrderId directly (without leading zeros)
        const orderId = lastOrderId;

        // Store the updated orderId back into localStorage for the next order
        localStorage.setItem('lastOrderId', lastOrderId.toString());

        const orderSummary = {
            orderId: orderId,  // Order ID
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
            orderId: orderId,
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

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const menuItems = document.querySelectorAll('.menu-item, .card');

    // Function to handle search
    const handleSearch = () => {
        const query = searchInput.value.toLowerCase();

        menuItems.forEach(item => {
            const titleElement = item.querySelector('h5, h4');
            const title = titleElement.textContent;

            // Clear previous highlights
            titleElement.innerHTML = title;

            // Check if the title includes the query
            if (title.toLowerCase().includes(query)) {
                item.style.display = ''; // Show item if it matches

                // Highlight the matched text
                const regex = new RegExp(`(${query})`, 'gi');
                titleElement.innerHTML = title.replace(regex, '<span class="highlight">$1</span>');
            } else {
                item.style.display = 'none'; // Hide item if it doesn't match
            }
        });
    };

    // Attach input event listener
    searchInput.addEventListener('input', handleSearch);
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