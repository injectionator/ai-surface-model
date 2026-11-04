# Harbor Archive — fictional interface notes, fixture-1

Harbor Archive is a synthetic document and event archival product. It is
independent of Lumen Desk and has no built-in knowledge of summarization or AI.

## Intake

Harbor offers separate HTTP routes for storing documents and appending audit
events. JSON request payloads are supported. Exact payload fields, limits and
authentication are not specified by this document.

## Notifications

An optional outbound HTTP callback reports archival events. Its exact payload
and the receiver's compatibility need investigation. No integration with Lumen
Desk has been tested. No deployment or exercised request trace is supplied.
