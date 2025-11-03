const fs = require('fs');
const http = require('http');
const url = require('url');

// //////////////////////////
// FILES

// Blocking synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()} `;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File was written!');

// Non-blocking asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) return console.log('ERROR!');

//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     if (err) return console.log('ERROR!');

//     console.log(data2);

//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       if (err) return console.log('ERROR!');

//       console.log(data3);

//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, (err) => {
//         if (err) return console.log('ERROR!');

//         console.log('Your file has been written');
//       });
//     });
//   });
// });
// console.log('Reading...');

// //////////////////////////
// SERVER

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

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

const dataObject = JSON.parse(data);

const server = http.createServer((req, res) => {
  const fullURL = new URL(req.url, `http://${req.headers.host}`);
  const { pathname, searchParams } = fullURL;

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const cardsHtml = dataObject
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const overviewHtml = tempOverview.replace(/{%PRODUCT_CARDS%}/, cardsHtml);

    res.end(overviewHtml);

    // Product page
  } else if (pathname === '/product') {
    const productId = Number(searchParams.get('id'));
    const product = dataObject.find((el) => el.id === productId);
    const productHtml = replaceTemplate(tempProduct, product);

    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    res.end(productHtml);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
    });
    res.end('<h1>Page not found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
