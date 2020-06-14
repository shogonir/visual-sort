import BubbleSort from "./sort/BubbleSort";
import TimeUtil from "./TimeUtil";
import QuickSort from "./sort/QuickSort";
import HeapSort from "./sort/HeapSort";
import InsertionSort from "./sort/InsertionSort";
import SelectionSort from "./sort/SelectionSort";
import MergeSort from "./sort/MergeSort";

const MaxRadius: number = 0.9
const MinRadius: number = 0.5

export default class SortVisualizer {

  numbers: number[]
  numbersLength: number

  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D

  alignCount: number
  referArrayCount: number
  swapCount: number

  align: (element: number, index: number) => Promise<void>
  referArray: (index: number) => Promise<number>
  shift: (from: number, to: number) => Promise<void>
  swap: (index1: number, index2: number) => Promise<void>

  centerText: string
  referedIndices: number[]

  constructor() {
    this.initializeCanvas()

    this.alignCount = 0
    this.referArrayCount = 0
    this.swapCount = 0

    this.centerText = ''
    this.referedIndices = []

    this.align = async (element: number, index: number): Promise<void> => {
      if (index < 0 || index >= this.numbersLength) {
        throw new Error(`ERROR: align(): index out of bounds. index '${index}' accessed to array(${this.numbersLength})`)
      }
      this.numbers[index] = element
      this.alignCount++
      await this.drawNumbers()
    }

    this.referArray = async (index: number): Promise<number> => {
      if (index < 0 || index >= this.numbersLength) {
        throw new Error(`ERROR: referArray(): index out of bounds. index '${index}' accessed to array(${this.numbersLength})`)
      }
      this.referedIndices.push(index)
      this.referArrayCount++
      await this.drawNumbers()
      return this.numbers[index]
    }

    this.shift = async (from: number, to: number): Promise<void> => {
      if (from === to || from < 0 || from >= this.numbersLength || to < 0 || to >= this.numbersLength) {
        return
      }
      const direction = (from < to) ? 1 : -1;
      const condition = (from < to) ? ((index: number) => index < to) : ((index: number) => index > to);
      const tmp = await this.referArray(from)
      for (let index = from; condition(index); index += direction) {
        await this.align(await this.referArray(index + direction), index)
      }
      await this.align(tmp, to);
      await this.drawNumbers()
    }

    this.swap = async (index1: number, index2: number): Promise<void> => {
      if (index1 < 0 || index1 >= this.numbersLength) {
        throw new Error(`ERROR: swap(): index out of bounds. index1 '${index1}' accessed to array(${this.numbersLength})`)
      }
      if (index2 < 0 || index2 >= this.numbersLength) {
        throw new Error(`ERROR: swap(): index out of bounds. index2 '${index2}' accessed to array(${this.numbersLength})`)
      }
      const swap = await this.referArray(index1)
      await this.align(await this.referArray(index2), index1)
      await this.align(swap, index2);
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
    this.resetCounter()
    this.numbers = new Array(numbersLength)
    this.numbersLength = numbersLength
    for (let index = 0; index < numbersLength; index ++) {
      this.numbers[index] = index + 1
    }
    await this.drawNumbers()
  }

  async shuffleNumbers(): Promise<void> {
    this.resetCounter()
    this.centerText = 'shuffle()'
    for (let index = 0; index < this.numbersLength; index++) {
      const index1 = Math.floor(Math.random() * this.numbersLength)
      const index2 = Math.floor(Math.random() * this.numbersLength)
      
      await this.swap(index1, index2)
    }

    this.centerText = 'finish!'
    await this.drawNumbers()
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight)
    this.context.rect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight)
    this.context.fillStyle = '#222222'
    this.context.fill()
  }

  private async drawNumbers(): Promise<void> {
    const width = this.canvas.clientWidth
    const height = this.canvas.clientHeight
    const centerX = width / 2
    const centerY = height / 2
    const maxRadius = Math.min(width, height) / 2

    this.clearCanvas()

    // grid
    this.context.strokeStyle = '#303030'
    this.context.beginPath()
    this.context.arc(centerX, centerY, maxRadius * MinRadius, 0, 2 * Math.PI, false)
    this.context.stroke()
    this.context.beginPath()
    this.context.arc(centerX, centerY, maxRadius * (MaxRadius + MinRadius) / 2, 0, 2 * Math.PI, false)
    this.context.stroke()
    this.context.beginPath()
    this.context.arc(centerX, centerY, maxRadius * MaxRadius, 0, 2 * Math.PI, false)
    this.context.stroke()
    for (let index = 0; index < 12; index++) {
      const radian = index / 12 * 2 * Math.PI;
      this.context.beginPath()
      this.context.moveTo(
        centerX + maxRadius * MinRadius * Math.cos(radian),
        centerY + maxRadius * MinRadius * Math.sin(radian)
      )
      this.context.lineTo(
        centerX + maxRadius * MaxRadius * Math.cos(radian),
        centerY + maxRadius * MaxRadius * Math.sin(radian)
      )
      this.context.stroke()
    }
    
    // numbers
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

    // refer array
    if (this.referedIndices.length > 0) {
      this.context.beginPath()
      this.context.strokeStyle = '#00FFFF'
      for (const index of this.referedIndices) {
        this.context.moveTo(centerX, centerY);
        const radian = index / this.numbersLength * 2 * Math.PI - Math.PI / 2;
        const radiusRatio = (MinRadius + (MaxRadius - MinRadius) * (this.numbers[index] / this.numbersLength))
        this.context.lineTo(
          centerX + maxRadius * radiusRatio * Math.cos(radian),
          centerY + maxRadius * radiusRatio * Math.sin(radian)
        )
      }
      this.context.stroke()
      this.referedIndices = []
    }

    // center text
    this.context.beginPath()
    this.context.fillStyle = '#FFFFFF'
    this.context.font = '20px monospace'
    this.context.textAlign = 'center'
    this.context.fillText(this.centerText, centerX, centerY - 20)

    // status
    this.context.beginPath()
    this.context.fillStyle = '#BBBBBB'
    this.context.font = '15px monospace'
    this.context.textAlign = 'left'
    const statusTextLines = [
      this.numbersLength.toLocaleString().padStart(6, ' ') + ' elements',
      this.referArrayCount.toLocaleString().padStart(6, ' ') + ' references',
      this.alignCount.toLocaleString().padStart(6, ' ') + ' aligns',
      this.swapCount.toLocaleString().padStart(6, ' ') + ' swaps',
    ];
    for (const lineNumber in statusTextLines) {
      const lineNum = parseInt(lineNumber, 10);
      const line = statusTextLines[lineNumber];
      this.context.fillText(line, centerX - 64, centerY + 12 + (lineNum * 21))
    }

    await TimeUtil.sleep(1);
  }

  private resetEffect() {
    this.centerText = 'finish!'
    this.referedIndices = []
  }

  private resetCounter() {
    this.alignCount = 0;
    this.referArrayCount = 0;
    this.swapCount = 0;
  }

  async bubbleSort(): Promise<void> {
    this.resetCounter()
    this.centerText = 'bubble_sort()'
    const bubbleSort = new BubbleSort()
    bubbleSort.initialize(this.align, this.referArray, this.shift, this.swap)
    await bubbleSort.sort(this.numbers)
    this.resetEffect()
    await this.drawNumbers()
    this.swapCount = 0
  }

  async insertionSort(): Promise<void> {
    this.resetCounter()
    this.centerText = 'insertion_sort()'
    const insertionSort = new InsertionSort()
    insertionSort.initialize(this.align, this.referArray, this.shift, this.swap)
    await insertionSort.sort(this.numbers)
    this.resetEffect()
    await this.drawNumbers()
    this.swapCount = 0
  }

  async selectionSort(): Promise<void> {
    this.resetCounter()
    this.centerText = 'selection_sort()'
    const selectionSort = new SelectionSort()
    selectionSort.initialize(this.align, this.referArray, this.shift, this.swap)
    await selectionSort.sort(this.numbers)
    this.resetEffect()
    await this.drawNumbers()
    this.swapCount = 0
  }

  async heapSort(): Promise<void> {
    this.resetCounter()
    this.centerText = 'heap_sort()'
    const heapSort = new HeapSort()
    heapSort.initialize(this.align, this.referArray, this.shift, this.swap)
    await heapSort.sort(this.numbers)
    this.resetEffect()
    await this.drawNumbers()
    this.swapCount = 0
  }

  async mergeSort(): Promise<void> {
    this.resetCounter()
    this.centerText = 'merge_sort()'
    const mergeSort = new MergeSort()
    mergeSort.initialize(this.align, this.referArray, this.shift, this.swap)
    await mergeSort.sort(this.numbers)
    this.resetEffect()
    await this.drawNumbers()
    this.swapCount = 0
  }

  async quickSort(): Promise<void> {
    this.resetCounter()
    this.centerText = 'quick_sort()'
    const quickSort = new QuickSort()
    quickSort.initialize(this.align, this.referArray, this.shift, this.swap)
    await quickSort.sort(this.numbers)
    this.resetEffect()
    await this.drawNumbers()
    this.swapCount = 0
  }
}