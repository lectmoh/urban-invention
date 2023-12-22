import Signal from "./signal.ts"

export default class Keyboard {

  // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
  public allowKeys: Set<string> = new Set<string>()
  public onPress = new Signal<string>() // key
  public onRelease = new Signal<string>()

  constructor() {
    this.subscribe()
  }

  subscribe() {
    window.addEventListener("keydown", this._keyDownHandler.bind(this))
    window.addEventListener("keyup", this._keyUpHandler.bind(this))
  }

  unsubscribe() {
    window.removeEventListener("keydown", this._keyDownHandler.bind(this))
    window.removeEventListener("keyup", this._keyUpHandler.bind(this))
  }

  _keyDownHandler(e: KeyboardEvent) {
    if (this.allowKeys.size && !this.allowKeys.has(e.key)) return
    e.preventDefault()
    this.onPress.emit(e.key)
  }

  _keyUpHandler(e: KeyboardEvent) {
    if (this.allowKeys.size && !this.allowKeys.has(e.key)) return
    e.preventDefault()
    this.onRelease.emit(e.key)
  }

}