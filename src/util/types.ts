export declare type Dict<T> = {
  [key: string]: T
}

export class Vector2 {

  constructor(public x: number, public y: number) {}

  // 벡터 덧셈
  add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y)
  }

  // 벡터 뺄셈
  subtract(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y)
  }

  // 벡터 스칼라 곱
  multiplyScalar(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar)
  }

  // 벡터 크기 계산
  magnitude(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }

  // 단위 벡터 생성
  normalize(): Vector2 {
    const magnitude = this.magnitude()
    if (magnitude === 0) {
      return new Vector2(0, 0)
    }
    return this.multiplyScalar(1 / magnitude)
  }

  // + 연산자 오버로드
  static add(v1: Vector2, v2: Vector2): Vector2 {
    return v1.add(v2)
  }

  static get ZERO(): Vector2 {
    return new Vector2(0, 0)
  }

  static get ONE(): Vector2 {
    return new Vector2(1, 1)
  }

  static get UP(): Vector2 {
    return new Vector2(0, 1)
  }

  static get DOWN(): Vector2 {
    return new Vector2(0, -1)
  }

  static get LEFT(): Vector2 {
    return new Vector2(-1, 0)
  }

  static get RIGHT(): Vector2 {
    return new Vector2(1, 0)
  }

  isZero() {
    return this.x === 0 && this.y === 0
  }
}

// + 연산자 사용을 위한 확장
declare global {
  interface Number {
    toVector2(): Vector2;
  }
}

// 숫자를 Vector2로 변환하는 확장 메서드
Number.prototype.toVector2 = function (): Vector2 {
  return new Vector2(this as number, 0)
}