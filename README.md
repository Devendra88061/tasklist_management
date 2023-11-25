# Book_Management :

# Pre-requisites
- Install Node.js v14.15.3
- Install Typescript v4.0.2

# cloning the repo:
- git clone 

# Install dependencies
- npm i nodemon
- npm i express
- npm i mongoose


# TypeScript + Node 
The repository consist of commonly used functionalities written in typescript which are used in task_management project.

## Project Structure
The folder structure of this Book_management is explained below:

- src (Main folder)
 - models (mongoose schema)
 - modules (functionality modules)
- index.ts (app starting point)

# Api Endpoint

# Sign Up
- http://localhost:4000/auth/signUp

# login Api
- http://localhost:4000/auth/login

# logout Api
- http://localhost:4000/auth/logout

# Home Tab Api
- http://localhost:4000/auth/getUserById/Id

# Add link Api
- http://localhost:4000/auth/addUrl


# Note :
- im using the twilio third party api for sending the otp verification process if user want to check the
- verify otp functionality user need to verify the mobileNo on twilio account because we are using free
- Account for this verification process.