clear

# user tests
echo USER TESTS
echo ------------------------------------------------------------------------

mocha test/user/test_register.js --exit
mocha test/user/test_login.js --exit
mocha test/user/test_change_email.js --exit
mocha test/user/test_forgot_password.js --exit

sleep 2

# tree tests
echo TREE TESTS
echo ------------------------------------------------------------------------

mocha test/tree/test_create_tree.js --exit
mocha test/tree/test_delete_tree.js --exit
mocha test/tree/test_edit_tree.js --exit
mocha test/tree/test_toggle_privacy.js --exit
mocha test/tree/test_ban_unban.js --exit
mocha test/tree/test_invite_user.js --exit
mocha test/tree/test_search.js --exit

