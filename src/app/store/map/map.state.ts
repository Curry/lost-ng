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


export interface MapEntityModel {
  nodes: { [id: string]: Node };
  connections: { [id: string]: Connection };
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
  name: 'nodes',
  defaults: {
    nodes: {},
    connections: {},
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
  static nodes(state: MapEntityModel) {
    return Object.values(state.nodes);
  }

  @Selector()
  static connections(state: MapEntityModel) {
    return Object.values(state.connections);
  }

  ngxsOnChanges(change: NgxsSimpleChange<MapEntityModel>) {
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
          Object.keys(change.previousValue.connections).length > 0 &&
          Object.keys(change.previousValue.nodes).length > 0
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

  @Action(NodeActions.Load)
  loadNodes(ctx: StateContext<MapEntityModel>) {
    return this.service.getNodes().pipe(
      tap((nodes) => {
        ctx.setState(
          produce((draft: MapEntityModel) => {
            nodes.forEach(node => {
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
        ctx.setState(
          produce((draft: MapEntityModel) => {
            draft.nodes[val.id].posX = val.posX;
            draft.nodes[val.id].posY = val.posY;
          })
        );
      })
    );
  }

  @Action(NodeActions.Create)
  createNode(ctx: StateContext<MapEntityModel>, action: NodeActions.Create) {
    return this.service.createNode(action.mapId, action.systemId).pipe(
      tap((val) => {
        ctx.setState(
          produce((draft: MapEntityModel) => {
            draft.nodes[val.id] = val;
          })
        );
      })
    );
  }

  @Action(ConnectionActions.Load)
  loadConnections(ctx: StateContext<MapEntityModel>) {
    return this.service.getConnections().pipe(
      tap((connections) => {
        ctx.setState(
          produce((draft: MapEntityModel) => {
            connections.forEach(conn => {
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
        ctx.setState(
          produce((draft: MapEntityModel) => {
            draft.connections[conn.id] = conn;
          })
        );
      })
    );
  }

  @Action(ConnectionActions.Remove)
  removeConnection(
    ctx: StateContext<MapEntityModel>,
    action: ConnectionActions.Remove
  ) {
    return this.service.removeConnection(action.source, action.target).pipe(
      tap(val => {
        ctx.setState(
          produce((draft: MapEntityModel) => {
            delete draft.connections[val.id];
          })
        );
      })
    );
  }

  @Action(Undo)
  undo(ctx: StateContext<MapEntityModel>) {
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
  redo(ctx: StateContext<MapEntityModel>) {
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
