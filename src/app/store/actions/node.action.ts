import { createAction, props } from '@ngrx/store';
import { Node } from 'src/app/graphql';

export const addNodeType = '[Node] Add Node';
export const loadNodesType = '[Node] Load Nodes';
export const deleteNodeType = '[Node] Delete Node';
export const moveNodeType = '[Node] Move Node';
export const resetNodesType = '[Node] Reset Node';
export const getNodesType = '[Connection] Get Connections';

export const addNode = createAction(addNodeType, props<{ node: Node }>());
export const loadNodes = createAction(
  loadNodesType,
  props<{ nodes: Node[] }>()
);
export const deleteNode = createAction(deleteNodeType, props<{ node: Node }>());
export const resetNodes = createAction(resetNodesType);
export const getNodes = createAction(getNodesType);
export const moveNode = createAction(
  moveNodeType,
  props<{ id: string; posX: number; posY: number }>()
);
