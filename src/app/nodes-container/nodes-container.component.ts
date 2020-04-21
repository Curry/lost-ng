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
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'nodes-container',
  templateUrl: './nodes-container.component.html',
  styleUrls: ['./nodes-container.component.scss'],
})
export class NodesContainerComponent implements OnInit, OnChanges {
  @Input() nodes: Node[];

  @Input() connections: Connection[];

  @ViewChild('nodes', { read: ViewContainerRef, static: true })
  viewContainerRef: ViewContainerRef;

  constructor(private nodeService: NodeService) {}

  ngOnInit() {
    this.nodeService.setRootViewContainerRef(this.viewContainerRef);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.nodes) {
      const prev = changes.nodes.previousValue || [];
      this.nodeService.removeNodes(
        prev.filter((n: Node) => !this.nodes.map((no) => no.id).includes(n.id))
      );
    }
    if (changes.connections) {
      const prev = changes.connections.previousValue || [];
      this.nodeService.removeConnections(
        prev.filter(
          (c: Connection) => !this.connections.map((co) => co.id).includes(c.id)
        )
      );
    }
    this.nodeService.addNodes(this.nodes);
    timer().subscribe(() => {
      this.nodeService.revalidate(this.nodes);
      this.nodeService.addConnections(this.connections);
    });
  }
}
