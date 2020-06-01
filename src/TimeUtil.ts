export default class TimeUtil {
  
  static async sleep(milliSec: number): Promise<void> {
    return new Promise((resolve: () => void) => {
      setTimeout(resolve, milliSec)
    })
  }
}