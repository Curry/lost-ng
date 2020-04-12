import { Component, OnInit, Input, ViewContainerRef, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { NodeService } from '../node.service';
import { Store,  } from '@ngrx/store';
import { addNode, deleteNode } from '../store/actions/node.action';
import { Node } from '../graphql';



@Component({
  selector: 'nodes-container',
  templateUrl: './nodes-container.component.html',
  styleUrls: ['./nodes-container.component.scss'],
})
export class NodesContainerComponent implements OnInit, OnChanges {
  @Input() nodes: Node[];

  @Input() connections = [];

  @ViewChild('nodes', { read: ViewContainerRef, static: true }) viewContainerRef: ViewContainerRef;


  constructor(private nodeService: NodeService) {
  }

  ngOnInit() {
    this.nodeService.setRootViewContainerRef(this.viewContainerRef);

    this.nodes.forEach(node => {
      this.nodeService.addDynamicNode(node);
    });

    setTimeout(() => {
      this.connections.forEach(connection => {
        this.nodeService.addConnection(connection);
      });
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.nodes.currentValue.length <= 3) {
      this.nodes.forEach(node => this.nodeService.addDynamicNode(node));
    }
  }
}
