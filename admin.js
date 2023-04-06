import { formatNumber } from "./js/common/numbers.utils.js";

var invoices;
const soly = document.querySelector("#soly");
const sodon = document.querySelector("#sodon");
const doanhthu = document.querySelector("#doanhthu");

const phantramly = document.querySelector("#phantramly");
const phantramdon = document.querySelector("#phantramdon");
const phantramdoanhthu = document.querySelector("#phantramdoanhthu");

const lyhomqua = document.querySelector("#lyhomqua");
const donhomqua = document.querySelector("#donhomqua");
const doanhthuhomqua = document.querySelector("#doanhthuhomqua");

const ly30day = document.querySelector("#ly30day");
const don30day = document.querySelector("#don30day");
const doanhthu30day = document.querySelector("#doanhthu30day");

const today_date = document.querySelector("#today_date");
const invoice_content = document.querySelector("#invoice_content");

//Hôm nay

window.onload = async function () {
  changeTextDate(new Date());
  invoices = await getInvoices();
  filterDataByDate(0);
  filterMonth(0);
};
var chart;
const renderChart = (options, element) => {
  var chart = new ApexCharts(document.querySelector(element), options);
  chart.render();
};

const getInvoices = async () => {
  return (await API.getData("invoice")) || [];
};
const changeTextDate = (date) => {
  today_date.innerHTML = convertVnDate(date);
};
window.handleChangeDate = (event) => {
  let date_now = new Date();
  let selectedDate = new Date(event.value);
  changeTextDate(selectedDate);
  if (convertDate(selectedDate) == convertDate(date_now)) {
    filterDataByDate(0);
    return;
  }
  if (selectedDate.getTime() < date_now.getTime()) {
    var timeDiff = Math.abs(selectedDate.getTime() - date_now.getTime());
    var diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));
    filterDataByDate(diffDays);
  } else {
    filterDataByDate(-1);
  }
};
var currentDate = new Date();
window.nextDay = () => {
  let date_now = new Date();
  currentDate.setDate(currentDate.getDate() + 1);
  changeTextDate(currentDate);
  if (convertDate(currentDate) == convertDate(date_now)) {
    filterDataByDate(0);
    return;
  }
  if (currentDate.getTime() < date_now.getTime()) {
    var timeDiff = Math.abs(currentDate.getTime() - date_now.getTime());
    var diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));
    filterDataByDate(diffDays);
  } else {
    filterDataByDate(-1);
  }
};
window.prevDay = () => {
  let date_now = new Date();
  currentDate.setDate(currentDate.getDate() - 1);
  changeTextDate(currentDate);
  if (convertDate(currentDate) == convertDate(date_now)) {
    filterDataByDate(0);
    return;
  }
  if (currentDate.getTime() < date_now.getTime()) {
    var timeDiff = Math.abs(currentDate.getTime() - date_now.getTime());
    var diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));
    filterDataByDate(diffDays);
  } else {
    filterDataByDate(-1);
  }
};
window.toDay = () => {
  let date_now = new Date();
  currentDate = new Date();
  changeTextDate(currentDate);
  if (convertDate(currentDate) == convertDate(date_now)) {
    filterDataByDate(0);
    return;
  }
  if (currentDate.getTime() < date_now.getTime()) {
    var timeDiff = Math.abs(currentDate.getTime() - date_now.getTime());
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
    lyhomqua.innerHTML = 0;
    donhomqua.innerHTML = 0;
    doanhthuhomqua.innerHTML = 0 + " đ";

    let ly_ss = 0;
    let don_ss = 0;
    let tien_ss = 0;
    handlePhantram(phantramdoanhthu, tien_ss, "đ");
    handlePhantram(phantramly, ly_ss, "ly");
    handlePhantram(phantramdon, don_ss, "đơn");
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

  let date_now2 = new Date();
  let date_filter2 = date_now2.setDate(date_now2.getDate() - 1 - date);
  let filter_invoices2 = invoices.filter(
    (item) => convertDate(item.date) === convertDate(date_filter2)
  );
  let ly2 = 0;
  let don2 = filter_invoices2.length || 0;
  let tien2 = 0;
  filter_invoices2.forEach(function (item) {
    ly2 += item.sold;
    tien2 += item.total;
  });
  lyhomqua.innerHTML = ly2;
  donhomqua.innerHTML = don2;
  doanhthuhomqua.innerHTML = formatNumber(tien2) + " đ";

  let ly_ss = ly - ly2;
  let don_ss = don - don2;
  let tien_ss = tien - tien2;
  handlePhantram(phantramdoanhthu, tien_ss, "đ");
  handlePhantram(phantramly, ly_ss, "ly");
  handlePhantram(phantramdon, don_ss, "đơn");

  // phantramly.querySelector("span").innerHTML = ;
  // phantramdon.querySelector("span").innerHTML = don - don2;
  // phantramdoanhthu.querySelector("span").innerHTML =
  //   formatNumber(tien - tien2) + " đ";
};
const handlePhantram = (element, value, unit) => {
  if (unit !== "đ") {
    element.querySelector("span").innerHTML = value + " " + unit;
  } else {
    element.querySelector("span").innerHTML = formatNumber(value) + " " + unit;
  }
  if (value == 0) {
    element.classList.remove("bg-success");
    element.classList.remove("bg-danger");
    element.classList.add("bg-warning");
    element.querySelector("svg").style.transform = "rotate(90deg)";
    return;
  }
  if (value < 0) {
    element.classList.remove("bg-warning");
    element.classList.remove("bg-success");
    element.classList.add("bg-danger");
    element.querySelector("svg").style.transform = "rotate(-180deg)";
  } else {
    element.classList.remove("bg-warning");
    element.classList.remove("bg-danger");
    element.classList.add("bg-success");
    element.querySelector("svg").style.transform = "rotate(0)";
  }
};
var currentMonth = 0;
window.nextMonth = () => {
  currentMonth += -1;
  console.log(chart);
  filterMonth(currentMonth);
};
window.prevMonth = () => {
  currentMonth += 1;
  console.log(currentMonth);

  filterMonth(currentMonth);
};
window.toMonth = () => {
  currentMonth = 0;
  filterMonth(currentMonth);
};

window.filterMonth = (month_filter) => {
  const now_date = new Date();
  let date_filter = now_date.setMonth(now_date.getMonth() - month_filter);
  let filter_month = new Date(date_filter).getMonth();
  let filter_year = new Date(date_filter).getFullYear();

  document.querySelector("#monthNow").innerHTML =
    `Tháng ` +
    (filter_month + 1 < 10 ? `0` + (filter_month + 1) : filter_month + 1);
  var daysInMonth = getDaysInMonth(filter_month, filter_year);
  document.querySelector("#chart-doanhthu").innerHTML = ``;
  document.querySelector("#chart-sodon").innerHTML = ``;

  let filter_invoices = invoices.filter(
    (item) => new Date(item.date).getMonth() === filter_month
  );
  let ly = 0;
  let don = filter_invoices.length || 0;
  let tien = 0;
  filter_invoices.forEach(function (item) {
    ly += item.sold;
    tien += item.total;
  });
  ly30day.innerHTML = ly;
  don30day.innerHTML = don;
  doanhthu30day.innerHTML = formatNumber(tien) + " đ";
  let data_doanhthu = [];
  let data_soly = [];
  let data_sodon = [];

  daysInMonth.forEach(function (item) {
    let date_item = filter_invoices.filter(
      (invoice) => new Date(invoice.date).getDate() === item
    );
    if (date_item.length > 0) {
      let tien = 0;
      let ly = 0;
      let don = date_item.length;
      date_item.forEach(function (item2) {
        ly += item2.sold;
        tien += item2.total;
      });
      data_sodon.push(don);
      data_soly.push(ly);
      data_doanhthu.push(tien);
    } else {
      data_sodon.push(0);
      data_soly.push(0);
      data_doanhthu.push(0);
    }
  });
  var options_doanhthu = {
    series: [
      {
        name: "Doanh thu",
        data: data_doanhthu,
      },
    ],
    colors: ["#35a571"],
    chart: {
      type: "bar",
      height: 268,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "80%",
        endingShape: "rounded",
        borderRadius: 3,
        dataLabels: {
          position: "top", // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        if (val > 0) {
          return val / 1000 + "k";
        } else {
          return "";
        }
      },
      offsetY: -16,
      style: {
        fontSize: "9px",
        colors: ["#000"],
      },
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["transparent"],
    },
    xaxis: {
      categories: daysInMonth,
    },
    yaxis: {
      enabled: false,
      labels: {
        formatter: (val) => {
          if (val > 2) {
            return val / 1000 + "k";
          } else {
            return 0;
          }
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        formatter: function (val) {
          return "Ngày " + val + " tháng " + (filter_month + 1);
        },
      },
      y: {
        formatter: function (val) {
          return formatNumber(val) + "  đ";
        },
      },
    },
  };
  renderChart(options_doanhthu, "#chart-doanhthu");
  var options_lydon = {
    series: [
      {
        name: "Số đơn",
        data: data_sodon,
      },
      {
        name: "Số ly",
        data: data_soly,
      },
    ],

    colors: ["#10b9d3", "#d35f10"],
    chart: {
      type: "bar",
      height: 268,
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "80%",
        endingShape: "rounded",
        borderRadius: 2,
        dataLabels: {
          position: "top", // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val;
      },
      offsetY: 0,
      style: {
        fontSize: "9px",
        colors: ["#fff"],
      },
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["transparent"],
    },
    xaxis: {
      categories: daysInMonth,
    },
    yaxis: {
      enabled: false,
      labels: {
        formatter: (val) => {
          if (val > 2) {
            return val;
          } else {
            return 0;
          }
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      x: {
        formatter: function (val) {
          return "Ngày " + val + " tháng " + (filter_month + 1);
        },
      },
      y: {
        formatter: function (val) {
          return formatNumber(val) + "  đ";
        },
      },
    },
  };
  renderChart(options_lydon, "#chart-sodon");
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

const getDaysInMonth = (month, year) => {
  const date = new Date(year, month, 1);
  const days = [];

  while (date.getMonth() === month) {
    days.push(new Date(date).getDate());
    date.setDate(date.getDate() + 1);
  }
  return days;
};
