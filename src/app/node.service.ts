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

  setRootViewContainerRef = (viewContainerRef: ViewContainerRef): void => {
    this.rootViewContainer = viewContainerRef;
  };

  resetConnections = (): void => this.jsPlumbInstance.deleteEveryConnection();

  addNodes = (nodes: Node[]): void => {
    nodes.forEach((node) => {
      this.addNode(node);
      // this.jsPlumbInstance.revalidate(node.id);
    });
  };

  addNode = (node: Node): void => {
    if (this.components[node.id]) {
      this.components[node.id].instance.node = node;
    } else {
      const factory = this.factoryResolver.resolveComponentFactory(
        NodeComponent
      );
      const component = factory.create(this.rootViewContainer.injector);
      component.instance.node = node;
      component.instance.jsPlumbInstance = this.jsPlumbInstance;
      component.onDestroy(() => {
        this.jsPlumbInstance.remove(node.id);
      });
      this.rootViewContainer.insert(component.hostView);
      this.components[node.id] = component;
    }
  };

  removeNodes = (nodes: Node[]): void => {
    nodes.forEach((node) => {
      this.components[node.id].destroy();
      delete this.components[node.id];
    });
  };

  revalidate = (nodes: Node[]): void => {
    nodes.forEach((node) => this.jsPlumbInstance.revalidate(node.id));
  };

  addConnections = (connections: Connection[]): void => {
    connections.forEach((connection) => this.addConnection(connection));
  };

  addConnection = (connection: Connection): void => {
    if (
      this.jsPlumbInstance.select({
        source: connection.source,
        target: connection.target,
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
      }).length === 0
    ) {
      this.jsPlumbInstance.connect({
        uuids: [connection.source + '_bottom', connection.target + '_top'],
      });
    }
  };

  removeConnections = (connections: Connection[]): void => {
    connections.forEach((connection) => this.removeConnection(connection));
  };

  removeConnection = (connection: Connection): void => {
    this.jsPlumbInstance
      .select({
        source: connection.source,
        target: connection.target,
      })
      .each((conn) => this.jsPlumbInstance.deleteConnection(conn));
  };
}
