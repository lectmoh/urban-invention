import { Dict, Vector2 } from "../util/types.ts"
import Asset from "./asset.ts"
import { AssetData } from "./assetBundle.ts"
import AnimatedBuilder from "../anim/builder.ts"
import UnitAnimation from "../anim/unitAnimation.ts"
import { Container } from "pixi.js"

export default class Unit extends Asset {

  public speed = 1.0
  public runSpeed = 2.0

  constructor(name: string, data?: AssetData, builders: Dict<AnimatedBuilder> = {}) {
    super(name, data, builders, new UnitAnimation(new Container()))
  }

  idle() {
    this.playAnim("idle")
  }

  walk(delta: number, v: Vector2) {
    if (v.isZero()) {
      this.idle()
    } else {
      this.playAnim("walk")
      this.move(v.multiplyScalar(delta * this.speed))
    }
  }

  run(delta: number, dir: Vector2) {
    if (dir.isZero()) {
      this.idle()
    } else {
      this.playAnim("run")
      this.move(dir.multiplyScalar(delta * this.runSpeed))
    }
  }

  copy(name: string): Unit {
    return new Unit(name, undefined, this._builders)
  }

}