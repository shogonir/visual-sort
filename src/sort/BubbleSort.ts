import Sort from './Sort'

export default class BubbleSort implements Sort {

  swap: (index1: number, index2: number) => Promise<void>
  referArray: (index: number) => Promise<number>

  initialize(
    swap: (index1: number, index2: number) => Promise<void>,
    referArray: (index: number) => Promise<number>,
  ) {
    this.swap = swap
    this.referArray = referArray
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