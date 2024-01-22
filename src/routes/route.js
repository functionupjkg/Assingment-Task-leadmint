const express = require("express");

const {
    userRegistration,
    userLogin,
    viewUserProfile,

} = require("../controller/userController");

const {
    createChatRoom,
    inviteMemberChatRoom,
    joinChatRoom,
    joinChatNonPrimeMember,
    send_Friend_request,
    accepte_reject_request

} = require("../controller/chatroomController");

const { authentication } = require("../middleware/auth");


const router = express.Router();


//user routes
router.route("/create").post(userRegistration);
router.route("/login").post(userLogin);
router.route("/profile/:userId").get(viewUserProfile);


//chatroom routes
router.route("/chatrooms").post(authentication, createChatRoom);
router.route("/invite").post(authentication, inviteMemberChatRoom);
router.route("/joinchat").post(joinChatRoom);
router.route("/joinroom").post(joinChatNonPrimeMember);


router.route("/friend-requests").post(authentication, send_Friend_request);
router.route("/accept_rej_req").post(authentication, accepte_reject_request);






module.exports = router;