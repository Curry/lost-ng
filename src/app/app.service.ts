import { Injectable } from '@angular/core';
import { NodesGQL, Node } from './graphql';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private nodes: NodesGQL) {}

  getNodes = () =>
    this.nodes.fetch({ map: 1 }).pipe(map((val) => val.data.nodes as Node[]));
}
