import { specificSortableTable } from './drag-and-drop.js'
import { showToast } from "./toast.js";

export default class TaskSidebar {
    #$addMoveBtn = $(document.getElementById('add-move-btn'));
    #$addPointBtn = $(document.getElementById('add-point-btn'));
    #$addWaitBtn = $(document.getElementById('add-wait-btn'));
    #$addSettingsBtn = $(document.getElementById('add-settings-btn'));
    #$addNotificationBtn = $(document.getElementById('add-notification-btn'));
    #$addCommentBtn = $(document.getElementById('add-comment-btn'));

    #$taskContainer = $(document.getElementById('task-container'));

    // List of elements that should not remove the outline of the current selected task if clicked.
    #noMarkingElement = ['add-move-btn', 'add-point-btn', 'add-point-btn', 'add-settings-btn', 'add-notification-btn', 'add-comment-btn'];

    // Some usefull counters
    #pointCount = 0;
    #moveCount = 0;

    constructor() {
        this.initSidebar();
    }

    initSidebar() {
        this.#$addMoveBtn.on('click', this.createAxisLi.bind(this));
        this.#$addPointBtn.on('click', this.createMovementLi.bind(this));
        this.#$addWaitBtn.on('click', this.createWaitLi.bind(this));
        this.#$addSettingsBtn.on('click', this.createSettingsLi.bind(this));
        this.#$addNotificationBtn.on('click', this.createNotificationLi.bind(this));
        this.#$addCommentBtn.on('click', this.createCommentLi.bind(this));

        $(document).on('click', this.#markSubTask.bind(this));
    }

    createAxisLi(e, id='') {
        if(this.#moveCount === 0) this.#$taskContainer.empty();

        this.#moveCount++;
    
        const $div = $('<div></div>');
    
        if(!id?.trim?.()) this.#pointCount++ 

        const html = !id?.trim?.() ? this.createSubtask() : this.createAxis(id);
    
        this.#$taskContainer.append($div);
        $div[0].outerHTML = html;
    
        const collapse = new HSCollapse(document.querySelector(`#collapse-${this.#moveCount}`));
        collapse.show();
    
        specificSortableTable(`#collapse-content-${this.#moveCount} .move-list--draggable`, '.move-list-item--draggable')
    }

    createMovementLi(e, id='') {
        if (!this.#valid()) return;
    
        this.#pointCount++;
    
        const container = this.#getContainer();
    
        const html = this.createMovement(id)
    
        const $div = $('<div></div>');
    
        $(container).find('.command-chain-container').append($div);
        $div[0].outerHTML = html;
    }

    createWaitLi(e, id='') {
        if (!this.#valid()) return;
    
        const container = this.#getContainer();
    
        const html = this.createWait(id);
    
        const $div = $('<div></div>');
    
        $(container).find('.command-chain-container').append($div);
        $div[0].outerHTML = html;
    }

    createSettingsLi(e, id='') {
        if (!this.#valid()) return;
    
        const container = this.#getContainer();
    
        const html = this.createSettings(id);
    
        const $div = $('<div></div>');
    
        $(container).find('.command-chain-container').append($div);
        $div[0].outerHTML = html;
    }

    createNotificationLi(e, id='') {
        if (!this.#valid()) return;
    
        const container = this.#getContainer();
    
        const html = this.createNotification(id);
    
        const $div = $('<div></div>');
    
        $(container).find('.command-chain-container').append($div);
        $div[0].outerHTML = html;
    }

    createCommentLi(e, id='') {
        // Coming soon...
    }

    #valid() {
        if (this.#moveCount === 0) {
            showToast(`Das Element konnte nicht hinzugefügt werden, da noch keine Bewegung erstellt wurde.`, 'danger')
            return false;
        }

        return true;
    }

    #getContainer() {
        let container = document.querySelector('.collapse-content-container.marked');
    
        if (!container) {
            const containers = [...document.querySelectorAll('.collapse-content-container')]
            container = containers[containers.length - 1];
        };

        return container;
    }

    #markSubTask(e) {
        let target = e.target;
        if (!target.classList.contains('collapse-content-container')) {
            if (!target.closest('.collapse-content-container')) {
                let shouldRemove = true;
    
                for (const id of this.#noMarkingElement) {
                    if (target.id !== id)
                        if (target?.parentElement?.id !== id) continue;
    
                    shouldRemove = false;
                }
    
    
                if (shouldRemove) document.querySelector('.collapse-content-container.marked')?.classList?.remove('marked', 'border-dashed', 'border-2', 'border-sky-500');
                return;
            }
    
            target = target.closest('.collapse-content-container')
        }
    
    
        const oldTarget = document.querySelector('.collapse-content-container.marked');
    
        oldTarget?.classList?.remove('marked', 'border-dashed', 'border-2', 'border-sky-500')
    
        target.classList.add('marked', 'border-dashed', 'border-2', 'border-sky-500');
    }

    createSubtask() {
        return `
        <div class="subtask-group">
            <div class="flex mt-4">
                <button type="button" data-card-id="" class="hs-collapse-toggle text-sm font-semibold rounded-lg border border-transparent dark:focus:outline-none dark:focus:ring-1 pl-1 pr-1 text-slate-700 hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:ring-gray-600" id="collapse-${this.#moveCount}" data-hs-collapse="#collapse-content-${this.#moveCount}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="hs-collapse-open:rotate-180 flex-shrink-0 size-5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                <button type="button" class="create-axis-card--btn flex gap-1 pl-1 pr-1 items-center text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0 size-4 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    Fahre Achse
                </button>
            </div>
            <div id="collapse-content-${this.#moveCount}" class="collapse-content-container cursor-pointer hs-collapse hidden w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-basic-collapse">
                <div class="flex flex-col mt-2 ml-8 command-chain-container gap-x-1 gap-y-2 move-list--draggable">
                    <button type="button" data-card-id="" class="create-movement-card--btn move-list-item--draggable flex gap-1 items-center pl-1 pr-1 text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0 size-5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecapspic="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Wegpunkt ${this.#pointCount}
                    </button>
                </div>
            </div>
        </div>
    `;
    }

    createAxis(id) {
        return `
        <div class="subtask-group">
            <div class="flex mt-4">
                <button type="button" data-card-id="${id}" class="hs-collapse-toggle text-sm font-semibold rounded-lg border border-transparent dark:focus:outline-none dark:focus:ring-1 pl-1 pr-1 text-slate-700 hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:ring-gray-600" id="collapse-${this.#moveCount}" data-hs-collapse="#collapse-content-${this.#moveCount}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="hs-collapse-open:rotate-180 flex-shrink-0 size-5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                <button type="button" class="create-axis-card--btn flex gap-1 pl-1 pr-1 items-center text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0 size-4 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    Fahre Achse
                </button>
            </div>
            <div id="collapse-content-${this.#moveCount}" class="collapse-content-container cursor-pointer hs-collapse hidden w-full overflow-hidden transition-[height] duration-300" aria-labelledby="hs-basic-collapse">
                <div class="flex flex-col mt-2 ml-8 command-chain-container gap-x-1 gap-y-2 move-list--draggable">
                </div>
            </div>
        </div>
    `;
    }
    
    createMovement(id) {
        return `
        <button type="button" data-card-id="${id}" class="create-movement-card--btn move-list-item--draggable flex gap-1 items-center pl-1 pr-1 text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0 size-5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Wegpunkt ${this.#pointCount}
        </button>
        `
    }
    
    createWait(id) {
        return `
        <button type="button" data-card-id="${id}" class="create-wait-card--btn move-list-item--draggable flex gap-1 items-center pl-1 pr-1 text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0 mt-0.5 size-5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Wartepunkt
        </button>
        `
    }
    
    createSettings(id) {
        return `
        <button type="button" data-card-id="${id}" class="create-settings-card--btn move-list-item--draggable flex gap-1 items-center pl-1 pr-1 text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0 mt-0.5 size-5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Einstellung
        </button>
        `
    }
    
    createNotification(id) {
        return `
        <button type="button" data-card-id="${id}" class="create-notification-card--btn move-list-item--draggable flex gap-1 items-center pl-1 pr-1 text-sm text-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-slate-400 dark:hover:text-slate-300 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0 mt-0.5 size-5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Meldung
        </button>
        `
    }
}