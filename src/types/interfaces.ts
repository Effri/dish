export interface IDataBase {
	dishes: IDish[];
	last: IDish[];
}

export interface IDish {
	name: string;
	id: string;
	date: number;
	weight: number;
	link?: string;
	dishType?: string;
	type?: string;
	description?: string;
	ipAdress?: string;
	userAgent?: string;
}

export interface IParams {
	slider: number;
	switches: string[];
	selected: string[];
}
