// DOWNLOAD
document.addEventListener('DOMContentLoaded', function () {
  const exportel = document.getElementById('export');
  if (!exportel) return;
  exportel.addEventListener("click", () => {

    startLoad();
    axios.get("api/get").then(res => {
      if (String(res.status).startsWith("2")) {
        const blob = new Blob([JSON.stringify(res.data)], {
          type: 'text/plain'
        });
        const link = document.getElementById("download");
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
        endLoad();
      } else {
        M.toast({
          html: 'Что-то пошло не так :( Попробуйте перезагрузить страницу',
          displayLength: 2000
        });
      }
    }, (res) => {
      endLoad();
      M.toast({
        html: 'Что-то пошло не так :( Попробуйте перезагрузить страницу',
        displayLength: 2000
      });
    })
  })

});