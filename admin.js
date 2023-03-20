var products = [];
window.onload = async () => {
  await fetch("https://dvthanh277.github.io/Mer/database-tiemtramer.json")
    .then((response) => response.json())
    .then((data) => {
      products = data.product;
      return data.product;
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  console.log(products);
};
