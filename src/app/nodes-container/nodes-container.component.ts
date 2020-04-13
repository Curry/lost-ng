import {
  Component,
  OnInit,
  Input,
  ViewContainerRef,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NodeService } from '../node.service';
import { Node, Connection } from '../graphql';

@Component({
  selector: 'nodes-container',
  templateUrl: './nodes-container.component.html',
  styleUrls: ['./nodes-container.component.scss'],
})
export class NodesContainerComponent implements OnInit, OnChanges {
  @Input() nodes: Node[];

  @Input() connections: Connection[];

  @ViewChild('nodes', { read: ViewContainerRef, static: true })
  viewContainerRef: ViewContainerRef;

  constructor(
    private nodeService: NodeService,
  ) {}

  ngOnInit() {
    this.nodeService.setRootViewContainerRef(this.viewContainerRef);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let key in changes) {
      const prev: (Node | Connection)[] = changes[key].previousValue;
      const curr: (Node | Connection)[] = changes[key].currentValue;
      if (prev) {
        const toDelete = prev.filter(
          ({ id }) => curr.map((val) => val.id).indexOf(id) === -1
        );
        const toAdd = curr.filter(
          ({ id }) => prev.map((val) => val.id).indexOf(id) === -1
        );

        toAdd.forEach((val) => {
          if (key === 'nodes') {
            this.nodeService.addDynamicNode(val as Node);
          } else {
            this.nodeService.addConnection(val as Connection);
          }
        });
        toDelete.forEach((val) => {
          if (key === 'nodes') {
            this.nodeService.removeDynamicNode(val as Node);
          } else {
            this.nodeService.removeConnection(val as Connection);
          }
        });
      }
    }
  }
}
