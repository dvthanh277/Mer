const menu = [
  {
    name: "Trà sữa truyền thống",
    priceM: 20000,
    priceL: 25000,
    image: "default.png",
    type: "TRASUA",
  },
  {
    name: "Trà sữa thái xanh",
    priceM: 20000,
    priceL: 25000,
    image: "default.png",
    type: "TRASUA",
  },
  {
    name: "Trà sữa gạo rang",
    priceM: 20000,
    priceL: 25000,
    image: "default.png",
    type: "TRASUA",
  },
  {
    name: "Trà sữa phủ socola",
    priceM: 25000,
    priceL: 29000,
    image: "default.png",
    type: "TRASUA",
  },
  {
    name: "Trà sữa phủ matcha",
    priceM: 25000,
    priceL: 29000,
    image: "default.png",
    type: "TRASUA",
  },
  {
    name: "Trà sữa bánh plan",
    priceM: 25000,
    priceL: 29000,
    image: "default.png",
    type: "TRASUA",
  },
  {
    name: "Trà sữa phô mai tươi",
    priceM: 25000,
    priceL: 29000,
    image: "default.png",
  },
  {
    name: "Trà sữa phô mai viên",
    priceM: 25000,
    priceL: 29000,
    image: "default.png",
    type: "TRASUA",
  },
  {
    name: "Trà lài tắc",
    priceL: 15000,
    image: "default.png",
    type: "TRA",
  },
  {
    name: "Trà đen",
    priceL: 18000,
    image: "default.png",
    type: "TRA",
  },
  {
    name: "Trà gạo rang",
    priceL: 18000,
    image: "default.png",
    type: "TRA",
  },
  {
    name: "Trà táo",
    priceL: 18000,
    image: "default.png",
    type: "TRA",
  },
  {
    name: "Trà vải",
    priceL: 22000,
    image: "default.png",
    type: "TRA",
  },
  {
    name: "Trà lựu",
    priceL: 22000,
    image: "default.png",
    type: "TRA",
  },
  {
    name: "Trà dâu",
    priceL: 25000,
    image: "default.png",
    type: "TRA",
  },
  {
    name: "Trà atiso đỏ",
    priceL: 22000,
    image: "default.png",
    type: "TRA",
  },
  {
    name: "Trà đào",
    priceL: 22000,
    image: "default.png",
    type: "TRA",
  },
  {
    name: "Trà đào cam xả",
    priceL: 27000,
    image: "default.png",
    type: "TRA",
  },
  {
    name: "Trà đen milk foam",
    priceM: 22000,
    image: "default.png",
    type: "MILKFOAM",
  },
  {
    name: "Trà sữa milk foam",
    priceM: 25000,
    image: "default.png",
    type: "MILKFOAM",
  },
  {
    name: "Thái xanh milk foam",
    priceM: 25000,
    image: "default.png",
    type: "MILKFOAM",
  },
  {
    name: "Trà sen vàng",
    priceM: 25000,
    image: "default.png",
    type: "TRA",
  },
  {
    name: "Sữa tươi đường đen",
    priceM: 22000,
    image: "default.png",
    type: "SUATUOI",
  },
  {
    name: "Sữa tươi đường đen socola",
    priceM: 25000,
    image: "default.png",
    type: "SUATUOI",
  },
  {
    name: "Sữa tươi đường đen matcha",
    priceM: 25000,
    image: "default.png",
    type: "SUATUOI",
  },
  {
    name: "Coffee đen đá",
    priceM: 12000,
    image: "default.png",
    type: "COFFEE",
  },
  {
    name: "Coffee sữa",
    priceM: 15000,
    image: "default.png",
    type: "COFFEE",
  },
  {
    name: "Coffee sữa tươi",
    priceM: 17000,
    image: "default.png",
    type: "COFFEE",
  },
  {
    name: "Coffee macchiato",
    priceM: 22000,
    image: "default.png",
    type: "COFFEE",
  },
];
var menuObj = {
  product: [],
};

menu.forEach((element, index) => {
  let temp = {
    cost: 0,
    id: 1000 + index,
    image: element.image,
    name: element.name,
    sizes: [],
    sold: 0,
    type: element.type,
  };
  if (element.priceM > 0) {
    temp.sizes.push({
      name: "M",
      price: element.priceM,
    });
  }
  if (element.priceL > 0) {
    temp.sizes.push({
      name: "L",
      price: element.priceL,
    });
  }
  menuObj.product.push(temp);
});
console.log(menuObj);
