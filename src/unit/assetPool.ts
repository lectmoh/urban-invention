import Asset from "./asset.ts"
import { Util } from "../util/util.ts"

export default class AssetPool {

  get valid(): boolean {
    return Object.values(this._asset).every(asset => asset.valid)
  }

  private _asset: Asset
  private _size: number
  private _pool: Asset[] = []
  private _borrowed: Asset[] = []

  constructor(asset: Asset, size: number) {
    this._asset = asset
    this._size = size
    this._create(size)
  }

  _create(size: number, start = 0) {
    for (let i = start; i < size; i++) {
      const name = `${this._asset.name}.pool.${Util.lpad(i, 3)}`
      const inst = this._asset.copy(name)
      this._pool.push(inst)
    }
  }

  get(): Asset {
    const asset = this._pool.shift()

    if (!asset) {
      console.warn(`current size: ${this._pool.length}/${this._size}`)
      throw new Error("더 이상 가져갈 에셋이 없음")
    }

    this._borrowed.push(asset)
    return asset
  }

  release(asset: Asset) {
    const i = this._borrowed.indexOf(asset)
    if (i > -1) {
      this._borrowed.splice(i, 1)
      this._pool.push(asset)
    }
  }

}