import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';

const link = createUploadLink({ uri: process.env.API_URL });

export const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});