import Unit from "../unit/unit.ts"
import { Application } from "pixi.js"
import Signal from "../util/signal.ts"
import Keyboard from "../util/keyboard.ts"
import { Dict, Vector2 } from "../util/types.ts"
import { Util } from "../util/util.ts"

export default class Player {
  get unit(): Unit {
    return this._unit
  }

  private _unit: Unit
  private _keyboard: Keyboard
  private _keyMap: Dict<boolean> = {}

  public onProcess = new Signal<number>() // delta

  constructor(unit: Unit, app: Application) {
    this._unit = unit

    Util.wait4true(() => unit.valid).then(() => unit.clipping(app))

    this._keyboard = new Keyboard()
    this._keyboard.allowKeys.add("Shift")
      .add("ArrowLeft").add("ArrowRight")
      .add("ArrowUp").add("ArrowDown")

    window.addEventListener("focus", () => this._keyMap = {})

    this._keyboard.onPress.connect(this.handlePress.bind(this))
    this._keyboard.onRelease.connect(this.handleRelease.bind(this))

    app.ticker.add((delta) => this.onProcess.emit(delta))
    this.onProcess.connect((delta: number) => {
      const dir = Vector2.ZERO

      if (this._keyMap["ArrowLeft"]) {
        dir.x -= 1
      }
      if (this._keyMap["ArrowRight"]) {
        dir.x += 1
      }
      if (this._keyMap["ArrowUp"]) {
        dir.y -= 1
      }
      if (this._keyMap["ArrowDown"]) {
        dir.y += 1
      }

      if (this._keyMap["Shift"]) {
        unit.run(delta, dir)
      } else {
        unit.walk(delta, dir)
      }
    })
  }

  handlePress(key: string) {
    this._keyMap[key] = true
  }

  handleRelease(key: string) {
    this._keyMap[key] = false
  }

}