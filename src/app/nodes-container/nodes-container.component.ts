import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { timer } from 'rxjs';
import { Connection, Node } from '../graphql';
import { NodeService } from '../node.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'nodes-container',
  templateUrl: './nodes-container.component.html',
  styleUrls: ['./nodes-container.component.scss'],
})
export class NodesContainerComponent implements OnInit, OnChanges {
  @Input() nodes: Node[];

  @Input() connections: Connection[];

  jsPlumbInstance;

  @ViewChild('nodes', { read: ViewContainerRef, static: true })
  viewContainerRef: ViewContainerRef;

  constructor(private nodeService: NodeService) {
    this.jsPlumbInstance = nodeService.jsPlumbInstance;
  }

  ngOnInit() {
    this.nodeService.setRootViewContainerRef(this.viewContainerRef);
    this.nodeService.addNodes(this.nodes);
    timer().subscribe(() => {
      this.nodes.forEach(node => this.nodeService.jsPlumbInstance.revalidate(node.id));
      this.nodeService.addConnections(this.connections);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.nodes) {
      const prev = changes.nodes.previousValue || [];
      this.nodeService.removeNodes(prev.filter((n: Node) => !this.nodes.map(no => no.id).includes(n.id)));
      this.nodeService.addNodes(this.nodes);
    }
    if (changes.connections) {
      const prev = changes.connections.previousValue || [];
      this.nodeService.removeConnections(prev.filter((c: Connection) => !this.connections.map(co => co.id).includes(c.id)));
    }
    timer().subscribe(() => {
      this.nodes.forEach(node => this.nodeService.jsPlumbInstance.revalidate(node.id));
      this.nodeService.addConnections(this.connections);
    });
  }
}
