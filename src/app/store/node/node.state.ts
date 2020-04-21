import { State } from '@ngxs/store';
import { Injectable } from '@angular/core';
import {
  StateRepository,
  DataAction,
  Computed,
} from '@ngxs-labs/data/decorators';
import { NgxsDataEntityCollectionsRepository } from '@ngxs-labs/data/repositories';
import { createEntityCollections } from '@ngxs-labs/data/utils';
import { Node } from 'src/app/graphql';
import { AppService } from 'src/app/app.service';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@StateRepository()
@State({
  name: 'nodes2',
  defaults: createEntityCollections(),
})
@Injectable()
export class NodeState extends NgxsDataEntityCollectionsRepository<Node> {
  constructor(private service: AppService) {
    super();
  }

  @Computed()
  public get nodes$(): Observable<Node[]> {
    return this.state$.pipe(map((val) => Object.values(val.entities)));
  }

  @DataAction()
  public load(): Observable<Node[]> {
    return this.service.getNodes().pipe(
      tap((val) => {
        this.setAll(val);
        console.log(this.selectAll());
      })
    );
  }
}
