const ip = "192.168.0.1"
const wmAn = document.getElementById('wm-an')
const wmAus = document.getElementById('wm-aus')

wmAn.addEventListener('click', (event) => toggleWartungsmodus(event, true));
wmAus.addEventListener('click', (event) => toggleWartungsmodus(event, false));

async function toggleWartungsmodus(event, status) {
    event.preventDefault();
    // const result = await postData(ip, { status: status });

    if (status) {
        setLoad(true)
        document.querySelectorAll(".gray").forEach((e) => {
            e.classList.remove("gray");
        })

        document.querySelector(".gruen").classList.add("gray")
        document.querySelector(".rot").classList.add("gray")
    } else {
        document.querySelectorAll(".gray").forEach((e) => {
            e.classList.remove("gray");
        })

        document.querySelector(".rot").classList.add("gray")
        document.querySelector(".gelb").classList.add("gray")
    }
    // console.log(result);
}

async function postData(url = "", data = {}) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

function setLoad(value) {
    const load = document.querySelector("#load");
    if (value) {
        load.style = 'display: flex';
    } else {
        load.style = 'display: none';
    }
}