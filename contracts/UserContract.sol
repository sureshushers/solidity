pragma solidity ^0.5.0;

contract UsersContract{
    struct UserInfo{
        string firstName;
        string lastName;
        string userName;
        string password;
        address userid;
        
    }
    
    
    mapping (uint=>UserInfo) public users;
    
    uint userCount=0;

    event UserCreated(
        string firstName, 
        string lastName,
        string username,
        string password,
        address userid
    );
    
    function createUser(string memory _firstName, string memory  _lastName, string memory _userName, string memory _password) public {
        // Retrieving the userInfo based on the address that we need to insert
        userCount++;
        users[userCount] = UserInfo(_firstName, _lastName, _userName, _password, msg.sender);
        emit UserCreated(_firstName, _lastName, _userName, _password, msg.sender);
    }
    
    function getUserCount() public view returns(uint ){
        return userCount;
    }

}