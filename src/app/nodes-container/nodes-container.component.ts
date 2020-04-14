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

  @ViewChild('nodes', { read: ViewContainerRef, static: true })
  viewContainerRef: ViewContainerRef;

  constructor(private nodeService: NodeService) {}

  ngOnInit() {
    this.nodeService.setRootViewContainerRef(this.viewContainerRef);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.nodes) {
      this.nodeService.resetNodes();
      this.nodeService.addNodes(this.nodes);
    }
    timer().subscribe(() => {
      this.nodeService.resetConnections();
      this.nodeService.addConnections(this.connections);
    });
  }
}
