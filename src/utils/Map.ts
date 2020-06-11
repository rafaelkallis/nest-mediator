export interface ReadonlyMap<U, V> {
  get(u: U): V | null;
  inverse(): ReadonlyMap<V, U[]>;
}

export class Map<U, V> implements ReadonlyMap<U, V> {
  private readonly values: [U, V][];

  private constructor(values: [U, V][]) {
    this.values = values;
  }

  public inverse(): ReadonlyMap<V, U[]> {
    return new Map(
      this.values.map(([, v1]) => [
        v1,
        this.values.filter(([, v2]) => v1 === v2).map(([u2]) => u2),
      ]),
    );
  }

  public static empty<U, V>(): Map<U, V> {
    return new Map([]);
  }

  public get(u1: U): V | null {
    for (const [u2, v2] of this.values) {
      if (u1 === u2) {
        return v2;
      }
    }
    return null;
  }

  public put(t1: U, u1: V): void {
    for (const [t2, u2] of this.values) {
      if (t1 === t2) {
        throw new Error(`Conflicting pairs: {${t1}, ${u1}} and {${t2}, ${u2}}`);
      }
    }
    this.values.push([t1, u1]);
  }
}
