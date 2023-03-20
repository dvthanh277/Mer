window.onload = () => {
  fetch("https://dvthanh277.github.io/Mer/tiemtramer-menu.json")
    .then((response) => response.json())
    .then((data) => {
      return data.product;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
