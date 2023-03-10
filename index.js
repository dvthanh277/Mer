import { formatNumber } from "./js/common/numbers.utils.js";

const menu_items = document.querySelector("#menu_items");
const topping_items = document.querySelector("#topping_items");
const bill_items = document.querySelector("#bill_items");
const search_input = document.querySelector("#search_input");
const total_quantity_element = document.querySelector("#total_quantity");
const total_money_element = document.querySelector("#total_money");
var products;
var topping;
var bills = [];
var topping_adds = [];
window.onload = async function () {
  getProducts();
  search_input.focus();
  search_input.addEventListener("input", function (e) {
    handleSearch(search_input.value);
  });

  document.addEventListener("keydown", function (event) {
    switch (event.code) {
      case "F1":
        printPage();
        break;
      case "F2":
        printBill();
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
    };
    bills.push(item);
  }
  renderBill(bills);
};
var idTemp, sizeTemp;
window.openToppingModal = (id, size) => {
  idTemp = id;
  sizeTemp = size;
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
      product[0].id + sizeTemp + "TP" + Math.floor(Math.random() * 1000),
    size: sizeTemp,
    price: price,
    quantity: 1,
    idProduct: product[0].id,
    total: price_total,
    topping: topping_adds,
  };
  bills.push(item);
  $("#toppingModal").modal("hide");
  topping_adds = [];
  renderBill(bills);
  console.log(bills);
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
  console.log(topping);
  renderProduct(products);
  renderTopping(topping);
};
const renderProduct = (data) => {
  if (data) {
    menu_items.innerHTML = data
      .map((element) => {
        return `<div class="col">
        <div
          class="card card-white dish-card profile-img mb-0 index"
        >
          <div class="profile-img21">
            <img
              src="./assets/images/menu/${element.image}"
              class="img-fluid rounded-pill avatar-170"
              alt="profile-image"
            />
          </div>
          <div class="card-body menu-image">
            <h6 class="heading-title fw-bolder mt-4 mb-0">
              ${element.name}
            </h6>
            <p class="mt-1 mb-0 pb-4   iq-calories small">???? b??n: ${
              element.sold
            }</p>
            <div class="d-flex mt-1 flex-wrap">
              ${element.sizes
                .map((size) => {
                  return `<div class="d-flex align-items-center justify-content-between col-12 mb-2">
                <span class="text-primary fw-bolder me-2">${formatNumber(
                  size.price
                )} ??</span>
                <div class="d-flex align-items-center justify-content-between">
            
              <button class="btn btn-success btn-sm rounded-pill fw-bolder" onclick="handleAddItem('${
                element.id
              }','${size.name}')" style="min-width:47px">
            ${size.name}</button>

              <button class="btn btn-warning btn-xs rounded-pill ms-3" onclick="openToppingModal('${
                element.id
              }','${size.name}')">
              Topping</button>
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
        return `<div class="col-4 mb-3" onclick="handleAddTopping('${
          element.id
        }')" >
        <div
          class="card card-white dish-card profile-img mb-0 index"
        >
          <div class="p-3">
            <h6 class="heading-title fw-bolder mt-2 mb-0">
              ${element.name}
            </h6>
            <div class="d-flex mt-1 flex-wrap">
            <div class="d-flex align-items-center justify-content-between col-12 mb-2">
            <span class="text-primary fw-bolder me-2">${formatNumber(
              element.price
            )} ??</span>
            </div>
            </div>

          </div>
        </div>
      </div>`;
      })
      .join("");
  }
};

