import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { NodeComponent } from './node/node.component';
import { NodesContainerComponent } from './nodes-container/nodes-container.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { environment } from '../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { StoreModule } from '@ngrx/store';
import { reducers, undoRedo, debug } from './store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NodeEffects } from './store/effects/node.effects';
import { ConnectionEffects } from './store/effects/connection.effect';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    DragDropModule,
    MatButtonModule,
    MatCardModule,
    StoreModule.forRoot({}, { metaReducers: [debug, undoRedo] }),
    StoreModule.forFeature('app', reducers),
    EffectsModule.forRoot([NodeEffects, ConnectionEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    }),
  ],
  declarations: [AppComponent, NodeComponent, NodesContainerComponent],
  entryComponents: [NodeComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
