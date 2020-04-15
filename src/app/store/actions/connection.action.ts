import { createAction, props } from '@ngrx/store';
import { Connection } from 'src/app/graphql';

export const createConnectionType = '[Connection] Create Connection';
export const addConnectionType = '[Connection] Add Connection';
export const loadConnectionsType = '[Connection] Load Connections';
export const deleteConnectionType = '[Connection] Delete Connection';
export const resetConnectionsType = '[Connection] Reset Connections';
export const getConnectionsType = '[Connection] Get Connections';

export const addConnection = createAction(
  addConnectionType,
  props<{ connection: Connection }>()
);
export const loadConnections = createAction(
  loadConnectionsType,
  props<{ connections: Connection[] }>()
);
export const createConnection = createAction(
  createConnectionType,
  props<{ mapId: number; source: string; target: string }>()
);
export const deleteConnection = createAction(deleteConnectionType, props<{ source: string, target: string }>());
export const resetConnections = createAction(resetConnectionsType);
export const getConnections = createAction(getConnectionsType);
