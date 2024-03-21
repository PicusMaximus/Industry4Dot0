class StepManager {

    /**
     * @type {Map<string, object>}
     */
    #data = new Map();
    
    listenForMovementCards(id) {
        document.addEventListener('click', (e) => {
            if(!e.target.closest('.create-movement-card--btn')) return;

            const section = document.getElementById(id);
            section.addEventListener('change', (e) => {
                const armPosId = e.target?.id;

                if (
                    armPosId !== 'dobot-arm-pos-x' &&
                    armPosId !== 'dobot-arm-pos-y' &&
                    armPosId !== 'dobot-arm-pos-z' &&
                    armPosId !== 'dobot-arm-pos-r' &&
                    armPosId !== 'dobot-arm-pos-j1' &&
                    armPosId !== 'dobot-arm-pos-j2' &&
                    armPosId !== 'dobot-arm-pos-j3' &&
                    armPosId !== 'dobot-arm-pos-j4'
                    ) return;

                const data = {
                    x: e.target.value,
                    y: e.target.value,
                    z: e.target.value,
                    r: e.target.value,
                    j1: e.target.value,
                    j2: e.target.value,
                    j3: e.target.value,
                    j4: e.target.value,
                }

                if (this.#data.has(id))
                {
                    const oldData = this.#data.get(id)

                    const newData = Object.assign(oldData, data);

                    this.#data.set(id, newdata);
                    return;
                }

                this.#data.set(id, data);
            });
        })
    }

    seeData() {
        if (this.#data.size === 0) return;

        for (const data of this.#data.entries()) {
            console.log(data);
        } 
    }
}



// document.addEventListener('click', async (e) => {
//     if(!e.target.closest('.create-movement-card--btn')) return;

//     const target = e.target.closest('.create-movement-card--btn');

//     const id = target.getAttribute('data-card-id');

//     const res = await fetch(`/movement-card${id ? `?id=${id}` : ''}`, {method: "GET"})
//     const content = await res.text();

//     const contentHTML = $.parseHTML(content)

//     if (!id) {
//         const newId = contentHTML[0].id
//         target.setAttribute('data-card-id', newId);
//     }

//     document.getElementById('task-card-content').replaceChildren(contentHTML[0]);

//     document.getElementById('free-drive-btn').addEventListener('click', () => {
//         document.getElementById('movement-dialog').showModal();
//     })
// });

// document.addEventListener('click', async (e) => {
//     if(!e.target.closest('.create-axis-card--btn')) return;

//     const target = e.target.closest('.create-axis-card--btn');

//     const id = target.getAttribute('data-card-id');

//     const res = await fetch(`/axis-card${id ? `?id=${id}` : ''}`, {method: "GET"})
//     const content = await res.text();

    
//     const contentHTML = $.parseHTML(content)
    
//     if (!id) {
//         const newId = contentHTML[0].id
//         target.setAttribute('data-card-id', newId);
//     }

//     document.getElementById('task-card-content').replaceChildren(contentHTML[0]);
// });

// document.addEventListener('click', async (e) => {
//     if(!e.target.closest('.create-wait-card--btn')) return;

//     const target = e.target.closest('.create-wait-card--btn');
//     const id = target.getAttribute('data-card-id');

//     const res = await fetch(`/wait-card${id ? `?id=${id}` : ''}`, {method: "GET"})
//     const content = await res.text();

//     const contentHTML = $.parseHTML(content)

//     if (!id) {
//         const newId = contentHTML[0].id
//         target.setAttribute('data-card-id', newId);
//     }

//     document.getElementById('task-card-content').replaceChildren(contentHTML[0]);
// });

// document.addEventListener('click', async (e) => {
//     if(!e.target.closest('.create-comment-card--btn')) return;

//     const target = e.target.closest('.create-comment-card--btn');
//     const id = target.getAttribute('data-card-id');

//     const res = await fetch(`/comment-card${id ? `?id=${id}` : ''}`, {method: "GET"})
//     const content = await res.text();

//     const contentHTML = $.parseHTML(content)

//     if (!id) {
//         const newId = contentHTML[0].id
//         target.setAttribute('data-card-id', newId);
//     }

//     document.getElementById('task-card-content').replaceChildren(contentHTML[0]);
// });

// document.addEventListener('click', async (e) => {
//     if(!e.target.closest('.create-settings-card--btn')) return;

//     const target = e.target.closest('.create-settings-card--btn');
//     const id = target.getAttribute('data-card-id');

//     const res = await fetch(`/settings-card${id ? `?id=${id}` : ''}`, {method: "GET"})
//     const content = await res.text();

//     const contentHTML = $.parseHTML(content)

//     if (!id) {
//         const newId = contentHTML[0].id
//         target.setAttribute('data-card-id', newId);
//     }

//     document.getElementById('task-card-content').replaceChildren(contentHTML[0]);
// });