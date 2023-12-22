import { AnimatedSprite, BaseTexture, ISpritesheetData, ISpritesheetFrameData, Spritesheet } from "pixi.js"
import { Dict, Vector2 } from "../util/types.ts"
import { Util } from "../util/util.ts"

export default class AnimatedBuilder {

  private _id: string
  private _size: Vector2 = Vector2.ZERO
  private _image: string
  private _length: number
  private _texture: BaseTexture

  constructor(id: string, image: string, w: number, h: number, length: number, texture?: BaseTexture) {
    this._id = id
    this._size.x = w
    this._size.y = h
    this._image = image
    this._length = length
    this._texture = texture ?? BaseTexture.from(image)
  }

  copy(id: string) {
    return new AnimatedBuilder(id, this._image, this._size.x, this._size.y, this._length, this._texture)
  }

  private async _makeFrameData(): Promise<Dict<ISpritesheetFrameData>> {
    const frames: Dict<ISpritesheetFrameData> = {}

    await Util.wait4true(() => this._texture.valid)

    const temp = this._texture.height % this._size.y > 0 ? 1 : 0
    const line = this._texture.height / this._size.y + temp
    const w = this._size.x
    const h = this._size.y

    for (let l = 0; l < line; l++) {
      for (let i = 0; i < this._length / line; i++) {
        frames[`${this._id}.${l}.${i}`] = {
          frame: { x: i * h, y: l * h, w, h },
          sourceSize: { w, h },
          spriteSourceSize: { x: 0, y: 0, w, h },
        }
      }
    }

    return frames
  }

  async _makeSpritesheet(frames: Dict<ISpritesheetFrameData>) {
    const data: ISpritesheetData = {
      frames,
      meta: {
        image: this._image,
        format: "RGBA8888",
        size: { w: this._texture.width, h: this._texture.height },
        scale: "1"
      },
      animations: {
        anim: Object.keys(frames)
      }
    }

    return new Spritesheet(this._texture, data)
  }

  // 7.3.3에 고쳐지면 수정: https://github.com/pixijs/pixijs/pull/9896
  async build(): Promise<AnimatedSprite> {
    const frames = await this._makeFrameData()
    const sheet = await this._makeSpritesheet(frames)

    try {
      await sheet.parse()
    } catch (e) {
      console.error(e)
      throw new Error("잘못된 애니메이션 정보")
    }

    // @ts-ignore
    const textures = sheet.animations["anim"]
    return new AnimatedSprite(textures)
  }

}