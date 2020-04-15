import {
  ComponentFactoryResolver,
  Injectable,
  ViewContainerRef,
  ComponentRef,
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

  components: { [id: string]: ComponentRef<NodeComponent> } = {};

  constructor(private factoryResolver: ComponentFactoryResolver) {}

  setRootViewContainerRef = (viewContainerRef: ViewContainerRef) => {
    this.rootViewContainer = viewContainerRef;
  }

  resetConnections = () => this.jsPlumbInstance.deleteEveryConnection();

  addNodes = (nodes: Node[]) => {
    nodes.forEach((node) => this.addNode(node));
  }

  addNode = (node: Node) => {
    if (this.components[node.id]) {
      this.components[node.id].instance.node = node;
    } else {
      const factory = this.factoryResolver.resolveComponentFactory(NodeComponent);
      const component = factory.create(this.rootViewContainer.injector);
      (component.instance as any).node = node;
      (component.instance as any).jsPlumbInstance = this.jsPlumbInstance;
      this.rootViewContainer.insert(component.hostView);
      this.components[node.id] = component;
    }
  }

  removeNodes = (nodes: Node[]) => {
    nodes.forEach(node => {
      this.components[node.id].destroy();
    });
  }

  addConnections = (connections: Connection[]) => {
    connections.forEach((connection) => this.addConnection(connection));
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

  removeConnections = (connections: Connection[]) => {
    connections.forEach(connection => this.removeConnection(connection));
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
