const express = require("express");

const app = express();
app.use(express.static('/app/html'));

app.listen(80);