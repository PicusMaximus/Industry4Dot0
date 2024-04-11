import TaskSidebar from "./task-sidebar";
import { showToast } from "./toast.js";

export default class TaskManager {
    #id = '';

    #data = new Map();
    #currentId = '';

    #taskCardContainer = document.getElementById('task-card-content');

    #selectors = ['movement', 'axis', 'comment', 'settings', 'wait', 'notification'];

    #taskSidebar = new TaskSidebar();

    constructor() {

        const searchParams = new URLSearchParams(window.location.search);

        if (searchParams.has('id')) this.#id = searchParams.get('id');

        if (this.#id) this.#loadTask();

        document.addEventListener('click', this.#loadCardHandler.bind(this));
        document.getElementById('save-task-btn').addEventListener('click', this.saveTask.bind(this));
    }

    async #loadCardHandler(e) {
        for (const selector of this.#selectors) {
            const target = e.target.closest(`.create-${selector}-card--btn`);
            
            if(!target) continue;
    
            let id = target.getAttribute('data-card-id');
    
            await this.loadCard(id, selector)
    
            if (id) break;
    
            const sectionId = document.querySelector(`section.${selector}-card`).getAttribute('data-card-id');
            target.setAttribute('data-card-id', sectionId);
    
            break;
        }
    }
  
    async loadCard(id, type) {
        this.#currentId = id;

        if (type === 'axis') return await this.#loadAxisCard(), this.listenForCardChanges(type), void 0;
        if (type === 'movement') return await this.#loadMovementCard(), this.listenForCardChanges(type), void 0;
        if (type === 'comment') return await this.#loadCommentCard(), this.listenForCardChanges(type), void 0;
        if (type === 'settings') return await this.#loadSettingsCard(), this.listenForCardChanges(type), void 0;
        if (type === 'wait') return await this.#loadWaitCard(), this.listenForCardChanges(type), void 0;
        if (type === 'notification') return this.listenForCardChanges(type), void 0;

        // const data = this.#data.get(id);
    }
  
    async #loadMovementCard() {
        const res = await fetch(`/movement-card${this.#currentId ? `?id=${this.#currentId}` : ''}`, {method: "GET"})
        const content = await res.text();

        const contentHTML = $.parseHTML(content)    

        this.#taskCardContainer.replaceChildren(contentHTML[0]);

        if (!this.#data.has(this.#currentId)) return;

        const data = this.#data.get(this.#currentId);

        $('#dobot-arm-pos-x').val(data.x);
        $('#dobot-arm-pos-y').val(data.y);
        $('#dobot-arm-pos-z').val(data.z);
        $('#dobot-arm-pos-r').val(data.r);
        $('#dobot-arm-pos-j1').val(data.j1);
        $('#dobot-arm-pos-j2').val(data.j2);
        $('#dobot-arm-pos-j3').val(data.j3);
        $('#dobot-arm-pos-j4').val(data.j4);
    }

    async #loadWaitCard() {
        const res = await fetch(`/wait-card${this.#currentId ? `?id=${this.#currentId}` : ''}`, {method: "GET"})
        const content = await res.text();
    
        const contentHTML = $.parseHTML(content)
    
        this.#taskCardContainer.replaceChildren(contentHTML[0]);

        if (!this.#data.has(this.#currentId)) return;

        const data = this.#data.get(this.#currentId);

        $('#dobot-wait-ms').val(data);
    }

    async #loadAxisCard() {
        const res = await fetch(`/axis-card${this.#currentId ? `?id=${this.#currentId}` : ''}`, {method: "GET"})
        const content = await res.text();
    
        const contentHTML = $.parseHTML(content)
    
        this.#taskCardContainer.replaceChildren(contentHTML[0]);
    }

    async #loadSettingsCard() {
        const res = await fetch(`/settings-card${this.#currentId ? `?id=${this.#currentId}` : ''}`, {method: "GET"})
        const content = await res.text();
    
        const contentHTML = $.parseHTML(content)
    
        document.getElementById('task-card-content').replaceChildren(contentHTML[0]);

        if (!this.#data.has(this.#currentId)) return;

        const data = this.#data.get(this.#currentId);

        const input = document.getElementById('suck-switch');

        input.checked = data;
    }

    async #loadCommentCard() {
        const res = await fetch(`/comment-card${id ? `?id=${id}` : ''}`, { method: "GET" })
        const content = await res.text();
    
        const contentHTML = $.parseHTML(content)
    
        document.getElementById('task-card-content').replaceChildren(contentHTML[0]);
    }

    listenForCardChanges(type) {
        const target = document.querySelector(`section.${type}-card`);
        this.#currentId = target.id;

        if (type === 'axis') return $(target).on( "change", () => {}), void 0; 
        if (type === 'movement') return $(target).on( "change", this.#movementListener.bind(this)), void 0; 
        if (type === 'comment') return $(target).on( "change", (e) => {}), void 0;
        if (type === 'settings') return $(target).on( "change", this.#settingsListener.bind(this)), void 0;
        if (type === 'wait') return $(target).on( "change", this.#waitListener.bind(this)), void 0; 
        if (type === 'notification') return $(target).on( "change", (e) => {}), void 0;

        throw new Error(`Invalid type was given. Type: ${type} is not defined.`);
    }
    
    #movementListener(e) {
        const target = e.target;
        const apId = target?.id;

        if (!this.#currentId) throw new Error('The current card has no id.');
        
        if (
            apId !== 'dobot-arm-pos-x' &&
            apId !== 'dobot-arm-pos-y' &&
            apId !== 'dobot-arm-pos-z' &&
            apId !== 'dobot-arm-pos-r' &&
            apId !== 'dobot-arm-pos-j1' &&
            apId !== 'dobot-arm-pos-j2' &&
            apId !== 'dobot-arm-pos-j3' &&
            apId !== 'dobot-arm-pos-j4'
            ) return;
        
        const value = target.value;
        
        const data = {}

        apId === 'dobot-arm-pos-x' ? data.x = value : undefined;
        apId === 'dobot-arm-pos-y' ? data.y = value : undefined;
        apId === 'dobot-arm-pos-z' ? data.z = value : undefined;
        apId === 'dobot-arm-pos-r' ? data.r = value : undefined;
        apId === 'dobot-arm-pos-j1' ? data.j1 = value : undefined;
        apId === 'dobot-arm-pos-j2' ? data.j2 = value : undefined;
        apId === 'dobot-arm-pos-j3' ? data.j3 = value : undefined;
        apId === 'dobot-arm-pos-j4' ? data.j4 = value : undefined;


        if (this.#data.has(this.#currentId)) {
            const oldData = this.#data.get(this.#currentId)

            const newData = Object.assign(oldData, data);

            this.#data.set(this.#currentId, newData);
            return;
        }

        this.#data.set(this.#currentId, data);
    }

    #waitListener(e) {
        const target = e.target;
        const apId = target?.id;
        
        if (apId !== 'dobot-wait-ms') return;
        
        const value = target.value;

        this.#data.set(this.#currentId, value)
    }

    #settingsListener(e) {
        const target = e.target;
        const apId = target?.id;
        
        if (apId !== 'suck-switch') return;
        
        const checked = target.checked;

        this.#data.set(this.#currentId, checked)
    }

    async saveTask() {
        const task = {
            subtasks: [],
        };

        for (const elem of $('.subtask-group').toArray()) {
            const $elem = $(elem);

            const axisBtn = $elem.find('.reate-axis-card--btn');
            const axisId = axisBtn.attr('data-card-id') || '0';
            
            const subtask = {};

            if (!this.#data.has(axisId)) subtask.movementType = 'move_to_p';
            else subtask.movementType = this.#data.get(axisId);

            subtask.steps = [];

            for (const btn of $elem.find('.command-chain-container button').toArray()) {
                const $btn = $(btn);
                const btnId = $btn.attr('data-card-id') || '0';
                
                if (!this.#data.has(btnId)) continue;
                
                const step = {
                    data: {},
                };
                
                if ($btn.hasClass('create-movement-card--btn')) {
                    step.command = 'move';
                    step.data.pos = this.#data.get(btnId)
                    subtask.steps.push(step);
                    continue;
                }

                if ($btn.hasClass('create-wait-card--btn')) {
                    step.command = 'wait';
                    step.data.wait = this.#data.get(btnId)
                    subtask.steps.push(step);
                    continue;
                }
            
                if ($btn.hasClass('create-comment-card--btn')) {
                    step.command = 'continue';
                    step.data.comment = this.#data.get(btnId);
                    subtask.steps.push(step);
                    continue;
                }

                if ($btn.hasClass('create-settings-card--btn')) {
                    step.command = 'settings';
                    step.data.settings = this.#data.get(btnId);
                    subtask.steps.push(step);
                    continue;
                }
            }

            task.subtasks.push(subtask);
        }
        
        task.name = 'test';
        if(this.#id) task.id = this.#id;

        const json = JSON.stringify(task);

        try {
            if (!this.#id) {
                await fetch('/api/task', { method: 'POST', body: json, headers: { "Content-Type": "application/json"} });
            } else {
                await fetch(`/api/task?id=${this.#id}`, { method: 'PUT', body: json, headers: { "Content-Type": "application/json"} })
            }

            showToast('Die Aufgabe wurde erfolgreich gespeichert', 'success');
            window.location.href = '/'
        } catch(ex) {
            showToast('Es ist ein Fehler beim Speichern der Aufgabe aufgetreten.', 'danger');
        }
    }

    async #loadTask() {
        // There is nothing to load!!!
        if (!this.#id) return;

        const res = await fetch(`/api/task?id=${this.#id}`, {method: 'GET'});
        const [id, name, subtaksJson] = await res.json();
        const subtasks = JSON.parse(subtaksJson);

        let counter = -1;

        for (const { movementType, steps } of subtasks) {
            // Hier -> Fahre Achse mit dem richtigen Type erstellen
            counter++;
            this.#taskSidebar.createAxisLi(null, `${id}-${counter}`);

            for (const { command, data } of steps) {
                //=> Hier die einzelnen Steps nachstellen.
                counter++;

                const itemId = `${id}-${counter}`;

                if (command === 'move') {
                    this.#taskSidebar.createMovementLi(null, itemId);
                    this.#data.set(itemId, data.pos)
                    continue;
                }

                if (command === 'comment') {
                    this.#taskSidebar.createCommentLi(null, itemId);
                    this.#data.set(itemId, data.comment)
                    continue;
                }

                if (command === 'settings') {
                    this.#taskSidebar.createSettingsLi(null, itemId);
                    this.#data.set(itemId, data.settings)
                    continue;
                }

                if (command === 'wait') {
                    this.#taskSidebar.createWaitLi(null, itemId);
                    this.#data.set(itemId, data.wait)
                    continue;
                }

                if (command === 'notification') {
                    this.#taskSidebar.createNotificationLi(null, itemId);
                    this.#data.set(itemId, data.Notification)
                    continue;
                }
            }
        }
    }
}
