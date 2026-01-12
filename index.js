const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemp = require("./starter/modules/replaceTemp");

/////////////////////////////////////////////////
// FILES
/////////////////////////////////////////////////
/* Blocking, synchronous way
const textIn = fs.readFileSync("./starter/txt/input.txt", "utf-8");
console.log(textIn);

const textOut = `This is what we know about the avocado: \n${textIn}\nCreated on ${new Date().toISOString()}`;
fs.writeFileSync("./starter/txt/output.txt", textOut);
console.log("File written successfully");

 Non-blocking, asynchronous way

fs.readFile("./starter/txt/startt.txt", "utf-8", (err, data1) => {
  if (err) return console.log("ERROR 💥");

  fs.readFile(`./starter/txt/${data1}.txt`, "utf-8", (err, data2) => {
    console.log(data2);
    fs.readFile("./starter/txt/append.txt", "utf-8", (err, data3) => {
      console.log(data3);
      fs.writeFile("./starter/txt/final.txt", `${data2}\n${data3}`, (err) => {
        console.log("Your file has been written😊");
      });
    });
  });
});
*/
/////////////////////////////////////////////////
// SERVER
/////////////////////////////////////////////////

const tempCard = fs.readFileSync(
  `${__dirname}/starter/templates/template-cards.html`,
  "utf-8"
);
const tempOverview = fs.readFileSync(
  `${__dirname}/starter/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/starter/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(
  `${__dirname}/starter/dev-data/data.json`,
  "utf-8"
);
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/" || pathname === "/overview") {
    // Overview page
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataObj.map((el) => replaceTemp(tempCard, el)).join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
  } else if (pathname === "/product") {
    // Product page
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemp(tempProduct, product);
    res.end(output);
  } else if (pathname === "/api") {
    // API
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else {
    // Not found
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end(`
      <h1>Page not found!</h1>
    `);
  }
});

server.listen(8080, "127.0.0.1", () => {
  console.log("Server is listening on port 8080");
});
