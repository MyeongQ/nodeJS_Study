const Sequelize = require('sequelize');

module.exports = class Article extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            // id: 자동 생성
            title : {
                type: Sequelize.STRING(45),
                allowNull: false,
            },
            text : {
                type: Sequelize.STRING(500),
                allowNull: false,
            }
            
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            paranoid: false,
            modelName: 'Article',
            tableName: 'articles',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        db.Article.belongsTo(db.User, {foreignKey: 'writer', targetKey: 'id'});
    }
}