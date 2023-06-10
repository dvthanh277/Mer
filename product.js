import { formatNumber } from "./js/common/numbers.utils.js";

const datatable_inner = document.querySelector("#datatable tbody");
var products;

window.onload = async function () {
  await getProducts();

  $('[data-toggle="data-table"]').DataTable({
    dom: '<"row align-items-center"<"col-md-6" l><"col-md-6" f>><"table-responsive my-3" rt><"row align-items-center" <"col-md-6" i><"col-md-6" p>><"clear">',
    pageLength: 50,
    language: {
      decimal: "",
      emptyTable: "Không có dữ liệu",
      info: "",
      infoEmpty: "",
      infoFiltered: "",
      infoPostFix: "",
      thousands: ",",
      lengthMenu: " _MENU_ dòng",
      loadingRecords: "Loading...",
      processing: "",
      search: "Tìm kiếm:",
      zeroRecords: "Không tìm thấy dữ liệu",
      paginate: {
        first: "Đầu tiên",
        last: "Cuối cùng",
        next: "Tiếp ",
        previous: "Trước",
      },
      aria: {
        sortAscending: ": activate to sort column ascending",
        sortDescending: ": activate to sort column descending",
      },
    },
  });
};

const getProducts = async () => {
  products = await API.getData("product");
  //   topping = await API.getData("topping");
  renderProduct(products);
};
const renderProduct = (data) => {
  if (data) {
    datatable_inner.innerHTML = data
      .map((element, index) => {
        console.log(element.sizes.length);
        let sizeM = formatNumber(element?.sizes[0]?.price) || "-";
        let sizeL = formatNumber(element?.sizes[1]?.price) || "-";
        return `<tr>
        <td>${element.id}</td>
        <td> <img src="./assets/images/menu/${
          element.image
        }" style="width: 48px;border-radius: 30%;" alt="profile-image"></td>
        <td><span class="menu_text_${index}" id="text_name_${index}">${
          element.name
        }</span> <input class="menu_input_${index} hide menu_input" type="text" value="${
          element.name
        }" id="input_name_${index}">
        </td>
        <td><span class="menu_text_${index}" id="text_priceM_${index}">${sizeM}</span> <input class="menu_input_${index} hide menu_input" type="number" min="0" value="${
          element?.sizes[0]?.price
        }" id="input_priceM_${index}"></td>
        <td><span class="menu_text_${index}" id="text_priceL_${index}">${sizeL}</span> ${
          sizeL !== "-"
            ? `<input class="menu_input_${index} hide menu_input" type="number" min="0" value="${element?.sizes[1]?.price}" id="input_priceL_${index}">`
            : ``
        }</td>
        <td>${element.type}</td>
        <td>${element.sold}</td>
        <td style="text-align: right">
        <button
        class="btn btn-sm btn-warning mt-2 me-2 menu_button_edit_${index}"
        type="button"
        onclick="handleEditRow(${index})"
      >
        <svg
          width="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M9.3764 20.0279L18.1628 8.66544C18.6403 8.0527 18.8101 7.3443 18.6509 6.62299C18.513 5.96726 18.1097 5.34377 17.5049 4.87078L16.0299 3.69906C14.7459 2.67784 13.1541 2.78534 12.2415 3.95706L11.2546 5.23735C11.1273 5.39752 11.1591 5.63401 11.3183 5.76301C11.3183 5.76301 13.812 7.76246 13.8651 7.80546C14.0349 7.96671 14.1622 8.1817 14.1941 8.43969C14.2471 8.94493 13.8969 9.41792 13.377 9.48242C13.1329 9.51467 12.8994 9.43942 12.7297 9.29967L10.1086 7.21422C9.98126 7.11855 9.79025 7.13898 9.68413 7.26797L3.45514 15.3303C3.0519 15.8355 2.91395 16.4912 3.0519 17.1255L3.84777 20.5761C3.89021 20.7589 4.04939 20.8879 4.24039 20.8879L7.74222 20.8449C8.37891 20.8341 8.97316 20.5439 9.3764 20.0279ZM14.2797 18.9533H19.9898C20.5469 18.9533 21 19.4123 21 19.9766C21 20.5421 20.5469 21 19.9898 21H14.2797C13.7226 21 13.2695 20.5421 13.2695 19.9766C13.2695 19.4123 13.7226 18.9533 14.2797 18.9533Z"
            fill="currentColor"
          ></path>
        </svg>
        Sửa
      </button>
      <button
      class="btn btn-sm btn-success mt-2 me-2 hide menu_button_confirm_${index}"
      type="button"
      onclick="handleConfirmRow(${index})"
    >
    <svg width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C6.48 22 2 17.51 2 12C2 6.48 6.48 2 12 2C17.51 2 22 6.48 22 12C22 17.51 17.51 22 12 22ZM16 10.02C15.7 9.73 15.23 9.73 14.94 10.03L12 12.98L9.06 10.03C8.77 9.73 8.29 9.73 8 10.02C7.7 10.32 7.7 10.79 8 11.08L11.47 14.57C11.61 14.71 11.8 14.79 12 14.79C12.2 14.79 12.39 14.71 12.53 14.57L16 11.08C16.15 10.94 16.22 10.75 16.22 10.56C16.22 10.36 16.15 10.17 16 10.02Z" fill="currentColor"></path>                            </svg>                        
      OK
    </button>
      <button
        class="btn btn-sm btn-danger mt-2"
        type="button"
        onclick="handleDeleteRow(${index})"
      >
        <svg
          width="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M20.2871 5.24297C20.6761 5.24297 21 5.56596 21 5.97696V6.35696C21 6.75795 20.6761 7.09095 20.2871 7.09095H3.71385C3.32386 7.09095 3 6.75795 3 6.35696V5.97696C3 5.56596 3.32386 5.24297 3.71385 5.24297H6.62957C7.22185 5.24297 7.7373 4.82197 7.87054 4.22798L8.02323 3.54598C8.26054 2.61699 9.0415 2 9.93527 2H14.0647C14.9488 2 15.7385 2.61699 15.967 3.49699L16.1304 4.22698C16.2627 4.82197 16.7781 5.24297 17.3714 5.24297H20.2871ZM18.8058 19.134C19.1102 16.2971 19.6432 9.55712 19.6432 9.48913C19.6626 9.28313 19.5955 9.08813 19.4623 8.93113C19.3193 8.78413 19.1384 8.69713 18.9391 8.69713H5.06852C4.86818 8.69713 4.67756 8.78413 4.54529 8.93113C4.41108 9.08813 4.34494 9.28313 4.35467 9.48913C4.35646 9.50162 4.37558 9.73903 4.40755 10.1359C4.54958 11.8992 4.94517 16.8102 5.20079 19.134C5.38168 20.846 6.50498 21.922 8.13206 21.961C9.38763 21.99 10.6811 22 12.0038 22C13.2496 22 14.5149 21.99 15.8094 21.961C17.4929 21.932 18.6152 20.875 18.8058 19.134Z"
            fill="currentColor"
          ></path>
        </svg>
        Xóa
      </button>
        </td>
        </tr>`;
      })
      .join("");
  }
};

window.handleEditRow = (id) => {
  console.log(id);
  $(".menu_text_" + id).hide();
  $(".menu_button_edit_" + id).hide();
  $(".menu_input_" + id).show();
  $(".menu_button_confirm_" + id).show();
};
window.handleConfirmRow = async (id) => {
  products[id].name = $("#input_name_" + id).val();
  products[id].sizes[0].price = $("#input_priceM_" + id).val();
  if (products[id].sizes.length > 1) {
    products[id].sizes[1].price = $("#input_priceL_" + id).val();
  }
  $(".menu_text_" + id).show();
  $(".menu_button_edit_" + id).show();
  $(".menu_input_" + id).hide();
  $(".menu_button_confirm_" + id).hide();

  console.log(products[id]);
  const rest = await API.postData("product/", products);
  // await getProducts();
  renderProduct(products);
};
window.handleDeleteRow = (id) => {
  console.log(id);
};
