import { Sortable } from '@shopify/draggable';
        
export function sortableTable () {
  const containers = document.querySelectorAll('.sortable-list--draggable');

  if (containers.length === 0) return false;

  const sortable = new Sortable(containers, {
    draggable: '.list-item--draggable',
    mirror: {
      appendTo: '.sortable-list--draggable',
      constrainDimensions: true,
    },
    delay: {
      mouse: 100,
      drag: 100,
      touch: 100,
    },
  });            
}

export function specificSortableTable(selector, draggable) {
  const containers = document.querySelectorAll(selector);

  if (containers.length === 0) return false;

  const sortable = new Sortable(containers, {
    draggable: draggable,
    mirror: {
      appendTo: selector,
      constrainDimensions: true,
    },
    delay: {
      mouse: 100,
      drag: 100,
      touch: 100,
    },
  });
  
  sortable.on('click', () => console.log("hello"));
}