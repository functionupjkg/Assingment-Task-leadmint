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

    },
        {
            paranoid: true,

            // If you want to give a custom name to the deletedAt column
            deletedAt: "destroyTime",
        },
    );

    FriendRequest.associate = (models) => {



        FriendRequest.belongsTo(models.user, {
            foreignKey: {
                allowNull: false,
                name: 'senderRequest',

            },
        });

        FriendRequest.belongsTo(models.user, {
            foreignKey: {
                allowNull: false,
                name: 'receiverRequest',

            },
        });


    };


    return FriendRequest;
};
