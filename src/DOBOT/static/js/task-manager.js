import TaskSidebar from "./task-sidebar";
import { showToast } from "./toast.js";

export default class TaskManager {
    #id = '';

    #data = new Map();
    #currentId = '';

    #taskCardContainer = document.getElementById('task-card-content');

    #selectors = ['movement', 'axis', 'comment', 'settings', 'wait', 'notification'];

    #taskSidebar = new TaskSidebar();

    /**
     * @type WebSocketHandler
     */
    #wsHandler;

    /**
     * 
     * @param { { ws: WebSocketHandler } } options 
     */
    constructor(options) {
        this.#wsHandler = options.ws;
 
        const searchParams = new URLSearchParams(window.location.search);

        if (searchParams.has('id')) this.#id = searchParams.get('id');

        if (this.#id) this.#loadTask();

        document.addEventListener('click', this.#loadCardHandler.bind(this));
        document.addEventListener('click', this.#deleteCardHandler.bind(this));
        document.addEventListener('click', this.#specialCardMethods.bind(this));
        document.getElementById('save-task-btn').addEventListener('click', this.saveTask.bind(this));
    }

    /**
     * 
     * @param {Event} e 
     */
    async #loadCardHandler(e) {
        for (const selector of this.#selectors) {
            const target = e.target.closest(`.create-${selector}-card--btn`);
            
            if(!target) continue;
    
            const id = target.getAttribute('data-card-id');

            const taskContainer = document.getElementById('task-container');

            taskContainer.querySelector('.active-card--btn')?.classList?.remove('active-card--btn');

            target.classList.add('active-card--btn')
    
            await this.loadCard(id, selector)
    
            if (id) break;
    
            const sectionId = document.querySelector(`section.${selector}-card`).getAttribute('data-card-id');
            target.setAttribute('data-card-id', sectionId);
    
            break;
        }
    }

    /**
     *  Event handler for handling the deletion of an item
     * @param {Event} e 
     */
    async #deleteCardHandler(e) {
        const $target = $(e.target).closest('.delete-current-item');

        if (!$target?.length) return;

        const $currBtn = $(document.querySelector(`button[data-card-id="${this.#currentId}"]`));
        const $currCard = $(document.getElementById(this.#currentId));

        this.#data.delete(this.#currentId);

        if ($currBtn.hasClass('create-axis-card--btn')) {
            $currBtn.closest('.subtask-group').remove();
            this.#taskSidebar.axisCount--;
        } else {
            $currBtn.remove();
        }

        if ($currBtn.hasClass('create-movement-card--btn')) this.#taskSidebar.moveCount--;

        $currCard.remove();
    }

    /**
     *  Event handler for handling the click onto a specific card button
     * @param {Event} e 
     */
    async #specialCardMethods(e) {
        const $target = $(e.target).closest('.special-card-methode');

        if (!$target?.length) return;

        if ($target.hasClass('goto-pos')) {
            if (!this.#data.has(this.#currentId)) return;

            const data = this.#data.get(this.#currentId);

            const pos = {
                type: 'control-command',
                command: 'goto_pos',
                pos: data,
            }

            this.#wsHandler.ws.send(JSON.stringify(pos));
        }

        if ($target.hasClass('execute-settings')) {
            if (!this.#data.has(this.#currentId)) return;

            const data = this.#data.get(this.#currentId);

            const settings = {
                type: 'control-command',
                command: 'execute_settings',
                settings: data,
            }

            this.#wsHandler.ws.send(JSON.stringify(settings));
        }
    }
  
    /**
     *  Function which takes a type and executes functions recording to the type...
     * @param { string } id 
     * @param {'axis' | 'movement' | 'wait' | 'settings' |'notification' | 'comment'} type 
     * @returns 
     */
    async loadCard(id, type) {
        this.#currentId = id;

        if (type === 'axis') return await this.#loadAxisCard(), this.listenForCardChanges(type), void 0;
        if (type === 'movement') return await this.#loadMovementCard(), this.listenForCardChanges(type), void 0;
        if (type === 'wait') return await this.#loadWaitCard(), this.listenForCardChanges(type), void 0;
        if (type === 'settings') return await this.#loadSettingsCard(), this.listenForCardChanges(type), void 0;
        if (type === 'notification') return await this.#loadNotificationCard(), this.listenForCardChanges(type), void 0;
        if (type === 'comment') return await this.#loadCommentCard(), this.listenForCardChanges(type), void 0;

        throw new Error(`The given type does not exists. Type: ${type}`)
    }
  
    /**
     * Loades the movement card into the dom and initialiesed all the used elements...
     */
    async #loadMovementCard() {
        const res = await fetch(`/movement-card${this.#currentId ? `?id=${this.#currentId}` : ''}`, {method: "GET"})
        const content = await res.text();

        const contentHTML = $.parseHTML(content)    

        this.#taskCardContainer.replaceChildren(contentHTML[0]);

        if (!this.#currentId?.trim?.()) this.#currentId = $('#task-card-content').find('section:first').attr('id');

        HSTooltip.autoInit();
        HSDropdown.autoInit();

        if (this.#data.has(this.#currentId)){

            const data = this.#data.get(this.#currentId);

            $('#dobot-arm-pos-x').val(data.x).attr('value', data.x);
            $('#dobot-arm-pos-y').val(data.y).attr('value', data.y);
            $('#dobot-arm-pos-z').val(data.z).attr('value', data.z);
            $('#dobot-arm-pos-r').val(data.r).attr('value', data.r);
            $('#dobot-arm-pos-j1').val(data.j1).attr('value', data.j1);
            $('#dobot-arm-pos-j2').val(data.j2).attr('value', data.j2);
            $('#dobot-arm-pos-j3').val(data.j3).attr('value', data.j3);
            $('#dobot-arm-pos-j4').val(data.j4).attr('value', data.j4);
        } else {
            const newTask = {
                x: 0,
                y: 0,
                z: 0,
                r: 0,
                j1: 0,
                j2: 0,
                j3: 0,
                j4: 0,
            }

            this.#data.set(this.#currentId, newTask);
        }
    }

    /**
     * Loades the wait card into the dom and initialiesed all the used elements...
     */
    async #loadWaitCard() {
        const res = await fetch(`/wait-card${this.#currentId ? `?id=${this.#currentId}` : ''}`, {method: "GET"})
        const content = await res.text();
    
        const contentHTML = $.parseHTML(content)
    
        this.#taskCardContainer.replaceChildren(contentHTML[0]);

        if (!this.#currentId?.trim?.()) this.#currentId = $('#task-card-content').find('section:first').attr('id');

        // Init Preline NumberInput
        HSTooltip.autoInit();
        HSDropdown.autoInit();

        if (this.#data.has(this.#currentId)) {
            const data = this.#data.get(this.#currentId);
    
            $('#dobot-wait-ms').val(data).attr('value', data.x);
            return;
        }
        
        this.#data.set(this.#currentId, 0);
    }

    /**
     * Loades the axis card into the dom and initialiesed all the used elements...
     */
    async #loadAxisCard() {
        const res = await fetch(`/axis-card${this.#currentId ? `?id=${this.#currentId}` : ''}`, {method: "GET"})
        const content = await res.text();
    
        const contentHTML = $.parseHTML(content)
    
        this.#taskCardContainer.replaceChildren(contentHTML[0]);

        if (!this.#currentId?.trim?.()) this.#currentId = $('#task-card-content').find('section:first').attr('id');

        HSTooltip.autoInit();
        HSDropdown.autoInit();

        //TODO: Add functionallity here - also add the card content
    }

    /**
     * Loades the settings card into the dom and initialiesed all the used elements...
     */
    async #loadSettingsCard() {
        const res = await fetch(`/settings-card${this.#currentId ? `?id=${this.#currentId}` : ''}`, {method: "GET"})
        const content = await res.text();
    
        const contentHTML = $.parseHTML(content)
    
        document.getElementById('task-card-content').replaceChildren(contentHTML[0]);

        if (!this.#currentId?.trim?.()) this.#currentId = $('#task-card-content').find('section:first').attr('id');

        HSTooltip.autoInit();
        HSDropdown.autoInit();

        if (!this.#data.has(this.#currentId)) {
            this.#data.set(this.#currentId, { suckState: false, /* gripState: false */ });
            return;
        }

        const settings = this.#data.get(this.#currentId);

        const input = document.getElementById('suck-switch');

        input.checked = settings.suckState;
    }

    /**
     * Loades the notification card into the dom and initialiesed all the used elements...
     */
    async #loadNotificationCard() {
        const res = await fetch(`/notification-card${this.#currentId ? `?id=${this.#currentId}` : ''}`, { method: "GET" })
        const content = await res.text();
    
        const contentHTML = $.parseHTML(content)
    
        document.getElementById('task-card-content').replaceChildren(contentHTML[0]);

        if (!this.#currentId?.trim?.()) this.#currentId = $('#task-card-content').find('section:first').attr('id');

        HSTooltip.autoInit();
        HSDropdown.autoInit();

        if(!this.#data.has(this.#currentId)) {
            this.#data.set(this.#currentId, { message: '', status: '' });
            HSSelect.autoInit();
            return;
        }
        
        const data = this.#data.get(this.#currentId);

        $(document.getElementById('notification-status--select')).find(`option[value="${ data.status }"]`).prop('selected', 'true');

        HSSelect.autoInit();
        
        const input = document.getElementById('notification-message--textarea');

        input.textContent = data.message;
        // select.value = data.status;
    }

    /**
     * Loades the comment card into the dom and initialiesed all the used elements...
     */
    async #loadCommentCard() {
        const res = await fetch(`/comment-card${this.#currentId ? `?id=${this.#currentId}` : ''}`, { method: "GET" })
        const content = await res.text();
    
        const contentHTML = $.parseHTML(content)
    
        document.getElementById('task-card-content').replaceChildren(contentHTML[0]);

        if (!this.#currentId?.trim?.()) this.#currentId = $('#task-card-content').find('section:first').attr('id');


        HSTooltip.autoInit();
        HSDropdown.autoInit();

        if (!this.#data.has(this.#currentId)) {
            this.#data.set(this.#currentId, '');
            return;
        }

        const comment = this.#data.get(this.#currentId);

        const input = document.getElementById('comment-textarea');

        input.textContent = comment;
    }

    listenForCardChanges(type) {
        const target = document.querySelector(`section.${type}-card`);
        this.#currentId = target.id;


        if (type === 'axis') return $(target).on( "change", () => {}), void 0; 
        if (type === 'movement') return $(target).on( "change", this.#movementListener.bind(this)), void 0; 
        if (type === 'wait') return $(target).on( "change", this.#waitListener.bind(this)), void 0; 
        if (type === 'settings') return $(target).on( "change", this.#settingsListener.bind(this)), void 0;
        if (type === 'notification') {
            $(target).on( "change", this.#notificationListener.bind(this))
            const el = HSSelect.getInstance('#notification-status--select');
            el.on('change', (val) => {
                if (this.#data.has(this.#currentId)) {
                    const data = this.#data.get(this.#currentId)
                    data.status = val;
                    this.#data.set(this.#currentId, data)
                    return;
                }
    
                this.#data.set(this.#currentId, { status: val })
            })
            return;
        }
        if (type === 'comment') return $(target).on( "change", this.#commentListener.bind(this)), void 0;

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
        
        if (apId === 'suck-switch') {
            const checked = target.checked;

            if(this.#data.has(this.#currentId)) {
                const settings = this.#data.get(this.#currentId);

                settings.suckState = checked;

                this.#data.set(this.#currentId, settings);
                return;
            }

            this.#data.set(this.#currentId, { suckState: checked });

            return;
        }

        // The following code could be used to implement the gripper :)
        // if (apId === 'grip-switch') {
        //     const checked = target.checked;

        //     if(this.#data.has(this.#currentId)) {
        //         const settings = this.#data.get(this.#currentId);

        //         settings.gripState = checked;

        //         this.#data.set(this.#currentId, settings);
        //         return;
        //     }

        //     this.#data.set(this.#currentId, { gripState: checked });

        //     return;
        // }

    }

    #notificationListener(e) {
        const target = e.target;
        const apId = target?.id;

        if (apId === 'notification-message--textarea') {
            const message = target.value;

            if (this.#data.has(this.#currentId)) {
                const data = this.#data.get(this.#currentId)
                data.message = message;
                this.#data.set(this.#currentId, data)
                return;
            }

            this.#data.set(this.#currentId, { message: message })
            return;
        }
    }

    #commentListener(e) {
        const target = e.target;
        const apId = target?.id;
        
        if (apId !== 'comment-textarea') return;
        
        const comment = target.value;

        this.#data.set(this.#currentId, comment)
    }

    async saveTask() {
        const task = {
            subtasks: [],
        };

        for (const elem of $('.subtask-group').toArray()) {
            const $elem = $(elem);

            const axisBtn = $elem.find('.create-axis-card--btn');
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
            
                if ($btn.hasClass('create-settings-card--btn')) {
                    step.command = 'settings';
                    step.data.settings = this.#data.get(btnId);
                    subtask.steps.push(step);
                    continue;
                }
                
                if ($btn.hasClass('create-notification-card--btn')) {
                    step.command = 'notification';
                    step.data.notification = this.#data.get(btnId);
                    subtask.steps.push(step);
                    continue;
                }
                
                if ($btn.hasClass('create-comment-card--btn')) {
                    step.command = 'comment';
                    step.data.comment = this.#data.get(btnId);
                    subtask.steps.push(step);
                    continue;
                }
            }

            task.subtasks.push(subtask);
        }
        
        const taskName = document.getElementById('task-name');

        // TODO:FIXME: This can be used to attack the side... - should be fine check it again...
        task.name = taskName.innerText;

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
        if (!this.#id) return;

        const res = await fetch(`/api/task?id=${this.#id}`, {method: 'GET'});
        const [id, name, subtaksJson] = await res.json();
        const subtasks = JSON.parse(subtaksJson);

        const taskNameField = document.getElementById('task-name');

        taskNameField.textContent = name;

        let counter = -1;

        for (const { movementType, steps } of subtasks) {
            counter++;
            this.#taskSidebar.createAxisLi(null, `${id}-${counter}`);

            for (const { command, data } of steps) {
                counter++;

                const itemId = `${id}-${counter}`;

                if (command === 'move') {
                    this.#taskSidebar.createMovementLi(null, itemId);
                    this.#data.set(itemId, data.pos)
                    continue;
                }

                if (command === 'wait') {
                    this.#taskSidebar.createWaitLi(null, itemId);
                    this.#data.set(itemId, data.wait)
                    continue;
                }

                if (command === 'settings') {
                    this.#taskSidebar.createSettingsLi(null, itemId);
                    this.#data.set(itemId, data.settings)
                    continue;
                }

                if (command === 'comment') {
                    this.#taskSidebar.createCommentLi(null, itemId);
                    this.#data.set(itemId, data.comment)
                    continue;
                }

                if (command === 'notification') {
                    this.#taskSidebar.createNotificationLi(null, itemId);
                    this.#data.set(itemId, data.notification)
                    continue;
                }
            }
        }
    }
}
