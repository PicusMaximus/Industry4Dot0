const ip = "http://192.168.0.1/"
const wmAn = document.getElementById('wm-an')
const wmAus = document.getElementById('wm-aus')

loadJobs();

wmAn.addEventListener('click', (event) => toggleWartungsmodus(event, true));
wmAus.addEventListener('click', (event) => toggleWartungsmodus(event, false));

async function toggleWartungsmodus(event, status) {
    event.preventDefault();
    setLoad(true)

    // const result = await postData(ip, {status: status});

    // if (!result || result.status !== 200) {
    //     setLoad(false);
    //     return;
    // }

    // const respone = await result.json();

    if (status) { // response nicht status
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

    setLoad(false);
}

async function loadJobs() {
    const table = document.querySelector("#table");
    const data = [
        ["Alfreds Futterkiste", "Maria Anders", "Germany"],
        ["Centro comercial Moctezuma", "Francisco Chang", "Mexico"]
    ];

    data.forEach((e) => {
        const tr = document.createElement("tr");
        const td0 = getTd(e[0]);
        const td1 = getTd(e[1]);
        const td2 = getTd(e[2]);

        tr.appendChild(td0);
        tr.appendChild(td1);
        tr.appendChild(td2);

        table.appendChild(tr);
    });
}

function getTd(value) {
    const td = document.createElement("td");
    td.innerHTML = value;

    return td;
}

async function postData(url = "", data = {}) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        return response;
    } catch (e) {
        alert("Fehler");
    }
}

function setLoad(value) {
    const load = document.querySelector("#load");
    if (value) {
        load.style = 'display: flex';
    } else {
        load.style = 'display: none';
    }
}