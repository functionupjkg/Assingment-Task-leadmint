// Import necessary modules and models
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { user } = require('../models'); // Update with your actual model paths



// User Registration
exports.userRegistration = async (req, res) => {
    try {
        const {
            name,
            phone,
            password,
            deviceId,
            availCoins
            // Add other registration details here
        } = req.body;



        // Check if the user with the provided name already exists
        const existingUser = await user.findOne({ where: { name } });

        if (existingUser) {
            return res.status(400).json({ status: 400, message: 'User with this name already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await user.create({
            name,
            phone,
            password: hashedPassword,
            deviceId,
            availCoins
            // Add other registration details here
        });

        return res.status(200).json({ status: 200, message: 'User Registration Successfully', data: newUser });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, error: message.error });
    }
};


// User Authentication
exports.userLogin = async (req, res) => {
    try {
        const { name, password } = req.body;

        // Find the user by name
        const userData = await user.findOne({ where: { name } });

        if (!userData) {
            return res.status(401).json({ error: 'Invalid name or password' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, userData.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid name or password' });
        }

        const token = jwt.sign(
            {
                userId: userData.id,
                name: userData.name,
            },
            "jk-secret-key",
            { expiresIn: '1h' }
        );

        return res.send({
            status: 200,
            otpStatus: true,
            message: "User login successfully",
            data: token,
            user: userData.id,
            name: userData.name
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: message.error });
    }
}


//user View each other profile
exports.viewUserProfile = async (req, res) => {
    try {
        const userId = req.params.userId
        console.log("userId ===> ", userId);


        let userData = await user.findOne({ where: { id: userId } })
        if (!userData) {
            return res.send({ status: 404, message: 'User not found' });
        }

        return res.send({
            status: 200,
            message: 'User Profile data fetched successfully',
            data: userData
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, error: message.error });
    }
};

