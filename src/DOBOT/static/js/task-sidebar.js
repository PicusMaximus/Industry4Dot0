const $addMoveBtn = $(document.getElementById('add-move-btn'));
const $addPointBtn = $(document.getElementById('add-point-btn'));
const $taskContainer = $(document.getElementById('task-container'));

let pointCount = 0;

$addMoveBtn.on('click', () => {
    $taskContainer.empty();

    pointCount++;
    
    const $pElement = $('<p class="flex items-center mt-2 text-gray-500 dark:text-gray-400"></p>');

    const svg = '<svg xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0 size-4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';

    $pElement[0].innerHTML = svg;
    $pElement.append($('<span></span>').text(`Wegpunkt ${pointCount}`));

    $taskContainer.append($pElement)
});

$addPointBtn.on('click', () => {
    if (pointCount === 0) $taskContainer.empty();

    pointCount++;

    const $pElement = $('<p class="flex items-center mt-2 text-gray-500 dark:text-gray-400"></p>');

    const svg = '<svg xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0 size-4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';

    $pElement[0].innerHTML = svg;
    $pElement.append($('<span></span>').text(`Wegpunkt ${pointCount}`));

    $taskContainer.append($pElement)
});