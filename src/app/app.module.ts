import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { NodeComponent } from './node/node.component';
import { NodesContainerComponent } from './nodes-container/nodes-container.component';
import { StoreModule } from '@ngrx/store';
import * as fromNode from './store/reducers/node.reducer';
import { EffectsModule } from '@ngrx/effects';
import { NodeEffects } from './store/effects/node.effects';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    StoreModule.forRoot({ nodes: fromNode.reducer }),
    EffectsModule.forRoot([NodeEffects]),
  ],
  declarations: [AppComponent, NodeComponent, NodesContainerComponent],
  entryComponents: [NodeComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
