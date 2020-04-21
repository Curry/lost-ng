import { Injectable } from '@angular/core';
import { NgxsPlugin } from '@ngxs/store';
import { Patch, produce, applyPatches, enablePatches } from 'immer';
import { getActionTypeFromInstance } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import * as MapActions from './map.actions';
import * as NodeActions from './node.actions';
import * as ConnectionActions from './connection.actions';

interface Patches {
  patches: Patch[];
  inversePatches: Patch[];
}

interface History {
  undone: Patches[];
  undoable: Patches[];
}

@Injectable()
export class MapPlugin implements NgxsPlugin {
  private history: History;

  constructor() {
    this.history = {
      undoable: [],
      undone: [],
    };
    enablePatches();
  }

  handle(state, action, next) {
    let newState = state;
    const actionType = getActionTypeFromInstance(action);
    switch (actionType) {
      case MapActions.Undo.type:
        if (this.history.undoable.length > 0) {
          const lastPatches = this.history.undoable[0];
          this.history = produce(this.history, (draft) => {
            draft.undone.unshift(lastPatches);
            draft.undoable.shift();
          });
          newState = applyPatches(state, lastPatches.inversePatches);
        }
        return next(newState, action);
      case MapActions.Redo.type:
        if (this.history.undone.length > 0) {
          const nextPatches = this.history.undone[0];
          this.history = produce(this.history, (draft) => {
            draft.undoable.unshift(nextPatches);
            draft.undone.shift();
          });
          newState = applyPatches(state, nextPatches.patches);
        }
        return next(newState, action);
      default:
        return next(state, action).pipe(
          tap((actionState: any) => {
            if (
              actionType !== NodeActions.Load.type &&
              actionType !== ConnectionActions.Load.type
            ) {
              produce(
                state,
                (draft) => {
                  draft.connections = actionState.connections;
                  draft.nodes = actionState.nodes;
                },
                (patches, inversePatches) => {
                  this.history = produce(this.history, (draft) => {
                    draft.undoable.unshift({ patches, inversePatches });
                    draft.undone = [];
                  });
                }
              );
            }
          })
        );
    }
  }
}
