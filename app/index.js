import { formatNumber } from "../js/common/numbers.utils.js";

const menu_items = document.querySelector("#menu_items");
const topping_items = document.querySelector("#topping_items");
const bill_items = document.querySelector("#bill_items");
const bill_topping = document.querySelector("#topping_add");
const search_input = document.querySelector("#search_input");
const total_quantity_element = document.querySelector("#total_quantity");
const total_money_element = document.querySelector("#total_money");
const total_quantity_element2 = document.querySelector("#total_quantity2");
const total_money_element2 = document.querySelector("#total_money2");
const cart_number = document.querySelector("#cart-number");

const saleInput = document.querySelector("#saleInput");
var products;
var invoices;
var sales;
var topping;
var bills = [];
var topping_adds = [];

window.onload = async function () {
  await getProducts();
  await getInvoices();
  await getSales();
  console.log(sales);
  saleInput.value = sales[0].sale || 0;
  checkSaleButton();

  search_input.focus();
  search_input.addEventListener("input", function (e) {
    handleSearch(search_input.value);
  });
  document.addEventListener("keydown", function (event) {
    switch (event.code) {
      case "F1":
        event.preventDefault();
        printPage();
        break;
      case "F2":
        event.preventDefault();
        printBill();
        break;
      case "F3":
        event.preventDefault();
        createInvoice();
        break;
      case "F4":
        event.preventDefault();
        newBill();
        break;
    }
  });
};
window.handleAddItem = (id, size) => {
  const index = bills.findIndex((element) => element.invoiceId === id + size);
  if (index !== -1) {
    bills[index].quantity += 1;
    bills[index].total = bills[index].quantity * bills[index].price;
  } else {
    const product = returnItemInfo(id);
    let price = product[0].sizes.filter(
      (sizeElement) => sizeElement.name === size
    )[0].price;
    let item = {
      name: product[0].name,
      image: product[0].image,
      invoiceId: product[0].id + size,
      size: size,
      price: price,
      idProduct: product[0].id,
      quantity: 1,
      topping: [],
      total: price,
      group: product[0].group,
      type: product[0].type,
      sold: product[0].sold,
    };
    bills.push(item);
  }
  renderBill(bills);
};
var idTemp, sizeTemp;
window.openToppingModal = (id, size) => {
  idTemp = id;
  sizeTemp = size;
  if (size === "L") {
    document.querySelector(".TP010").style.display = "none";
  } else {
    document.querySelector(".TP010").style.display = "block";
  }
  $("#toppingModal").modal("show");
};
window.handleAddItemTopping = () => {
  const product = returnItemInfo(idTemp);
  let price = product[0].sizes.filter(
    (sizeElement) => sizeElement.name === sizeTemp
  )[0].price;
  let price_total = price;
  topping_adds.map((element) => {
    price_total += element.total;
  });
  let item = {
    name: product[0].name,
    image: product[0].image,
    invoiceId:
      product[0].id +
      sizeTemp +
      "TP" +
      Math.floor(Math.random() * 10000) +
      Math.floor(Math.random() * 10000),
    size: sizeTemp,
    price: price,
    quantity: 1,
    idProduct: product[0].id,
    total: price_total,
    topping: topping_adds,
    group: product[0].group,
    type: product[0].type,
    sold: product[0].sold,
  };
  bills.push(item);
  closeAddTopping();
  renderBill(bills);
};
window.returnItemInfo = (id) => {
  const copy = [...products];
  let temp = copy.filter((element) => element.id == id);
  return temp;
};
window.returnToppingItem = (id) => {
  const copy = [...topping];
  let temp = copy.filter((element) => element.id == id);
  return temp;
};
const getProducts = async () => {
  products = await API.getData("product");
  topping = await API.getData("topping");
  renderProduct(products);
  renderTopping(topping);
};
const getInvoices = async () => {
  invoices = (await API.getData("invoice")) || [];
};
const getSales = async () => {
  sales = (await API.getData("sales")) || [];
};
const renderProduct = (data) => {
  if (data) {
    menu_items.innerHTML = data
      .sort(function (a, b) {
        return b.sold - a.sold;
      })
      .map((element) => {
        return `<div class="menu-item">
        <div
          class="menu-title"
        >
          <div class="menu-item-image">
          <img src="../assets/images/menu/${element.image}" >
          </div>
          <div class="menu-sub">
          <h6 class="heading-title fw-bolder">
          ${element.name}
        </h6>
          <p class="mt-1 mb-0 small">Đã bán: ${element.sold}</p>
          </div>

          </div>
          <div class="menu-image">
       
          
            <div class="d-flex mt-1 flex-wrap justify-content-between menu-button">
              ${element.sizes
                .map((size) => {
                  return `<div class="d-flex align-items-center justify-content-end">
               
                <div class="d-flex align-items-center justify-content-between">
            
              <button class="btn btn-success btn-sm rounded-pill fw-bolder" onclick="handleAddItem('${
                element.id
              }','${size.name}')" style="min-width:47px">
            ${size.name}</button>
              ${
                element.group == "NUOC"
                  ? `    <button class="btn btn-warning btn-xs rounded-pill ms-3" onclick="openToppingModal('${element.id}','${size.name}')">
              +Topping</button>`
                  : ``
              }
              </div>
              </div>`;
                })
                .join("")}
            </div>
          </div>
        </div>
      </div>`;
      })
      .join("");
  }
};
const renderTopping = (data) => {
  if (data) {
    topping_items.innerHTML = data
      .map((element) => {
        return `<div class="col-6 mb-2 position-relative ${element.id}">
        <div
          class="card card-white dish-card profile-img mb-0 index "
          onclick="handleAddTopping('${element.id}',this)"
        >
          <div class="p-2">
            <h6 class="heading-title fw-bolder mb-0">
              ${element.name}
            </h6>
            <div class="d-flex mt-1 flex-wrap">
            <div class="d-flex align-items-center justify-content-between col-12">
            <span class="text-primary fw-bolder me-2">${formatNumber(
              element.price
            )} đ</span>
            </div>
            </div>
          </div>
      
          <div class="number_topping"></div>
        </div>
        <button class="btn btn-warning btn-sm rounded-pill fw-bolder" style="
        position: absolute;
        right: 22px;
        bottom: 10px;
        cursor: pointer;
    "
    onclick="handleDecreaseTopping('${element.id}',this)"> - </button>
      </div>`;
      })
      .join("");
  }
};

