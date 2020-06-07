import BubbleSort from "./sort/BubbleSort";
import TimeUtil from "./TimeUtil";
import QuickSort from "./sort/QuickSort";
import HeapSort from "./sort/HeapSort";
import InsertionSort from "./sort/InsertionSort";

const MaxRadius: number = 0.9
const MinRadius: number = 0.5

export default class SortVisualizer {

  numbers: number[]
  numbersLength: number

  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D

  swapCount: number

  referArray: (index: number) => Promise<number>
  shift: (from: number, to: number) => Promise<void>
  swap: (index1: number, index2: number) => Promise<void>

  constructor() {
    this.initializeCanvas()
    this.swapCount = 0

    this.referArray = async (index: number): Promise<number> => {
      if (index < 0 || index >= this.numbersLength) {
        throw new Error(`ERROR: referArray(): index out of bounds. index '${index}' accessed to array(${this.numbersLength})`)
      }
      return this.numbers[index]
    }

    this.shift = async (from: number, to: number): Promise<void> => {
      if (from === to || from < 0 || from >= this.numbersLength || to < 0 || to >= this.numbersLength) {
        return
      }
      const direction = (from < to) ? 1 : -1;
      const condition = (from < to) ? ((index: number) => index < to) : ((index: number) => index > to);
      const tmp = this.numbers[from];
      for (let index = from; condition(index); index += direction) {
        this.numbers[index] = this.numbers[index + direction]
        await this.drawNumbers()
      }
      this.numbers[to] = tmp
      await this.drawNumbers()
    }

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
      this.swapCount++
      await this.drawNumbers()
    }
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

  async initializeNumbers(numbersLength: number): Promise<void> {
    this.numbers = new Array(numbersLength)
    this.numbersLength = numbersLength
    for (let index = 0; index < numbersLength; index ++) {
      this.numbers[index] = index + 1
    }
    await this.drawNumbers()
  }

  async shuffleNumbers(): Promise<void> {
    for (let index = 0; index < this.numbersLength; index++) {
      const index1 = Math.floor(Math.random() * this.numbersLength)
      const index2 = Math.floor(Math.random() * this.numbersLength)
      
      await this.swap(index1, index2)
    }

    await this.drawNumbers()
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight)
    this.context.rect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight)
    this.context.fillStyle = '#000000'
    this.context.fill()
  }

  private async drawNumbers(): Promise<void> {
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
    await TimeUtil.sleep(1);
  }

  async bubbleSort(): Promise<void> {
    const bubbleSort = new BubbleSort()
    bubbleSort.initialize(this.referArray, this.shift, this.swap)
    await bubbleSort.sort(this.numbers)
    await this.drawNumbers()
    this.swapCount = 0
  }

  async insertionSort(): Promise<void> {
    const insertionSort = new InsertionSort()
    insertionSort.initialize(this.referArray, this.shift, this.swap)
    await insertionSort.sort(this.numbers)
    await this.drawNumbers()
    this.swapCount = 0
  }

  async heapSort(): Promise<void> {
    const heapSort = new HeapSort()
    heapSort.initialize(this.referArray, this.shift, this.swap)
    await heapSort.sort(this.numbers)
    await this.drawNumbers()
    this.swapCount = 0
  }

  async quickSort(): Promise<void> {
    const quickSort = new QuickSort()
    quickSort.initialize(this.referArray, this.shift, this.swap)
    await quickSort.sort(this.numbers)
    await this.drawNumbers()
    this.swapCount = 0
  }
}