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
        ChatRoom.belongsToMany(models.user, {
            through: 'userchatroom'
        });
    }
    ChatRoom.associate = (models) => {
        ChatRoom.hasMany(models.invitechat, {
            foreignKey: {
                allowNull: false,
            },
        });

        ChatRoom.hasMany(models.message, {
            foreignKey: {
                allowNull: false,
            },
        });


    };

    return ChatRoom;
};
