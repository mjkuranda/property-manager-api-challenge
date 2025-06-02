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
- **API Documentation**: Swagger/OpenAPI

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following content:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/property-management
   ANALYSIS_API_URL=http://localhost:3001
   ```

3. Start MongoDB:
   ```bash
   # Make sure MongoDB is running on your system
   ```

4. Start the services:
   ```bash
   # Start Analysis API
   npm run start analysis-api

   # Start Property Management API
   npm run start property-management-api
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
  "keywords": ["burst", "water", "emergency"],
  "urgencyIndicators": 3,
  "priorityScore": 0.95
}
```

### Property Management API

#### POST /requests
Submit a new maintenance request.

Request:
```json
{
  "tenantId": "T123",
  "message": "Kitchen sink is leaking badly!",
  "timestamp": "2024-03-15T09:30:00Z"
}
```

Response:
```json
{
  "requestId": "REQ001",
  "priority": "high",
  "analyzedFactors": {
    "keywords": ["leak", "urgent"],
    "priorityScore": 0.76
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
      "id": "REQ001",
      "priority": "high",
      "message": "Kitchen sink is leaking badly!",
      "createdAt": "2024-03-15T09:30:00Z",
      "resolved": false
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
  /analysis-api         # Mock AI analysis service
  /property-management-api  # Main API service
/libs                   # Shared libraries
```

### Running Tests
```bash
# Run all tests
npm run test

# Run tests for specific app
npm run test analysis-api
npm run test property-management-api
```

## Design Decisions

1. **Microservice Architecture**: Separated analysis logic from main API to allow for future scaling and potential replacement with real AI service.

2. **MongoDB**: Chosen for flexibility in request data structure and good performance for read/write operations.

3. **NestJS**: Provides robust architecture patterns and excellent TypeScript support.

## Future Enhancements

- Request resolution tracking
- Tenant authentication
- Real-time notifications
- Historical analysis and reporting
- AWS Lambda integration
- DynamoDB migration option