import {
  ComponentFactoryResolver,
  Injectable,
  ViewContainerRef,
} from '@angular/core';
import { jsPlumb } from 'jsplumb';

import { NodeComponent } from './node/node.component';
import { Node, Connection } from './graphql';
import * as fromConnection from './store/actions/connection.action';
import { Store } from '@ngrx/store';
import { AppState } from './store';

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  private rootViewContainer: ViewContainerRef;
  private nodes: string[] = [];

  jsPlumbInstance = jsPlumb.getInstance();

  constructor(private factoryResolver: ComponentFactoryResolver, private store: Store<AppState>) {
    this.jsPlumbInstance.bind("connection", (info, event) => {
      const { sourceId, targetId } = info;
      this.store.dispatch(fromConnection.createConnection({
          mapId: 1,
          source: sourceId,
          target: targetId,
      }));
    });
  }

  public setRootViewContainerRef(viewContainerRef) {
    this.rootViewContainer = viewContainerRef;
  }

  public addDynamicNode(node: Node) {
    const factory = this.factoryResolver.resolveComponentFactory(NodeComponent);
    const component = factory.create(this.rootViewContainer.parentInjector);
    (<any>component.instance).node = node;
    (<any>component.instance).jsPlumbInstance = this.jsPlumbInstance;
    this.nodes.push(node.id);
    this.rootViewContainer.insert(component.hostView);
  }

  public removeDynamicNode(node: Node) {
    this.jsPlumbInstance
    // @ts-ignore
      .selectEndpoints({
        element: node.id,
      })
      .each((end) => this.jsPlumbInstance.deleteEndpoint(end));
    this.rootViewContainer.remove(this.nodes.indexOf(node.id));
    this.nodes.splice(this.nodes.indexOf(node.id), 1);
  }

  addConnection(connection: Connection) {
    this.jsPlumbInstance.connect({
      uuids: [connection.source + '_bottom', connection.target + '_top'],
    });
  }

  removeConnection(connection: Connection) {
    this.jsPlumbInstance
      .select({
        source: connection.source,
        target: connection.target,
      })
      .each((conn) => this.jsPlumbInstance.deleteConnection(conn));
  }
}
