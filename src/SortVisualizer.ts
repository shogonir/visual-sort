const MaxRadius: number = 0.9
const MinRadius: number = 0.8

export default class SortVisualizer {

  public static readonly DefaultLength: number = 500;

  numbers: number[]

  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D

  constructor() {
    this.numbers = new Array(SortVisualizer.DefaultLength)
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
    const numbersLength = this.numbers.length
    for (let index = 0; index < numbersLength; index ++) {
      this.numbers[index] = index + 1
    }
  }

  shuffleNumbers() {
    const numbersLength = this.numbers.length
    for (let index = 0; index < numbersLength; index++) {
      const index1 = Math.floor(Math.random() * numbersLength)
      const index2 = Math.floor(Math.random() * numbersLength)
      
      const swap = this.numbers[index1]
      this.numbers[index1] = this.numbers[index2]
      this.numbers[index2] = swap
    }

    this.drawNumbers()
    console.log(this.numbers)
  }

  private drawNumbers() {
    const width = this.canvas.clientWidth
    const height = this.canvas.clientHeight
    const centerX = width / 2
    const centerY = height / 2
    const maxRadius = Math.min(width, height) / 2
    const numbersLength = this.numbers.length
    console.log(width, height, centerX, centerY, maxRadius)

    this.context.beginPath()
    for (let index = 0; index < numbersLength; index++) {
      const radian = (index / numbersLength * 2 * Math.PI) - Math.PI / 2
      const radiusRatio = (MinRadius + (MaxRadius - MinRadius) * (this.numbers[index] / numbersLength))
      const x = centerX + maxRadius * radiusRatio * Math.cos(radian)
      const y = centerY + maxRadius * radiusRatio * Math.sin(radian)

      if (index === 0) {  
        this.context.moveTo(x, y)
        continue
      }
      this.context.lineTo(x, y)
    }
    this.context.stroke()
  }
}