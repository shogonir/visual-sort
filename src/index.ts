import SortVisualizer from './SortVisualizer'

const startButton = document.querySelector('#start')

if (startButton) {
  console.log('start button detected')
  startButton.addEventListener('click', () => {
    console.log('click');
    (async () => {
      const sortVisualizer = new SortVisualizer()
      await sortVisualizer.shuffleNumbers()
      await sortVisualizer.quickSort()
    })()    
  })
}