// DELETE
document.addEventListener("DOMContentLoaded", function () {
	const dishCollections = document.querySelector(".list-time__collection");
	if (!dishCollections) return;

	dishCollections.addEventListener("click", (event) => {
		const target = event.target.closest(".list-time__delete");
		if (!target) return; //? Check target

		const id = target.getAttribute("data-id"); //? get id

		const submit = confirm("Вы точно хотите удалить блюдо?"); //? confirm delete
		if (!submit) return;
		startLoad();
		const wrapper = target.closest(".collection-item");
		target
			.closest(".collection-item__insert")
			.querySelectorAll(".list-time__icon")
			.forEach((e) => e.remove());

		axios
			.delete("/api/delete", {
				headers: {
					dish_id: id,
				},
			})
			.then(
				(res) => {
					endLoad();
					if (String(res.status).startsWith("2")) {
						M.toast({
							html: "Блюдо успешно удалено!",
							displayLength: 2000,
						});
						wrapper.remove();
						if (!res.data.count) {
							const row = document.createElement("div");
							row.classList = "row";
							row.innerHTML = `
                <span class="list__empty col s12 center-align">Тут пока ничего нет :(</span>
              `;
							document.querySelector(".last-time__list").append(row);
						}
					} else {
						alert("Во время удаления произошла ошибка, попробуйте снова.");
						location.reload();
					}
				},
				(res) => {
					endLoad();
					alert("Во время удаления произошла ошибка, попробуйте снова.");
					location.reload();
				}
			);
	});
});
