const replaceTemplate = (temp, product) => {
  let output = temp
    .replace(/{%PRODUCTNAME%}/g, product.productName)
    .replace(/{%IMAGE%}/g, product.image)
    .replace(/{%QUANTITY%}/g, product.quantity)
    .replace(/{%PRICE%}/g, product.price)
    .replace(/{%ID%}/g, product.id)
    .replace(/{%NOT_ORGANIC%}/g, !product.organic && 'not-organic')
    .replace(/{%FROM%}/g, product.from)
    .replace(/{%NUTRIENTS%}/g, product.nutrients)
    .replace(/{%DESCRIPTION%}/g, product.description);

  return output;
};

exports.replaceTemplate = replaceTemplate;