window.handleAddTopping = (id_topping, event) => {
  const index = topping_adds.findIndex((element) => element.id === id_topping);
  const number = event.querySelector(".number_topping");
  if (index !== -1) {
    if (id_topping === "TP010") {
      topping_adds[index].quantity = 1;
    } else {
      topping_adds[index].quantity += 1;
    }
    topping_adds[index].total =
      topping_adds[index].quantity * topping_adds[index].price;
    number.innerHTML = topping_adds[index].quantity;
  } else {
    const topping = returnToppingItem(id_topping);
    let item = {
      id: topping[0].id,
      name: topping[0].name,
      price: topping[0].price,
      quantity: 1,
      total: topping[0].price,
    };
    number.innerHTML = 1;
    topping_adds.push(item);
  }
  event.classList.add("have_topping");
  // renderToppingBill(topping_adds);
};
window.handleDecreaseTopping = (id_topping, event) => {
  const index = topping_adds.findIndex((element) => element.id === id_topping);
  const number = event.parentElement.querySelector(".number_topping");
  if (index !== -1) {
    topping_adds[index].quantity -= 1;
    topping_adds[index].total =
      topping_adds[index].quantity * topping_adds[index].price;
    number.innerHTML = topping_adds[index].quantity;

    if (topping_adds[index].quantity == 0) {
      topping_adds.splice(index, 1);
      event.parentElement
        .querySelector(".have_topping")
        .classList.remove("have_topping");
    }
  }

  // event.classList.add("have_topping");
  // renderToppingBill(topping_adds);
};
window.handleDeleteTopping = (invoice_id, id_topping) => {
  const index = bills.findIndex((element) => element.invoiceId === invoice_id);
  if (index !== -1) {
    let index_topping = bills[index].topping.findIndex(
      (topping) => topping.id === id_topping
    );
    if (index_topping !== -1) {
      bills[index].total =
        bills[index].total - bills[index].topping[index_topping].total;
      bills[index].topping.splice(index_topping, 1);
    }
  }
  renderBill(bills);
};
var total_money = 0;
var total_quantity = 0;
const renderBill = (data) => {
  if (data) {
    total_money = 0;
    total_quantity = 0;
    bill_items.innerHTML = bills
      .map((element, index) => {
        total_quantity += element.quantity;
        total_money += element.total;
        return `  <div class="bill-item">
      <div
        class="d-flex align-items-center justify-content-between profile-img4"
      >
        <div class="profile-img11">
          <img
            src="../assets/images/menu/${element.image}"
            alt="img"
          />
        </div>
        <div class="d-flex align-items-center profile-content">
          <div>
            <h6 class="mb-1 heading-title fw-bolder">
              ${element.name}  ${
          element.group == "NUOC" ? `(${element.size})` : ``
        }
            </h6>
            <span class="d-flex align-items-center ms-2">
              <button type="button" class="btn btn-primary btn-xs" onclick="handleDecrease('${
                element.invoiceId
              }')"> - </button>
              <small class="text-dark fw-bold ms-3 me-3">x ${
                element.quantity
              }</small>
              <button type="button" class="btn btn-primary btn-xs" onclick="handleIncrease('${
                element.invoiceId
              }')"> + </button>
         
            </span>
          </div>
        </div>
        <div class="text-end">
          <span class="mb-1" onclick="handleDelete('${element.invoiceId}')">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                opacity="0.4"
                d="M19.6449 9.48924C19.6449 9.55724 19.112 16.298 18.8076 19.1349C18.6169 20.8758 17.4946 21.9318 15.8111 21.9618C14.5176 21.9908 13.2514 22.0008 12.0055 22.0008C10.6829 22.0008 9.38936 21.9908 8.1338 21.9618C6.50672 21.9228 5.38342 20.8458 5.20253 19.1349C4.88936 16.288 4.36613 9.55724 4.35641 9.48924C4.34668 9.28425 4.41281 9.08925 4.54703 8.93126C4.67929 8.78526 4.86991 8.69727 5.07026 8.69727H18.9408C19.1402 8.69727 19.3211 8.78526 19.464 8.93126C19.5973 9.08925 19.6644 9.28425 19.6449 9.48924"
                fill="#E60A0A"
              />
              <path
                d="M21 5.97686C21 5.56588 20.6761 5.24389 20.2871 5.24389H17.3714C16.7781 5.24389 16.2627 4.8219 16.1304 4.22692L15.967 3.49795C15.7385 2.61698 14.9498 2 14.0647 2H9.93624C9.0415 2 8.26054 2.61698 8.02323 3.54595L7.87054 4.22792C7.7373 4.8219 7.22185 5.24389 6.62957 5.24389H3.71385C3.32386 5.24389 3 5.56588 3 5.97686V6.35685C3 6.75783 3.32386 7.08982 3.71385 7.08982H20.2871C20.6761 7.08982 21 6.75783 21 6.35685V5.97686Z"
                fill="#E60A0A"
              />
            </svg>
          </span>
          <p class="mb-0 text-dark">${
            element.topping.length > 0
              ? `<span class="old-price">${formatNumber(
                  element.price
                )}đ</span>${formatNumber(element.total)}đ`
              : `${formatNumber(element.total)}đ`
          }</p>
        </div>
      </div>
      ${element.topping
        .map((topping) => {
          return `
        <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center profile-content" style="margin-left: 68px">
          <div>
            <h6 class="mb-1 heading-title">
              ${topping.name}   <small class="text-dark fw-bold ms-1 me-2">x ${
            topping.quantity
          }</small>
            </h6>
          </div>
        </div>
        <div class="text-end" style="
        display: flex;
        flex-direction: row-reverse;
        align-items: center;">
          <span class="mb-1 ms-2" onclick="handleDeleteTopping('${
            element.invoiceId
          }','${topping.id}')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.4" d="M19.6449 9.48924C19.6449 9.55724 19.112 16.298 18.8076 19.1349C18.6169 20.8758 17.4946 21.9318 15.8111 21.9618C14.5176 21.9908 13.2514 22.0008 12.0055 22.0008C10.6829 22.0008 9.38936 21.9908 8.1338 21.9618C6.50672 21.9228 5.38342 20.8458 5.20253 19.1349C4.88936 16.288 4.36613 9.55724 4.35641 9.48924C4.34668 9.28425 4.41281 9.08925 4.54703 8.93126C4.67929 8.78526 4.86991 8.69727 5.07026 8.69727H18.9408C19.1402 8.69727 19.3211 8.78526 19.464 8.93126C19.5973 9.08925 19.6644 9.28425 19.6449 9.48924" fill="#E60A0A"></path>
              <path d="M21 5.97686C21 5.56588 20.6761 5.24389 20.2871 5.24389H17.3714C16.7781 5.24389 16.2627 4.8219 16.1304 4.22692L15.967 3.49795C15.7385 2.61698 14.9498 2 14.0647 2H9.93624C9.0415 2 8.26054 2.61698 8.02323 3.54595L7.87054 4.22792C7.7373 4.8219 7.22185 5.24389 6.62957 5.24389H3.71385C3.32386 5.24389 3 5.56588 3 5.97686V6.35685C3 6.75783 3.32386 7.08982 3.71385 7.08982H20.2871C20.6761 7.08982 21 6.75783 21 6.35685V5.97686Z" fill="#E60A0A"></path>
            </svg>
          </span>
          <p class="mb-0 text-dark">${formatNumber(topping.total)}đ</p>
        </div>
      </div>`;
        })
        .join("")}
    </div>`;
      })
      .join("");
    if (total_money > 0) {
      total_money_element.innerHTML = formatNumber(total_money) + "đ";
      total_quantity_element.innerHTML =
        "Tổng cộng: " + total_quantity + " món - ";
      cart_number.style.display = "block";

      cart_number.innerHTML = total_quantity;
      total_money_element2.innerHTML = formatNumber(total_money) + "đ";
      total_quantity_element2.innerHTML =
        "Tổng cộng: " + total_quantity + " món - ";
    } else {
      total_money_element.innerHTML = "";
      total_quantity_element.innerHTML = "";
      cart_number.style.display = "none";

      cart_number.innerHTML = "";

      total_money_element2.innerHTML = "";
      total_quantity_element2.innerHTML = "";
    }
  }
};
window.newBill = () => {
  topping_adds = [];
  bills = [];
  renderBill(bills);
  // renderToppingBill(topping_adds);
};
const renderToppingBill = (data) => {
  if (data) {
    bill_topping.innerHTML = data
      .map((element, index) => {
        return `<p></p> <p style="
        margin: 0;
        font-weight: bold;">${element.name} x${element.quantity}</p>`;
      })
      .join("");
  }
};
window.closeAddTopping = () => {
  topping_adds = [];
  document.querySelectorAll(".have_topping").forEach((item) => {
    item.classList.remove("have_topping");
  });
  // renderToppingBill(topping_adds);
  $("#toppingModal").modal("hide");
};
window.handleIncrease = (invoice_id) => {
  const index = bills.findIndex((element) => element.invoiceId === invoice_id);
  if (index !== -1) {
    if (bills[index].topping.length > 0) {
      let item = {
        ...bills[index],
      };
      item.invoiceId =
        item.idProduct +
        item.size +
        "TP" +
        Math.floor(Math.random() * 10000) +
        Math.floor(Math.random() * 10000);
      bills.push(item);
    } else {
      bills[index].quantity += 1;
      bills[index].total = bills[index].quantity * bills[index].price;
    }
  }
  renderBill(bills);
};
window.handleDecrease = (invoice_id) => {
  const index = bills.findIndex((element) => element.invoiceId === invoice_id);
  console.log(index);
  if (index !== -1) {
    bills[index].quantity -= 1;
    bills[index].total = bills[index].quantity * bills[index].price;
  }
  if (bills[index].quantity == 0) {
    bills.splice(index, 1);
  }
  renderBill(bills);
};
window.handleDelete = (invoice_id) => {
  const index = bills.findIndex((element) => element.invoiceId === invoice_id);
  console.log(index);
  if (index !== -1) {
    bills.splice(index, 1);
  }
  renderBill(bills);
};
window.handleSearch = (search_value) => {
  $("html, body").animate({
    scrollTop: 0,
  });
  let bill_search = [...products];
  if (!search_value) {
    renderProduct(products);
    return;
  }
  bill_search = bill_search.filter(
    (element) =>
      element.name.toLowerCase().includes(search_value.toLowerCase()) == true ||
      toSlug(element.name.toLowerCase()).includes(search_value.toLowerCase()) ==
        true
  );
  renderProduct(bill_search);
};
function toSlug(str) {
  // Chuyển hết sang chữ thường
  str = str.toLowerCase();

  // xóa dấu
  str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, "a");
  str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, "e");
  str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, "i");
  str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, "o");
  str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, "u");
  str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, "y");
  str = str.replace(/(đ)/g, "d");

  // Xóa ký tự đặc biệt
  str = str.replace(/([^0-9a-z-\s])/g, "");

  // Xóa ký tự - liên tiếp
  str = str.replace(/-+/g, "-");

  // xóa phần dự - ở đầu
  str = str.replace(/^-+/g, "");

  // xóa phần dư - ở cuối
  str = str.replace(/-+$/g, "");

  // return
  return str;
}

