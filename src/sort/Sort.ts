export default interface Sort {
  
  referArray: (index: number) => Promise<number>
  shift: (from: number, to: number) => Promise<void>
  swap: (index1: number, index2: number) => Promise<void>

  initialize(
    referArray: (index: number) => Promise<number>,
    shift: (from: number, to: number) => Promise<void>,
    swap: (index1: number, index2: number) => Promise<void>,
  ): void

  sort(numbers: number[]): Promise<void>
}