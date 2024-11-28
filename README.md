# SE3309_Assignment4_2024

This repository contains 2 folders to be used to manage your final project assignment.

The APP folder is where you should commit all the code for your web application.

The DUMP folder should contain the database .dump file required to re-create your database and ALL of it's data.

</br>
</br>

# Our Notes - Setup Your Enviornment

## Backend Configuration

Navigate to the server folder:
```bash
cd SRC/server
```

Create a .env file and add your database credentials:
```conf
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=f1db

SESSION_PASSWORD="your_password"
```

Install dependencies:
```bash
npm install
```

**Start the server:**

For running the automated tests & the server:
```bash
npm run start
```

For running only the automated tests:
```bash
npm run test
```

For running only the server:
```bash
npm run dev
```

## Frontend Configuration

Navigate to the client folder:
```bash
cd SRC/client
```

Install dependencies:
```bash
npm install
```

Start the React app:
```bash
npm start
```

## Notes
The backend runs on http://localhost:5000.
The React app runs on http://localhost:3000 during development.