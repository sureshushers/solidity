App = {
    // To avoid double rendering, use the following attribule

    loading: false,
    //Step 1
    contracts:{},

    load: async()=>{
        
        //Step:3
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()

    },
    // Step:4
    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
          App.web3Provider = web3.currentProvider
          web3 = new Web3(web3.currentProvider)
        } else {
          window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
          window.web3 = new Web3(ethereum)
          try {
            // Request account access if needed
            await ethereum.enable()
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */})
          } catch (error) {
            // User denied account access...
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          App.web3Provider = web3.currentProvider
          window.web3 = new Web3(web3.currentProvider)
          // Acccounts always exposed
          web3.eth.sendTransaction({/* ... */})
        }
        // Non-dapp browsers...
        else {
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      },
      //Step 5: Getting the account information of the Ganache user contract
    loadAccount: async()=>{
          App.account = web3.eth.accounts[0]
          //console.log(App.account)
      },
      // Step 6: Loading the contract from the block chain
    loadContract: async()=>{
        const usercontract = await $.getJSON('UsersContract.json')
        //console.log(users)
        // Before these function's create an empty object called contracts
        // inside App to store the truffle contract inside it
        // And use truffle binded methods to interact with the contract.
        //Step: 8 Binding the contract with the truffle contract

        App.contracts.UserList = TruffleContract(usercontract);
        App.contracts.UserList.setProvider(App.web3Provider)
        //console.log('App Contract Object:'+App.contracts)
        //Step 9: Storing the smart contract wiht values from blockchain
        App.users = await App.contracts.UserList.deployed()
        //console.log(App.users)
      },

      // Step: 10 Render the app with 
      // 1) account
    render: async()=>{

        // Prevent double render
        if (App.loading){
            return
        }

        App.setLoading(true)
        //REnder account
        $('#account').html(App.account)

        //Render the users

        await App.renderUsers()

        App.setLoading(false)    
      },
      
      //Steps:11
      renderUsers: async () => {
            //Load the total user count from the blockchain
            //Getting the user count

            const userCount = await App.users.getUserCount()
            const $userTemplate = $('.userListTemplate')

            for(var i=1;i<=userCount;i++){
                const user = await App.users.users(i)
                const $newUserTemplate = $userTemplate.clone()
                $newUserTemplate.find('.firstname').html(user[0])
                $newUserTemplate.find('.lastname').html(user[1])
                $newUserTemplate.find('.userid').html(user[2])
                $newUserTemplate.find('.password').html(user[3])
                $newUserTemplate.find('.address').html(user[4])
                

            $('#userList').append($newUserTemplate)
           
            //Show the user
            $newUserTemplate.show()
            }

      },

      createUser: async () => {
            App.setLoading(true)
            const firstName = $('#ifirstname').val()
            const lastName = $('#ilastname').val()
            const username = $('#iusername').val()
            const password = $('#ipassword').val()
            console.log(firstName, lastName, username, password)
            await App.users.createUser(firstName, lastName, username, password)
            window.location.reload()

      },

      openUser: async () => {
        console.log()
      },

    setLoading:(boolean)=>{
         App.loading = boolean
         const loader = $('#loader')
         const content = $('#content')
         if(boolean){
             loader.show()
             content.hide()
         }else{
             loader.hide()
             content.show()
         }

    } 
}   

//Step 2
$(()=>{
    $(window).load(()=>{
        App.load();
    })
})