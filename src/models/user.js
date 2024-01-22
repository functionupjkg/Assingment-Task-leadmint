module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        deviceId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        availCoins: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        isPrimeMember: {
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


    User.associate = (models) => {

        User.hasMany(models.chatroom, {
            foreignKey: {
                allowNull: false,
            },
        });
        User.hasMany(models.invitechat, {
            foreignKey: {
                allowNull: false,
            },
        });

        User.hasMany(models.friendrequest, {
            foreignKey: {
                allowNull: false,
                name: 'senderRequest',
            },
        });
        User.hasMany(models.friendrequest, {
            foreignKey: {
                allowNull: false,
                name: 'receiverRequest',
            },
        });
        User.hasMany(models.message, {
            foreignKey: {
                allowNull: false,
            },
        });
        User.belongsToMany(models.chatroom, {
            through: 'userchatroom'
        });
    };


    return User;
};
