import { createAction, props } from '@ngrx/store';
import { Node, Connection } from 'src/app/graphql';

export const addConnectionType = '[Connection] Add Connection';
export const loadConnectionsType = '[Connection] Load Connections';
export const deleteConnectionType = '[Connection] Delete Connection';
export const resetConnectionsType = '[Connection] Reset Connections';

export const addConnection = createAction(addConnectionType, props<{ connection: Connection }>());
export const loadConnections = createAction(
  loadConnectionsType,
  props<{ connections: Connection[] }>()
);
export const deleteConnection = createAction(deleteConnectionType);
export const resetConnections = createAction(resetConnectionsType);
