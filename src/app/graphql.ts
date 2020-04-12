import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Date custom scalar type */
  Date: any;
};



export type Alliance = {
   __typename?: 'Alliance';
  allianceId: Scalars['Int'];
  allianceName: Scalars['String'];
  ticker: Scalars['String'];
  dateFounded?: Maybe<Scalars['Date']>;
  factionId?: Maybe<Scalars['Int']>;
};

export type Character = {
   __typename?: 'Character';
  id: Scalars['Int'];
  characterId: Scalars['Int'];
  lastLogin: Scalars['Date'];
  active: Scalars['Boolean'];
  name: Scalars['String'];
  ownerHash: Scalars['String'];
  esiAccessToken: Scalars['String'];
  esiAccessTokenExpires: Scalars['Date'];
  esiRefreshToken: Scalars['String'];
  esiScopes: Scalars['String'];
  corporationId: Scalars['Int'];
  allianceId: Scalars['Int'];
};

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

export type Connection = {
   __typename?: 'Connection';
  id: Scalars['String'];
  mapId: Scalars['Int'];
  source: Scalars['String'];
  target: Scalars['String'];
  createdAt: Scalars['Date'];
  updatedAt: Scalars['Date'];
};

export type Corporation = {
   __typename?: 'Corporation';
  corporationId: Scalars['Int'];
  corporationName: Scalars['String'];
  ticker: Scalars['String'];
  dateFounded?: Maybe<Scalars['Date']>;
  memberCount: Scalars['Int'];
  isNPC: Scalars['Boolean'];
  allianceId?: Maybe<Scalars['Int']>;
  factionId?: Maybe<Scalars['Int']>;
  allianceName?: Maybe<Scalars['String']>;
  alliance?: Maybe<Alliance>;
};

export type CorporationInput = {
  corporationId: Scalars['Int'];
  corporationName: Scalars['String'];
  ticker: Scalars['String'];
  dateFounded?: Maybe<Scalars['Date']>;
  memberCount: Scalars['Int'];
  isNPC?: Maybe<Scalars['Boolean']>;
  allianceId?: Maybe<Scalars['Int']>;
  factionId?: Maybe<Scalars['Int']>;
};


export enum Effect {
  RedGiant = 'redGiant',
  Cataclysmic = 'cataclysmic',
  Magnetar = 'magnetar',
  Pulsar = 'pulsar',
  WolfRayet = 'wolfRayet',
  BlackHole = 'blackHole'
}

export type Mutation = {
   __typename?: 'Mutation';
  addCorporation: Corporation;
  addConnection: Connection;
  removeConnection: Connection;
  addNode: Node;
};


export type MutationAddCorporationArgs = {
  corporationData: CorporationInput;
};


export type MutationAddConnectionArgs = {
  target: Scalars['String'];
  source: Scalars['String'];
  map: Scalars['Float'];
};


export type MutationRemoveConnectionArgs = {
  target: Scalars['String'];
  source: Scalars['String'];
  map: Scalars['Float'];
};


export type MutationAddNodeArgs = {
  system: Scalars['Float'];
  map: Scalars['Float'];
};

export type Node = {
   __typename?: 'Node';
  id: Scalars['String'];
  mapId: Scalars['Float'];
  systemId: Scalars['Float'];
  system: System;
};

export type Query = {
   __typename?: 'Query';
  helloWorld: Scalars['String'];
  hello: Scalars['String'];
  currentShip: Ship;
  ship: Ship;
  online: Scalars['Boolean'];
  whoAmI: Character;
  location: System;
  systemId: System;
  systemName: System;
  systemReg: Array<Scalars['String']>;
  systems: Array<System>;
  route: Array<System>;
  wormhole: Wormhole;
  wormholeConn: Array<Wormhole>;
  corporation: Corporation;
  connections: Array<Connection>;
  nodes: Array<Node>;
};


export type QueryHelloArgs = {
  name: Scalars['String'];
};


export type QueryShipArgs = {
  name: Scalars['String'];
};


export type QuerySystemIdArgs = {
  id: Scalars['Float'];
};


