import { Router } from "express";
import { DB } from "../models/DB";

import { IDataBase } from "../types/interfaces";
const router = Router();

router.get("/", (req, res) => {
	res.status(200);
	DB.getAll().then(result => {
		res.render("edit", { dishes: result.dishes });
	});
});

export { router as editRouter };
