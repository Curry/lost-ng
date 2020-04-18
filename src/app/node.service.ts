import {
  ComponentFactoryResolver,
  Injectable,
  ViewContainerRef,
  ComponentRef,
  ViewRef,
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
    nodes.forEach((node) => {
      this.addNode(node);
      // this.jsPlumbInstance.revalidate(node.id);
    });
  }

  addNode = (node: Node) => {
    if (this.components[node.id]) {
      this.components[node.id].instance.node = node;
    } else {
      const factory = this.factoryResolver.resolveComponentFactory(NodeComponent);
      const component = factory.create(this.rootViewContainer.injector);
      component.instance.node = node;
      component.instance.jsPlumbInstance = this.jsPlumbInstance;
      component.onDestroy(() => {
        this.jsPlumbInstance.remove(node.id);
      });
      this.rootViewContainer.insert(component.hostView);
      this.components[node.id] = component;
    }
  }

  removeNodes = (nodes: Node[]) => {
    nodes.forEach(node => {
      this.components[node.id].destroy();
      delete this.components[node.id];
    });
  }

  revalidate = (nodes: Node[]) => {
    nodes.forEach(node => this.jsPlumbInstance.revalidate(node.id));
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
