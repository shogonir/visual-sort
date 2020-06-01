import Sort from './Sort'

export default class BubbleSort implements Sort {

  swap: (index1: number, index2: number) => void
  referArray: (index: number) => number

  initialize(
    swap: (index1: number, index2: number) => void,
    referArray: (index: number) => number,
  ) {
    this.swap = swap
    this.referArray = referArray
  }

  async sort(numbers: number[]): Promise<void> {
    const numbersLength = numbers.length
    for (let i = 1; i < numbersLength; i++) {
      for (let j = 1; j < numbersLength - i + 1; j++) {
        if (this.referArray(j) < this.referArray(j - 1)) {
          await this.swap(j, j - 1);
        }
      }
    }
  }
}