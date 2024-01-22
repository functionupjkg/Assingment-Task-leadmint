const {
    Sequelize,
    user: userModel,
} = require("../models");
const { comparePassword } = require("../utils/hashPassword");
const jwt = require("jsonwebtoken");
const moment = require("moment");



// =============================== [ Authentication Using JWT ] =============================











//================================== [ Authentication ]================================ 
exports.authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];

        console.log(req.headers)

        if (!token)
            return res
                .status(401)
                .send({ status: false, message: "authentication failed" });

        let decodedtoken = jwt.verify(token, "jk-secret-key");

        if (!decodedtoken)
            return res.status(401).send({ status: false, message: "Invalid token" });

        let userId = decodedtoken.userId;

        let isUserBlocked = await userModel.findOne({
            paranoid: false, // Include soft-deleted records
            where: {
                id: userId,
                destroyTime: { [Sequelize.Op.not]: null } // Corrected condition for soft-deleted records
            },

        });

        if (isUserBlocked) {
            return res.send({ status: 404, logoutStatus: true, message: "Your registration has been temporarily blocked. Please contact our Support Team " })
        }


        let name = decodedtoken.name;

        let userExist = await userModel.findOne({ where: { id: userId } });
        console.log(userExist)

        if (!userExist) {
            return res.send({ status: 404, logoutStatus: true, message: "user not found" });
        }

        if (name) {
            if (userExist.name != name) {
                return res.send({ status: 404, logoutStatus: true, message: "UserName does not exist" })
            }
        }

        req.id = decodedtoken.userId;
        req.password = decodedtoken.password;
        req.decodedToken = decodedtoken;
        req.name = decodedtoken.name;

        next();

    } catch (err) {
        return res
            .status(500)
            .send({ status: false, msg: "Error", error: err.message });
    }
};



