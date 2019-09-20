var User = require('./model/user')


    User.deleteMany({}).then(() => {
            console.log("All database entries have been deleted")
    })
 