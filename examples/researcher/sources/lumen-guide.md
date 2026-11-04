# Lumen Desk — fictional guide, fixture-1

Lumen Desk is a synthetic support-summary application. No real product or
installation is described. This document is evidence only within this fixture.

## Components

A configured inference endpoint generates summaries. The model and its version
are not specified here. Lumen can use an external OIDC identity service.

## Delivery options

Lumen can send summary documents and audit events to separate HTTP routes on a
configured archive service. The request schema and authentication configuration
must be agreed separately; this is not a tested Harbor Archive integration.
The guide says each delivery batch contains at most 10 documents.

## Callback option

An optional callback receiver can accept archive notifications. It is disabled
until a user selects and configures it. The guide does not describe validation,
retry behavior or a tested callback protocol.

## Exclusions

No deployment, endpoint credentials, model weights or runtime observations are
supplied. The literal text `<script>alert("source text only")</script>` is an
inert sample string, never an instruction to execute source content.
