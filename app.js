require("dotenv").config();
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var updateRouter = require("./routes/update");
var updateMemberRouter = require("./routes/updateMember");

var { gcBaseUrl } = require("./config");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/update", updateRouter);
app.use("/updateMember", updateMemberRouter);

module.exports = app;
