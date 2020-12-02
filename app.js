const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  let url = req.url.slice(1, req.url.length);
  if (!url || url === "") url = "index.html";
  res.writeHead(200, { "content-type": "text/html" });
  fs.exists(url, (exists) => {
    if (!exists) url = "404.html";
    fs.createReadStream(url).pipe(res);
  });
});

server.listen(process.env.PORT || 3000);
