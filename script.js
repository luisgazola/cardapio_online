let cart = [];
const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const spanItem = document.getElementById("date-span");

// Função para exibir o Toast
function showToast(message, backgroundColor) {
    Toastify({
        text: message,
        duration: 5000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: backgroundColor,
            transition: "all 0.5s ease",
        },
        className: "toastify",  // Aplicando a classe que contém as animações CSS
    }).showToast();
}

// Abrir o modal do carrinho
cartBtn.addEventListener("click", () => {
    updateCartModal();
    cartModal.style.display = "flex";
});

// Fechar o modal do carrinho ao clicar fora
cartModal.addEventListener("click", (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});

// Fechar o modal do carrinho
closeModalBtn.addEventListener("click", () => {
    cartModal.style.display = "none";
});

// Adicionar item ao carrinho
menu.addEventListener("click", (event) => {
    const parentButton = event.target.closest(".add-to-cart-btn");
    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        addToCart(name, price);
    }
});

// Função de adicionar ao carrinho
function addToCart(name, price) {
    const existingItem = cart.find((item) => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }

    updateCartModal();
    showToast(`${name} foi adicionado ao carrinho!`, "#34D399");
}

// Função de atualizar o carrinho no modal
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item) => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");
        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Quantidade: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-from-cart-btn" data-name="${item.name}">Remover</button>
            </div>
        `;

        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    cartCounter.innerHTML = cart.length;
}

// Função para remover itens do carrinho
cartItemsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");
        removeItemCart(name);
    }
});

function removeItemCart(name) {
    const index = cart.findIndex((item) => item.name === name);
    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
        showToast(`${item.name} foi retirado do seu carrinho. Mas não se preocupe, você sempre pode adicionar de novo! 😉`, "#F97316");
    }
}

// Validação do endereço
addressInput.addEventListener("input", () => {
    if (addressInput.value !== "") {
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }
});

// Função para checkout
checkoutBtn.addEventListener("click", () => {
    const isOpen = checkRestaurantOpen();

    if (!isOpen) {
        showToast("Oi! A nossa hamburgueria só está aberta a partir das 18 horas. Volte mais tarde, ok? 😊", "#ef4444");
        return;
    }

    if (cart.length === 0) {
        showToast("Opa! Parece que você esqueceu de adicionar algum item ao carrinho. Que tal escolher algo delicioso? 😄", "#F97316");
        return;
    }

    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        showToast("Ei, não esquecemos do endereço, né? 😊 Por favor, informe o endereço de entrega para finalizar seu pedido.", "#F97316");
        return;
    }

    // Criação da mensagem de forma mais amigável
const cartItems = cart.map((item) => `${item.name} - Quantidade: ${item.quantity} | Preço: R$ ${item.price.toFixed(2)}`).join("\n");
const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
const message = encodeURIComponent(`
    Olá! Gostaria de fazer o pedido:

    ${cartItems}

    Total: R$ ${totalPrice}

    Endereço de entrega: ${addressInput.value}

    Aguardo confirmação. Obrigado! :)
`);

// Número de contato para o WhatsApp
const phone = "5511999999999";

// Abrir o WhatsApp com a mensagem formatada
window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    // Limpar carrinho após checkout
    cart.length = 0;
    updateCartModal();
});

// Verificar se o restaurante está aberto
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}

// Atualizar o status do restaurante
const isOpen = checkRestaurantOpen();
if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
} else {
    spanItem.classList.add("bg-red-500");
    spanItem.classList.remove("bg-green-600");
}

const clearCartBtn = document.getElementById("clear-cart-btn");

clearCartBtn.addEventListener("click", function() {
    // Limpa o carrinho
    cart.length = 0;

    // Atualiza o modal
    updateCartModal();

    // Exibe uma mensagem de confirmação usando Toastify
    Toastify({
        text: "Seu carrinho foi limpo com sucesso! 😄 Agora, é só escolher algo delicioso para adicionar.",
        duration: 3000,
        close: true,
        gravity: "top", // `top` ou `bottom`
        position: "right", // `left`, `center` ou `right`
        stopOnFocus: true, // Impede o desaparecimento do toast quando o mouse está sobre ele
        style: {
            background: "#34D399", // Cor verde de sucesso
        },
    }).showToast();
});
