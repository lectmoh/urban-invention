import { Application } from "pixi.js"
import { slate } from "tailwindcss/colors"
import AssetBundle from "./unit/assetBundle.ts"
import { Util } from "./util/util.ts"
import Player from "./control/player.ts"
import unitJson from "./data/unit.anim.json"
import AssetPool from "./unit/assetPool.ts"

const app = new Application<HTMLCanvasElement>({
  background: slate["300"],
  resizeTo: window
})

const bundle = new AssetBundle(unitJson)

await Util.wait4true(() => bundle.valid)

const unit = bundle.get("sample")
unit.get().x = app.screen.width / 2
unit.get().y = app.screen.height

const pool = new AssetPool(unit, 3)
const test = pool.get()
test.get().x = app.screen.width / 2
test.get().y = app.screen.height / 2
test.playAnim("run")

document.body.append(app.view)
app.stage.addChild(unit.get())
app.stage.addChild(test.get())

new Player(unit, app)
