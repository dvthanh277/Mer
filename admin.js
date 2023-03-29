import { formatNumber } from "./js/common/numbers.utils.js";

var invoices;
const soly = document.querySelector("#soly");
const sodon = document.querySelector("#sodon");
const doanhthu = document.querySelector("#doanhthu");
const today_date = document.querySelector("#today_date");

window.onload = async function () {
  //Hôm nay
  const dateNow = new Date();
  today_date.innerHTML = `${getDayOfWeek(dateNow)} , ${dateNow.getDate()}/${
    dateNow.getMonth() + 1
  }/${dateNow.getFullYear()}`;

  invoices = await getInvoices();
  filterDataByDate(0);
};

const getInvoices = async () => {
  return (await API.getData("invoice")) || [];
};

window.filterDataByDate = (date) => {
  let date_now = new Date();
  let date_filter = date_now.setDate(date_now.getDate() - date);
  let filter_invoices = invoices.filter(
    (item) => convertDate(item.date) == convertDate(date_filter)
  );
  if (filter_invoices.length > 0) {
    let ly = 0;
    let don = filter_invoices.length;
    let tien = 0;
    filter_invoices.forEach(function (item) {
      ly += item.sold;
      tien += item.total;
    });
    switch (date) {
      case 0:
        soly.innerHTML = ly;
        sodon.innerHTML = don;
        doanhthu.innerHTML = formatNumber(tien) + " đ";
        break;
      case 1:
        break;
      case 7:
        break;
      case 30:
        break;
      default:
        break;
    }
  } else {
    switch (date) {
      case 0:
        soly.innerHTML = 0;
        sodon.innerHTML = 0;
        doanhthu.innerHTML = "0 đ";
        break;
      case 1:
        break;
      case 7:
        break;
      case 30:
        break;
      default:
        break;
    }
  }
};

function getDayOfWeek(date) {
  const daysOfWeek = [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ];
  return daysOfWeek[date.getDay()];
}
const convertDate = (date) => {
  let date_convert = new Date(date)
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");
  return date_convert;
};
