import { Dict } from "../util/types.ts"
import Unit from "./unit.ts"

export interface AssetData {
  [unitName: string]: AnimationData
}

export interface AnimationData {
  image: string,
  w: number,
  h: number,
  length: number
}

export default class AssetBundle {
  get valid(): boolean {
    return Object.values(this._units).every(unit => unit.valid)
  }

  private _units: Dict<Unit> = {}

  constructor(assetData: Dict<AssetData>) {
    for (let name in assetData) {
      const data = assetData[name]
      this._units[name] = new Unit(name, data)
    }
  }

  get(unitName: string): Unit {
    if (!this.valid) throw new Error("에셋 불러오는 중")

    const unit = this._units[unitName]
    if (!unit) {
      console.warn("유닛 목록:", Object.keys(this._units))
      throw new Error("존재하지 않는 유닛")
    }
    return unit
  }

}