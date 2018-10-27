const path = require("path"),
  express = require("express"),
  app = express();

const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

app.listen(port);
