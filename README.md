# PeopleDataLabs CLI Tool

## Description

Executes a set of defined queries to the PeopleDataLabs API and saves results as JSON files.

## Usage

```
pnpm install
pnpm cli --query=person --github=<USERNAME>
```

## Configuration

The tool is configured via environment variables. The following variables are required:
- `PEOPLEDATALABS_KEY`: API key for PeopleDataLabs which can be obtained from https://peopledatalabs.com/

Environment variables should be stored in a `.env` file in the root of the project.

## Roadmap

- [ ] Add support for more queries.
- [ ] Add support for more output formats.
- [ ] Add support for additional data sources.

## API Documentation

https://docs.peopledatalabs.com/docs/javascript-sdk