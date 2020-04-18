import { pairwise, distinctUntilChanged } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Queries, logAction, isFunction, AkitaPlugin } from '@datorama/akita';
import { AkitaMultiPlugin } from './plugin';

export interface StateHistoryParams {
  maxAge?: number;
  watchProperty?: string;
  comparator?: (prevState, currentState) => boolean;
}

// export type History<State> = {
//   past: [State[], State[]];
//   present: [State, State] | null;
//   future: [State[], State[]];
// };
export type AppState<State> = {
  nodes: State,
  connections: State
};

export type History<State> = {
  past: AppState<State>[],
  present: AppState<State> | null,
  future: AppState<State>[]
};

export type MultiAppState<A, B> = {
  nodes: A,
  connections: B
};

export type MultiHistory<A, B> = {
  past: MultiAppState<A, B>[],
  present: MultiAppState<A, B> | null,
  future: MultiAppState<A, B>[]
};

export class StateMultiHistoryPlugin<A, B> extends AkitaMultiPlugin<A, B> {
  /** Allow skipping an update from outside */
  private skip = false;

  private history: MultiHistory<A, B> = {
    past: [],
    present: null,
    future: [],
  };

  /** Skip the update when redo/undo */
  private skipUpdate = false;
  private subscription;

  constructor(
    protected queryOne: Queries<A>,
    protected queryTwo: Queries<B>,
    private params: StateHistoryParams = {},
    // tslint:disable-next-line:variable-name
    private _entityId?: any
  ) {
    super(queryOne, queryTwo, {
      resetFn: () => this.clear(),
    });
    params.maxAge = !!params.maxAge ? params.maxAge : 10;
    params.comparator = params.comparator || (() => true);

    this.activate();
  }

  private get property() {
    return this.params.watchProperty;
  }

  activate() {
    this.history.present = {
      nodes: this.getSource(0, this._entityId, this.property),
      connections: this.getSource(1, this._entityId, this.property)
    };
    this.subscription = (this as any)
      .selectSource(this._entityId, this.property)
      .pipe(pairwise())
      .subscribe(([past, present]) => {
        if (this.skip) {
          this.skip = false;
          return;
        }
        /**
         *  comparator: (prev, current) => isEqual(prev, current) === false
         */
        const shouldUpdate = this.params.comparator(past, present);

        if (!this.skipUpdate && shouldUpdate) {
          if (this.history.past.length === this.params.maxAge) {
            this.history.past = this.history.past.slice(1);
          }
          this.history.past = [...this.history.past, { nodes: past, connections: null }];
          this.history.present = {
            nodes: present,
            connections: null
          };
        }
      });
  }


  destroy(clearHistory = false) {
    if (clearHistory) {
      this.clear();
    }
    this.subscription.unsubscribe();
  }

  clear(customUpdateFn?: (history: MultiHistory<A, B>) => MultiHistory<A, B>) {
    this.history = isFunction(customUpdateFn)
      ? customUpdateFn(this.history)
      : {
          past: [],
          present: null,
          future: [],
        };
  }
}

export class StateHistoryPlugin<State = any> extends AkitaPlugin<State> {
  /** Allow skipping an update from outside */
  private skip = false;

  private history: History<State> = {
    past: [],
    present: null,
    future: [],
  };

  /** Skip the update when redo/undo */
  private skipUpdate = false;
  private subscription;

  constructor(
    protected query: Queries<State>,
    // protected queries: Array<Queries<State>>,
    private params: StateHistoryParams = {},
    // tslint:disable-next-line:variable-name
    private _entityId?: any
  ) {
    super(query, {
      resetFn: () => this.clear(),
    });
    params.maxAge = !!params.maxAge ? params.maxAge : 10;
    params.comparator = params.comparator || (() => true);

    this.activate();
  }

  get hasPast() {
    return this.history.past.length > 0;
  }

  get hasFuture() {
    return this.history.future.length > 0;
  }

  private get property() {
    return this.params.watchProperty;
  }

  activate() {
    this.history.present = {
      nodes: this.getSource(this._entityId, this.property),
      connections: null
    };
    this.subscription = (this as any)
      .selectSource(this._entityId, this.property)
      .pipe(pairwise())
      .subscribe(([past, present]) => {
        if (this.skip) {
          this.skip = false;
          return;
        }
        /**
         *  comparator: (prev, current) => isEqual(prev, current) === false
         */
        const shouldUpdate = this.params.comparator(past, present);

        if (!this.skipUpdate && shouldUpdate) {
          if (this.history.past.length === this.params.maxAge) {
            this.history.past = this.history.past.slice(1);
          }
          this.history.past = [...this.history.past, { nodes: past, connections: null }];
          this.history.present = {
            nodes: present,
            connections: null
          };
        }
      });
  }

  undo() {
    if (this.history.past.length > 0) {
      const { past, present } = this.history;
      const previous = past[past.length - 1];
      this.history.past = past.slice(0, past.length - 1);
      this.history.present = previous;
      this.history.future = [present, ...this.history.future];
      this.update();
    }
  }

  redo() {
    if (this.history.future.length > 0) {
      const { past, present } = this.history;
      const next = this.history.future[0];
      const newFuture = this.history.future.slice(1);
      this.history.past = [...past, present];
      this.history.present = next;
      this.history.future = newFuture;
      this.update('Redo');
    }
  }


  /**
   * Clear the history
   *
   * @param customUpdateFn Callback function for only clearing part of the history
   *
   * @example
   *
   * stateHistory.clear((history) => {
   *  return {
   *    past: history.past,
   *    present: history.present,
   *    future: []
   *  };
   * });
   */
  clear(customUpdateFn?: (history: History<State>) => History<State>) {
    this.history = isFunction(customUpdateFn)
      ? customUpdateFn(this.history)
      : {
          past: [],
          present: null,
          future: [],
        };
  }

  destroy(clearHistory = false) {
    if (clearHistory) {
      this.clear();
    }
    this.subscription.unsubscribe();
  }

  ignoreNext() {
    this.skip = true;
  }

  private update(action = 'Undo') {
    this.skipUpdate = true;
    logAction(`@StateHistory - ${action}`);
    this.updateStore(this.history.present.nodes, this._entityId, this.property);
    this.skipUpdate = false;
  }
}
