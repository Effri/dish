//! ADD new Dish
document.addEventListener("DOMContentLoaded", function () {
	const subbtn = document.querySelector(".edit__submit");

	if (!subbtn) return;
	subbtn.addEventListener("click", async (event) => {
		const name = document.getElementById("edit_name");
		if (name.value.trim() === "") {
			alert("Введите имя блюда!");
			return;
		}

		const link = document.getElementById("edit_link");
		const dishType = document.getElementById("edit_dishType");
		const type = document.getElementById("edit__type");
		const descr = document.getElementById("edit__area");
		const edit = document.querySelector(".edit");
		const productType = document.getElementById("edit__product");

		let dish = {
			name: name.value,
			link: link.value || null,
			dishType: dishType.value || null,
			type: type.value || null,
			description: descr.value || null,
			productType: productType.value || null,
		};

		subbtn.setAttribute("disabled", "true");
		startLoad();

		function postDish() {
			return axios.post("/api/add", dish).then(
				(res) => {
					endLoad();
					if (String(res.status).startsWith("2")) {
						M.toast({
							html: "Блюдо успешно добавлено/отредактировано :D",
							displayLength: 2000,
						});
						subbtn.removeAttribute("disabled");
						name.value = "";
						link.value = "";
						return res;
					} else
						M.toast({
							html: "Что-то пошло не так :( Попробуйте перезагрузить страницу",
							displayLength: 2000,
						});
				},
				(res) => {
					endLoad();
					M.toast({
						html: "Что-то пошло не так :( Попробуйте перезагрузить страницу",
						displayLength: 2000,
					});
				}
			);
		}

		async function request() {
			if (edit.getAttribute("data-edit")) {
				await axios
					.delete("/api/delete", {
						headers: {
							dish_id: edit.getAttribute("data-edit"),
						},
					})
					.then(
						(res) => {
							if (String(res.status).startsWith("2")) {
								return postDish().then(() => {
									document.querySelector(".edit__logo").textContent =
										"Добавьте новое блюдо в список!";
									edit.removeAttribute("data-edit");
								});
							} else
								M.toast({
									html: "Что-то пошло не так :( Попробуйте перезагрузить страницу",
									displayLength: 2000,
								});
						},
						(res) => {
							M.toast({
								html: "Что-то пошло не так :( Попробуйте перезагрузить страницу",
								displayLength: 2000,
							});
						}
					);
			} else await postDish();
		}

		await request();
		let res = await axios.get("/api/get").catch(() =>
			M.toast({
				html: "Что-то пошло не так :( Попробуйте перезагрузить страницу",
				displayLength: 2000,
			})
		);
		setList(res.data);
	});
});
