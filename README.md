![Logo](.github/images/project.png)

# Personalised Image Gallery Application (PicPics)

## Description
This application provides a gallery for users to upload, download, view, and manage images easily via a web interface. It supports features like image search, filtering, sorting, and more. For a more detailed view of the app, visit [GitHub repository](https://github.com/Wiz-Omar/WebbApps).

### Purpose
This project was part of the course DAT076 - Web applications at Chalmers University of Technology. Spring term 2024.

### Authors
Mojtaba Alizade, Harry Denell, Rikard Roos, Omar Younes

## Getting Started

### Prerequisites
Before you begin, ensure you have the following installed on your system:
- Node.js
- npm (Node Package Manager)

### Installation Guide
Follow these steps to set up the application on your local machine:

#### 1. Clone the Repository
First, clone the GitHub repository to your local machine using the following command:
```bash
git clone https://github.com/Wiz-Omar/WebbApps.git
```

#### 2. Set Up the Server Configuration
Navigate to the `Server/src/` directory and create a file named `secret.ts`. Insert your secret key as shown below:
```typescript
export const secret = "your_secret_key_here";
```

Next, move to the `Server/src/db/` directory and create a file named `key.ts`. Add your MongoDB database key:
```typescript
export const pass = "your_mongodb_pass_here";
```

#### 3. Install Dependencies
Install the necessary dependencies for both the client and the server. Open a terminal and execute the following commands:

For the server
```bash
cd Server
npm install
```

For the client
```bash
cd Client
npm install
```

#### 4. Running the project
To run the project you need to run the following commands:

To start the server:
```bash
cd Server
npm run dev
```

In a new terminal, start the client:
```bash
cd Client
npm start
```

You should now see the application running in a new tab in your browser
