import { createAction, props } from '@ngrx/store';
import { Node } from 'src/app/graphql';

export const nodeNamespace = '[Node]';
export const addNodeType = `${nodeNamespace} Add Node`;
export const loadNodesType = `${nodeNamespace} Load Node`;
export const deleteNodeType = `${nodeNamespace} Delete Node`;
export const resetNodesType = `${nodeNamespace} Reset Node`;

export const addNode = createAction(addNodeType, props<{ node: Node }>());
export const loadNodes = createAction(
  loadNodesType,
  props<{ nodes: Node[] }>()
);
export const deleteNode = createAction(resetNodesType);
export const resetNodes = createAction(resetNodesType);
