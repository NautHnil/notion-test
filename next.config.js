const path = require("path");

module.exports = {
  trailingSlash: true,
  reactStrictMode: true,
  baseUrl: ".",
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
};
