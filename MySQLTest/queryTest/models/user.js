const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            /*
            id : 시퀄라이즈 모델이 자동으로 생성
                 추가로 AUTO_INCREMENT도 지원
            */
            name : {
                type: Sequelize.STRING(20),  // VARCHAR(20)
                allowNull: false,  // NOT NULL
                unique: true,  // UNIQUE INDEX
            },
            age: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
            },
            married: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            comment: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        }, {
            sequelize,
            timestamps: false,  // createdAt, updatedAt 컬럼 자동 생성
            underscored: false,  // 컬럼 자동생성시 _ 추가 (created_at)
            paranoid: false,  //  deletedAt 자동 생성
            modelName: 'User',  // 모델명 - 단수
            tableName: 'users',  // 테이블명 - 복수
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id' });
    }
};