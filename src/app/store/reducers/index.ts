import * as fromNode from './node.reducer';
// import * as fromNode from './inode.reducer';
import * as fromConnection from './connection.reducer';
import {
  createSelector,
  ActionReducerMap,
  createFeatureSelector,
  ActionReducer,
} from '@ngrx/store';

export interface AppState {
  nodes: fromNode.NodeState;
  connections: fromConnection.ConnectionState;
}

export const initialState: AppState = {
  nodes: undefined,
  connections: undefined,
};

export const reducers: ActionReducerMap<AppState> = {
  nodes: fromNode.reducer,
  connections: fromConnection.reducer,
};

export const getAppState = createFeatureSelector<AppState>('app');

export const getNodeState = createSelector(
  getAppState,
  (state: AppState) => state.nodes
);

export const getConnectionState = createSelector(
  getAppState,
  (state: AppState) => state.connections
);

// export const getNodeEntities = createSelector(
//   getNodeState,
//   (state: fromNode.NodeState) => state.nodes
// );

// export const getAllNodes = createSelector(
//   getNodeEntities,
//   (nodes) => Object.keys(nodes).map(id => nodes[id])
// );

export const getAllNodes = createSelector(getNodeState, fromNode.selectAll);

export const getAllConnections = createSelector(
  getConnectionState,
  fromConnection.selectAll
);
interface History {
  past: Array<AppState>;
  present: AppState;
  future: Array<AppState>;
}

export const debug = (reducer: ActionReducer<any>): ActionReducer<any> => {
  return (state, action) => {
    console.dir(state, action);
    return reducer(state, action);
  };
};

export const undoRedo = (reducer: ActionReducer<any>): ActionReducer<any> => {
  let history: History = {
    past: [],
    present: initialState,
    future: [],
  };
  return (state, action) => {
    switch (action.type) {
      case 'UNDO':
        if (history.past.length > 0) {
          const previous = history.past[0];
          const newPast = history.past.slice(1);
          history = {
            past: newPast,
            present: previous,
            future: [history.present, ...history.future],
          };
          return previous;
        }
        return history.present;
      case 'REDO':
        if (history.future.length > 0) {
          const next = history.future[0];
          const newFuture = history.future.slice(1);
          history = {
            past: [history.present, ...history.past],
            present: next,
            future: newFuture,
          };
          return next;
        }
        return history.present;
      default:
        const newPresent = reducer(state, action);
        if (/Load/.test(action.type)) {
          history = {
            past: [],
            present: newPresent,
            future: [],
          };
        } else {
          history = {
            past: [history.present, ...history.past],
            present: newPresent,
            future: [],
          };
        }
        return newPresent;
    }
  };
};
