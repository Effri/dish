import { Router } from "express";
import { DB } from "../models/DB";
const router = Router();
interface IParams {
	key: string;
	value: string;
}

router.get("/", (req, res) => {
	res.status(200);
	const id = req.query.id as string;
	const last = (req.query.last as string) || false;
	let search: "getLastById" | "getById" = last ? "getLastById" : "getById";

	DB[search](id || "").then((result) => {
		res.render("view", {
			...result,
		});
	});
});

export { router as viewRouter };
