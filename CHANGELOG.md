# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.8.0] - 2025-06-04
### Added
- [Marek Kurańda](https://github.com/mjkuranda): `KeywordService` that calculates `priorityScore`.

### Changed
- [Marek Kurańda](https://github.com/mjkuranda): The way how priority score is calculating. 

## [1.7.0] - 2025-06-03
### Added
- [Marek Kurańda](https://github.com/mjkuranda): `LoggerModule` to log each event within the system.

## [1.6.0] - 2025-06-03
### Added
- [Marek Kurańda](https://github.com/mjkuranda): Unit and E2E tests for `MaintenanceModule` in Property Management API.
- [Marek Kurańda](https://github.com/mjkuranda): `DatabaseError` for unexpected reasons from interaction with database.
- [Marek Kurańda](https://github.com/mjkuranda): `DtoValidationPipe` for validation DTOs.

## [1.5.0] - 2025-06-03
### Added
- [Marek Kurańda](https://github.com/mjkuranda): Simple error handling system.

## [1.4.1] - 2025-06-03
### Changed
- [Marek Kurańda](https://github.com/mjkuranda): `tsconfig.json` configuration - no extension of base one.

## [1.4.0] - 2025-06-02
### Changed
- [Marek Kurańda](https://github.com/mjkuranda): Separate `package.json` for each application and root directory.

## [1.3.0] - 2025-06-02
### Added
- [Marek Kurańda](https://github.com/mjkuranda): Command to create tables in DynamoDB.

## [1.2.0] - 2025-06-02
### Added
- [Marek Kurańda](https://github.com/mjkuranda): `MaintenanceRequestModule` containing two endpoints: `GET /requests?priority` and `POST /requests` to add a new one.
- [Marek Kurańda](https://github.com/mjkuranda): `DynamodbModule` to integrate DynamoDB.
- [Marek Kurańda](https://github.com/mjkuranda): Thresholds for defining priority levels.

## [1.1.0] - 2025-05-31
### Added
- [Marek Kurańda](https://github.com/mjkuranda): Keyword config for all words or tokens to define priority level.
- [Marek Kurańda](https://github.com/mjkuranda): `AnalysisRequestDTO` object with validation and transformation.
- [Marek Kurańda](https://github.com/mjkuranda): Custom error different classes.
- [Marek Kurańda](https://github.com/mjkuranda): `AnalysisService` to analyse request and `ValidationService` to validate request body.

## [1.0.0] - 2025-05-30
### Added
- [Marek Kurańda](https://github.com/mjkuranda): Initial basic API version.