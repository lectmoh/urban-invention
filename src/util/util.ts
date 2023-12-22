export class Util {

  static wait4true(callback: () => boolean) {
    return new Promise((resolve, reject) => {
      try {
        const checkCallback = () => {
          const result = callback()

          if (result) {
            resolve(true)
          } else {
            setTimeout(checkCallback, 100)
          }
        }

        checkCallback()
      } catch (error) {
        reject(error)
      }
    })
  }

  static lpad(text: string | number, length: number) {
    const len = length - text.toString().length
    let s = "", i = 0
    while (i++ < len) s += "0"
    return s + text.toString()
  }

}