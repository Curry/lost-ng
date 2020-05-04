import { produce, Patch } from 'immer';
import {
  StateRepository,
  Computed,
  DataAction,
} from '@ngxs-labs/data/decorators';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import * as HistoryActions from './history.actions';
import { MapState } from '../map/map.state';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

interface Patches {
  patches: Patch[];
  inversePatches: Patch[];
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
  name: 'history',
  defaults: {
    history: {
      undone: [],
      undoable: [],
    },
  },
})
@Injectable()
export class HistoryState extends NgxsDataRepository<HistoryModel> {
  private syncChanges$: BehaviorSubject<boolean>;
  constructor(private readonly map: MapState) {
    super();
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

  @Action(HistoryActions.Add)
  addHistory(
    { setState }: StateContext<HistoryModel>,
    actions: HistoryActions.Add
  ): void {
    setState(
      produce((draft: HistoryModel) => {
        draft.history.undoable.unshift(actions);
        draft.history.undone = [];
      })
    );
  }

  @DataAction()
  undo(): void {
    if (this.ctx.getState().history.undoable.length > 0) {
      this.map.update(this.ctx.getState().history.undoable[0].inversePatches);
      this.ctx.setState((state) =>
        produce(state, (draft) => {
          draft.history.undone.unshift(draft.history.undoable.shift());
        })
      );
    }
  }

  @DataAction()
  redo(): void {
    if (this.ctx.getState().history.undone.length > 0) {
      this.map.update(this.ctx.getState().history.undone[0].patches);
      this.ctx.setState((state) =>
        produce(state, (draft) => {
          draft.history.undoable.unshift(draft.history.undone.shift());
        })
      );
    }
  }
}
