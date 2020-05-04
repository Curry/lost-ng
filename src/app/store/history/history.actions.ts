import { Patch } from 'immer';
import { ActionType } from '@ngxs/store';

export class Add {
  static readonly type = '[History] Add';
  constructor(public patches: Patch[], public inversePatches: Patch[]) {}
}

export class Add2 {
  static readonly type = '[History] Add2';
  type = '[History] Add2';
  constructor(public action: ActionType, public inverseAction: ActionType) {}
}