export type QuerySystemNameArgs = {
  name: Scalars['String'];
};


export type QuerySystemRegArgs = {
  name: Scalars['String'];
};


export type QuerySystemsArgs = {
  effect?: Maybe<Effect>;
  statics?: Maybe<Array<Class>>;
  class?: Maybe<Class>;
};


export type QueryRouteArgs = {
  dest: Scalars['Float'];
  source: Scalars['Float'];
};


export type QueryWormholeArgs = {
  name: Scalars['String'];
};


export type QueryWormholeConnArgs = {
  source: Class;
};


export type QueryCorporationArgs = {
  name: Scalars['String'];
};


export type QueryConnectionsArgs = {
  map: Scalars['Float'];
};


export type QueryNodesArgs = {
  map: Scalars['Float'];
};

export type Ship = {
   __typename?: 'Ship';
  id: Scalars['Int'];
  name: Scalars['String'];
  mass: Scalars['Float'];
  alias?: Maybe<Scalars['String']>;
};

export type Subscription = {
   __typename?: 'Subscription';
  corpChanged: Corporation;
  nodeAdded: Node;
};


export type SubscriptionNodeAddedArgs = {
  map: Scalars['Float'];
};

export type System = {
   __typename?: 'System';
  id: Scalars['Int'];
  constellationId?: Maybe<Scalars['Int']>;
  regionId?: Maybe<Scalars['Int']>;
  systemName: Scalars['String'];
  security?: Maybe<Scalars['String']>;
  trueSec: Scalars['Float'];
  class: Class;
  effect?: Maybe<Effect>;
  statics: Array<Wormhole>;
};

export type Wormhole = {
   __typename?: 'Wormhole';
  id: Scalars['Int'];
  name: Scalars['String'];
  sourceClasses: Array<Class>;
  targetClass: Class;
  lifetime: Scalars['Float'];
  maxMass: Scalars['Float'];
  massRegen: Scalars['Float'];
  maxOnePass: Scalars['Float'];
  scanStrength?: Maybe<Scalars['Float']>;
};

export type NodesQueryVariables = {
  map: Scalars['Float'];
};


export type NodesQuery = (
  { __typename?: 'Query' }
  & { nodes: Array<(
    { __typename?: 'Node' }
    & Pick<Node, 'id' | 'mapId'>
    & { system: (
      { __typename?: 'System' }
      & Pick<System, 'id' | 'regionId' | 'constellationId' | 'systemName' | 'class' | 'effect' | 'trueSec'>
      & { statics: Array<(
        { __typename?: 'Wormhole' }
        & Pick<Wormhole, 'id' | 'name' | 'sourceClasses' | 'targetClass' | 'lifetime' | 'maxMass' | 'massRegen' | 'maxOnePass' | 'scanStrength'>
      )> }
    ) }
  )> }
);

export type ConnectionsQueryVariables = {
  map: Scalars['Float'];
};


export type ConnectionsQuery = (
  { __typename?: 'Query' }
  & { connections: Array<(
    { __typename?: 'Connection' }
    & Pick<Connection, 'id' | 'mapId' | 'source' | 'target' | 'createdAt' | 'updatedAt'>
  )> }
);

export type UpdatesQueryVariables = {
  map: Scalars['Float'];
};


export type UpdatesQuery = (
  { __typename?: 'Query' }
  & { connections: Array<(
    { __typename?: 'Connection' }
    & Pick<Connection, 'id' | 'mapId' | 'source' | 'target' | 'createdAt' | 'updatedAt'>
  )>, nodes: Array<(
    { __typename?: 'Node' }
    & Pick<Node, 'id' | 'mapId'>
    & { system: (
      { __typename?: 'System' }
      & Pick<System, 'id' | 'regionId' | 'constellationId' | 'systemName' | 'class' | 'effect' | 'trueSec'>
      & { statics: Array<(
        { __typename?: 'Wormhole' }
        & Pick<Wormhole, 'id' | 'name' | 'sourceClasses' | 'targetClass' | 'lifetime' | 'maxMass' | 'massRegen' | 'maxOnePass' | 'scanStrength'>
      )> }
    ) }
  )> }
);

