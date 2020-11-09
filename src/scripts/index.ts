import express from "express";

import { indexRouter } from "../routes";
import { editRouter } from "../routes/edit";
import { exportRouter } from "../routes/export";
import { moreRouter } from "../routes/more";
import { apiRouter } from "../routes/api";
import { viewRouter } from "../routes/view";
import { searchRouter } from "../routes/search";

import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 80;

app.set("view engine", "pug");
app.set("views", "src/pages");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("src/public"));
app.use(bodyParser.json());

app.use("/", indexRouter);
app.use("/edit", editRouter);
app.use("/export", exportRouter);
app.use("/more", moreRouter);
app.use("/view", viewRouter);
app.use("/search", searchRouter);

app.use("/api", apiRouter);

app.listen(PORT, () => {
	console.log(`Server is runing on ${PORT} port`);
});
