module.exports = (sequelize, DataTypes) => {
    const ChatRoom = sequelize.define("chatroom", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        roomName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 6,
        },
        isPrimeOnly: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

    },
        {
            paranoid: true,

            // If you want to give a custom name to the deletedAt column
            deletedAt: "destroyTime",
        },
    );


    ChatRoom.associate = (models) => {

        ChatRoom.belongsTo(models.chatroom, {
            foreignKey: {
                allowNull: false,
            },
        });
    }
    ChatRoom.associate = (models) => {
        ChatRoom.hasMany(models.friendrequest, {
            foreignKey: {
                allowNull: false,
            },
        });
    };

    return ChatRoom;
};
