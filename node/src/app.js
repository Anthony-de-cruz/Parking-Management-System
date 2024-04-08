const port = process.env.PORT || 8080;

const http = require("http");
const server = http.createServer((request, response) => {
    response.end("Hello" + request);
});
server.listen(port);

console.log("Node Server is running on port: " + port);
