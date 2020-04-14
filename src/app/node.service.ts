import {
  ComponentFactoryResolver,
  Injectable,
  ViewContainerRef,
} from '@angular/core';
import { jsPlumb } from 'jsplumb';
import { NodeComponent } from './node/node.component';
import { Node, Connection } from './graphql';

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  private rootViewContainer: ViewContainerRef;

  jsPlumbInstance = jsPlumb.getInstance();

  constructor(private factoryResolver: ComponentFactoryResolver) {}

  setRootViewContainerRef = (viewContainerRef: ViewContainerRef) => {
    this.rootViewContainer = viewContainerRef;
  }

  resetNodes = () => {
    this.rootViewContainer.clear();
    this.jsPlumbInstance.reset(true);
  }

  resetConnections = () => this.jsPlumbInstance.deleteEveryConnection();

  addNodes = (nodes: Node[]) => {
    const factory = this.factoryResolver.resolveComponentFactory(NodeComponent);
    nodes.forEach((node) => {
      const component = factory.create(this.rootViewContainer.injector);
      (component.instance as any).node = node;
      (component.instance as any).jsPlumbInstance = this.jsPlumbInstance;
      this.rootViewContainer.insert(component.hostView);
    });
  }

  addDynamicNode = (node: Node) => {
    const factory = this.factoryResolver.resolveComponentFactory(NodeComponent);
    const component = factory.create(this.rootViewContainer.injector);
    (component.instance as any).node = node;
    (component.instance as any).jsPlumbInstance = this.jsPlumbInstance;
    this.rootViewContainer.insert(component.hostView);
  }

  addConnections = (connections: Connection[]) => {
    connections.forEach((connection) => {
      this.jsPlumbInstance.connect({
        uuids: [connection.source + '_bottom', connection.target + '_top'],
      });
    });
  }

  addConnection(connection: Connection) {
    if (
      this.jsPlumbInstance.select({
        source: connection.source,
        target: connection.target,
        // @ts-ignore
      }).length === 0
    ) {
      this.jsPlumbInstance.connect({
        uuids: [connection.source + '_bottom', connection.target + '_top'],
      });
    }
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
