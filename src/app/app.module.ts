import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { NodeComponent } from './node/node.component';
import { NodesContainerComponent } from './nodes-container/nodes-container.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NodeEffects } from './store/effects/node.effects';
import { ConnectionEffects } from './store/effects/connection.effect';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { reducers } from './store';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
import { environment } from '../environments/environment';
@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    DragDropModule,
    StoreModule.forRoot({}, {}),
    StoreModule.forFeature('app', reducers),
    EffectsModule.forRoot([NodeEffects, ConnectionEffects]),
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    AkitaNgRouterStoreModule.forRoot(),
  ],
  declarations: [AppComponent, NodeComponent, NodesContainerComponent],
  entryComponents: [NodeComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
