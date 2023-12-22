interface Connected {
  id: number
  callback: Function
}

export default class Signal<T1 = any, T2 = any, T3 = any> {

  private _max_count: number = 0 // 최대 개수: 0일 때 제한 없음
  private _generated_id: number = 0
  private _connected_list: Connected[] = []

  constructor(maxCount = 0) {
    this._max_count = maxCount
    this.clear()
  }

  connect(callback: Function) {
    if (this._max_count > 0 && this._connected_list.length >= this._max_count) {
      console.warn("Cannot exceed the maximum number: ", this._connected_list.length, "/", this._max_count)
      return
    }

    const id = ++this._generated_id
    this._connected_list.push({ id, callback })

    return id
  }

  disconnect(id: number) {
    this._connected_list = this._connected_list.filter(x => x.id !== id)
  }

  size() {
    return this._connected_list.length
  }

  emit(p1: T1 = undefined as any, p2: T2 = undefined as any, p3: T3 = undefined as any, ...params: any[]) {
    this._connected_list.forEach(x => x.callback(p1, p2, p3, ...params))
  }

  clear() {
    this._connected_list = []
    this._generated_id = 0
  }

}