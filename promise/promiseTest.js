function findAndSaveUser(Users) {
    Users.findOne({})
        .then((user) => {
            user.name = 'zero';
            return user.save();
        })
        .then((user) => {
            return Users.findOne({ gender: 'm'});
        })
        .catch(err => {
            console.error(err);
        })
}

async function findAndSaveUser2(Users) {
    let user = await Users.findOne({});
    user.name = 'zero';
    user = await user.save();
    user = await Users.findOne({ gender: 'm'});
}

function helloWorld() {
    console.log("Hello World");
}

helloWorld();

