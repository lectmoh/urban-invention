import Animation from "./animation.ts"
import { AnimatedSprite } from "pixi.js"

export default class UnitAnimation extends Animation {

  async _add(name: string, sprite: AnimatedSprite): Promise<this> {
    await super._add(name, sprite);
    sprite.anchor.set(0.5, 1)
    return this
  }

}