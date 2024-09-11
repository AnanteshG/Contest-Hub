# ContestHub

## Overview

ContestHub fetches upcoming and ongoing programming contests from multiple platforms including CodeChef, Codeforces, GeeksforGeeks, and LeetCode. It consolidates this information into a structured format and saves it as JSON files for easy access and further use. The project uses a backend repository for data storage and employs DevOps CI for automation.

## Features

- Fetches contest details from:
  - **CodeChef**
  - **Codeforces**
  - **GeeksforGeeks**
  - **LeetCode**
- Stores the contest data in JSON format.
- Includes details such as contest title, start time, duration, and URL.
- Integrates with [ContestHub-backend](https://github.com/AnanteshG/ContestHub-backend) for data storage.
- Automates updates of contest data using DevOps CI.

### Backend Integration

The project uses the [ContestHub-backend](https://github.com/AnanteshG/ContestHub-backend) repository for storing contest data. Ensure the backend service is up and running for seamless data synchronization.

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/AnanteshG/
   ```

2. **Navigate to Project Directory**
   ```bash
   cd
   ```
3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Run the Project**
   ```bash
   npm run dev
   ```

Your application should now be running at `http://localhost:5173/`.
