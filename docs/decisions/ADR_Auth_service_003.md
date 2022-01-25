# Authentication Services Decision Record

* Status: accepted
* Deciders: Francesco Di Bella, Angela Busato, Francesco Ricci, Federico Siddi, Tommaso Venza, Valentina D'Agata, Erica De Giovanni, Valentina Bazzacchi
* Date: 24/01/2022

## Context and Problem Statement

Decide which auth service is best suitable for the team web app

## Decision Drivers

* It has to be well documented and not complicated to implement
* It has to be free or at least have a free plan

## Considered Options

* Firebase Auth
* Auth0
* Okta

## Decision Outcome

Chosen option: "Auth0", because it's easy to implement and considered quite secure. In tests we've made it's the fastest to implement thanks to a very good documentation.

### {Firebase}

* Good, because it has a lot of other services connencted that eventually can be implemented.
* Good, because it's very well known and plenty of documentation.
* Bad, it seems optimized for mobile apps, and it's a bit complicated for web apps.

### {Auth0}

* Good, because it's well know and there's a lot of documentation
* Good, because it's highly customizable, even more than Firebase
* Good, it's quite easy to implement

### {Okta}

* Good, because it's considered very secure
* Bad, it's a little more complicated to implement and seems more focused for enterprise users and bigger companies
