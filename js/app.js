import { fetchProducts } from "./api.js";

const productContainer = document.getElementById("productContainer");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const retryButton = document.getElementById("retryButton");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const categoryButtons = document.querySelectorAll(".category-btn");

let products = [];

let currentCategory =
    localStorage.getItem("selectedCategory") || "all";

let currentSearch =
    localStorage.getItem("searchTerm") || "";

let currentSort =
    localStorage.getItem("sortOption") || "default";


// ==============================
// LOAD SAVED PREFERENCES
// ==============================

searchInput.value = currentSearch;
sortSelect.value = currentSort;

categoryButtons.forEach(button => {
    button.classList.toggle(
        "active",
        button.dataset.category === currentCategory
    );
});


// ==============================
// LOAD PRODUCTS
// ==============================

async function loadProducts() {
    try {
        loading.classList.remove("hidden");
        errorMessage.classList.add("hidden");

        products = await fetchProducts();

        updateProducts();

    } catch (error) {
        console.error(error);
        errorMessage.classList.remove("hidden");

    } finally {
        loading.classList.add("hidden");
    }
}

retryButton.addEventListener("click", () => {
    loadProducts();
});
// ==============================
// UPDATE PRODUCTS
// ==============================

function updateProducts() {

    const searchTerm = currentSearch
        .toLowerCase()
        .trim();

    let filteredProducts = products.filter(product => {

        const matchesSearch =
            product.title.toLowerCase().includes(searchTerm);

        const matchesCategory =
            currentCategory === "all" ||
            product.category === currentCategory;

        return matchesSearch && matchesCategory;
    });


    // ==============================
    // SORT
    // ==============================

    switch (currentSort) {

        case "price-low":
            filteredProducts.sort(
                (a, b) => a.price - b.price
            );
            break;

        case "price-high":
            filteredProducts.sort(
                (a, b) => b.price - a.price
            );
            break;

        case "name":
            filteredProducts.sort(
                (a, b) =>
                    a.title.localeCompare(b.title)
            );
            break;
    }


    displayProducts(filteredProducts);
}


// ==============================
// DISPLAY PRODUCTS
// ==============================

function displayProducts(productList) {

    productContainer.innerHTML = "";

    if (productList.length === 0) {

        productContainer.innerHTML =
            "<p>No products found.</p>";

        return;
    }


    productList.forEach(product => {

        const card = document.createElement("article");

        card.className = "product-card";

        card.innerHTML = `
            <img
                src="${product.thumbnail}"
                alt="${product.title}"
                class="product-image"
            >

            <div class="product-info">

                <h2 class="product-title">
                    ${product.title}
                </h2>

                <p class="product-category">
                    ${product.category}
                </p>

                <p class="product-price">
                    $${product.price}
                </p>

            </div>
        `;

        productContainer.appendChild(card);
    });
}


// ==============================
// SEARCH
// ==============================

searchInput.addEventListener("input", () => {

    currentSearch = searchInput.value;

    localStorage.setItem(
        "searchTerm",
        currentSearch
    );

    updateProducts();
});


// ==============================
// CATEGORY FILTER
// ==============================

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentCategory =
            button.dataset.category;

        localStorage.setItem(
            "selectedCategory",
            currentCategory
        );

        updateProducts();
    });
});


// ==============================
// SORT
// ==============================

sortSelect.addEventListener("change", () => {

    currentSort = sortSelect.value;

    localStorage.setItem(
        "sortOption",
        currentSort
    );

    updateProducts();
});


// ==============================
// START APPLICATION
// ==============================

loadProducts();