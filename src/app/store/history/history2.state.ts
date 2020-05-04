import { produce, enablePatches } from 'immer';
import {
  StateRepository,
  Computed,
  DataAction,
} from '@ngxs-labs/data/decorators';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { Injectable } from '@angular/core';
import { State, ActionType } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Patches {
  action: ActionType[];
  inverseAction: ActionType[];
}

interface History {
  undone: Patches[];
  undoable: Patches[];
}

export interface HistoryModel {
  history: History;
}

@StateRepository()
@State<HistoryModel>({
  name: 'history2',
  defaults: {
    history: {
      undone: [],
      undoable: [],
    },
  },
})
@Injectable()
export class HistoryState2 extends NgxsDataRepository<HistoryModel> {
  constructor() {
    super();
    enablePatches();
  }

  @Computed()
  public get undoDisabled$(): Observable<boolean> {
    return this.state$.pipe(
      map((state) => state.history.undoable.length === 0)
    );
  }

  @Computed()
  public get redoDisabled$(): Observable<boolean> {
    return this.state$.pipe(map((state) => state.history.undone.length === 0));
  }

  @DataAction()
  addHistory(action: ActionType[], inverseAction: ActionType[]): void {
    this.ctx.setState(
      produce((draft: HistoryModel) => {
        draft.history.undoable.unshift({ action, inverseAction });
        draft.history.undone = [];
      })
    );
  }

  @DataAction()
  undo(): void {
    if (this.getState().history.undoable.length > 0) {
      const action = this.getState().history.undoable[0].inverseAction;
      this.ctx.setState((state) =>
        produce(state, (draft) => {
          draft.history.undone.unshift(draft.history.undoable.shift());
        })
      );
      this.ctx.dispatch(action);
    }
  }

  @DataAction()
  redo(): void {
    if (this.getState().history.undone.length > 0) {
      const action = this.getState().history.undone[0].action;
      this.ctx.setState((state) =>
        produce(state, (draft) => {
          draft.history.undoable.unshift(draft.history.undone.shift());
        })
      );
      this.ctx.dispatch(action);
    }
  }
}
