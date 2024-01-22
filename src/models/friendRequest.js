module.exports = (sequelize, DataTypes) => {
    const FriendRequest = sequelize.define("friendrequest", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        status: {
            type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
            defaultValue: 'pending',
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

    FriendRequest.associate = (models) => {


        FriendRequest.belongsTo(models.chatroom, {
            foreignKey: {
                allowNull: false,
            },
        });
        FriendRequest.belongsTo(models.user, {
            foreignKey: {
                allowNull: false,
            },
        });


    };


    return FriendRequest;
};
