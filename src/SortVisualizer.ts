import BubbleSort from "./sort/BubbleSort";
import TimeUtil from "./TimeUtil";
import QuickSort from "./sort/QuickSort";

const MaxRadius: number = 0.9
const MinRadius: number = 0.5

export default class SortVisualizer {

  public static readonly DefaultLength: number = 5000;

  numbers: number[]
  numbersLength: number

  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D

  swap: (index1: number, index2: number) => Promise<void>
  referArray: (index: number) => number

  constructor() {
    this.numbers = new Array(SortVisualizer.DefaultLength)
    this.numbersLength = this.numbers.length

    this.swap = async (index1: number, index2: number): Promise<void> => {
      if (index1 < 0 || index1 >= this.numbersLength) {
        throw new Error(`ERROR: swap(): index out of bounds. index1 '${index1}' accessed to array(${this.numbersLength})`)
      }
      if (index2 < 0 || index2 >= this.numbersLength) {
        throw new Error(`ERROR: swap(): index out of bounds. index2 '${index2}' accessed to array(${this.numbersLength})`)
      }
      const swap = this.numbers[index1]
      this.numbers[index1] = this.numbers[index2]
      this.numbers[index2] = swap

      console.log('swap')
      await this.drawNumbers()
    }

    this.referArray = (index: number): number => {
      if (index < 0 || index >= this.numbersLength) {
        throw new Error(`ERROR: referArray(): index out of bounds. index '${index}' accessed to array(${this.numbersLength})`)
      }
      return this.numbers[index]
    }

    this.initializeNumbers()
    this.initializeCanvas()
  }

  private initializeCanvas() {
    const canvas: HTMLCanvasElement | null = document.querySelector('#canvas')
    if (canvas === null) {
      throw new Error('missing canvas element')
    }

    this.canvas = canvas
    const context: CanvasRenderingContext2D | null = this.canvas.getContext('2d')
    if (context === null) {
      throw new Error('missing 2d context')
    }
    this.context = context
  }

  private initializeNumbers() {
    for (let index = 0; index < this.numbersLength; index ++) {
      this.numbers[index] = index + 1
    }
  }

  async shuffleNumbers() {
    for (let index = 0; index < this.numbersLength; index++) {
      const index1 = Math.floor(Math.random() * this.numbersLength)
      const index2 = Math.floor(Math.random() * this.numbersLength)
      
      const swap = this.numbers[index1]
      this.numbers[index1] = this.numbers[index2]
      this.numbers[index2] = swap
    }

    await this.drawNumbers()
    console.log('shuffled')
    console.log(`n: ${this.numbersLength}`)
    console.log(`  n ^ 2      : ${this.numbersLength ** 2}`)
    console.log(`  n * log(n) : ${this.numbersLength * Math.log2(this.numbersLength)}`)
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight)
    this.context.rect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight)
    this.context.fillStyle = '#000000'
    this.context.fill()
  }

  private async drawNumbers() {
    const width = this.canvas.clientWidth
    const height = this.canvas.clientHeight
    const centerX = width / 2
    const centerY = height / 2
    const maxRadius = Math.min(width, height) / 2

    this.clearCanvas()
    this.context.strokeStyle = '#FFFFFF'

    this.context.beginPath()
    for (let index = 0; index < this.numbersLength; index++) {
      const radian = (index / this.numbersLength * 2 * Math.PI) - Math.PI / 2
      const radiusRatio = (MinRadius + (MaxRadius - MinRadius) * (this.numbers[index] / this.numbersLength))
      const x = centerX + maxRadius * radiusRatio * Math.cos(radian)
      const y = centerY + maxRadius * radiusRatio * Math.sin(radian)

      if (index === 0) {  
        this.context.moveTo(x, y)
        continue
      }
      this.context.lineTo(x, y)
    }
    this.context.stroke()
    await TimeUtil.sleep(2);
  }

  async bubbleSort() {
    const bubbleSort = new BubbleSort()
    bubbleSort.initialize(this.swap, this.referArray)
    await bubbleSort.sort(this.numbers)
    await this.drawNumbers()
    console.log('bubble sorted')
  }

  async quickSort() {
    const quickSort = new QuickSort()
    quickSort.initialize(this.swap, this.referArray)
    await quickSort.sort(this.numbers)
    await this.drawNumbers()
    console.log('quick sorted')
  }
}