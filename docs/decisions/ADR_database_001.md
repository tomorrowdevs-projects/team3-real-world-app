# Database implementation

* Status: accepted <!-- superseded by [ADR-0005](0005-example.md)} --> <!-- optional -->
* Deciders: Francesco Di Bella, Angela Busato, Francesco Ricci, Jurgen Ametaj, Federico Siddi, Tommaso Venza, Valentina D'Agata, Erica De Giovanni, Valentina Bazzacchi
* Date: 2022-01-13

<!-- Technical Story: {description | ticket/issue URL} -->

## Context and Problem Statement

Which is the best DBMS to implement in the web app?

## Decision Drivers <!-- optional -->

* performance storing big files (GB)
* integration and support of the programming language choosen by the team
* easy to learn

## Considered Options

* PostgreSQL
* Redis
* ElasticSearch
<!-- numbers of options can vary -->

## Decision Outcome

Chosen option: "PostgreSQL", because is the best open source Relational DBMS and easy to learn.

### Positive Consequences <!-- optional -->

* Everyone can contribute, Valentina, Angela, Tommaso and Francesco Ricci already used SQL.


### Negative Consequences <!-- optional -->

* We must use a schema.


## Pros and Cons of the Options <!-- optional -->

### PostgreSQL

* Good, because is easy to learn.
* Good, because we can fast implement the APIs.
* Good, because we can store the data in tables and use the relations between tables.
* Bad, because the csv file has to follow the schema.
 <!-- numbers of pros and cons can vary -->

### Redis

* Good, because we can store a part of the data in the cache.
* Bad, because we don't have to call often the same data (no advantage storing the data in the cache).
* Bad, because maybe hard to learn.
 <!-- numbers of pros and cons can vary -->

### ElasticSearch

* Good, because is optimized for textual searching.
* Good, because is well implemented with Nodejs.
* Bad, because we don't have to do textual research.
 <!-- numbers of pros and cons can vary -->


<!-- markdownlint-disable-file MD013 -->