import SortVisualizer from './SortVisualizer'

(async () => {
  const sortVisualizer = new SortVisualizer()
  await sortVisualizer.shuffleNumbers()
  await sortVisualizer.bubbleSort()
})()