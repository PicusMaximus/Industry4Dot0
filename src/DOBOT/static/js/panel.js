// Query the element
export function initPanelSectionSlider() {
    const resizer = document.getElementById('dragMe');
    
    const resizerParent = resizer.closest('.resizer');
    
    const leftSide = resizerParent.previousElementSibling;
    const rightSide = resizerParent.nextElementSibling;
    
    // The current position of mouse
    let x = 0;
    let y = 0;
    
    // Width of left side
    let leftWidth = 0;
    
    // Handle the mousedown event
    // that's triggered when user drags the resizer
    const mouseDownHandler = function (e) {
        // Get the current mouse position
        x = e.clientX;
        y = e.clientY;
        leftWidth = leftSide.getBoundingClientRect().width;
    
        // Attach the listeners to `document`
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };
    
    const mouseMoveHandler = function (e) {
        // How far the mouse has been moved
        const dx = e.clientX - x;
        // Dont need this right away
        // const dy = e.clientY - y;
    
        const newLeftWidth = ((leftWidth + dx) * 100) / resizerParent.parentNode.getBoundingClientRect().width;
        leftSide.style.width = `${newLeftWidth}%`;
    
        document.body.style.cursor = 'col-resize';
    
        leftSide.style.userSelect = 'none';
        leftSide.style.pointerEvents = 'none';
    
        rightSide.style.userSelect = 'none';
        rightSide.style.pointerEvents = 'none';
    };
    
    const mouseUpHandler = function () {
        resizer.style.removeProperty('cursor');
        document.body.style.removeProperty('cursor');
    
        leftSide.style.removeProperty('user-select');
        leftSide.style.removeProperty('pointer-events');
    
        rightSide.style.removeProperty('user-select');
        rightSide.style.removeProperty('pointer-events');
    
        // Remove the handlers of `mousemove` and `mouseup`
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };
    
    // Attach the handler
    resizer.addEventListener('mousedown', mouseDownHandler);
} 


