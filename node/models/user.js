class User{
  constructor(username, password, email, isAdmin){
    this.username = username;
    this.password = password;
    this.email = email;
    this.isAdmin = isAdmin;
  }

  addUser(username, password, email, isAdmin){
    usersArray.push(username, password, email, isAdmin);
    }

  removeUser(username){
    usersArray = usersArray.filter(user => user.username !== username)
  }

  updateUser(username, updatedData){
    let user = users.find(user => user,username === username);
    if(user){
      Object.assign(user,updatedData); //change any data: users.updateUser('user1', { email: 'newEmail@123.com' });
    }
  }
}
const usersArray = []; 

User.addUser('newUser', 'newPassword', 'newuser@123.com', false);
User.addUser('newUser2', 'newPassword', 'newuser@123.com', false);
console.log(usersArray);
User.removeUser(newUser);
console.log(users);
User.updateUser('newUser2', {email: 'newEmail@123,com'})
console.log(usersArray);

module.exports = User;