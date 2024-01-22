module.exports = (sequelize, DataTypes) => {
    const UserChatRoom = sequelize.define(
        "userchatroom",
        {},

        { timestamps: false }
    );



    return UserChatRoom;
};
