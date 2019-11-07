clear

# user tests
echo USER TESTS
echo ------------------------------------------------------------------------

mocha test/user/test_register.js --exit
mocha test/user/test_login.js --exit
mocha test/user/test_change_email.js --exit
mocha test/user/test_forgot_password.js --exit

sleep 2
