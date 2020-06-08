import Sort from './Sort'

export default class SelectionSort implements Sort {

  referArray: (index: number) => Promise<number>
  shift: (from: number, to: number) => Promise<void>
  swap: (index1: number, index2: number) => Promise<void>

  initialize(
    referArray: (index: number) => Promise<number>,
    shift: (from: number, to: number) => Promise<void>,
    swap: (index1: number, index2: number) => Promise<void>,
  ) {
    this.referArray = referArray
    this.shift = shift
    this.swap = swap
  }

  async sort(numbers: number[]): Promise<void> {
    const numbersLength = numbers.length
    for (let i = 0; i < numbersLength; i++) {
      let minIndex = i
      let min = await this.referArray(minIndex)
      for (let j = i; j < numbersLength; j++) {
        const element = await this.referArray(j)
        if (element < min) {
          min = element
          minIndex = j
        }
      }
      if (i !== minIndex) {
        await this.swap(i, minIndex)
      }
    }
  }
}