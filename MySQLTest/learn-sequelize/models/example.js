const { User } = require('../models');

// INSERT INTO nodejs.users (name, age, married, comment)
// VALUES ('Mike Kong', 25, 0, '공명규입니다.');
User.create({
    name: 'Mike Kong',
    age: 25,
    married: false,
    comment: '공명규입니다.',
});

// SELECT * FROM nodejs.users;
User.findAll({});

// SELECT * FROM nodejs.users LIMIT 1;
User.findOne({});

// SELECT name, married FROM nodejs.users;
User.findAll({
    attributes: ['name', 'married'],
})

// SELECT name, age FROM nodejs.users 
// WHERE married = 1 AND age > 30;
const { Op } = require('sequelize');
const db = require('../models');
User.findAll({
    attributes: ['name', 'age'],
    where: { // 자동으로 AND 연산
        married: true,
        age: { [Op.gt]: 30 }
    }
})

// SELECT name, age FROM nodejs.users 
// WHERE married = 1 OR age > 30;
User.findAll({
    attributes: ['name', 'age'],
    where: {
        [Op.or] : [{ married: true }, { age: { [Op.gt]: 30 } }],
    },
});

// SELECT id, name FROM users ORDER BY age DESC;
User.findAll({
    attributes: ['id', 'name'],
    order: [['age', 'DESC']],
});

// SELECT id, name FROM users ORDER BY age DESC LIMIT 1;
User.findAll({
    attributes: ['id', 'name'],
    order: [['age', 'DESC']],
    limit: 1,
});

// SELECT id, name FROM users 
// ORDER BY age DESC LIMIT 1 OFFSET 1;
User.findAll({
    attributes: ['id', 'name'],
    order: [['age', 'DESC']],
    limit : 1,
    offset: 1,
});

// UPDATE nodejs.users 
// SET comment = '바꿀내용' WHERE id = 2;
User.update({  // 인수가 두 개
    comment: '바꿀 내용',
}, {
    where: { id:2 },
});

// DELETE FROM nodejs.users WHERE id = 2;
User.destroy({
    where: { id:2 },
});

///////////////////////////////////////////

const user1 = await User.findOne({});
console.log(user.nick);

const user2 = await User.findOne({
    include: [{
        model: Comment,
    }]
});
console.log(user.Comments);

const user2_2 = await User.findOne({});
const comments_2 = await user2_2.getComments();
console.log(comments_2);

// 관계 설정시 as로 등록 가능
db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id', as: 'Answer'});

// 쿼리 수행
const user2_3 = await User.findOne({});
const comments_3 = await user2_3.getAnswer();
console.log(comments_3);


