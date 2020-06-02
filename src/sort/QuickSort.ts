import Sort from './Sort'

export default class QuickSort implements Sort {

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
    this.sortRecurse(numbers, 0, numbers.length - 1)
  }

  private async sortRecurse(numbers: number[], indexMin: number, indexMax: number): Promise<void> {
    if (indexMin >= indexMax) {
      return
    }
    const pivot = await this.selectPivot(numbers, indexMin, indexMax)
    let leftIndex = indexMin
    let rightIndex = indexMax
    while (leftIndex < rightIndex) {
      while (this.referArray(leftIndex) < pivot && leftIndex < indexMax) {
        leftIndex++
      }
      while (this.referArray(rightIndex) > pivot && rightIndex > indexMin) {
        rightIndex--
      }
      if (leftIndex >= rightIndex) {
        break
      }
      if (this.referArray(leftIndex) > this.referArray(rightIndex)) {
        await this.swap(leftIndex, rightIndex)
      }
    }
    await this.sortRecurse(numbers, indexMin, leftIndex - 1)
    await this.sortRecurse(numbers, leftIndex + 1, indexMax)
  }

  private async selectPivot(numbers: number[], indexMin: number, indexMax: number): Promise<number> {
    const medians: number[] = []
    for (let i = indexMin; i <= indexMax; i+= 5) {
      const max = Math.min(i + 4, indexMax)
      const fiveNumbers: number[] = []
      for (let j = i; j <= max; j++) {
        fiveNumbers.push(numbers[j])
      }
      const median = await this.selectMedian(fiveNumbers)
      medians.push(median)
    }
    return (medians.length === 1) ? medians[0] : await this.selectPivot(medians, 0, medians.length - 1)
  }

  private async selectMedian(numbers: number[]): Promise<number> {
    const numbersLength = numbers.length
    if (numbersLength <= 0 || numbersLength > 5) {
      console.log(`QuickSort.selectMedian() uncorrect numbers length: ${numbersLength}`)
      return 0
    }
    return numbers.sort()[Math.floor(numbersLength / 2)]
  }
}