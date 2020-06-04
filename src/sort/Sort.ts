export default interface Sort {
  
  swap: (index1: number, index2: number) => Promise<void>
  referArray: (index: number) => Promise<number>

  initialize(
    swap: (index1: number, index2: number) => Promise<void>,
    referArray: (index: number) => Promise<number>,
  )

  sort(numbers: number[]): Promise<void>
}