const slides = document.querySelectorAll(".category-wrapper .category-menu");
console.log(slides);
window.handleClickCategory = (category, event) => {
  console.log(event);
  slides.forEach(function (item) {
    item.classList.remove("active");
  });
  if (category === "ALL") {
    renderProduct(products);
    $(".category-wrapper").removeClass("active");
    $(".category-current").addClass("active");
    $(".category-current")[0].innerHTML = $(event).html();
    return;
  }
  let temp = products.filter((pro) => pro.type == category);
  renderProduct(temp);
  $(".category-wrapper").removeClass("active");
  $(".category-current").addClass("active");
  $(".category-current")[0].innerHTML = $(event).html();
};

window.createInvoice = async (sale) => {
  if (!bills || bills.length <= 0) return;
  let total = 0;
  let quantity = 0;
  let saleValue = sale ? sales[0].sale || 0 : 0;
  bills.forEach(async function (item) {
    total += item.total;
    quantity += item.quantity;
    let sold = item.sold + item.quantity;
    const res = await API.putData("product/" + item.idProduct, {
      sold: sold,
    });
  });
  let temp = {
    id: "MER" + Date.now(),
    total: total,
    date: Date.now(),
    details: bills,
    sold: quantity,
    sale: saleValue,
    realTotal: ((100 - saleValue) / 100) * total || total,
  };
  invoices.push(temp);
  const rest = await API.postData("invoice/", invoices);
  closeBillModal();
  newBill();
};

