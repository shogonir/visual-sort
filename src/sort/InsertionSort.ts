import Sort from "./Sort";

export default class InsertionSort implements Sort {
  
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
    for (let index = 1; index < numbersLength; index++) {
      const inserted = await this.referArray(index);
      if (inserted > await this.referArray(index - 1)) {
        continue;
      }
      let j: number = index - 1;
      for (j = index - 1; j >= 0; j--) {
        const element = await this.referArray(j);
        if (element < inserted) {
          break;
        }
      }
      await this.shift(index, j + 1);
    }
  }
}