
function btn_schools(params) {
    document.getElementById("schools_konten").style.display = "block";
    document.getElementById("me").style.display = "none";
    document.getElementById("work_konten").style.display = "none";
}

function btn_work(params) {
    document.getElementById("schools_konten").style.display = "none";
    document.getElementById("me").style.display = "none";
    document.getElementById("work_konten").style.display = "block";
}

function btn_me(params) {
    document.getElementById("schools_konten").style.display = "none";
    document.getElementById("me").style.display = "block";
    document.getElementById("work_konten").style.display = "none";
}



const btn_web = document.getElementById("btn_web")
const web_konten = document.getElementById("web_konten")

const btn_design = document.getElementById("btn_design")
const design_konten = document.getElementById("design_konten")

const btn_achievment = document.getElementById("btn_achievment")
const achievment_konten = document.getElementById("achievment_konten")

const buttons = document.querySelectorAll(".all_projek")

const btn_about = document.querySelectorAll(".btn_about")

buttons.forEach(btn => {
    // btn = variabel perulangan bebas mau apa saja teknya
    btn.addEventListener("click", () => {
        // btn = jumlah / isi variabel buttons. kasus ini ada 3 button
        buttons.forEach(b => {
            // Reset semua tombol (hanya yg punya class .all_projek)
            b.classList.remove("btn-line");
            b.classList.add("btn-bg");
        })
        // aktifkan tombol yang di klik
        btn.classList.remove("btn-bg");
        btn.classList.add("btn-line");
    });
})



btn_about.forEach(btn => {
    btn.addEventListener("click", () => {
        btn_about.forEach(b => {
            b.classList.remove(

            )

        });
    })
})



btn_web.addEventListener("click", () => {

    web_konten.style.display = "grid";
    design_konten.style.display = "none";
    achievment_konten.style.display = "none";
})
btn_design.addEventListener("click", () => {

    web_konten.style.display = "none";
    design_konten.style.display = "grid";
    achievment_konten.style.display = "none";
})
btn_achievment.addEventListener("click", () => {

    web_konten.style.display = "none";
    design_konten.style.display = "none";
    achievment_konten.style.display = "grid";
})


