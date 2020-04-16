import { Injectable } from '@angular/core';
import {
  NodesGQL,
  Node,
  ConnectionsGQL,
  Connection,
  MoveNodeGQL,
  AddConnectionGQL,
  AddNodeGQL,
  DeleteNodeGQL,
  RemoveConnectionGQL,
  DeleteConnectionByNodeGQL,
} from './graphql';
import { map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private readonly POLL_RATE = 1000;

  private testConnections = {
    data: {
      connections: [
        {
          id: '5e97a0f49bebb0235bf8f99d',
          mapId: 1,
          source: '5e94f19d2177631983fa1c79',
          target: '5e94f1ae2177631983fa1c7a',
          createdAt: '2020-04-16T00:04:04.365Z',
          updatedAt: '2020-04-16T00:04:04.365Z',
          __typename: 'Connection',
        },
      ],
    },
  };

  private testNodes = {
    data: {
      nodes: [
        {
          id: '5e94f1852177631983fa1c78',
          mapId: 1,
          alias: null,
          posX: 236,
          posY: 360,
          system: {
            id: 31002003,
            regionId: 11000025,
            constellationId: 21000247,
            systemName: 'J114154',
            class: 'C5',
            effect: 'cataclysmic',
            trueSec: -0.99,
            statics: [
              {
                id: 30702,
                name: 'H296',
                sourceClasses: ['C5'],
                targetClass: 'C5',
                lifetime: 1440,
                maxMass: 3300000000,
                massRegen: 0,
                maxOnePass: 1480000000,
                scanStrength: 10,
                __typename: 'Wormhole',
              },
            ],
            __typename: 'System',
          },
          __typename: 'Node',
        },
        {
          id: '5e94f19d2177631983fa1c79',
          mapId: 1,
          alias: null,
          posX: 159,
          posY: 175,
          system: {
            id: 31000714,
            regionId: 11000007,
            constellationId: 21000056,
            systemName: 'J163923',
            class: 'C2',
            effect: null,
            trueSec: -0.99,
            statics: [
              {
                id: 30675,
                name: 'N062',
                sourceClasses: ['C2'],
                targetClass: 'C5',
                lifetime: 1440,
                maxMass: 3000000000,
                massRegen: 0,
                maxOnePass: 300000000,
                scanStrength: 2.5,
                __typename: 'Wormhole',
              },
              {
                id: 30679,
                name: 'E545',
                sourceClasses: ['C2'],
                targetClass: 'NULL',
                lifetime: 960,
                maxMass: 2000000000,
                massRegen: 0,
                maxOnePass: 300000000,
                scanStrength: 2.5,
                __typename: 'Wormhole',
              },
            ],
            __typename: 'System',
          },
          __typename: 'Node',
        },
        {
          id: '5e94f1ae2177631983fa1c7a',
          mapId: 1,
          alias: null,
          posX: 515,
          posY: 220,
          system: {
            id: 31000734,
            regionId: 11000007,
            constellationId: 21000058,
            systemName: 'J115700',
            class: 'C2',
            effect: 'wolfRayet',
            trueSec: -0.99,
            statics: [
              {
                id: 30675,
                name: 'N062',
                sourceClasses: ['C2'],
                targetClass: 'C5',
                lifetime: 1440,
                maxMass: 3000000000,
                massRegen: 0,
                maxOnePass: 300000000,
                scanStrength: 2.5,
                __typename: 'Wormhole',
              },
              {
                id: 30679,
                name: 'E545',
                sourceClasses: ['C2'],
                targetClass: 'NULL',
                lifetime: 960,
                maxMass: 2000000000,
                massRegen: 0,
                maxOnePass: 300000000,
                scanStrength: 2.5,
                __typename: 'Wormhole',
              },
            ],
            __typename: 'System',
          },
          __typename: 'Node',
        },
      ],
    },
  };
  constructor(
    private nodes: NodesGQL,
    private connections: ConnectionsGQL,
    private move: MoveNodeGQL,
    private addConnection: AddConnectionGQL,
    private addNode: AddNodeGQL,
    private deleteNode: DeleteNodeGQL,
    private deleteConnectionByNode: DeleteConnectionByNodeGQL,
    private deleteConnection: RemoveConnectionGQL
  ) {}

  getNodes = () => {
    // const queryRef = this.nodes.watch({ map: 1 });
    // queryRef.startPolling(this.POLL_RATE);
    // return queryRef.valueChanges.pipe(map((val) => val.data.nodes as Node[]));
    return of(this.testNodes).pipe(map((val) => val.data.nodes as Node[]));
  }

  createNode = (mapId: number, system: number) => {
    return this.addNode.mutate({ map: mapId, system });
  }

  moveNode = (id: string, posX: number, posY: number) => {
    return this.move
      .mutate({ id, posX, posY })
      .pipe(map((val) => val.data.moveNode));
  }

  removeNode = (id: string) => {
    return this.deleteNode
      .mutate({ id })
      .pipe(mergeMap((val) => this.removeConnectionByNode(id)));
  }

  removeConnectionByNode = (nodeId: string) => {
    return this.deleteConnectionByNode.mutate({ nodeId });
  }

  getConnections = () => {
    // const queryRef = this.connections.watch({ map: 1 });
    // queryRef.startPolling(this.POLL_RATE);
    // return queryRef.valueChanges.pipe(
    //   map((val) => val.data.connections as Connection[])
    // );
    return of(this.testConnections).pipe(map((val) => val.data.connections as Connection[]));
  }

  createConnection = (mapId: number, source: string, target: string) => {
    return this.addConnection
      .mutate({
        map: mapId,
        source,
        target,
      })
      .pipe(map((val) => val.data.addConnection as Connection));
  }

  removeConnection = (source: string, target: string) => {
    return this.deleteConnection.mutate({ map: 1, source, target });
  }
}
