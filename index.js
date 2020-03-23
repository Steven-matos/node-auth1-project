require("dotenv").config();

const server = require("./api/server");

const PORT = process.env.PORT_NUM || 5000;

server.listen(PORT, () => console.log(`\n** Runing on port ${PORT}...`));
