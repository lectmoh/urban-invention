import UnitAnimation from "../anim/unitAnimation.ts"
import { Application, Container } from "pixi.js"
import { AnimationData, AssetData } from "./assetBundle.ts"
import AnimatedBuilder from "../anim/builder.ts"
import { Dict, Vector2 } from "../util/types.ts"
import Animation from "../anim/animation.ts"
import { Util } from "../util/util.ts"

export default class Asset {

  get animSpeed(): number {
    return this._anim.speed
  }

  set animSpeed(value: number) {
    this._anim.speed = value
  }

  get direction(): number {
    return this.isLookLeft ? -1 : 1
  }

  public valid = false
  public name: string
  public isLookLeft = false

  protected _anim: UnitAnimation
  protected _builders: Dict<AnimatedBuilder>
  protected _container: Container
  protected _clipper?: (delta: number) => void

  constructor(name: string, data?: AssetData, builders: Dict<AnimatedBuilder> = {}, anim?: Animation) {
    this.name = name
    this._builders = builders
    this._container = anim?.container ?? new Container()
    this._anim = anim ?? new Animation(this._container)

    this._load(data).then(() => this.valid = true)
  }

  fullName(animName: string) {
    return `${this.name}.${animName}`
  }

  async _load(data?: AssetData) {
    if (Object.keys(this._builders).length) {
      for (let animName in this._builders) {
        const builder = this._builders[animName].copy(this.fullName(animName))
        await this._anim.add(animName, builder)
      }
    } else {
      for (let animName in data) {
        const { image, w, h, length }: AnimationData = data[animName]
        const id = this.fullName(animName)

        const builder = new AnimatedBuilder(id, image, w, h, length)
        this._builders[animName] = builder

        await this._anim.add(animName, builder)
      }
    }
  }

 async playAnim(name: string) {
    await Util.wait4true(() => this.valid)
    this._anim.play(name)
  }

  move(dir: Vector2) {
    const asset: Container = this.get()

    asset.x += dir.x
    asset.y += dir.y

    if (dir.x > 0) {
      this.look(false)
    } else if (dir.x < 0) {
      this.look()
    }
  }

  look(left = true) {
    this._anim.look(left)
    this.isLookLeft = left
  }

  flip() {
    this.isLookLeft ? this.look(false) : this.look()
  }

  get(): Container {
    return this._container
  }

  async clipping(app: Application) {
    if (this._clipper) {
      app.ticker.remove(this._clipper)
    }

    this._clipper = (_delta: number) => {
      const unit = this.get()
      const anim = this._anim.get()
      const w = (anim?.width ?? 0) * (anim?.anchor.x ?? 0)
      const minH = (anim?.height ?? 0) * (anim?.anchor.y ?? 0)
      const maxH = (anim?.height ?? 0) * (1 - (anim?.anchor.y ?? 0))

      if (unit.x > app.screen.width - w) {
        unit.x = app.screen.width - w
      } else if (unit.x < w) {
        unit.x = w
      }

      if (unit.y > app.screen.height - maxH) {
        unit.y = app.screen.height - maxH
      } else if (unit.y < minH) {
        unit.y = minH
      }
    }
    app.ticker.add(this._clipper)
  }

  copy(name: string): Asset {
    return new Asset(name, undefined, this._builders)
  }

}