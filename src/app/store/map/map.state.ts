import { Injectable } from '@angular/core';
import {
  State,
  Action,
  StateContext,
  Selector,
  NgxsOnChanges,
  NgxsSimpleChange,
} from '@ngxs/store';
import { Node, Connection } from 'src/app/graphql';
import { AppService } from 'src/app/app.service';
import { NodeActions, ConnectionActions, Undo, Redo } from './map.actions';
import produce, { enablePatches, Patch, applyPatches } from 'immer';
import { tap } from 'rxjs/operators';

export interface MapStateModel {
  nodes: Node[];
  connections: Connection[];
}

interface Patches {
  patches: Patch[];
  inversePatches: Patch[];
}

interface History {
  undone: Patches[];
  undoable: Patches[];
}

@State<MapStateModel>({
  name: 'nodes',
  defaults: {
    nodes: [],
    connections: [],
  },
})
@Injectable()
export class MapState implements NgxsOnChanges {
  private history: History;
  private ignore = false;

  constructor(private service: AppService) {
    this.history = {
      undoable: [],
      undone: [],
    };
    enablePatches();
  }

  @Selector()
  static nodes(state: MapStateModel) {
    return state.nodes;
  }

  @Selector()
  static connections(state: MapStateModel) {
    return state.connections;
  }

  ngxsOnChanges(change: NgxsSimpleChange<MapStateModel>) {
    produce(
      change.previousValue,
      (draft) => {
        if (draft) {
          draft.connections = change.currentValue.connections;
          draft.nodes = change.currentValue.nodes;
        }
      },
      (patches, inversePatches) => {
        if (
          !this.ignore &&
          change.previousValue.connections?.length > 0 &&
          change.previousValue.nodes?.length > 0
        ) {
          this.history = produce(this.history, (draft) => {
            draft.undoable.unshift({ patches, inversePatches });
            draft.undone = [];
          });
        }
        this.ignore = false;
      }
    );
  }

  @Action(NodeActions.LoadNodes)
  loadNodes(ctx: StateContext<MapStateModel>) {
    return this.service.getNodes().pipe(
      tap((nodes) => {
        ctx.setState(
          produce((draft: MapStateModel) => {
            draft.nodes = nodes;
          })
        );
      })
    );
  }

  @Action(ConnectionActions.LoadConnections)
  loadConnections(ctx: StateContext<MapStateModel>) {
    return this.service.getConnections().pipe(
      tap((connections) => {
        ctx.setState(
          produce((draft: MapStateModel) => {
            draft.connections = connections;
          })
        );
      })
    );
  }

  @Action(NodeActions.AddNode)
  addNode(ctx: StateContext<MapStateModel>, action: NodeActions.AddNode) {
    ctx.setState(
      produce((draft: MapStateModel) => {
        draft.nodes.push(action.node);
      })
    );
  }

  @Action(NodeActions.MoveNode)
  moveNode(ctx: StateContext<MapStateModel>, action: NodeActions.MoveNode) {
    return this.service.moveNode(action.id, action.posX, action.posY).pipe(
      tap(val => {
        ctx.setState(
          produce((draft: MapStateModel) => {
            const nodeToEdit = draft.nodes.find((node) => node.id === val.id);
            nodeToEdit.posX = val.posX;
            nodeToEdit.posY = val.posY;
          })
        );
      })
    );
  }

  @Action(ConnectionActions.AddConnection)
  addConnection(
    ctx: StateContext<MapStateModel>,
    action: ConnectionActions.AddConnection
  ) {
    return this.service.createConnection(1, action.source, action.target).pipe(
      tap((conn) => {
        ctx.setState(
          produce((draft: MapStateModel) => {
            if (
              draft.connections
                .map((connection) => connection.id)
                .indexOf(conn.id) === -1
            ) {
              draft.connections.push(conn);
            }
          })
        );
      })
    );
  }

  @Action(ConnectionActions.RemoveConnection)
  removeConnection(
    ctx: StateContext<MapStateModel>,
    action: ConnectionActions.RemoveConnection
  ) {
    return this.service.removeConnection(action.source, action.target).pipe(
      tap(() => {
        ctx.setState(
          produce((draft: MapStateModel) => {
            const idx = draft.connections.findIndex(
              (connection) =>
                connection.source === action.source &&
                connection.target === action.target
            );
            draft.connections.splice(idx, 1);
          })
        );
      })
    );
  }

  @Action(Undo)
  undo(ctx: StateContext<MapStateModel>) {
    if (this.history.undoable.length > 0) {
      this.ignore = true;
      const lastPatches = this.history.undoable[0];
      this.history = produce(this.history, (draft) => {
        draft.undone.unshift(lastPatches);
        draft.undoable.shift();
      });
      ctx.setState((state) => applyPatches(state, lastPatches.inversePatches));
    }
  }

  @Action(Redo)
  redo(ctx: StateContext<MapStateModel>) {
    if (this.history.undone.length > 0) {
      this.ignore = true;
      const nextPatches = this.history.undone[0];
      this.history = produce(this.history, (draft) => {
        draft.undoable.unshift(nextPatches);
        draft.undone.shift();
      });
      ctx.setState((state) => applyPatches(state, nextPatches.patches));
    }
  }
}
