import { AnimatedSprite, Container } from "pixi.js"
import { Dict } from "../util/types.ts"
import AnimatedBuilder from "./builder.ts"

export default class Animation {
  get speed(): number {
    return this._speed
  }

  set speed(value: number) {
    this._speed = value
    if (this._state) {
      Object.values(this._sprites).forEach(sprite => sprite.animationSpeed = value)
    }
  }

  public container: Container

  private _names: Set<string> = new Set<string>()
  private _sprites: Dict<AnimatedSprite> = {}
  private _speed: number = 0.2
  private _state?: string // current state

  constructor(container: Container) {
    this.container = container
  }

  async _add(name: string, sprite: AnimatedSprite) {
    sprite.anchor.set(0.5, 0.5) // x=0.5 고정 (flip)
    sprite.animationSpeed = this._speed
    this._sprites[name] = sprite
    return this
  }

  async add(name: string, sprite: AnimatedSprite | AnimatedBuilder) {
    if (this._names.has(name)) {
      console.warn("이름 목록:", this._names)
      throw new Error("이미 존재하는 이름")
    }
    if (sprite instanceof AnimatedBuilder) {
      sprite = await sprite.build()
    }
    return this._add(name, sprite)
  }

  get(): AnimatedSprite | null {
    return this._state ? this._sprites[this._state] : null
  }

  play(name: string) {
    if (this._state === name) return

    const animations = Object.keys(this._sprites)
    if (!animations.includes(name)) {
      console.warn("애니메이션 목록:", animations)
      throw new Error("존재하지 않는 애니메이션")
    }

    const prev = this.get()

    this._state = name
    const sprite = this._sprites[name]

    sprite.play()
    prev?.stop()

    prev && this.container.removeChild(prev)
    this.container.addChild(sprite)
  }

  look(left = true) {
    Object.values(this._sprites).forEach(sprite => sprite.scale.x = left ? -1 : 1)
  }

}