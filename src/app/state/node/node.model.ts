export enum Class {
  C1 = 'C1',
  C2 = 'C2',
  C3 = 'C3',
  C4 = 'C4',
  C5 = 'C5',
  C6 = 'C6',
  High = 'HIGH',
  Low = 'LOW',
  Null = 'NULL',
  Thera = 'THERA',
  Shattered = 'SHATTERED',
  Sentinel = 'SENTINEL',
  Barbican = 'BARBICAN',
  Vidette = 'VIDETTE',
  Conflux = 'CONFLUX',
  Redoubt = 'REDOUBT'
}

export enum Effect {
  RedGiant = 'redGiant',
  Cataclysmic = 'cataclysmic',
  Magnetar = 'magnetar',
  Pulsar = 'pulsar',
  WolfRayet = 'wolfRayet',
  BlackHole = 'blackHole'
}

export type Wormhole = {
 id: number;
 name: string;
 sourceClasses: Class[];
 targetClass: Class;
 lifetime: number;
 maxMass: number;
 massRegen: number;
 maxOnePass: number;
 scanStrength?: number;
};

export interface System {
 id: number;
 constellationId?: number;
 regionId?: number;
 systemName: string;
 security?: string;
 trueSec: number;
 class: Class;
 effect?: Effect;
 statics: Array<Wormhole>;
}

export interface Node {
 id: string;
 mapId: number;
 systemId: number;
 alias?: string;
 posX: number;
 posY: number;
 system: System;
}


export function createNode(params: Partial<Node>) {
  return {

  } as Node;
}
