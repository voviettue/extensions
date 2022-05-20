## v1.2.0

- Refactor: stop using Directus API to create items from the request payload instead using custom endpoint `/data-management/import/:collection` to handle upload CSV file and insert data with queue.
