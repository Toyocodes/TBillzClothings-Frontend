export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "headphones", label: "Headphones" },
      { id: "airpods", label: "AirPods" },
      { id: "powerbanks", label: "Power Banks" },
      { id: "phones", label: "Phones" },
      { id: "smartwatch", label: "Smartwatch" },
      { id: "laptop", label: "Laptop" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "apple", label: "Apple" },
      { id: "oraimo", label: "Oraimo" },
      { id: "techno", label: "Tecno" },
      { id: "huawei", label: "Huawei" },
      { id: "samsung", label: "Samsung" },
      { id: "dell", label: "Dell" },
      { id: "hp", label: "HP" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];


export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "faq",
    label: "Faqs",
    path: "/shop/faq",
  },
  {
    id: "search",
    label: "Search",
    path: "/search",
  },
];


export const categoryOptionsMap = {
  headphones: "Headphones",
  airpods: "AirPods",
  powerbanks: "Power Banks",
  phones: "Phones",
  smartwatch: "Smartwatch",
  laptop: "Laptop",
};

export const brandOptionsMap = {
  apple: "Apple",
  oraimo: "Oraimo",
  techno: "Tecno",
  huawei: "Huawei",
  samsung: "Samsung",
  dell: "Dell",
  hp: "HP",
};

export const filterOptions = {
  category: [
    { id: "headphones", label: "Headphones" },
    { id: "airpods", label: "AirPods" },
    { id: "powerbanks", label: "Power Banks" },
    { id: "phones", label: "Phones" },
    { id: "smartwatch", label: "Smartwatch" },
    { id: "laptop", label: "Laptop" },
  ],
  brand: [
    { id: "apple", label: "Apple" },
    { id: "oraimo", label: "Oraimo" },
    { id: "techno", label: "Tecno" },
    { id: "huawei", label: "Huawei" },
    { id: "samsung", label: "Samsung" },
    { id: "dell", label: "Dell" },
    { id: "hp", label: "HP" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];