export type AddConnectionMutationVariables = {
  map: Scalars['Float'];
  source: Scalars['String'];
  target: Scalars['String'];
};


export type AddConnectionMutation = (
  { __typename?: 'Mutation' }
  & { addConnection: (
    { __typename?: 'Connection' }
    & Pick<Connection, 'id'>
  ) }
);

export type RemoveConnectionMutationVariables = {
  map: Scalars['Float'];
  source: Scalars['String'];
  target: Scalars['String'];
};


export type RemoveConnectionMutation = (
  { __typename?: 'Mutation' }
  & { removeConnection: (
    { __typename?: 'Connection' }
    & Pick<Connection, 'id'>
  ) }
);

export type WatchNodesSubscriptionVariables = {
  map: Scalars['Float'];
};


export type WatchNodesSubscription = (
  { __typename?: 'Subscription' }
  & { nodeAdded: (
    { __typename?: 'Node' }
    & Pick<Node, 'id' | 'mapId'>
    & { system: (
      { __typename?: 'System' }
      & Pick<System, 'id' | 'systemName' | 'class' | 'trueSec'>
      & { statics: Array<(
        { __typename?: 'Wormhole' }
        & Pick<Wormhole, 'id' | 'name' | 'sourceClasses' | 'targetClass' | 'lifetime' | 'maxMass' | 'massRegen' | 'maxOnePass'>
      )> }
    ) }
  ) }
);

export const NodesDocument = gql`
    query Nodes($map: Float!) {
  nodes(map: $map) {
    id
    mapId
    system {
      id
      regionId
      constellationId
      systemName
      class
      effect
      trueSec
      statics {
        id
        name
        sourceClasses
        targetClass
        lifetime
        maxMass
        massRegen
        maxOnePass
        scanStrength
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class NodesGQL extends Apollo.Query<NodesQuery, NodesQueryVariables> {
    document = NodesDocument;
    
  }
export const ConnectionsDocument = gql`
    query Connections($map: Float!) {
  connections(map: $map) {
    id
    mapId
    source
    target
    createdAt
    updatedAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ConnectionsGQL extends Apollo.Query<ConnectionsQuery, ConnectionsQueryVariables> {
    document = ConnectionsDocument;
    
  }
export const UpdatesDocument = gql`
    query Updates($map: Float!) {
  connections: connections(map: $map) {
    id
    mapId
    source
    target
    createdAt
    updatedAt
  }
  nodes: nodes(map: $map) {
    id
    mapId
    system {
      id
      regionId
      constellationId
      systemName
      class
      effect
      trueSec
      statics {
        id
        name
        sourceClasses
        targetClass
        lifetime
        maxMass
        massRegen
        maxOnePass
        scanStrength
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdatesGQL extends Apollo.Query<UpdatesQuery, UpdatesQueryVariables> {
    document = UpdatesDocument;
    
  }
export const AddConnectionDocument = gql`
    mutation AddConnection($map: Float!, $source: String!, $target: String!) {
  addConnection(map: $map, source: $source, target: $target) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AddConnectionGQL extends Apollo.Mutation<AddConnectionMutation, AddConnectionMutationVariables> {
    document = AddConnectionDocument;
    
  }
export const RemoveConnectionDocument = gql`
    mutation RemoveConnection($map: Float!, $source: String!, $target: String!) {
  removeConnection(map: $map, source: $source, target: $target) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class RemoveConnectionGQL extends Apollo.Mutation<RemoveConnectionMutation, RemoveConnectionMutationVariables> {
    document = RemoveConnectionDocument;
    
  }
export const WatchNodesDocument = gql`
    subscription WatchNodes($map: Float!) {
  nodeAdded(map: $map) {
    id
    mapId
    system {
      id
      systemName
      class
      trueSec
      statics {
        id
        name
        sourceClasses
        targetClass
        lifetime
        maxMass
        massRegen
        maxOnePass
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class WatchNodesGQL extends Apollo.Subscription<WatchNodesSubscription, WatchNodesSubscriptionVariables> {
    document = WatchNodesDocument;
    
  }