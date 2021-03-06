import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { OperationDefinitionNode } from 'graphql';
import { ApolloClientOptions } from 'apollo-client';

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      useFactory: (httpLink: HttpLink): ApolloClientOptions<any> => {
        return {
          cache: new InMemoryCache(),
          link: split(
            ({ query }) =>
              (getMainDefinition(query) as OperationDefinitionNode)
                .operation === 'subscription',
            new WebSocketLink({
              uri: 'ws://localhost:3000/graphql',
              options: {
                reconnect: true,
              },
            }),
            httpLink.create({
              uri: 'http://localhost:3000/graphql',
            })
          ),
        };
      },
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
