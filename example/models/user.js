const Sequelize = require('sequelize');
module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            email : {
                type: Sequelize.STRING(45),
                allowNull: false,
                unique: true,
            },
            pw : {
                type: Sequelize.STRING(20),
                allowNull: false,
            },
            name : {
                type: Sequelize.STRING(10),
                allowNull: false,
            },
            age: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
            
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            paranoid: false,
            modelName: 'User',
            tableName: 'users',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        db.User.hasMany(db.Article, { foreignKey: 'writer', sourceKey: 'id' })
    }
}