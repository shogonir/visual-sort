import Sort from './Sort'

export default class HeapSort implements Sort {

  align: (element: number, index: number) => Promise<void>
  referArray: (index: number) => Promise<number>
  shift: (from: number, to: number) => Promise<void>
  swap: (index1: number, index2: number) => Promise<void>

  heapSize: number

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
    this.heapSize = 0
  }

  async sort(numbers: number[]): Promise<void> {
    await this.maxHeapify(numbers)

    for (let index = numbers.length - 1; index > 0; index--) {
      const max = await this.deleteFromHeap(numbers)
      await this.align(max, index)
    }
  }

  async maxHeapify(numbers: number[]): Promise<void> {
    const numbersLength = numbers.length
    for (this.heapSize = 1; this.heapSize < numbersLength; this.heapSize++) {
      await this.addToHeap(numbers)
    }
  }

  async addToHeap(numbers: number[]): Promise<void> {
    let index = this.heapSize
    const numbersLength = numbers.length
    while (index > 0 && index < numbersLength) {
      const parentIndex = Math.floor((index - 1) / 2)
      if (await this.referArray(parentIndex) >= await this.referArray(index)) {
        break
      }
      await this.swap(index, parentIndex)
      index = parentIndex
    }
  }

  async deleteFromHeap(numbers: number[]): Promise<number> {
    const max = await this.referArray(0)
    this.heapSize--
    await this.align(await this.referArray(this.heapSize), 0)
    let index = 0
    while (index <= this.heapSize) {
      const leftChildIndex = index * 2 + 1
      const rightChildIndex = index * 2 + 2

      if (leftChildIndex > this.heapSize - 1) {
        break
      }

      const element = await this.referArray(index)

      if (rightChildIndex > this.heapSize - 1) {
        const element = await this.referArray(index)
        if (await this.referArray(leftChildIndex) > element) {
          await this.swap(leftChildIndex, index)
          index = leftChildIndex
          continue
        }  
      }
      
      const left = await this.referArray(leftChildIndex)
      const right = await this.referArray(rightChildIndex)
      if (left > element) {
        if (right > element) {
          if (right > left) {
            await this.swap(rightChildIndex, index)
            index = rightChildIndex
            continue           
          } else if (left > right) {
            await this.swap(leftChildIndex, index)
            index = leftChildIndex
            continue
          }
        }
        await this.swap(leftChildIndex, index)
        index = leftChildIndex
        continue
      } else if (right > element) {
        await this.swap(rightChildIndex, index)
        index = rightChildIndex
        continue
      }

      break
    }
    return max
  }
}