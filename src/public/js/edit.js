// EDIT
document.addEventListener("DOMContentLoaded", function () {
	const dishCollections = document.querySelector(".list-time__collection");
	if (!dishCollections) return;

	dishCollections.addEventListener("click", (event) => {
		const target = event.target.closest(".list-time__edit");
		if (!target) return; //? Check target
		const id = target.getAttribute("data-id"),
			name = document.getElementById("edit_name"),
			link = document.getElementById("edit_link"),
			dishType = document.getElementById("edit_dishType"),
			type = document.getElementById("edit__type"),
			descr = document.getElementById("edit_area"),
			edit = document.querySelector(".edit"),
			editLogo = document.querySelector(".edit__logo");
		startLoad();
		axios.get(`api/get/id?id=${id}`).then(
			(res) => {
				endLoad();
				if (String(res.status).startsWith("2")) {
					const dish = res.data;
					name.value = dish.name;
					link.value = dish.link;
					dishType.value = dish.dishType;
					type.value = dish.type;
					descr.value = dish.description;

					edit.setAttribute("data-edit", id);
					editLogo.textContent = `Изменение блюда ${dish.name}!`;
					scrollUp();
				} else {
					M.toast({
						html: "Что-то пошло не так :( Попробуйте перезагрузить страницу",
						displayLength: 2000,
					});
				}
			},
			(res) => {
				endLoad();
				M.toast({
					html: "Что-то пошло не так :( Попробуйте перезагрузить страницу",
					displayLength: 2000,
				});
			}
		);
	});
});
