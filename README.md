# Assingment-Task-leadmint

 - Secure Chat RoomImplementation


(#Secure-Chat-Room-Implementation) 

# Overview

This repository contains the code for a secure chat room system implemented in JavaScript, Node.js, and MySQL. The application ensures security, user authentication, and interactive communication. Below are the features and requirements fulfilled by this application.

# Features

- User Registration and Authentication:

Implement user registration and authentication by using JWT.
Users provide details like userId, devic`eId, name, phone, and availCoins for registration.
- POST /api/create
- POST/api/login


- Chat Room Creation:
Here, only Prime members can create a chat room.
Endpoint: POST /api/chatrooms
Only authenticated prime members can access it.
Maximum capacity of 6 people in a chat room.

- Inviting Participants:
Chat room creator can invite other prime members using the room ID and password.
Secure invitation mechanism using a token system.
Non-prime members can join one room for free and pay 150 coins for additional rooms.
Endpoint : POST /api/invite



- Joining a Room as a Non-Prime Member:
Endpoint: POST /api/joinroom
Prime members check if the user has already joined a room for free.
Non-prime members need 150 coins to join additional rooms.
Chat Functionality:

- Real-time messaging within chat rooms.
WebSocket implementation: POST /api/messages.
Profile Viewing:

- Users can view each other's profiles.
Endpoint: GET /api/profile/:userId.


- Friend Requests:
Users can send friend requests to other participants.
Endpoint: POST /api/friend-requests.

- Database Management:
MySQL used to store user details, chat room information, messages, and friend requests.
Proper database schema and queries implemented.


- Security Measures:
Secure password storage using bcrypt.
Only prime members can create chat rooms.
Sensitive information protected from unauthorized access.
Error Handling and Validation:

- Robust error handling and validation for user inputs.
Responses indicate reasons for denial (e.g., insufficient coins).

-- Version Control:


- Clone the repository:
- git clone https://github.com/functionupjkg/Assingment-Task-leadmint.git

- install dependencies
- npm install


- Create a .env file based on .env.example and provide the necessary configuration.

Run the application:
- npm start

API Documentation
API endpoints, expected request and response formats, and additional features are documented in the code. Refer to the codebase and inline comments for detailed information.

- Author : Jyoti Kumari