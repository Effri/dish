import { Router } from "express";
import { DB } from "../models/DB";
const router = Router();

router.get("/", (req, res) => {
	DB.getAll().then((result) => {
		res.status(200);
		res.render("search", { all: result.dishes });
	});
});

export { router as searchRouter };
