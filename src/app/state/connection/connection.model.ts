export interface Connection {
  id: string;
  mapId: number;
  source: string;
  target: string;
  createdAt: Date;
  updatedAt: Date;
}


export function createConnection(params: Partial<Connection>) {
  return {

  } as Connection;
}
