import SortVisualizer from './SortVisualizer'

const QuickerLength = 500;
const SlowerLength = 100;

(async () => {
  const sortVisualizer = new SortVisualizer();

  const shuffleButton = document.querySelector("#shuffle") as HTMLButtonElement;
  const orderSelect = document.querySelector("select[name='order']") as HTMLSelectElement;
  const sortButton = document.querySelector("#sort") as HTMLButtonElement;
  const algorithmSelect = document.querySelector("select[name='algorithm']") as HTMLSelectElement;

  const bubbleSortOption = document.querySelector("option[value='bubble']") as HTMLOptionElement;
  const insertionSortOption = document.querySelector("option[value='insertion']") as HTMLOptionElement;
  const selectionSortOption = document.querySelector("option[value='selection']") as HTMLOptionElement;
  const heapSortOption = document.querySelector("option[value='heap']") as HTMLOptionElement;
  const mergeSortOption = document.querySelector("option[value='merge']") as HTMLOptionElement;
  const quickSortOption = document.querySelector("option[value='quick']") as HTMLOptionElement;

  if (!shuffleButton
    || !orderSelect
    || !sortButton
    || !algorithmSelect
    || !bubbleSortOption
    || !insertionSortOption
    || !selectionSortOption
    || !heapSortOption
    || !mergeSortOption
    || !quickSortOption
  ) {
    return;  
  }

  const disable = () => {
    orderSelect.disabled = true
    algorithmSelect.disabled = true
    shuffleButton.disabled = true
    sortButton.disabled = true
  }

  const enable = () => {
    orderSelect.disabled = false
    algorithmSelect.disabled = false
    shuffleButton.disabled = false
    sortButton.disabled = false
  }

  const slow = async () => {
    await sortVisualizer.initializeNumbers(SlowerLength)

    bubbleSortOption.disabled = false
    insertionSortOption.disabled = false
    selectionSortOption.disabled = false

    heapSortOption.disabled = true
    mergeSortOption.disabled = true
    quickSortOption.disabled = true    

    bubbleSortOption.selected = true
  }

  const quick = async () => {
    await sortVisualizer.initializeNumbers(QuickerLength)

    bubbleSortOption.disabled = true
    insertionSortOption.disabled = true
    selectionSortOption.disabled = true

    heapSortOption.disabled = false
    mergeSortOption.disabled = false
    quickSortOption.disabled = false
    
    heapSortOption.selected = true
  }

  const shuffle = async () => {
    disable()
    await sortVisualizer.shuffleNumbers();
    enable()
  }

  await slow()
  // await shuffle();

  shuffleButton.addEventListener('click', async () => {
    disable()
    await shuffle()
    enable()
  })

  orderSelect.addEventListener('change', async () => {
    const order = orderSelect.value
    switch(order) {
      case 'slower':
        return await slow()
      case 'quicker':
        return await quick()
    }
  })

  sortButton.addEventListener('click', async () => {
    const option = algorithmSelect.value;
    disable()
    switch(option) {
      case 'bubble':
        await sortVisualizer.bubbleSort()
        break
      case 'insertion':
        await sortVisualizer.insertionSort()
        break
      case 'selection':
        await sortVisualizer.selectionSort()
        break
      case 'heap':
        await sortVisualizer.heapSort()
        break
      case 'merge':
        await sortVisualizer.mergeSort()
        break
      case 'quick':
        await sortVisualizer.quickSort()
        break
    }
    enable()
  })
})()
