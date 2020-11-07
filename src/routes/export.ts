import { Router } from "express";
import { DB } from "../models/DB";

const router = Router();

router.get("/", (req, res) => {
	res.status(200);

	res.render("export", {});
});

export { router as exportRouter };
