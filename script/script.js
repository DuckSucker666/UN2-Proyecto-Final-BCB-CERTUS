const cartIcon = document.querySelector(".boton-carrito");

$(document).ready(function () {
  //Agregando clase active a las categorias//
  $('.category_list .category_item[category="all"]').addClass("ct_item-active");

  $(".category_item").click(function () {
    var catProduct = $(this).attr("category");

    //Reasignando el selector de categoria activo
    $(".category_item").removeClass("ct_item-active");
    $(this).addClass("ct_item-active");

    $(".product-item").hide();

    //Seleccionando los elementos a mostrar
    $('.product-item[category="' + catProduct + '"]').show();
  });

  //Mostrar todos los elementos
    $('.category_item[category="all"]').click(function () {
    $(".product-item").show();
    });
});

class CartItem {
  constructor(name, img, price, desc) {
    this.name = name;
    this.desc = desc;
    this.img = img;
    this.price = price;
    this.quantity = 1;
  }
}

class LocalCart {
  static key = "cartItems";

  static getLocalCartItems() {
    let cartMap = new Map();
    const cart = localStorage.getItem(LocalCart.key);
    if (cart === null || cart.length === 0) return cartMap;
    return new Map(Object.entries(JSON.parse(cart)));
  }

  static addItemToLocalCart(id, item) {
    let cart = this.getLocalCartItems();
    if (cart.has(id)) {
      let mapItem = cart.get(id);
      mapItem.quantity += 1;
      cart.set(id, mapItem);
    } else {
      cart.set(id, item);
      localStorage.setItem(
        LocalCart.key,
        JSON.stringify(Object.fromEntries(cart))
      );
      updateCartUI();
    }
  }

  static removeItemFromCart(id) {
    let cart = LocalCart.getLocalCartItems();
    if (cart.has(id)) {
      let mapItem = cart.get(id);
      if (mapItem.quantity > 1) {
        mapItem.quantity -= 1;
        cart.set(id, mapItem);
      } else cart.delete(id);
    }
    if (cart.length === 0) {
      localStorage.clear();
    } else {
      localStorage.setItem(
        LocalCart.key,
        JSON.stringify(Object.fromEntries(cart))
      );
      updateCartUI();
    }
  }
}
const addToCartBtns = document.querySelectorAll("#comprar");
addToCartBtns.forEach((btn) => {
  btn.addEventListener("click", addItemFunction);
});
function addItemFunction(e) {
  const id = e.target.parentElement.parentElement.parentElement.getAttribute("data-id");
  const img = e.target.parentElement.parentElement.previousElementSibling.src;
  const name = e.target.parentElement.previousElementSibling.textContent;
  const desc = e.target.parentElement.children[0].textContent;
  let price = e.target.parentElement.children[2].textContent;
  price = price.replace("$", "");
  const item = new CartItem(name, img, price, desc);
  LocalCart.addItemToLocalCart(id, item);
}

function updateCartUI() {
  const cartWrapper = document.querySelector(".modal-body");
  cartWrapper.innerHTML = "";
  const items = LocalCart.getLocalCartItems("cartItem");
  if (items === null) return;
  let count = 0;
  let total = 0;
  for (const [key, value] of items.entries()) {
    const cartItem = document.createElement("div");
    cartItem.classList.add("card");
    let price = value.price * value.quantity;
    count += 1;
    total += price;
    cartItem.innerHTML = `
        <div class="card-body">
        <div class="d-flex justify-content-between">
          <div class="d-flex flex-row align-items-center">
            <div>
              <img src="${value.img}" class="img-fluid rounded-3" alt="Shopping item" style="width: 65px;">
            </div>
            <div class="ms-3">
              <h5>${value.name}</h5>
            </div>
          </div>
          <div class="d-flex flex-row align-items-center">
            <div style="width: 50px;">

            </div>
            <div style="width: 80px;">
              <h5 class="mb-0">$${price}</h5>
            </div>
              <i class="fas fa-trash-alt"></i>
            </div>
            </div>
        </div>
        `;
    cartItem.lastElementChild.addEventListener("click", () => {
      LocalCart.removeItemFromCart(key);
    });

    cartWrapper.append(cartItem);
  }
  if (count > 0) {
    cartIcon.classList.add("non-empty");
    let root = document.querySelector(":root");
    root.style.setProperty("--after-content", `"${count}"`);
    const subtotal = document.querySelector(".subtotal");
    subtotal.innerHTML = `SubTotal: $${total}`;
  } else cartIcon.classList.remove("non-empty");
}
document.addEventListener("DOMContentLoaded", () => {
  updateCartUI();
});
