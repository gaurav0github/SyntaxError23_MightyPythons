var firebaseConfig = {
    apiKey: "AIzaSyBvpuJesDIlM0PyOdhaAa9bfuxno8CE-2o",
    authDomain: "login-system-14ee6.firebaseapp.com",
    databaseURL: "https://login-system-14ee6-default-rtdb.firebaseio.com",
    projectId: "login-system-14ee6",
    storageBucket: "login-system-14ee6.appspot.com",
    messagingSenderId: "567277027772",
    appId: "1:567277027772:web:11735316e5cc285c2aabb9"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // Initialize variables
  const auth = firebase.auth()
  const database = firebase.database()
  
  // document.getElementById("loginForm").addEventListener("submit",(event)=>{
  //   event.preventDefault()
  // })

  // firebase.auth().onAuthStateChanged((user)=>{
  //   if(user){
  //       location.replace("/main")
  //   }
  // })

  firebase.auth().onAuthStateChanged((user)=>{
    if(!user){
        location.replace("/main")
    }else{
        document.getElementById("user").innerHTML = +user.email
    }
  })

  function logout(){
    firebase.auth().signOut()
  }

  // Set up our register function
  function register() {
    // Get all our input fields
    email = document.getElementById('email').value
    password = document.getElementById('password').value
    full_name = document.getElementById('full_name').value
    phone = document.getElementById('phone').value
    pan = document.getElementById('pan').value

    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
      alert('Enter a Valid Email or Password')
      return
      // Don't continue running the code
    }
    if (validate_field(full_name) == false || validate_field(phone) == false || validate_field(pan) == false) {
      alert('Fill the Required Details')
      return
    }
   
    // Move on with Auth
    auth.createUserWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      var user = auth.currentUser
  
      // Add this user to Firebase Database
      var database_ref = database.ref()
  
      // Create User data
      var user_data = {
        email : email,
        full_name : full_name,
        phone : phone,
        pan : pan,
        last_login : Date.now()
      }
  
      // Push to Firebase Database
      database_ref.child('users/' + user.uid).set(user_data)
  
      // DOne
      alert('Registered Successfully!')
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code
      var error_message = error.message
  
      alert(error_message)
    })
  }
  
  // Set up our login function
  function login () {
    // Get all our input fields
    email = document.getElementById('email').value
    password = document.getElementById('password').value
  
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
      alert('Enter a Valid Email or Password')
      return
      // Don't continue running the code
    }
    auth.signInWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      var user = auth.currentUser
  
      // Add this user to Firebase Database
      var database_ref = database.ref()
  
      // Create User data
      var user_data = {
        last_login : Date.now()
      }
  
      // Push to Firebase Database
      database_ref.child('users/' + user.uid).update(user_data)
  
      // DOne
      alert('Logged in Successfully!')
  
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code
      var error_message = error.message
  
      alert(error_message)
    })
  }
  
  
  
  
  // Validate Functions
  function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/
    if (expression.test(email) == true) {
      // Email is good
      return true
    } else {
      // Email is not good
      return false
    }
  }
  
  function validate_password(password) {
    // Firebase only accepts lengths greater than 6
    if (password < 6) {
      return false
    } else {
      return true
    }
  }
  
  function validate_field(field) {
    if (field == null) {
      return false
    }
  
    if (field.length <= 0) {
      return false
    } else {
      return true
    }
  }

function forgotPass(){
    const email = document.getElementById("email").value
    if (validate_email(email) == false) {
        alert('Enter the Email ID')
        return
        // Don't continue running the code
      }
    auth.sendPasswordResetEmail(email)
    .then(() => {
        alert("Reset Link Sent to your Email!")
    })
    .catch((error) => {
        document.getElementById("error").innerHTML = error.message
    });
}

function logout(){
    firebase.auth().signOut()
}

document.getElementById("loginForm").addEventListener("submit",(event)=>{
  event.preventDefault()
})

firebase.auth().onAuthStateChanged((user)=>{
  if(user){
     user.window.location.assign("/main")
  }
})

firebase.auth().onAuthStateChanged((user)=>{
  if(!user){
      user.window.location.assign("/login")
  }else{
      document.getElementById("user").innerHTML = user.email
  }
})
