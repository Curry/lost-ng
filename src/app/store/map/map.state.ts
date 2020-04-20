import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Node, Connection } from 'src/app/graphql';
import { AppService } from 'src/app/app.service';
import { NodeActions, ConnectionActions, Undo, Redo } from './map.actions';
import {
  produce,
  Patch,
  enablePatches,
  applyPatches,
  produceWithPatches,
  Draft,
} from 'immer';
import { tap } from 'rxjs/operators';

export interface MapEntityModel {
  nodes: { [id: string]: Node };
  connections: { [id: string]: Connection };
  history?: History;
}

interface Patches {
  patches: Patch[];
  inversePatches: Patch[];
}

interface History {
  undone: Patches[];
  undoable: Patches[];
}

@State<MapEntityModel>({
  name: 'map',
  defaults: {
    nodes: {},
    connections: {},
    history: {
      undone: [],
      undoable: [],
    },
  },
})
@Injectable()
export class MapState {
  constructor(private service: AppService) {
    enablePatches();
  }

  @Selector()
  static nodes(state: MapEntityModel) {
    return Object.values(state.nodes);
  }

  @Selector()
  static connections(state: MapEntityModel) {
    return Object.values(state.connections);
  }

  @Action(NodeActions.Load)
  loadNodes(ctx: StateContext<MapEntityModel>) {
    return this.service.getNodes().pipe(
      tap((nodes) => {
        ctx.setState(
          produce((draft: MapEntityModel) => {
            nodes.forEach((node) => {
              draft.nodes[node.id] = node;
            });
          })
        );
      })
    );
  }

  @Action(NodeActions.Move)
  moveNode(ctx: StateContext<MapEntityModel>, action: NodeActions.Move) {
    return this.service.moveNode(action.id, action.posX, action.posY).pipe(
      tap((val) => {
        this.changeState(ctx, (draft) => {
          draft.nodes[val.id].posX = val.posX;
          draft.nodes[val.id].posY = val.posY;
        });
      })
    );
  }

  @Action(NodeActions.Add)
  addNode(ctx: StateContext<MapEntityModel>, action: NodeActions.Add) {
    return this.service.createNode(action.mapId, action.systemId).pipe(
      tap((val) => {
        ctx.dispatch(new NodeActions.Create(val));
      })
    );
  }

  @Action(NodeActions.Create)
  createNode(ctx: StateContext<MapEntityModel>, action: NodeActions.Create) {
    if (!ctx.getState().nodes[action.node.id]) {
      this.changeState(ctx, (draft) => {
        draft.nodes[action.node.id] = action.node;
      });
    }
  }

  @Action(NodeActions.Remove)
  removeNode(ctx: StateContext<MapEntityModel>, action: NodeActions.Remove) {
    return this.service.removeNode(action.systemId).pipe(
      tap(({ node, connections }) => {
        this.changeState(ctx, (draft) => {
          delete draft.nodes[node];
          connections.forEach((conn) => {
            delete draft.connections[conn];
          });
        });
      })
    );
  }

  @Action(ConnectionActions.Load)
  loadConnections(ctx: StateContext<MapEntityModel>) {
    return this.service.getConnections().pipe(
      tap((connections) => {
        ctx.setState(
          produce((draft: MapEntityModel) => {
            connections.forEach((conn) => {
              draft.connections[conn.id] = conn;
            });
          })
        );
      })
    );
  }

  @Action(ConnectionActions.Add)
  addConnection(
    ctx: StateContext<MapEntityModel>,
    action: ConnectionActions.Add
  ) {
    return this.service.createConnection(1, action.source, action.target).pipe(
      tap((conn) => {
        ctx.dispatch(new ConnectionActions.Create(conn));
      })
    );
  }

  @Action(ConnectionActions.Create)
  createConnection(
    ctx: StateContext<MapEntityModel>,
    action: ConnectionActions.Create
  ) {
    if (!ctx.getState().connections[action.connection.id]) {
      this.changeState(ctx, (draft) => {
        draft.connections[action.connection.id] = action.connection;
      });
    }
  }

  @Action(ConnectionActions.Remove)
  removeConnection(
    ctx: StateContext<MapEntityModel>,
    action: ConnectionActions.Remove
  ) {
    return this.service.removeConnection(action.source, action.target).pipe(
      tap((val) => {
        this.changeState(ctx, (draft: MapEntityModel) => {
          delete draft.connections[val.id];
        });
      })
    );
  }

  private changeState = (
    ctx: StateContext<MapEntityModel>,
    produceFn: (draft: Draft<MapEntityModel>) => void
  ): void => {
    const [newState, patches, inversePatches] = produceWithPatches(
      ctx.getState(),
      produceFn
    );
    ctx.setState(
      produce(newState, (draft) => {
        draft.history.undoable.unshift({ patches, inversePatches });
        draft.history.undone = [];
      })
    );
  }

  @Action(Undo)
  undo(ctx: StateContext<MapEntityModel>) {
    if (ctx.getState().history.undoable.length > 0) {
      ctx.setState((state) =>
        applyPatches(
          produce(state, (draft) => {
            draft.history.undone.unshift(draft.history.undoable.shift());
          }),
          state.history.undoable[0].inversePatches
        )
      );
    }
  }

  @Action(Redo)
  redo(ctx: StateContext<MapEntityModel>) {
    if (ctx.getState().history.undone.length > 0) {
      ctx.setState((state) =>
        applyPatches(
          produce(state, (draft) => {
            draft.history.undoable.unshift(draft.history.undone.shift());
          }),
          state.history.undone[0].patches
        )
      );
    }
  }
}
