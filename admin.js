import { formatNumber } from "./js/common/numbers.utils.js";

var invoices;
const soly = document.querySelector("#soly");
const sodon = document.querySelector("#sodon");
const doanhthu = document.querySelector("#doanhthu");
const today_date = document.querySelector("#today_date");
const invoice_content = document.querySelector("#invoice_content");
const select_date = document.querySelector("#select_date");
window.onload = async function () {
  //Hôm nay
  changeTextDate(new Date());
  invoices = await getInvoices();
  filterDataByDate(0);
};

const getInvoices = async () => {
  return (await API.getData("invoice")) || [];
};
const changeTextDate = (date) => {
  today_date.innerHTML = convertVnDate(date);
};
window.handleChangeDate = (event) => {
  let selectedDate = new Date(event.value);
  let today = new Date();
  changeTextDate(selectedDate);
  if (convertDate(selectedDate) == convertDate(today)) {
    filterDataByDate(0);
    return;
  }
  if (selectedDate.getTime() < today.getTime()) {
    var timeDiff = Math.abs(selectedDate.getTime() - today.getTime());
    var diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));
    filterDataByDate(diffDays);
  } else {
    filterDataByDate(-1);
  }
};

window.filterDataByDate = (date) => {
  if (date < 0) {
    soly.innerHTML = 0;
    sodon.innerHTML = 0;
    doanhthu.innerHTML = "0 đ";
    renderInvoice([]);
    return;
  }
  let date_now = new Date();
  let date_filter = date_now.setDate(date_now.getDate() - date);
  let filter_invoices = invoices.filter(
    (item) => convertDate(item.date) === convertDate(date_filter)
  );
  let ly = 0;
  let don = filter_invoices.length || 0;
  let tien = 0;
  filter_invoices.forEach(function (item) {
    ly += item.sold;
    tien += item.total;
  });
  soly.innerHTML = ly;
  sodon.innerHTML = don;
  doanhthu.innerHTML = formatNumber(tien) + " đ";
  renderInvoice(filter_invoices);
};
const renderInvoice = (data) => {
  if (data?.length <= 0) {
    invoice_content.innerHTML = ``;
    return;
  }

  invoice_content.innerHTML = data
    .sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    })
    .map((invoice) => {
      return ` <div class="col">
    <div class="card order-history-card">
      <div class="card-body">
        <div
          class="d-flex align-items-center justify-content-between mb-5"
        >
          <div class="">
            <h6 class="heading-title mb-2">Hóa đơn #${invoice.id}</h6>
            <p class="mb-0">${convertVnDate(invoice.date, true)}</p>
          </div>
          <img
          src="./assets/images/avatars/mer.jpg"
            class="img-fluid rounded-pill avatar-50"
            alt=""
          />
        </div>
        <div class="invoice_detail" style="max-height: 188px; min-height:188px;overflow-y: auto;">
        ${invoice.details
          .map((detail, index) => {
            return `<div class="d-flex gap-2 mb-2">
            <p class="pt-3">${index + 1}</p>
          <img
            src="./assets/images/menu/${detail.image}"
            class="img-fluid rounded-pill avatar-60"
            alt=""
          />
          <div class="ms-4 pe-4" style="flex:1">
            <div>
            <h6 class="heading-title fw-bolder">${detail.name} (${
              detail.size
            }) </h6>
            <p class="text-end">x${detail.quantity} - ${formatNumber(
              detail.price
            )}</p>
            </div>            
            ${
              detail.topping
                ? detail?.topping
                    ?.map((topping) => {
                      return `<p class="mb-0 d-flex justify-content-between"><span>${
                        topping.name
                      }</span> <span>x${topping.quantity}  -  ${formatNumber(
                        topping.total
                      )}</span></p>
                    `;
                    })
                    .join("")
                : ``
            }
            <div
              class="d-flex justify-content-between align-items-center border-warning border-top pt-2 pb-2"
            >
              <h6 class="heading-title fw-bolder"></h6>
              <h6 class="heading-title fw-bolder text-primary ">${formatNumber(
                detail.total
              )}</h6>
            </div>
          </div>
        </div>${index === invoice.details.length - 1 ? `` : `<hr />`}`;
          })
          .join("")}
          </div>
        <hr />
        <div
          class="d-flex justify-content-between align-items-center"
        >
          <div class="">
            <p class="mb-0">Số lượng: ${invoice.sold}</p>
            <h6 class="heading-title fw-bolder text-primary">Tổng tiền: ${formatNumber(
              invoice.total
            )}đ</h6>
          </div>
          <div class="d-flex align-items-center">
            <button
              class="btn btn-icon btn-outline-danger rounded ctc-button ms-3"
              data-bs-toggle="modal" data-bs-target=".bd-example-modal-sm"
              onclick="cancelInvoice('${invoice.id}')"
            >
              <span class="btn-inner d-flex align-items-center">
                <span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.6654 5.33496L5.33203 10.6683"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M10.6643 10.6663L5.33203 5.33301"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </span>
                <span class=" pe-2">Hủy</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
    })
    .join("");
};
var temp_invoice;
window.cancelInvoice = (id_invoice) => {
  temp_invoice = id_invoice;
};
window.handleCancelInvoice = async () => {
  const index = invoices.findIndex((element) => element.id === temp_invoice);
  if (index !== -1) {
    invoices.splice(index, 1);
  }
  const rest = await API.postData("invoice/", invoices);
  renderInvoice(invoices);
  filterDataByDate(0);
  $("#cancelInvoice_modal").modal("hide");
};
const convertDate = (date) => {
  let date_convert = new Date(date).toLocaleDateString();
  return date_convert;
};
const convertVnDate = (date, isNumber) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  if (isNumber) {
    return new Date(date).toLocaleString();
  } else {
    return date.toLocaleString("vi-VN", options);
  }
};