window.handleAddTopping = (id_topping) => {
  const index = topping_adds.findIndex((element) => element.id === id_topping);
  if (index !== -1) {
    topping_adds[index].quantity += 1;
    topping_adds[index].total =
      topping_adds[index].quantity * topping_adds[index].price;
  } else {
    const topping = returnToppingItem(id_topping);
    let item = {
      id: topping[0].id,
      name: topping[0].name,
      price: topping[0].price,
      quantity: 1,
      total: topping[0].price,
    };
    topping_adds.push(item);
  }
  console.log(topping_adds);
  // renderToppingAdd(topping_adds);
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
        return `  <div class=" bill-item iq-my-cart">
      <div
        class="d-flex align-items-center justify-content-between profile-img4"
      >
        <div class="profile-img11">
          <img
            src="./assets/images/menu/${element.image}"
            class="img-fluid rounded-pill avatar-115"
            alt="img"
          />
        </div>
        <div class="d-flex align-items-center profile-content">
          <div>
            <h6 class="mb-1 heading-title fw-bolder">
              ${element.name} (Size: ${element.size})
            </h6>
            <span class="d-flex align-items-center">
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
        <div class="me-4 text-end">
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
                )}??</span>${formatNumber(element.total)} ??`
              : `${formatNumber(element.total)}??`
          }</p>
        </div>
      </div>
      ${element.topping
        .map((topping) => {
          return `
        <div class="d-flex align-items-center justify-content-between profile-img4">
        <div class="d-flex align-items-center profile-content" style="margin-left: 125px">
          <div>
            <h6 class="mb-1 heading-title">
              ${topping.name}
            </h6>
            <span class="d-flex align-items-center">
              <button type="button" class="btn btn-primary btn-xs" onclick="handleDecreaseTopping('${
                topping.id
              }')"> - </button>
              <small class="text-dark fw-bold ms-3 me-3">x ${
                topping.quantity
              }</small>
              <button type="button" class="btn btn-primary btn-xs" onclick="handleIncreaseTopping('${
                topping.id
              }')"> + </button>
            </span>
          </div>
        </div>
        <div class="me-4 text-end">
          <span class="mb-1" onclick="handleDeleteTopping('${topping.id}')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.4" d="M19.6449 9.48924C19.6449 9.55724 19.112 16.298 18.8076 19.1349C18.6169 20.8758 17.4946 21.9318 15.8111 21.9618C14.5176 21.9908 13.2514 22.0008 12.0055 22.0008C10.6829 22.0008 9.38936 21.9908 8.1338 21.9618C6.50672 21.9228 5.38342 20.8458 5.20253 19.1349C4.88936 16.288 4.36613 9.55724 4.35641 9.48924C4.34668 9.28425 4.41281 9.08925 4.54703 8.93126C4.67929 8.78526 4.86991 8.69727 5.07026 8.69727H18.9408C19.1402 8.69727 19.3211 8.78526 19.464 8.93126C19.5973 9.08925 19.6644 9.28425 19.6449 9.48924" fill="#E60A0A"></path>
              <path d="M21 5.97686C21 5.56588 20.6761 5.24389 20.2871 5.24389H17.3714C16.7781 5.24389 16.2627 4.8219 16.1304 4.22692L15.967 3.49795C15.7385 2.61698 14.9498 2 14.0647 2H9.93624C9.0415 2 8.26054 2.61698 8.02323 3.54595L7.87054 4.22792C7.7373 4.8219 7.22185 5.24389 6.62957 5.24389H3.71385C3.32386 5.24389 3 5.56588 3 5.97686V6.35685C3 6.75783 3.32386 7.08982 3.71385 7.08982H20.2871C20.6761 7.08982 21 6.75783 21 6.35685V5.97686Z" fill="#E60A0A"></path>
            </svg>
          </span>
          <p class="mb-0 text-dark">${formatNumber(topping.total)} ??</p>
        </div>
      </div>`;
        })
        .join("")}
    </div>`;
      })
      .join("");
    total_money_element.innerHTML = formatNumber(total_money) + " ??";
    total_quantity_element.innerHTML =
      "T???ng c???ng: " + total_quantity + " ly - ";
  }
};
window.handleIncrease = (invoice_id) => {
  const index = bills.findIndex((element) => element.invoiceId === invoice_id);
  console.log(index);
  if (index !== -1) {
    bills[index].quantity += 1;
    bills[index].total = bills[index].quantity * bills[index].price;
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
  let bill_search = [...products];
  if (!search_value) {
    renderProduct(products);
    return;
  }
  bill_search = bill_search.filter(
    (element) =>
      element.name.toLowerCase().includes(search_value.toLowerCase()) == true ||
      toSlug(element.name).includes(search_value.toLowerCase()) == true
  );
  renderProduct(bill_search);
};
function toSlug(str) {
  str = str.toLowerCase();
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return str;
}

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
  bills.map((element) => {
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
  var printContent = document.getElementById("printContent"); // l???y n???i dung mu???n in
  printContent.innerHTML = printBill
    .map((element) => {
      return ` <div class="print-item">
    <p class="print-shop">Ti???m tr?? Mer</p>
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
          )}??</span>${formatNumber(element.total)}??`
        : `${formatNumber(element.price)}??`
    }</p>
    
  </div>`;
    })
    .join("");
  var printWindow = window.open("", "", "width=1280,height=720"); // m??? c???a s??? in m???i v???i k??ch th?????c 72x22mm
  printWindow.document.write("<html><head><title>Print Page</title>"); // t???o ti??u ????? cho trang in
  printWindow.document.write(
    '<style type="text/css">@media print { body { margin: 0; } }</style>     <link rel="stylesheet" href="./assets/css/print.css" />'
  ); // ?????nh d???ng trang in
  printWindow.document.write("</head><body><div id='printContent'>");
  printWindow.document.write(printContent.innerHTML); // in n???i dung mu???n in v??o trang in m???i
  printWindow.document.write("</div></body></html>");
  // printWindow.document.close(); // ????ng trang in m???i
  // setTimeout(function () {
  //   printWindow.print(); // th???c hi???n l???nh in trang in m???i
  //   printWindow.close(); // ????ng trang in m???i sau khi in xong
  // }, 500);
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

  var printBill = document.getElementById("printBill"); // l???y n???i dung mu???n in
  printBill.innerHTML = `
  <div class="logo-bill">
        <img src="./assets/images/logoBill.png" alt="" />
      </div>
      <p class="bill-address bold">E39 t??? 3, ???p Ph?????c Thi???n, x?? Ph?????c T???nh</p>
      <p class="bill-address">(H???m nh?? h??ng Minh Ph????ng v??o 100m)</p>
      <p class="bill-address phone">SDT: 05634.03465</p>
      <div class="bill-item">
        <p class="title">PHI???U THANH TO??N</p>
        <p class="bill-time">
          <span class="time">${time}</span><span class="date">${date}</span>
        </p>
        <div class="items">
          <table>
            <tbody>
            ${bills
              .map((element) => {
                console.log(element);
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
                      return `<span class="quantity">x${topping.quantity}</span>`;
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
                  <td>${element.name} (${element.size})</td>
                  <td>x${element.quantity}</td>
                  <td>${formatNumber(element.total)}</td>
                </tr>`;
                }
              })
              .join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2">T???ng ti???n</td>
                <td>${formatNumber(total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p class="thank">??? C??m ??n qu?? kh??ch v?? h???n g???p l???i ???</p>
      </div>
      `;
  var printWindow = window.open("", "", "width=1280,height=720"); // m??? c???a s??? in m???i v???i k??ch th?????c 72x22mm
  printWindow.document.write("<html><head><title>Print Page</title>"); // t???o ti??u ????? cho trang in
  printWindow.document.write(
    '<style type="text/css">@media print { body { margin: 0; } }</style>     <link rel="stylesheet" href="./assets/css/print.css" />'
  ); // ?????nh d???ng trang in
  printWindow.document.write("</head><body><div id='printBill'>");
  printWindow.document.write(printBill.innerHTML); // in n???i dung mu???n in v??o trang in m???i
  printWindow.document.write("</div></body></html>");
  // printWindow.document.close(); // ????ng trang in m???i
  // setTimeout(function () {
  //   printWindow.print(); // th???c hi???n l???nh in trang in m???i
  //   printWindow.close(); // ????ng trang in m???i sau khi in xong
  // }, 500);
};
