# Cedar Chat source pack

Synthetic product documentation, source pack revision 1. Authored by AI Surface
Model contributors under the repository's prose licence. This is documentation
for a fictional product, not an executable application or a runtime observation.

## Request routes

The browser submits chat messages to the application backend. The backend sends
messages and tool definitions to an inference endpoint using an HTTP client whose
base URL is configurable. Returned tool-call proposals are processed by the
backend's tool dispatcher. The dispatcher invokes a remote MCP server over HTTP
and appends the returned result to the next model request. Server selection is
configurable. No server or model is selected in the supplied settings.

A browser-direct inference mode is also supported. It uses a separately configured
provider URL and does not pass through the backend's HTTP client. Whether that
mode is enabled in a deployment is not established by this source pack.

## Tool hook

Immediately before each MCP invocation from the chat dispatcher, a synchronous
`beforeTool` hook receives the tool name, arguments and requesting user ID. It may
allow or deny the invocation. Argument modification and post-result hooks are
not documented here. If the hook raises an exception, the dispatcher aborts the
invocation and returns an error. This is a documented behavior, not a test result.

The scheduled import worker invokes the same MCP server through its own client.
It does not call the chat dispatcher's `beforeTool` hook. Its results are stored
directly, without an inference request.

## Supporting resources

MongoDB is required for application persistence. Retrieval is optional and can
query a vector-store service; supported products and selected target are not
identified here. No database, vector store or MCP server has been started for
this example. A companion process can receive audit events, but no mechanism
for that process to block execution is documented here.

## Scope

No provider proxy, security vendor, hook implementation or tracing system has
been tested with Cedar Chat. Authentication scopes, end-to-end correlation,
network routing and effective configuration require additional evidence.
