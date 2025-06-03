# Smart Maintenance Request System

A property maintenance request management system that automatically prioritizes maintenance requests based on urgency and content analysis.

## System Architecture

The system consists of two main microservices:

1. **Property Management API** (`/apps/property-management-api`)
   - Handles maintenance request submission and retrieval
   - Integrates with Analysis API for request prioritization
   - Manages data persistence in MongoDB

2. **Analysis API** (`/apps/analysis-api`)
   - Mock AI analysis service
   - Analyzes maintenance request messages
   - Returns priority scores and detected keywords

## Technical Stack

- **Framework**: NestJS (TypeScript)
- **Database**: MongoDB
- **Testing**: Jest

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Docker (with DynamoDB image) or just DynamoDB
- npm

### Installation

1. Install dependencies:
   - root directory
   - apps/property-manager-api
   - apps/analysis-api
   
   Using:
   ```bash
   npm install
   ```

2. Create a `.env` file in `apps/property-management-api` with the following content:
   ```
   PORT=4000
   ANALYSIS_API_URL=http://localhost:4001

   AWS_ACCESS_KEY_ID=local
   AWS_SECRET_ACCESS_KEY=local
   AWS_REGION=us-east-1

   DYNAMODB_ENDPOINT=http://localhost:8000

   MAINTENANCE_HIGH_PRIORITY_THRESHOLD=0.7
   MAINTENANCE_MEDIUM_PRIORITY_THRESHOLD=0.4
   ```

3. Start DynamoDB:
   ```bash
   sudo docker run -p 8000:8000 amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb
   ```
   
4. Init DynamoDB tables:
   ```bash
   # To build script file
   npm run build:pm-api
   
   # To invoke script to create tables
   npm run db:setup
   ```

5. Start the services:
   ```bash
   # Start Analysis API
   npm run start:pm-api

   # Start Property Management API
   npm run start:analysis
   ```
   or to run the both at once:
   ```bash
   npm run start
   ```

## API Documentation

### Analysis API (Mock AI Service)

#### POST /analyze
Analyzes maintenance request messages for priority classification.

Request:
```json
{
    "message": "Bathroom pipe burst, water everywhere!"
}
```

Response:
```json
{
    "keywords": ["burst", "emergency"],
    "urgencyIndicators": 2,
    "priorityScore": 0.7
}
```

### Property Management API

#### POST /requests
Submit a new maintenance request.

Request:
```json
{
    "tenantId": "81fca361-66a3-4e1b-95f1-79b3a834647d", 
    "message": "urgent leaking water", 
    "timestamp": "2025-06-02T17:47:59.404Z"
}
```

Response:
```json
{
    "requestId": "a65a3cfa-ca0b-4907-9823-dfbd9210492a",
    "priority": "high",
    "analyzedFactors": {
        "keywords": [
            "leak",
            "water"
        ],
        "urgencyIndicators": 2,
        "priorityScore": 0.7
    }
}
```

#### GET /requests
Retrieve maintenance requests filtered by priority.

Query Parameters:
- `priority`: Filter by priority level (high, medium, low)

Response:

```json
{
   "requests": [
      {
         "requests": [
            {
               "createdAt": "2025-06-02T17:47:59.404Z",
               "analyzedFactors": {
                  "keywords": [
                     "leak",
                     "water"
                  ],
                  "urgencyIndicators": 2,
                  "priorityScore": 0.7
               },
               "tenantId": "81fca361-66a3-4e1b-95f1-79b3a834647d",
               "id": "7edf19fb-a4ff-44e3-8518-2b4506736de8",
               "message": "urgent leaking water",
               "priority": "high",
               "status": "PENDING",
               "updatedAt": "2025-06-02T19:27:31.018Z",
               "resolved": false
            },
            {
               "createdAt": "2025-06-02T17:47:59.404Z",
               "analyzedFactors": {
                  "keywords": [
                     "leak",
                     "water"
                  ],
                  "urgencyIndicators": 2,
                  "priorityScore": 0.7
               },
               "tenantId": "81fca361-66a3-4e1b-95f1-79b3a834647d",
               "id": "a65a3cfa-ca0b-4907-9823-dfbd9210492a",
               "message": "urgent leaking water",
               "priority": "high",
               "status": "PENDING",
               "updatedAt": "2025-06-02T19:14:55.454Z",
               "resolved": false
            }
         ]
      }
   ]
}
```

## Priority Classification

The system uses the following classification criteria:

### High Priority
- Plumbing emergencies (leaks, floods, bursts)
- Electrical hazards (sparking, outages)
- Structural damage
- Safety concerns (gas, smoke detectors)
- Environmental emergencies (heating, frozen pipes)

### Medium Priority
- Broken appliances
- Access issues (stuck doors)
- Non-emergency equipment problems

### Low Priority
- Cosmetic repairs
- Minor maintenance
- Non-urgent improvements

## Development

### Project Structure
```
/apps
  /analysis-api               # Mock AI analysis service
  /property-management-api    # Main API service
```

### Running Tests
Regarding Analysis API is mocked, unit and E2E tests were written only for Property Manager API.
To run them, go to `apps/property-manager-api` and use script:
```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e
```

## Design Decisions
1. **Microservice Architecture**: Separated analysis logic from main API to allow for future scaling and potential replacement with real AI service.
2. **DynamoDB**: Chosen in terms of wide-usage in the company.
3. **NestJS**: Provides robust architecture patterns and excellent TypeScript support.
4. **Separate package.json**: Each application has a separate `package.json` to manage scripts, version and dependencies. Common dependencies are located in root directory.
5. **Simple calculating priority score**: Focuses on finding words. "Urgent" words has a bigger weight than other ones. It can be replaced with another system: each word has a defined weight, which has an impact on the final score. The current way of calculating is simple and demonstrates mocked system.
6. **Three-tier API architecture**: Good to separate responsibility and make testing easier.

## Future Enhancements

- Request resolution tracking
- Tenant authentication
- Real-time notifications
- Historical analysis and reporting
- AWS Lambda integration
- DynamoDB migration option