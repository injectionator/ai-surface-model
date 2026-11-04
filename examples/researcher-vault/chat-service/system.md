# Example Chat design

Document version: 1.

## Conversations

People use a browser to send messages to the Example Chat application. The
application sends conversation text to a model gateway, which serves a language
model and returns generated text. The application sends that reply to the browser.
`MODEL_GATEWAY_URL` names the gateway's base address. The model name, provider and
gateway implementation are not specified in this document.

The application stores conversation messages in a document store so people can
reopen earlier conversations. The store's product and hosting location are not
specified here.

## Uploaded documents

The application supports an optional document-search service. It can send uploaded
documents to that service for indexing, ask it for relevant passages, and include
those passages in the conversation sent to the model gateway.

`DOCUMENT_SEARCH_URL` names the document-search service's base address. An empty
value supplies no address in that settings file. Deployment overrides and the
service's own storage, embedding model and implementation are not described here.

## Access

The application supports user sign-in, but this document does not identify an
authentication provider or explain its implementation. This design document
contains no observations of a running system.
