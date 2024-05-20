/**
 * 
 * @returns {number}
 */
function randomNumber() {
  const min = Math.ceil(10);
  const max = Math.floor(100_000);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 
 * @param {string} content 
 * @param {'success' | 'danger' | 'warn' | 'info'} type 
 */
export function showToast(content, type='info') {
    const id = randomNumber();

    const toast = createToast(content, type, id);

    const $toastContainer = $('<div></div>');


    $(document.getElementById('toast-container')).append($toastContainer);
    // $(document.body).append($toastContainer);

    $toastContainer[0].outerHTML = toast;

    const removeElement = new HSRemoveElement(document.getElementById(`${type}-toast-remove-btn-${id}`))

    const timeoutId = setTimeout(() => {
        removeElement.remove();
    }, 5000);

    removeElement.el.addEventListener('click', () => clearTimeout(timeoutId), { once: true });
}

/**
 * 
 * @param { string } content 
 * @param {'success' | 'danger' | 'warn' | 'info'} type 
 */
function createToast(content, type = 'info', id=0) {
    if (type === 'success') return createSuccessToast(content, id)
    if (type === 'danger') return createDangerToast(content, id);
    if (type === 'warn') return createWarnToast(content, id);
    if (type === 'info') return createInfoToast(content, id);
}

/**
 * 
 * @param {string} content
 * @returns {string}
 */
function createSuccessToast(content, id) {
    return `<div id="success-toast-${id}" class="hs-removing:translate-x-5 hs-removing:opacity-0 transition duration-300 max-w-xs bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-neutral-900 dark:border-neutral-700 z-50" role="alert">
    <div class="flex p-4">
      <div class="flex-shrink-0">
        <svg class="flex-shrink-0 size-4 text-teal-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
        </svg>
      </div>
      <div class="ms-3">
        <p class="text-sm text-gray-700 dark:text-neutral-400">
          ${content}
        </p>
      </div>
      <div class="ms-auto">
      <button id="success-toast-remove-btn-${id}" type="button" class="inline-flex flex-shrink-0 justify-center items-center size-5 rounded-lg text-gray-800 opacity-50 hover:opacity-100 focus:outline-none focus:opacity-100 dark:text-white" data-hs-remove-element="#success-toast-${id}">
        <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
      </div>
    </div>
  </div>`;
}

/**
 * 
 * @param {string} content
 * @returns {string}
 */
function createDangerToast(content, id) {
    return `<div id="danger-toast-${id}" class="hs-removing:translate-x-5 hs-removing:opacity-0 transition duration-300 max-w-xs bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-neutral-900 dark:border-neutral-700 z-50 " role="alert">
    <div class="flex p-4">
      <div class="flex-shrink-0">
        <svg class="flex-shrink-0 size-4 text-red-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
        </svg>
      </div>
      <div class="ms-3">
        <p class="text-sm text-gray-700 dark:text-neutral-400">
            ${content}
        </p>
      </div>
      <div class="ms-auto">
      <button id="danger-toast-remove-btn-${id}" type="button" class="inline-flex flex-shrink-0 justify-center items-center size-5 rounded-lg text-gray-800 opacity-50 hover:opacity-100 focus:outline-none focus:opacity-100 dark:text-white" data-hs-remove-element="#danger-toast-${id}">
        <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
      </div>
    </div>
  </div>`;
}

/**
 * 
 * @param {string} content
 * @returns {string}
 */
function createWarnToast(content, id) {
    return `<div id="warn-toast-${id}" class="hs-removing:translate-x-5 hs-removing:opacity-0 transition duration-300 max-w-xs bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-neutral-900 dark:border-neutral-700 z-50 " role="alert">
    <div class="flex p-4">
      <div class="flex-shrink-0">
        <svg class="flex-shrink-0 size-4 text-yellow-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
        </svg>
      </div>
      <div class="ms-3">
        <p class="text-sm text-gray-700 dark:text-neutral-400">
            ${content}
        </p>
      </div>
      <div class="ms-auto">
      <button id="warn-toast-remove-btn-${id}" type="button" class="inline-flex flex-shrink-0 justify-center items-center size-5 rounded-lg text-gray-800 opacity-50 hover:opacity-100 focus:outline-none focus:opacity-100 dark:text-white" data-hs-remove-element="#warn-toast-${id}">
        <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
      </div>
    </div>
  </div>`;
}

/**
 * 
 * @param {string} content
 * @returns {string}
 */
function createInfoToast(content, id) {
    return `<div id="info-toast-${id}" class="hs-removing:translate-x-5 hs-removing:opacity-0 transition duration-300 max-w-xs bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-neutral-900 dark:border-neutral-700 z-50 " role="alert">
        <div class="flex p-4">
            <div class="flex-shrink-0">
                <svg class="flex-shrink-0 size-4 text-blue-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                </svg>
            </div>
            <div class="ms-3">
            <p class="text-sm text-gray-700 dark:text-neutral-400">
                ${content}
            </p>
            </div>
            <div class="ms-auto">
            <button id="info-toast-remove-btn-${id}" type="button" class="inline-flex flex-shrink-0 justify-center items-center size-5 rounded-lg text-gray-800 opacity-50 hover:opacity-100 focus:outline-none focus:opacity-100 dark:text-white" data-hs-remove-element="#info-toast-${id}">
              <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            </div>
        </div>
    </div>`;
}