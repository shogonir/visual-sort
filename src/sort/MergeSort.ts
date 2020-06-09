import Sort from './Sort'

export default class MergeSort implements Sort {

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
    await this.sortRecurse(numbers, 0, numbers.length - 1)
  }

  private async sortRecurse(numbers: number[], indexMin: number, indexMax: number): Promise<void> {
    if (indexMax - indexMin <= 0) {
      return
    }
    const indexMiddle = indexMin + Math.floor(Math.abs(indexMax - indexMin) / 2)
    await this.sortRecurse(numbers, indexMin, indexMiddle)
    await this.sortRecurse(numbers, indexMiddle + 1, indexMax)
    let leftIndex = indexMin
    let rightIndex = indexMiddle + 1
    let index = indexMin
    const cloneNumbers = numbers.slice(indexMin, indexMax + 1)
    while (leftIndex <= indexMiddle || rightIndex <= indexMax) {
      if (leftIndex > indexMiddle) {
        const right = await this.referArray(rightIndex)
        cloneNumbers[index - indexMin] = right
        rightIndex++
        index++
        continue
      }
      if (rightIndex > indexMax) {
        const left = await this.referArray(leftIndex)
        cloneNumbers[index - indexMin] = left
        leftIndex++
        index++
        continue
      }
      
      const left = await this.referArray(leftIndex)
      const right = await this.referArray(rightIndex)
      if (left < right) {
        cloneNumbers[index - indexMin] = left
        leftIndex++
        index++
        continue 
      }
      cloneNumbers[index - indexMin] = right
      rightIndex++
      index++
    }

    for (let i = indexMin; i <= indexMax; i++) {
      await this.referArray(i)
      numbers[i] = cloneNumbers[i - indexMin]
    }
  }
}