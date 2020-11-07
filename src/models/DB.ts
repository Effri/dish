import { readFile, writeFile } from "fs";
import { resolve } from "path";

import { IDataBase, IDish, IParams } from "../types/interfaces";

export class DB {
	private static DBpath: string = resolve("src/data/dishes.json");

	public static async getAll() {
		return new Promise<IDataBase>((resovle, reject) => {
			readFile(this.DBpath, "utf-8", (err, res) => {
				if (err) reject("Read Error (getAll)");
				const DataBase: IDataBase = JSON.parse(res);
				resovle(DataBase);
			});
		});
	}

	public static async getByName(query: string) {
		const DataBase = await this.getAll();
		return DataBase.dishes.filter((dish) => dish.name === query);
	}

	public static async getById(query: string) {
		const DataBase = await this.getAll();
		return DataBase.dishes.filter((dish) => dish.id === query)[0];
	}
	public static async getLast() {
		const DataBase = await this.getAll();
		return DataBase.last;
	}

	public static async getLastById(id: string) {
		const DataBase = await this.getAll();
		return DataBase.last.filter((dish) => dish.id === id)[0];
	}

	public static async addLast(item: IDish) {
		const DataBase = await this.getAll();
		DataBase.last.push(item);
		return new Promise((resolve) => {
			writeFile(this.DBpath, JSON.stringify(DataBase), "utf-8", resolve);
		});
	}

	public static async write(item: IDish) {
		const DataBase = await this.getAll();
		DataBase.dishes.push(item);
		return new Promise((resolve) => {
			writeFile(this.DBpath, JSON.stringify(DataBase), "utf-8", resolve);
		});
	}

	private static async setDB(DB: IDataBase) {
		let DataBase = await this.getAll();
		DataBase = DB;
		return new Promise((resolve) => {
			writeFile(this.DBpath, JSON.stringify(DataBase), "utf-8", resolve);
		});
	}

	public static async deleteByName(query: string) {
		const DataBase = await this.getAll();
		DataBase.dishes = DataBase.dishes.filter((dish) => dish.name !== query);
		return new Promise((resolve) => {
			writeFile(this.DBpath, JSON.stringify(DataBase), "utf-8", resolve);
		});
	}

	public static async deleteById(query: string) {
		const DataBase = await this.getAll();
		DataBase.dishes = DataBase.dishes.filter((dish) => dish.id !== query);
		return new Promise((resolve) => {
			writeFile(this.DBpath, JSON.stringify(DataBase), "utf-8", () => {
				resolve(DataBase.dishes.length);
			});
		});
	}

	public static async generate(params: IParams) {
		const DataBase = await this.getAll();
		let dishes1: IDish[] = [];
		let dishes2: IDish[] = [];
		const types = ["обед", "ужин", "завтрак", "полдник"];

		params.selected.forEach((a) => {
			const query = arrIncludes(a.toLowerCase(), types);
			if (query) {
				dishes1.push(
					...DataBase.dishes.filter((a) =>
						a.type?.trim() ? a.type.toLocaleLowerCase().includes(String(query)) : true
					)
				);
			}
		});

		const dishTypes = ["2", "3", "4"]; // Id's for switchers
		const switchesEncode: any = {
			"0": "advanced",
			"2": "десерт",
			"3": "перв",
			"4": "втор",
		};
		if (!arrIncludes(params.switches.join(""), ["2", "3", "4"], true)) {
			params.switches = [...params.switches, "2", "3", "4"];
		}
		// Switchres
		params.switches.forEach((a) => {
			const query = arrIncludes(a.toLowerCase(), dishTypes) as string;
			if (query) {
				dishes2.push(
					...DataBase.dishes.filter((a) =>
						a.dishType?.trim()
							? a.dishType.toLocaleLowerCase().includes(switchesEncode[query] || "")
							: true
					)
				);
			}
		});
		if (params.switches.includes("1")) {
			dishes2 = dishes2.filter((a) => a.name && a.link && a.dishType && a.type && a.description);
		}

		dishes2 = [...new Set(dishes2)];
		dishes1 = [...new Set(dishes1)];

		let max = Math.max(dishes2.length, dishes1.length);
		let resultDishes = [];

		for (let i = 0; i < max; i++) {
			let item = dishes1[i] || dishes2[i];
			if (dishes1.some((a) => a === item) && dishes2.some((a) => a === item))
				resultDishes.push(item);
		}

		const generated = this.randomDish(params.switches.includes("0"), resultDishes);

		return generated;
	}

	private static randomDish(isAdvanced: boolean, dishes: IDish[]) {
		if (!isAdvanced) return dishes[random(0, dishes.length)];
		const allWeight = dishes.reduce((l, a) => l + a.weight, 0);
		let randomWeight: number = random(0, allWeight);
		if (randomWeight == 0) return dishes[0];
		let i = 0;

		while (randomWeight >= 0) {
			randomWeight -= dishes[i].weight;
			i++;
		}
		return dishes[i - 1];
	}

	public static async saveDish({ generated, slider }: { generated: IDish; slider: number }) {
		const DataBase = await this.getAll();
		generated.weight -= slider;
		if (generated.weight <= 0) generated.weight = 1;
		DataBase.dishes = DataBase.dishes.map((el) => ({
			...el,
			weight: el.weight + Math.ceil(slider / DataBase.dishes.length),
		}));
		DataBase.last.push(generated);
		if (DataBase.last.length > 6) DataBase.last.shift();
		await this.setDB(DataBase);
		await this.deleteById(generated.id);
		await this.write(generated);
	}
}

function arrIncludes(string: string, query: string[], every?: boolean) {
	if (every) return query.every((a) => string.includes(a));
	else return query.find((a) => string.includes(a));
}

function random(min: number, max: number): number {
	return ~~(min + Math.random() * (max + 1 - min));
}
