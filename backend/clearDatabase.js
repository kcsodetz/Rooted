var User = require('./model/user')
var Tree = require('./model/tree')

Tree.deleteMany({}).then(() => {
    User.deleteMany({}).then(() => {
        console.log("All database entries have been deleted")
    })
})