window.printPage = () => {
  if (!bills || bills.length <= 0) return;

  let currentdate = new Date();
  let date =
    (currentdate.getDate() < 10
      ? "0" + currentdate.getDate()
      : currentdate.getDate()) +
    "/" +
    (currentdate.getMonth() + 1 < 10
      ? "0" + (currentdate.getMonth() + 1)
      : currentdate.getMonth() + 1);

  let time =
    (currentdate.getHours() < 10
      ? "0" + currentdate.getHours()
      : currentdate.getHours()) +
    ":" +
    (currentdate.getMinutes() < 10
      ? "0" + currentdate.getMinutes()
      : currentdate.getMinutes());

  var printBill = [];
  bills
    .filter((pro) => pro.group == "NUOC")
    .map((element) => {
      if (element.quantity > 1) {
        for (let i = 0; i < element.quantity; i++) {
          printBill.push(element);
        }
      } else {
        printBill.push(element);
      }
    });
  // let content = bills.map((element) => {
  //   if (element.quantity > 1) {
  //   } else {
  //     return `<p class="title">${element.name}</p><p class="price"></p>`;
  //   }
  // });
  var printContent = document.getElementById("printContent"); // lấy nội dung muốn in
  printContent.innerHTML = printBill
    .map((element) => {
      return ` <div class="print-item">
    <p class="print-shop">Tiệm trà Mer</p>
    <p class="print-time">
      <span class="date">${date}</span><span class="time">${time}</span>
    </p>
    <p class="print-title">${element.name} (${element.size})</p>
    <p class="print-topping">
      ${element.topping
        .map((topping) => {
          return `<span>${topping.name} x${topping.quantity} - ${formatNumber(
            topping.total
          )}</span>`;
        })
        .join("")}
    </p>
    <p class="print-price">${
      element.topping.length > 0
        ? `<span class="old-price">${formatNumber(
            element.price
          )}đ</span>${formatNumber(element.total)}đ`
        : `${formatNumber(element.price)}đ`
    }</p>
    
  </div>`;
    })
    .join("");
  var printWindow = window.open("", "", "width=1280,height=720"); // mở cửa sổ in mới với kích thước 72x22mm
  printWindow.document.write("<html><head><title>Print Page</title>"); // tạo tiêu đề cho trang in
  printWindow.document.write(
    '<style type="text/css">@media print { body { margin: 0; } }</style><link rel="stylesheet" href="../assets/css/printApp.css" />'
  ); // định dạng trang in
  printWindow.document.write(
    "</head><body style='width:272px'><div id='printContent'>"
  );
  printWindow.document.write(printContent.innerHTML); // in nội dung muốn in vào trang in mới
  printWindow.document.write("</div></body></html>");
  // printWindow.document.close(); // đóng trang in mới
  setTimeout(function () {
    printWindow.print(); // thực hiện lệnh in trang in mới
    // printWindow.close(); // đóng trang in mới sau khi in xong
  }, 800);
};
window.printBill = () => {
  if (!bills || bills.length <= 0) return;

  let currentdate = new Date();
  let total = 0;
  let date =
    (currentdate.getDate() < 10
      ? "0" + currentdate.getDate()
      : currentdate.getDate()) +
    "/" +
    (currentdate.getMonth() + 1 < 10
      ? "0" + (currentdate.getMonth() + 1)
      : currentdate.getMonth() + 1);
  +currentdate.getFullYear;

  let time =
    (currentdate.getHours() < 10
      ? "0" + currentdate.getHours()
      : currentdate.getHours()) +
    ":" +
    (currentdate.getMinutes() < 10
      ? "0" + currentdate.getMinutes()
      : currentdate.getMinutes());

  var printBill = document.getElementById("printBill"); // lấy nội dung muốn in
  printBill.innerHTML = `
  <div class="logo-bill">
        <img src="../assets/images/logoBill.png" alt="" />
      </div>
      <p class="bill-address bold">E39 tổ 3, ấp Phước Thiện, xã Phước Tỉnh</p>
      <p class="bill-address">(Hẻm nhà hàng Minh Phương vào 100m)</p>
      <p class="bill-address phone">SDT: 05634.03465</p>
      <div class="bill-item">
        <p class="title">PHIẾU THANH TOÁN</p>
        <p class="bill-time">
          <span class="time">${time}</span><span class="date">${date}</span>
        </p>
        <div class="items">
          <table>
            <tbody>
            ${bills
              .map((element) => {
                total += element.total;
                if (element.topping.length > 0) {
                  return `<tr>
                  <td><span class="name">${element.name} (${
                    element.size
                  })</span>
                    ${element.topping
                      .map((topping) => {
                        return `<span class="topping">${topping.name}</span>`;
                      })
                      .join("")}
                  </td>
                  <td><span class="quantity">x${element.quantity}</span>
                  ${element.topping
                    .map((topping) => {
                      return `<span class="quantityMulti">${
                        topping.quantity > 1
                          ? `<span class="priceOne">${formatNumber(
                              topping.price
                            )}</span><span>x${topping.quantity}</span>`
                          : `x${topping.quantity}`
                      } </span>`;
                    })
                    .join("")}
                   </td>
                  <td><span class="total">${formatNumber(element.price)}</span>
                  ${element.topping
                    .map((topping) => {
                      return `<span class="total">${formatNumber(
                        topping.total
                      )}</span>`;
                    })
                    .join("")}
                  </td>
                </tr>`;
                } else {
                  return `<tr>
                  <td>${element.name} ${
                    element.group == "NUOC" ? `(${element.size})` : ``
                  } </td>
                  ${
                    element.quantity > 1
                      ? `  <td class="priceMulti"><span class="priceOne">${formatNumber(
                          element.price
                        )}</span> x${element.quantity}</td>`
                      : `<td>x${element.quantity}</td>`
                  }
                  <td>${formatNumber(element.total)}</td>
                </tr>`;
                }
              })
              .join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2">Tổng tiền</td>
                <td>${formatNumber(total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p class="thank">♥ Cám ơn quý khách và hẹn gặp lại ♥</p>
      </div>
      `;
  var printWindow = window.open("", "", "width=1280,height=720");
  printWindow.document.write("<html><head><title>Print Page</title>");
  printWindow.document.write(
    '<link rel="stylesheet" href="../assets/css/printApp.css" />'
  ); // định dạng trang in
  printWindow.document.write(
    "</head><body style='width:300px'><div id='printBill'>"
  );
  printWindow.document.write(printBill.innerHTML);
  printWindow.document.write("</div></body></html>");
  // printWindow.document.close();
  setTimeout(function () {
    printWindow.print();
    // printWindow.close();
  }, 800);
  // createInvoice(false);
};
window.printBillKM = () => {
  if (!bills || bills.length <= 0) return;

  let currentdate = new Date();
  let total = 0;
  let date =
    (currentdate.getDate() < 10
      ? "0" + currentdate.getDate()
      : currentdate.getDate()) +
    "/" +
    (currentdate.getMonth() + 1 < 10
      ? "0" + (currentdate.getMonth() + 1)
      : currentdate.getMonth() + 1);
  +currentdate.getFullYear;

  let time =
    (currentdate.getHours() < 10
      ? "0" + currentdate.getHours()
      : currentdate.getHours()) +
    ":" +
    (currentdate.getMinutes() < 10
      ? "0" + currentdate.getMinutes()
      : currentdate.getMinutes());

  var printBill = document.getElementById("printBill"); // lấy nội dung muốn in
  printBill.innerHTML = `
  <div class="logo-bill">
        <img src="../assets/images/logoBill.png" alt="" />
      </div>
      <p class="bill-address bold">E39 tổ 3, ấp Phước Thiện, xã Phước Tỉnh</p>
      <p class="bill-address">(Hẻm nhà hàng Minh Phương vào 100m)</p>
      <p class="bill-address phone">SDT: 05634.03465</p>
      <div class="bill-item">
        <p class="title">PHIẾU THANH TOÁN</p>
        <p class="bill-time">
          <span class="time">${time}</span><span class="date">${date}</span>
        </p>
        <div class="items">
          <table>
          <tbody>
          ${bills
            .map((element) => {
              total += element.total;
              if (element.topping.length > 0) {
                return `<tr>
                <td><span class="name">${element.name} (${element.size})</span>
                  ${element.topping
                    .map((topping) => {
                      return `<span class="topping">${topping.name}</span>`;
                    })
                    .join("")}
                </td>
                <td><span class="quantity">x${element.quantity}</span>
                ${element.topping
                  .map((topping) => {
                    return `<span class="quantityMulti">${
                      topping.quantity > 1
                        ? `<span class="priceOne">${formatNumber(
                            topping.price
                          )}</span><span>x${topping.quantity}</span>`
                        : `x${topping.quantity}`
                    } </span>`;
                  })
                  .join("")}
                 </td>
                <td><span class="total">${formatNumber(element.price)}</span>
                ${element.topping
                  .map((topping) => {
                    return `<span class="total">${formatNumber(
                      topping.total
                    )}</span>`;
                  })
                  .join("")}
                </td>
              </tr>`;
              } else {
                return `<tr>
                <td>${element.name} ${
                  element.group == "NUOC" ? `(${element.size})` : ``
                } </td>
                ${
                  element.quantity > 1
                    ? `  <td class="priceMulti"><span class="priceOne">${formatNumber(
                        element.price
                      )}</span> x${element.quantity}</td>`
                    : `<td>x${element.quantity}</td>`
                }
                <td>${formatNumber(element.total)}</td>
              </tr>`;
              }
            })
            .join("")}
          </tbody>
            <tfoot>
              <tr>
                <td colspan="2">Tổng tiền</td>
                <td>${formatNumber(total)}</td>
              </tr>
              <tr>
                <td colspan="2" style="font-weight: 400;padding: 0;font-style: italic;">Khuyến mãi ${
                  sales[0].sale
                }%</td>
                <td style="padding: 0;border-bottom: 1px dashed;padding-bottom: 5px;">-${formatNumber(
                  (sales[0].sale / 100) * total
                )}</td>
              </tr>
              <tr>
              <td colspan="2">Thành tiền</td>
              <td>${formatNumber(((100 - sales[0].sale) / 100) * total)}</td>
            </tr>
            </tfoot>
          </table>
        </div>
        <p class="thank">♥ Cám ơn quý khách và hẹn gặp lại ♥</p>
      </div>
      `;
  var printWindow = window.open("", "", "width=1280,height=720");
  printWindow.document.write("<html><head><title>Print Page</title>");
  printWindow.document.write(
    '<link rel="stylesheet" href="../assets/css/printApp.css" /> <style type="text/css">@media print { body { margin: 0; } }</style>  '
  ); // định dạng trang in
  printWindow.document.write("</head><body><div id='printBill'>");
  printWindow.document.write(printBill.innerHTML);
  printWindow.document.write("</div></body></html>");
  // printWindow.document.close();
  setTimeout(function () {
    printWindow.print();
    // printWindow.close();
  }, 800);
  createInvoice(true);
};

window.openSaleModal = () => {
  $("#saleModal").modal("show");
};
window.closeSaleModal = () => {
  $("#saleModal").modal("hide");
};
window.handleSaveSale = async () => {
  sales[0].sale = parseInt(saleInput.value) || 0;
  const rest = await API.postData("sales/", sales);
  checkSaleButton();
  closeSaleModal();
};
const checkSaleButton = () => {
  if (saleInput.value == 0) {
    document.querySelector("#khuyenmai").style.display = "none";
  } else {
    document.querySelector("#khuyenmai").style.display = "block";
  }
};
window.handleClickShowCategory = () => {
  $(".category-wrapper").toggleClass("active");
};

window.openBillModal = () => {
  $("#billModal").modal("show");
};
window.closeBillModal = () => {
  $("#billModal").modal("hide");
};
