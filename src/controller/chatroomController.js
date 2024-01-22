
// Import necessary modules and models
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { chatroom, friendrequest, user } = require('../models'); // Update with your actual model paths



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
        return res.status(500).json({ status: 500, error: message.error });
    }
};





/// Invite other people to join a chat room with userId and password
exports.invitePMChatRoom = async (req, res) => {
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
        let sendRequest = await friendrequest.create({ chatroomId: chatRoomId, password: password, userId: inviteuserId });

        // Return success response with invite to join the chat room
        return res.status(200).json({
            status: 200,
            message: 'Invite sent successfully to join the chat room',
            data: sendRequest,
            inviteData: { chatRoomId, password }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, error: message.error });
    }
};



// Invite other people to join a chat room with userId and password

exports.joinChatRoom = async (req, res) => {
    try {
        let data = req.body;
        let { chatroomId, password } = data;

        // Find the chat room by userId
        const checkJoinUser = await friendrequest.findOne({
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
                //update friendRequests
                await friendrequest.update(
                    { status: "accepted" },
                    { where: { userId: userId, chatroomId: checkJoinUser.chatroomId } }
                );
            } else {
                return res.status(400).json({ status: 400, message: "Chat room capacity exceeded." });
            }
        } else {
            // If the user is a non-prime member, check their login history
            let checkNonPrimeUser = await friendrequest.findOne({
                where: {
                    userId: userId,
                    status: 'accepted'
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
                    //update friendRequests
                    await friendrequest.update(
                        { status: "accepted" },
                        { where: { userId: userId, chatroomId: checkJoinUser.chatroomId } }
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
        const checkJoinUser = await friendrequest.findOne({
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

                //update friendRequests
                await friendrequest.update(
                    { status: "accepted" },
                    { where: { userId: userId, chatroomId: checkJoinUser.chatroomId } }
                );
            } else {
                return res.status(400).json({ status: 400, message: "Chat room capacity exceeded." });
            }
        } else {
            // If the user is a non-prime member, check their login history and available coins
            let checkNonPrimeUser = await friendrequest.findOne({
                where: {
                    userId: userId,
                    status: 'accepted'
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

                        //update friendRequests
                        await friendrequest.update(
                            { status: "accepted" },
                            { where: { userId: userId, chatroomId: checkJoinUser.chatroomId } }
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



