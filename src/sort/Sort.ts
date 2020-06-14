export default interface Sort {
  
  align: (element: number, index: number) => Promise<void>
  referArray: (index: number) => Promise<number>
  shift: (from: number, to: number) => Promise<void>
  swap: (index1: number, index2: number) => Promise<void>

  initialize(
    align: (element: number, index: number) => Promise<void>,
    referArray: (index: number) => Promise<number>,
    shift: (from: number, to: number) => Promise<void>,
    swap: (index1: number, index2: number) => Promise<void>,
  ): void

  sort(numbers: number[]): Promise<void>
}