// GENERATE
document.addEventListener("DOMContentLoaded", function () {
	const genbtn = document.getElementById("generate");
	if (!genbtn) return;
	genbtn.addEventListener("click", async () => {
		document.querySelector(".results")?.remove();
		document.querySelector(".results__btns")?.remove();

		const selected = [...document.querySelectorAll(".selection .selected")].map(
			(a) => a.textContent
		);
		const switches = [...document.querySelectorAll(".dish__switch p input")].flatMap((a) =>
			a.checked ? [a.getAttribute("data-id")] : []
		);
		const slider = document.querySelector(".main__slider input").value;
		//! TODO: ??
		if (selected[0] === "Выберите тип трапезы") {
			M.toast({
				html: "Вы не выбрали фильтры для еды.",
				displayLength: 2000,
			});
			return;
		}
		startLoad();
		let generated = await axios.post("/api/generate", { slider, switches, selected }).then(
			(res) => {
				if (!String(res.status).startsWith("2")) {
					M.toast({
						html: "Что-то пошло не так :( Попробуйте перезагрузить страницу",
						displayLength: 2000,
					});
				}
				return res;
			},
			() =>
				M.toast({
					html: "Что-то пошло не так :( Попробуйте перезагрузить страницу",
					displayLength: 2000,
				})
		);
		if (!generated.data) {
			M.toast({
				html: "Увы, но по вашим запросам мы не нашли не одного блюда",
				displayLength: 2000,
			});
			endLoad();
			return;
		}
		generated = generated.data;

		const main = document.querySelector(".main");
		const rowResults = document.createElement("div");
		const rowLogo = document.createElement("div");

		rowResults.classList = "row results";
		rowResults.innerHTML = `
    <div class="col s10 offset-s1">
     <h2>Ваше блюдо - ${generated.name}!</h2>
     <p>
       Посмотрите о нем
       <a class="tooltipped" href="/view?id=${generated.id}" data-tooltip="Узнать подробнее"> подробнее <i class="material-icons">send</i></a>
       если хотите приготовить его или нажмите "Перегенерировать". Если хотите другое блюдо.
      </p>
    </div>
    `;
		rowLogo.classList = "row results__btns";
		rowLogo.innerHTML = `
    <div class="col m3 offset-m1 s10 offset-s1">
      <button id="save" data-id=${generated.id} class="btn purple darken-1 waves-effect waves-light">Сохранить блюдо!</button>
    </div>
    <div class="col m5 offset-m1 s10 offset-s1">
      <button id="restart" data-id=${generated.id} class="btn purple darken-1 waves-effect waves-light">Перегенерировать (Не учитывать эту попытку)</button>
    </div>
    `;
		main.append(rowResults);
		main.append(rowLogo);
		const save = document.getElementById("save");
		const restart = document.getElementById("restart");
		endLoad();

		save.onclick = async (e) => {
			genbtn.setAttribute("disabled", "true");
			restart.setAttribute("disabled", "true");
			startLoad();
			await axios.post("/api/save", { generated, slider: slider });
			const last = await axios.get("/api/get/last");

			genbtn.removeAttribute("disabled");
			restart.remove();
			rowResults.querySelector(
				"p"
			).innerHTML = `Посмотрите о нем <a class="tooltipped" href="/view?id=${generated.id}" data-tooltip="Узнать подробнее"> подробнее <i class="material-icons">send</i></a>. Блюдо уже сохранено!`;

			document.querySelectorAll(".last-time__list .collection-item").forEach((a) => a.remove());
			last.data.reverse().forEach((el) => {
				const lastList = document.querySelector(".last-time__list");
				const li = document.createElement("li");
				li.classList = "collection-item";
				li.innerHTML = `
          <div>
          ${el.name}
          <a href="/view?id=${el.id}&last=true" data-tooltip="Узнать подробнее" class="tooltipped secondary-content"> <i class="material-icons">send</i></a>
          </div>
        `;
				lastList.append(li);
			});
			endLoad();
		};

		restart.onclick = (e) => {
			genbtn.click();
		};
	});
});
