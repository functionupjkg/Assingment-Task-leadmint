
// Import necessary modules and models
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const { chatroom, invitechat, user, friendrequest, message } = require('../models'); // Update with your actual model paths



// Chat Room Creation
exports.createChatRoom = async (req, res) => {
    try {


        const userId = req.id;
        console.log("userId ===> ", userId);
        // check user is prime or not

        let isPrime = await user.findOne({ where: { id: userId } })
        if (!isPrime) {
            return res.send({ status: 404, message: 'User not found' });
        }
        if (isPrime) {
            if (isPrime.isPrimeMember !== true) {
                return res.send({ status: 404, message: "Only Prime member can create a chat room." })
            }
        }

        const data = req.body;
        const { roomName } = data;

        const createdChatRoom = await chatroom.create({
            roomName: roomName,
            userId: userId,
        });

        // Return success response with created chat room data
        return res.status(200).json({ status: 200, message: 'Chat Room Created Successfully', data: createdChatRoom });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, error: error.message });
    }
};





/// Invite other people to join a chat room with userId and password
exports.inviteMemberChatRoom = async (req, res) => {
    try {
        let inviteuserId = req.body.userId
        let userId = req.id

        // Find the chat room by userId
        const findRoomId = await chatroom.findOne({ where: { userId: userId } });
        if (!findRoomId) {
            return res.status(404).json({ status: 404, message: 'Room not found' });
        }

        let chatRoomId = findRoomId.id;

        // Generate a unique password (combination of random numbers and alphabets)
        const passwordLength = 8;
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';

        for (let i = 0; i < passwordLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters.charAt(randomIndex);
        }

        // Save the password in the database
        let sendRequest = await invitechat.create({ chatroomId: chatRoomId, password: password, userId: inviteuserId });

        // Return success response with invite to join the chat room
        return res.status(200).json({
            status: 200,
            message: 'Invite sent successfully to join the chat room',
            data: sendRequest,
            inviteData: { chatRoomId, password }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, error: error.message });
    }
};



// Invite other people to join a chat room with userId and password

exports.joinChatRoom = async (req, res) => {
    try {
        let data = req.body;
        let { chatroomId, password } = data;

        // Find the chat room by userId
        const checkJoinUser = await invitechat.findOne({
            where: { chatroomId: chatroomId, password: password }
        });

        if (!checkJoinUser) {
            return res.status(404).json({ status: 404, message: 'Check your credentials' });
        }

        // Check if the user is a prime member
        let userId = checkJoinUser.userId
        let userPrimeOrNot = await user.findOne({ where: { id: userId } })

        if (!userPrimeOrNot) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }

        // If the user is a prime member
        if (userPrimeOrNot.isPrimeMember === true) {
            // Check chat room capacity
            let chatRoomCapacity = await chatroom.findOne({ where: { id: checkJoinUser.chatroomId } })
            if (chatRoomCapacity && chatRoomCapacity.capacity > 0) {
                await chatroom.update(
                    { capacity: chatRoomCapacity.capacity - 1 },
                    { where: { id: checkJoinUser.chatroomId } }
                );
                //update invitechats

            } else {
                return res.status(400).json({ status: 400, message: "Chat room capacity exceeded." });
            }
        } else {
            // If the user is a non-prime member, check their login history
            let checkNonPrimeUser = await invitechat.findOne({
                where: {
                    userId: userId,
                    status: 'join'
                }
            });

            if (!checkNonPrimeUser) {
                // Check chat room capacity for non-prime user
                let chatRoomCapacity = await chatroom.findOne({ where: { id: checkJoinUser.chatroomId } })
                if (chatRoomCapacity && chatRoomCapacity.capacity > 0) {
                    await chatroom.update(
                        { capacity: chatRoomCapacity.capacity - 1 },
                        { where: { id: checkJoinUser.chatroomId } }
                    );

                } else {
                    return res.status(400).json({ status: 400, message: "Chat room capacity exceeded." });
                }
            } else {
                return res.status(400).json({ status: 400, message: 'Access denied, You have to pay 150 Coins to join additional chat room' });
            }
        }

        res.status(200).json({ status: 200, message: 'Successfully joined the chat room.' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, error: error.message });
    }
};

