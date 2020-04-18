import { QueryEntity, Query, filterNil, toBoolean, getAkitaConfig, getValue, setValue } from '@datorama/akita';

export type Queries<State> = Query<State> | QueryEntity<State>;

export abstract class AkitaMultiPlugin<A, B> {
  protected constructor(protected queryOne: Queries<A>, protected queryTwo: Queries<B>, public config?: { resetFn?: () => void}) {
    if (config && config.resetFn) {
      if (getAkitaConfig().resettable) {
        this.onReset(config.resetFn);
      }
    }
  }

  protected getQuery = (index: number) => index === 0 ? this.queryOne : this.queryTwo;

  protected getStore = (index: number) => this.getQuery(index).__store__;

  public abstract destroy();

  protected isEntityBased(entityId: any) {
    return toBoolean(entityId);
  }

  protected selectSource(index: number, entityId: any, property?: string) {
    if (this.isEntityBased(entityId)) {
      return (this.getQuery(index) as QueryEntity<A | B>).selectEntity(entityId).pipe(filterNil);
    } else if (property) {
      return (this.getQuery(index) as Query<A | B>).select(state => getValue(state, this.withStoreName(index, property)));
    }
    return this.getQuery(index).select();
  }

  protected getSource(index: number, entityId: any, property?: string): any {
    if (this.isEntityBased(entityId)) {
      return (this.getQuery(index) as QueryEntity<A | B>).getEntity(entityId);
    }
    const state = this.getQuery(index).getValue();
    if (property) {
      return getValue(state, this.withStoreName(index, property));
    }
    return state;
  }

  protected withStoreName(index: number, prop: string) {
    return `${this.getStore(index).storeName}.${prop}`;
  }

  protected updateStore(index, newState, entityId?, property?: string) {
    if (this.isEntityBased(entityId)) {
      this.getStore(index).update(entityId, newState);
    } else {
      if (property) {
        this.getStore(index)._setState(state => {
          return setValue(state, this.withStoreName(index, property), newState);
        });
        return;
      }
      this.getStore(index)._setState(state => ({ ...state, ...newState }));
    }
  }

  private onReset(fn: () => void) {
    [0, 1].forEach(val => {
      const original = this.getStore(val).reset;
      this.getStore(val).reset = (...params) => {
        setTimeout(() => {
          original.apply(this.getStore(val), params);
          fn();
        });
      };
    });
  }
}
