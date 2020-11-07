import { Router } from "express";
import { DB } from "../models/DB";

const router = Router();
router.get("/", (req, res) => {
	res.redirect("/home");
});

router.get("/home", (req, res) => {
	res.status(200);
	DB.getLast().then((result) => {
		res.render("index", {
			lastDishes: [...result.reverse()],
			lunchTypes: ["Завтрак", "Обед", "Ужин", "Полдник"],
		});
	});
});

export { router as indexRouter };
