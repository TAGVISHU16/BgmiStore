
document.addEventListener("DOMContentLoaded", () => {
    const cart = [];

    // Demo UC package prices
    const packages = [
        { name: "60 UC", price: 79 },
        { name: "325 UC", price: 319 },
        { name: "660 UC", price: 639 },
        { name: "1800 UC", price: 1599 }
    ];

    // Cart button
    const cartButton = document.createElement("button");
    cartButton.textContent = "🛒 Cart (0)";
    cartButton.className = "cart-floating-button";
    document.body.appendChild(cartButton);

    // Cart panel
    const cartPanel = document.createElement("div");
    cartPanel.className = "cart-panel";

    cartPanel.innerHTML = `
        <div class="cart-header">
            <h2>My Cart</h2>
            <button class="close-cart" aria-label="Close cart">✕</button>
        </div>

        <div class="cart-items"></div>

        <div class="cart-footer">
            <h3>Total: ₹<span class="cart-total">0</span></h3>
            <button class="checkout-button">Order on WhatsApp</button>
        </div>
    `;

    document.body.appendChild(cartPanel);

    const cartItems = cartPanel.querySelector(".cart-items");
    const cartTotal = cartPanel.querySelector(".cart-total");

    // Add buttons to UC packages
    document.querySelectorAll(".uc-package").forEach((element, index) => {
        const product = packages[index];

        if (!product) return;

        const button = document.createElement("button");
        button.textContent = "Add to Cart +";
        button.className = "add-cart-button";

        element.appendChild(button);

        button.addEventListener("click", () => {
            const existing = cart.find(
                item => item.name === product.name
            );

            if (existing) {
                existing.quantity++;
            } else {
                cart.push({
                    ...product,
                    quantity: 1
                });
            }

            updateCart();
        });
    });

    // Update cart display
    function updateCart() {
        cartItems.innerHTML = "";

        let total = 0;
        let count = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            count += item.quantity;

            const row = document.createElement("div");
            row.className = "cart-item";

            const details = document.createElement("div");

            const name = document.createElement("strong");
            name.textContent = item.name;

            const price = document.createElement("p");
            price.textContent =
                `₹${item.price} × ${item.quantity}`;

            details.append(name, price);

            const actions = document.createElement("div");
            actions.className = "cart-actions";

            const minus = document.createElement("button");
            minus.textContent = "−";
            minus.setAttribute("aria-label", "Decrease quantity");

            const quantity = document.createElement("span");
            quantity.textContent = item.quantity;

            const plus = document.createElement("button");
            plus.textContent = "+";
            plus.setAttribute("aria-label", "Increase quantity");

            const remove = document.createElement("button");
            remove.textContent = "Remove";
            remove.className = "remove-item";

            minus.addEventListener("click", () => {
                item.quantity--;

                if (item.quantity <= 0) {
                    cart.splice(index, 1);
                }

                updateCart();
            });

            plus.addEventListener("click", () => {
                item.quantity++;
                updateCart();
            });

            remove.addEventListener("click", () => {
                cart.splice(index, 1);
                updateCart();
            });

            actions.append(minus, quantity, plus, remove);
            row.append(details, actions);
            cartItems.appendChild(row);
        });

        if (cart.length === 0) {
            cartItems.textContent = "Your cart is empty.";
        }

        cartButton.textContent = `🛒 Cart (${count})`;
        cartTotal.textContent = total.toLocaleString("en-IN");
    }

    // Open and close cart
    cartButton.addEventListener("click", () => {
        cartPanel.classList.add("cart-open");
    });

    cartPanel.querySelector(".close-cart")
        .addEventListener("click", () => {
            cartPanel.classList.remove("cart-open");
        });

    // WhatsApp order request
    cartPanel.querySelector(".checkout-button")
        .addEventListener("click", () => {
            if (cart.length === 0) {
                alert("Please add a package to your cart first!");
                return;
            }

            const orderDetails = cart.map(item =>
                `${item.name} x ${item.quantity} = ₹${item.price * item.quantity}`
            ).join("\n");

            const total = cart.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );

            const message =
                `Hello BGMI VAULT!\n\nMy order request:\n${orderDetails}\n\nTotal: ₹${total}\n\nPlease confirm availability and final price.`;

            // Replace this with your WhatsApp number,
            // including country code, without + or spaces.
            const phone = "917987077537";

            if (phone.includes("X")) {
                alert("Please add your WhatsApp number in script.js first.");
                return;
            }

            const url =
                `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

            window.open(url, "_blank");
        });

    updateCart();
});