// Invite other people to join a chat room for non-prime members
exports.joinChatNonPrimeMember = async (req, res) => {
    try {
        let data = req.body;
        let { chatroomId, password } = data;

        // Find the chat room by userId
        const checkJoinUser = await invitechat.findOne({
            where: { chatroomId: chatroomId, password: password }
        });

        if (!checkJoinUser) {
            return res.status(404).json({ status: 404, message: 'Check your credentials' });
        }

        // Check if the user is a prime member
        let userId = checkJoinUser.userId
        let userPrimeOrNot = await user.findOne({ where: { id: userId } })

        if (!userPrimeOrNot) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }

        // If the user is a prime member
        if (userPrimeOrNot.isPrimeMember === true) {
            // Check chat room capacity
            let chatRoomCapacity = await chatroom.findOne({ where: { id: checkJoinUser.chatroomId } })
            if (chatRoomCapacity && chatRoomCapacity.capacity > 0) {
                await chatroom.update(
                    { capacity: chatRoomCapacity.capacity - 1 },
                    { where: { id: checkJoinUser.chatroomId } }
                );


            } else {
                return res.status(400).json({ status: 400, message: "Chat room capacity exceeded." });
            }
        } else {
            // If the user is a non-prime member, check their login history and available coins
            let checkNonPrimeUser = await invitechat.findOne({
                where: {
                    userId: userId,
                    status: 'join'
                }
            });

            if (!checkNonPrimeUser) {
                // Check chat room capacity for non-prime user
                let chatRoomCapacity = await chatroom.findOne({ where: { id: checkJoinUser.chatroomId } })
                if (chatRoomCapacity && chatRoomCapacity.capacity > 0) {
                    // Check if the user has sufficient coins
                    let existCoin = parseFloat(userPrimeOrNot.availCoins);
                    if (existCoin >= 150) {
                        await chatroom.update(
                            { capacity: chatRoomCapacity.capacity - 1 },
                            { where: { id: checkJoinUser.chatroomId } }
                        );

                        // Update user's available coins
                        await user.update(
                            { availCoins: existCoin - 150 },
                            { where: { id: userId } }
                        );



                        res.status(200).json({ status: 200, message: 'Successfully joined the chat room.' });
                    } else {
                        return res.status(400).json({ status: 400, message: 'Access denied, your available coins are not sufficient, need 150 coins to join chat' });
                    }
                } else {
                    return res.status(400).json({ status: 400, message: "Chat room capacity exceeded." });
                }
            } else {
                return res.status(400).json({ status: 400, message: 'Access denied, You have to pay 150 Coins to join additional chat room' });
            }
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, error: error.message });
    }
};



// WebSocket endpoint for real-time messages
wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
        try {
            // Parse the JSON message
            const data = JSON.parse(message);

            // Save the message to the database
            const savedMessage = await message.create({
                content: data.content,
                userId: data.userId,
                chatroomId: data.chatRoomId,
            });

            // Broadcast the message to all connected clients
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(savedMessage));
                }
            });

        } catch (error) {
            console.error(error);
        }
    });
});









//send friend reques to other user
exports.send_Friend_request = async (req, res) => {
    try {

        let userId = req.id;
        let { friendUserId } = req.body;

        console.log("userId ===> ", userId);
        // check user is prime or not

        let sendRequest = await friendrequest.create({
            senderRequest: userId,
            receiverRequest: friendUserId

        })

        // Return success response with created chat room data
        return res.json({
            status: 200,
            message: 'Friend request sent Successfully',
            data: sendRequest
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, error: error.message });
    }
};



////send friend reques to other user
exports.accepte_reject_request = async (req, res) => {
    try {

        let userId = req.id;
        let { status, requestId } = req.body;


        console.log("userId ===> ", userId);
        // check user is prime or not

        let statusofreq = await friendrequest.update({
            status: status
        }, { where: { id: requestId } }
        )

        // Return success response with created chat room data
        return res.json({
            status: 200,
            message: `Friend request ${status} Successfully`,

        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: error.message });
    }
};
