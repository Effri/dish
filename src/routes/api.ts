import { Router } from "express";
import { DB } from "../models/DB";
import { IDish, IParams } from "../types/interfaces";
import { v4 as uuidv4 } from "uuid";
const getIp = require("ipware")().get_ip;
const router = Router();

router.delete("/delete", (req, res) => {
	const id = req.headers.dish_id as string;
	DB.deleteById(id).then(
		(val) => {
			res.status(200);
			res.send(JSON.stringify({ count: val }));
		},
		(err) => {
			res.status(500);
			res.send(err);
		}
	);
});

router.post("/add", (req, res) => {
	const dish: IDish = req.body;

	const userAgent = req.headers["user-agent"];

	dish.id = uuidv4();
	dish.ipAdress = getIp(req).clientIp || "";
	dish.date = Date.now();
	dish.weight = 200;
	dish.userAgent = userAgent;

	DB.write(dish).then(
		() => {
			res.status(201);
			res.send("Success");
		},
		(err) => {
			res.status(500);
			res.send(err);
		}
	);
});

router.get("/get", (req, res) => {
	DB.getAll().then(
		(result) => {
			res.status(200);
			res.send(JSON.stringify(result));
		},
		(err) => {
			res.status(500);
			res.send(err);
		}
	);
});

router.get("/get/last", (req, res) => {
	DB.getAll().then(
		(result) => {
			res.status(200);
			res.send(JSON.stringify(result.last));
		},
		(err) => {
			res.status(500);
			res.send(err);
		}
	);
});

router.get("/get/id/", (req, res) => {
	DB.getById(req.query.id as string).then(
		(result) => {
			res.status(200);
			res.send(result);
		},
		(err) => {
			res.status(500);
			res.send(err);
		}
	);
});

router.post("/generate", (req, res) => {
	const params = req.body;
	DB.generate(params).then(
		(result) => {
			res.status(200);
			res.send(result);
		},
		(err) => {
			res.status(500);
			res.send(err);
		}
	);
});

router.post("/save", (req, res) => {
	const params = req.body;
	DB.saveDish(params).then(
		(result) => {
			res.status(200);
			res.send(result);
		},
		(err) => {
			res.status(500);
			res.send(err);
		}
	);
});

router.post("/last", (req, res) => {
	const params = req.body;
	DB.saveDish(params).then(
		(result) => {
			res.status(200);
			res.send(result);
		},
		(err) => {
			res.status(500);
			res.send(err);
		}
	);
});

export { router as apiRouter };
