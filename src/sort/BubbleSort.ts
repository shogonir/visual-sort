import Sort from './Sort'

export default class BubbleSort implements Sort {

  align: (element: number, index: number) => Promise<void>
  referArray: (index: number) => Promise<number>
  shift: (from: number, to: number) => Promise<void>
  swap: (index1: number, index2: number) => Promise<void>

  initialize(
    align: (element: number, index: number) => Promise<void>,
    referArray: (index: number) => Promise<number>,
    shift: (from: number, to: number) => Promise<void>,
    swap: (index1: number, index2: number) => Promise<void>,
  ) {
    this.align = align
    this.referArray = referArray
    this.shift = shift
    this.swap = swap
  }

  async sort(numbers: number[]): Promise<void> {
    const numbersLength = numbers.length
    for (let i = 1; i < numbersLength; i++) {
      for (let j = 1; j < numbersLength - i + 1; j++) {
        if (await this.referArray(j) < await this.referArray(j - 1)) {
          await this.swap(j, j - 1);
        }
      }
    }
  }
}