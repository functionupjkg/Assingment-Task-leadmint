module.exports = (sequelize, DataTypes) => {
    const InviteChat = sequelize.define("invitechat", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'join',
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
        {
            paranoid: true,

            // If you want to give a custom name to the deletedAt column
            deletedAt: "destroyTime",
        },
    );

    InviteChat.associate = (models) => {


        InviteChat.belongsTo(models.chatroom, {
            foreignKey: {
                allowNull: false,
            },
        });
        InviteChat.belongsTo(models.user, {
            foreignKey: {
                allowNull: false,
            },
        });


    };


    return InviteChat;
};
