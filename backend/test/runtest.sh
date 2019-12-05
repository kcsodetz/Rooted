clear

# user tests
echo USER TESTS
echo ------------------------------------------------------------------------

mocha test/user/test_register.js --exit
mocha test/user/test_login.js --exit
mocha test/user/test_change_email.js --exit
mocha test/user/test_forgot_password.js --exit
mocha test/user/test_join_from_invite.js --exit
mocha test/user/test_decline_from_invite.js --exit
mocha test/user/test_sitewide_ban_unban.js --exit

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
mocha test/tree/test_add_and_remove_admin.js --exit
mocha test/tree/test_search.js --exit
mocha test/tree/test_upload_and_remove_photo.js --exit
mocha test/tree/test_add_and_remove_annoucements.js --exit
mocha test/tree/test_anonymous_messages.js --exit
mocha test/tree/test_approve_and_reject_annoucements.js --exit
mocha test/tree/test_change_color_scheme.js --exit
mocha test/tree/test_kick_user.js --exit

