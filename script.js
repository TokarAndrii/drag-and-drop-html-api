const RICHEST_PEOPLE_LIST = [
  'Bernard Arnault & family',
  'Elon Musk',
  'Jeff Bezos',
  'Mark Zuckerberg',
  'Larry Ellison',
  'Warren Buffett',
  'Bill Gates',
  'Larry Page',
  'Steve Ballmer',
  'Sergey Brin'
];

const draggableList = document.getElementById('draggable-list');

const checkBtn = document.getElementById('check-btn');

const listItems = [];
let dragStartIndex;

createList();

//Insert list items into DOM
function createList() {
  [...RICHEST_PEOPLE_LIST]
    // random order items in list stuff start
    .map((value) => ({ sort: Math.random(), value }))
    .sort((valA, valB) => valA.sort - valB.sort)
    .map((item) => item.value)
    // random order items in list stuff end
    .forEach((rich_people_name, index) => {
      const listItem = document.createElement('li');

      listItem.setAttribute('data-list-index', index); //add custom attribute

      listItem.innerHTML = `
        <span class='number'>${index + 1}</span>
        <div class='draggable' draggable='true'>
            <p class='name'>${rich_people_name}</p>
            <i class='fas fa-grip-lines'></i>
        </div>
    `;

      listItems.push(listItem);

      draggableList.appendChild(listItem);
    });

  addEventListeners();
}

//swap item places with each other
function swapItems(dragStartIndex, dragEndIndex) {
  //[myArray[0], myArray[1]] = [myArray[1], myArray[0]];

  const fromElement = listItems[dragStartIndex].querySelector('.draggable');
  const toElement = listItems[dragEndIndex].querySelector('.draggable');

  listItems[dragStartIndex].appendChild(toElement);
  listItems[dragEndIndex].appendChild(fromElement);
}

//paste item into overed place, move after dragStartIndex to the begin of array
//overed item move to the back one index
function pasteItemIntoMiddle(dragStartIndex, dragEndIndex) {
  const fromElement = listItems[dragStartIndex].querySelector('.draggable');
  //simple switch items by their places
  if (
    dragStartIndex === dragEndIndex - 1 ||
    dragStartIndex - 1 === dragEndIndex
  ) {
    const toElement = listItems[dragEndIndex].querySelector('.draggable');
    listItems[dragStartIndex].appendChild(toElement);
    listItems[dragEndIndex].appendChild(fromElement);
    return;
  }

  if (dragStartIndex < dragEndIndex) {
    //paste dragEndIndex - 1 because oll items will move to the left
    listItems[dragEndIndex - 1].appendChild(fromElement);

    //move to the left items after dragStartIndex
    listItems.forEach((item, index) => {
      if (index >= dragStartIndex && index + 1 < dragEndIndex) {
        const nextItem = listItems[index + 1].querySelector('.draggable');
        listItems[index].appendChild(nextItem);
      }
    });
  } else if (dragStartIndex > dragEndIndex) {
    const toElement = listItems[dragEndIndex].querySelector('.draggable');
    const startPrevElem =
      listItems[dragStartIndex - 1].querySelector('.draggable');

    listItems[dragEndIndex].appendChild(fromElement);
    listItems[dragEndIndex + 1].appendChild(toElement);
    listItems[dragStartIndex].appendChild(startPrevElem);

    for (let index = dragStartIndex - 1; index > dragEndIndex + 1; index--) {
      const prevItem = listItems[index - 1].querySelector('.draggable');
      listItems[index].appendChild(prevItem);
    }
  }
}

function addEventListeners() {
  //draggables
  const draggables = document.querySelectorAll('.draggable');

  //drop target
  const draggListItems = document.querySelectorAll('.draggable-list li');

  //The dragstart event is fired when the user starts dragging an element or text selection.
  function dragStart() {
    dragStartIndex = +this.closest('li').getAttribute('data-list-index');
  }

  //The dragover event is fired when an element or text selection is being dragged over
  //a valid drop target (every few hundred milliseconds).
  function dragOver(e) {
    e.preventDefault();
  }

  /**
   *
   * The drop event is fired when an element or text selection is dropped on a valid drop target.
   * To ensure that the drop event always fires as expected, you should always include
   * a preventDefault() call in the part of your code which handles the dragover event.
   */
  function dragDrop() {
    const dragEndIndex = +this.getAttribute('data-list-index');
    //swapItems(dragStartIndex, dragEndIndex);
    pasteItemIntoMiddle(dragStartIndex, dragEndIndex);
    this.classList.remove('over');
  }

  /**
   *
   * The dragenter event is fired when a dragged element or text selection enters
   * a valid drop target. The target object is the immediate user selection
   * (the element directly indicated by the user as the drop target), or the <body> element.
   */
  function dragEnter() {
    this.classList.add('over');
  }

  //The dragleave event is fired when a dragged element or text selection leaves
  //a valid drop target.
  function dragLeave() {
    this.classList.remove('over');
  }

  /**
   * dragenter -  is fired when a dragged item enters a valid drop target, allowing you
   * to perform preparations or visual changes.
   * dragover - is fired continuously while a dragged item is over a valid drop target,
   * allowing you to handle the drag operation and determine if the drop should be allowed.
   */

  draggables.forEach((draggable) => {
    draggable.addEventListener('dragstart', dragStart);
  });

  draggListItems.forEach((listItem) => {
    listItem.addEventListener('dragover', dragOver);
    listItem.addEventListener('drop', dragDrop);
    listItem.addEventListener('dragenter', dragEnter);
    listItem.addEventListener('dragleave', dragLeave);
  });

  checkBtn.addEventListener('click', () => {
    listItems.forEach((item, index) => {
      const personName = item.querySelector('.draggable').innerText.trim();

      if (personName !== RICHEST_PEOPLE_LIST[index]) {
        item.classList.add('wrong');
        item.classList.remove('right');
      } else {
        item.classList.add('right');
        item.classList.remove('wrong');
      }
    });
  });
}
