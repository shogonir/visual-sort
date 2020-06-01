export default interface Sort {
  
  swap: (index1: number, index2: number) => void
  referArray: (index: number) => number

  initialize(
    swap: (index1: number, index2: number) => void,
    referArray: (index: number) => number,
  )

  sort(numbers: number[]): void
}