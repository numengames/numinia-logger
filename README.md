# numinia-logger

## Overview

This module provides a unified and centralized logging solution across multiple projects. It facilitates integration with various logging systems and notification platforms, ensuring consistent and accessible log collection and visualization. Currently, the module supports Loki and Discord, with plans to easily implement new platforms depending of the project needs.

## Features

- **Loki Integration**: Sends logs to Loki, allowing for easy querying and storage in a centralized log system.
- **Discord Integration**: Sends critical alerts and information directly to a specified Discord channel, enabling immediate notifications for teams.
- **Extensible Framework**: Designed to easily incorporate additional logging destinations, with minimal configuration required.

## Getting Started

### Prerequisites

- Node.js (version 20.x or higher recommended)
- An instance of Loki set up for receiving logs
- A Discord bot and channel for receiving notifications

### Installation

Install the module using npm:

```bash
npm install @numengames/numinia-logger --save
```

## Usage

Here's how to integrate the logging module:

1. Declare the middleware passing the config & the express object
```javascript
const app = express();
loggerMiddleware(config.logger, app);
```
2. Initialize the logger method:
```javascript
import { logger } from '@numengames/numinia-logger';
logger('main-file');
```
3. Use `logger.logInfo or logger.logError to properly log things`.

## Configuration

Detailed description of configuration options:

```json
{
  "loki": {
    "isActive": true,
    "host": "http://your-loki-instance",
    "job": "your-job-name",
    "user": "your-user",
    "password": "your-password"
  },
  "discord": {
    "isActive": true,
    "webhook": "your-discord-webhook-url",
    "service": "your-service-name"
  }
}
```

## Contributing

Please follow these steps:

1. Create a new branch (git checkout -b feature/awesome-feature).
2. Make your changes and commit them (git commit -am 'Add an awesome feature').
3. Push the branch (git push origin feature/awesome-feature).
4. Open a merge request.