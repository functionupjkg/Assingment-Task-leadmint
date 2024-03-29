module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define("message", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

    },
        {
            paranoid: true,

            // If you want to give a custom name to the deletedAt column
            deletedAt: "destroyTime",
        },
    );

    Message.associate = (models) => {

        Message.belongsTo(models.user, {
            foreignKey: {
                allowNull: false,
            },
        });

        Message.belongsTo(models.chatroom, {
            foreignKey: {
                allowNull: false,
            },
        });

    };



    return Message;
};
