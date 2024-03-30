export const walmartProductSelectors = {
    imagesSelector: 'img[data-testid="productTileImage"]',
    pricesSelector: 'div.mr1.mr2-xl.b.black.lh-copy.f5.f4-l',
    descriptionSelector: 'span[data-automation-id="product-title"]',
    ratingSelector: 'span[data-testid="product-ratings"]',
    reviewSelector: 'span[data-testid="product-reviews"]',
  }
  
  export const walmartHtmlProductSelectors = {
    imagesSelector: 'img[data-testid="productTileImage"]',
    pricesSelector: 'div.mr1.mr2-xl.lh-copy.f5.f4-l',
    descriptionSelector: 'span[data-automation-id="product-title"]',
    ratingSelector: 'span[data-testid="product-ratings"]',
    reviewSelector: 'span[data-testid="product-reviews"]',
  }
  
  export const walmartHtmlPages = [
    {
      productUrl: 'public/test.html',
      resource: 'Walmart Html',
      category: 'Fruits',
      subCategory: 'Fresh fruits',
    },
  ];
  
  export const frozenFoodsQuery = [
      {
          url: 'https://www.walmart.ca/en/browse/grocery/frozen-food/frozen-fruit/10019_6000194326337_6000194327401?icid=landing/cp_page_grocery_frozen_fruit_21637_S0NMAHBAXA',
          category: 'Frozen Foods',
          subCategory: 'Frozen fruit',
          pages: 1,
      },
      // {
      //     url: 'https://www.walmart.ca/en/browse/grocery/frozen-food/frozen-meat-seafood-alternatives/10019_6000194326337_6000194327396?icid=landing%2Fcp_page_grocery_frozen_meat_seafood_and_alternatives_21629_5LMIE96WVC',
      //     category: 'Frozen Foods',
      //     subCategory: 'Frozen meat, seafood & alternatives',
      //     pages: 5,
      // },
      // {
      //     url: 'https://www.walmart.ca/en/browse/grocery/frozen-food/frozen-meals-sides/10019_6000194326337_6000194327413?icid=landing%2Fcp_page_grocery_frozen_meals_and_sides_21630_LCM513U4KZ',
      //     category: 'Frozen Foods',
      //     subCategory: 'Frozen meals & side dishes',
      //     pages: 8,
      // },
      // {
      //     url: 'https://www.walmart.ca/en/browse/grocery/frozen-food/frozen-pizza/10019_6000194326337_6000194349404?icid=landing%2Fcp_page_grocery_frozen_pizza_21631_MU1Z3OIBQF',
      //     category: 'Frozen Foods',
      //     subCategory: 'Frozen pizza',
      //     pages: 3,
      // },
      // {
      //     url: 'https://www.walmart.ca/en/browse/grocery/frozen-food/frozen-meals-sides/frozen-fries-potatoes/10019_6000194326337_6000194327413_6000202265741?icid=landing%2Fcp_page_grocery_frozen_fries_and_potatoes_21633_ID4AH2M3TS',
      //     category: 'Frozen Foods',
      //     subCategory: 'Frozen fries & potatoes',
      //     pages: 2,
      // },
  ]
  
  export const breadAndBakeryQuery = []
  export const snacksAndCandyQuery = []
  export const drinksQuery = []
  export const cheeseQuery = []