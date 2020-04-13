import { Component, Input, AfterViewInit } from '@angular/core';
import { Node } from '../graphql';
import { jsPlumbInstance } from 'jsplumb';

@Component({
  selector: 'node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements AfterViewInit {
  @Input() node: Node;

  @Input() jsPlumbInstance: jsPlumbInstance;

  ngAfterViewInit() {
    const exampleDropOptions = {
      tolerance: 'touch',
      hoverClass: 'dropHover',
      activeClass: 'dragActive'
    };
    let Endpoint1 = {
      endpoint: ['Dot', { radius: 6 }],
      paintStyle: { fill: '#3f51b5' },
      isSource: true,
      scope: 'jsPlumb_DefaultScope',
      connectorStyle: { stroke: '#3f51b5', strokeWidth: 3 },
      connector: ['Bezier', { curviness: 50 }],
      maxConnections: 30,
      isTarget: false,
      dropOptions: exampleDropOptions
    };
    let Endpoint2 = {
      endpoint: ['Dot', { radius: 6 }],
      paintStyle: { fill: '#ff4081' },
      isSource: false,
      scope: 'jsPlumb_DefaultScope',
      maxConnections: 10,
      isTarget: true,
      dropOptions: exampleDropOptions
    };
    const { id } = this.node;
    // @ts-ignore
    this.jsPlumbInstance.addEndpoint(id, { anchor: 'Right', uuid: id + '_bottom' }, Endpoint1);
    // @ts-ignore
    this.jsPlumbInstance.addEndpoint(id, { anchor: 'Left', uuid: id + '_top' }, Endpoint2);
    this.jsPlumbInstance.draggable(id, {
      stop: (val) => console.log(val.pos),
    });
  }

}
