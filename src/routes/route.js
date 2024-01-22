const express = require("express");

const {
    userRegistration,
    userLogin,
    viewUserProfile,

} = require("../controller/userController");

const {
    createChatRoom,
    invitePMChatRoom,
    joinChatRoom,
    joinChatNonPrimeMember,

} = require("../controller/chatroomController");

const { authentication } = require("../middleware/auth");


const router = express.Router();


//user routes
router.route("/create").post(userRegistration);
router.route("/login").post(userLogin);
router.route("/api/profile/:userId").get(viewUserProfile);


//chatroom routes
router.route("/chatrooms").post(authentication, createChatRoom);
router.route("/invite").post(authentication, invitePMChatRoom);
router.route("/joinchat").post(joinChatRoom);
router.route("/joinroom").post(joinChatNonPrimeMember);





module.exports = router;