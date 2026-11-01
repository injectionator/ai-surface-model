# Using the basic Surface in another Lab

## Inspect and bind

1. Read [the definition](surface.json), including coverage and missing requirements.
2. Retain the source revision and a fingerprint of the actual imported bytes.
   A consumer's byte hash is not a standardized model digest.
3. Map each component to a recipient-local resource, as illustrated in the
   [binding example](bindings.example.json). Keep unresolved mappings visible.
4. Obtain the required software and configuration artifacts. In particular, this
   repository does not supply the provider bridge. No runnable deployment follows
   merely from possession of this definition.
5. Supply private credentials and subscription authentication locally. Imported
   descriptions do not supply credentials or authorize equipment changes.

## Prepare and check

Use the Lab's supported configuration operations or a separately reviewed recipe
to prepare the resources. Establish the selected model, database initial state,
application configuration and artifacts actually used. If the intended definition
changes, preserve the original and record a derived revision.

Record dated observations separately: application access, authenticated database
access from the application environment, a response through the selected inference
route, and saved-conversation readback. Establish attribution to the bound resources;
a response from an unrelated interface is not evidence for this route.

A recipient's Experiment Run should retain the definition revision and exact
snapshot, local bindings and observed effective setup. A successful import, resource
mapping or JSON parse is not a successful recreation or reproduced result.

## Present limits

The example has no pinned builds, provider implementation, complete deployment
recipe, initial data or recipient verification evidence. These are explicit next
pieces to supply as consumers develop. Synthetic consumer tests can establish
import and binding behavior; they cannot establish a live LibreChat deployment.
