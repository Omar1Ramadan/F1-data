# SE3309_Assignment4_2024

## Setup Your Environment

### Backend Configuration

1. **Navigate to the server folder:**
    ```bash
    cd SRC/server
    ```

2. **Create a `.env` file and add your database credentials:**
    ```conf
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_password
    DB_NAME=f1db

    SESSION_PASSWORD="your_password"
    ```

3. **Install dependencies:**
    ```bash
    npm install
    ```

4. **Start the server:**

    - For running the automated tests & the server:
        ```bash
        npm run start
        ```

    - For running only the automated tests:
        ```bash
        npm run test
        ```

    - For running only the server:
        ```bash
        npm run dev
        ```

### Frontend Configuration

1. **Navigate to the client folder:**
    ```bash
    cd SRC/client
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Start the React app:**
    ```bash
    npm start
    ```

## Notes

- The backend runs on [http://localhost:5000](http://localhost:5000) by default (edit by including a PORT num in your .env file)
- The React app runs on [http://localhost:3000](http://localhost:3000) during development.

## Database Setup

1. **Navigate to the DUMP folder:**
    ```bash
    cd DUMP
    ```

2. **Import the database dump file into your MySQL database:**
    ```bash
    mysql -u root -p f1db < f1db.dump
    ```

    or

    **Run it from your preferred terminal:**
    ```bash
    mysql -u root -p
    ```

    **After logging in:**
    ```sql
    SOURCE path/to/directory/of/dump/folder/f1db.sql;
    ```

3. **Use database:**
    ```sql
    USE f1db;
    ```


## Running Tests

- **To run all tests:**
    ```bash
    npm test
    ```

- **To run a specific test file:**
    ```bash
    npm test -- path/to/testfile
    ```

## Project Structure

- **SRC/server**: Contains the backend code.
- **SRC/client**: Contains the frontend code.
- **DUMP**: Contains the database dump file.

## Troubleshooting

- **Common Issues:**
    - Ensure your `.env` file is correctly configured with your database credentials.
    - Make sure MySQL server is running and accessible.
    - Check if all dependencies are installed by running `npm install` in both [server](SRC\server) and [client](SRC\client) directories.

- **Logs:**
    - Backend logs can be found in the terminal where you run the server.
    - Frontend logs can be found in the browser console.