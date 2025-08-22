export class MockApiService {
  private store: Record<string, any[]> = {};
  private idCounters: Record<string, number> = {};

  private async simulateLatency<T>(result: T, ms = 120): Promise<T> {
    return new Promise(resolve => setTimeout(() => resolve(result), ms));
  }

  private ensureResource(resource: string) {
    if (!this.store[resource]) {
      this.store[resource] = [];
      this.idCounters[resource] = 1;
    }
  }

  list<T = any>(resource: string): Promise<T[]> {
    this.ensureResource(resource);
    return this.simulateLatency([...this.store[resource]]);
  }

  get<T = any>(resource: string, id: number | string): Promise<T | null> {
    this.ensureResource(resource);
    const item = this.store[resource].find(i => String(i.id) === String(id)) || null;
    return this.simulateLatency(item);
  }

  create<T = any>(resource: string, payload: Partial<T>): Promise<T> {
    this.ensureResource(resource);
    const id = this.idCounters[resource]++;
    const item = { ...payload, id } as T;
    this.store[resource].push(item);
    return this.simulateLatency(item);
  }

  update<T = any>(resource: string, id: number | string, payload: Partial<T>): Promise<T | null> {
    this.ensureResource(resource);
    const idx = this.store[resource].findIndex(i => String(i.id) === String(id));
    if (idx === -1) return this.simulateLatency(null);
    this.store[resource][idx] = { ...this.store[resource][idx], ...payload };
    return this.simulateLatency(this.store[resource][idx]);
  }

  delete<T = any>(resource: string, id: number | string): Promise<T | null> {
    this.ensureResource(resource);
    const idx = this.store[resource].findIndex(i => String(i.id) === String(id));
    if (idx === -1) return this.simulateLatency(null);
    return this.simulateLatency(this.store[resource].splice(idx, 1)[0] || null);
  }

  seed(resource: string, items: any[]) {
    this.store[resource] = items.map((it, i) => ({ id: i + 1, ...it }));
    this.idCounters[resource] = this.store[resource].length + 1;
  }
}
