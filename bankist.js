'use strict';
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//************************************************
//************************************************
//show the account number in webpage
const displayMovements = function(movements) {
  //remove the text in contanerMovements
  containerMovements.innerHTML = '';
  //.textContent = 0

  //mov>>is current movmement, i>>> index
  movements.forEach(function(mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    //template literal is amazing for call html elements
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__value">${mov}</div>
      </div>
    `;
    //now we have to find a way to add this to html webpage
    //we created the querySelector in top for everywhere we need(containerMovement is one of them)
    //we call insertAdjacentHTML.And this method accepts two strings.The first string is the position in which we want
    // to attach the HTML.
    //that I want to insert the new child element right after the beginning of the parent element.
    //because now we need to specify the second argument and that is the string containing the HTML that we want to insert.
    //why we choose afterbegin not before...because it put the element before each other so the last value is in the top
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//we call it in login
// displayMovements(account1.movements);

//************************************************
//************************************************
//sum the numbers and display it in the current balance

const calcPrintBalance = function(acc) {
  //we have to make a method in object that we can use it later
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  //jqueryselector>>>> we want to display it in div in html with balance class
  labelBalance.textContent = `${acc.balance} EUR`;
};
//we call it in login
// calcPrintBalance(account1.movements);
//************************************************
//************************************************
//In Out Interest
//because every account has a special interest rate so we nood to access to whole of account not just movements
const calcDisplaySummary = function(acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}EUR`;

  const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  //Math.abs >>> for getting rid of this minus sign ...abs=absolute
  labelSumOut.textContent = `${Math.abs(out)}`;

  const interest = acc.movements.filter(mov => mov > 0).map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    }).reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}EUR`;
};
//we call it in login
// calcDisplaySummary(account1.movements);

//************************************************
//************************************************
//make username
// const user = 'Steven Thomas Williams';
// const username1 = user.toLowerCase().split(' ').map(function(name) {
//   return name[0];
// }).join('');
// ///do it with arrow function
// const username2 = user.toLowerCase().split(' ').map(name => name[0]).join('');
// console.log(username2);
//************************************************
//************************************************
const creatUsernames = function(accs) {
  //we use the forEach instead of map because we dont want to creat new array, we want array to mutate
  accs.forEach(function(acc) {
    //here we do something in acc= account object SO wwe dont need return>>>we ar not making a new value to return
    //forEach>>> has a side effect>>means we do some works without returning anything
    acc.username = acc.owner.toLowerCase().split(' ').map(function(name) {
      return name[0];
    }).join('');
  });
};
creatUsernames(accounts);
console.log(accounts);

const updateUI = function(acc) {
   //display movements
  displayMovements(acc.movements);
    //display balance
    calcPrintBalance(acc);
    //display summary
    calcDisplaySummary(acc);
}
//************************************************
//************************************************
//event handler

// because we will need this information about the current account also later in other functions.
//then we need to know from which account that money should actually go>>>so we need the current account
let currentAccount;

btnLogin.addEventListener('click', function(e) {
  //with default when we click the Submit button, is for the page to reload.So we need to stop that from happening. And
  // for that, we need to actually give this function the event parameter, called prevent default,And so as the name says,
  // this will then prevent this form from submitting.
  //prevent form from submitting
  //it is because of "form"
  e.preventDefault();
  //another things about form: hitting enter in this PIN or USER is exactly the same as the user clicking right on arrow button.
  //both of these things will trigger a click event. when we enter them we cee more LOGIN in console So that's why we get then,
  // log in locked to the console.
  console.log('LOGIN');
  //to lock the user actually in,we need to find the account from the accounts array, with the username that the user inputted.
  //And so that's where our find method comes into play again.

  //we compare the value we write in user and the value in owner
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);

  //we also need to convert this to a number, because as I mentioned earlier,this value will always be a string.
  //? >>>>> something called optional chaining, So we can do this, and then this pin property will only be read in case
  // that the current account here actually exists
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //display UI and welcome massage
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;

    //we put the opacity = 0 in the style
    containerApp.style.opacity = 100;

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    //clear pin box from cursor
    inputLoginPin.blur();

    //update UI
    updateUI(currentAccount)
  }
});

//////////////////////////////////////////////////////////////////
//transfer
btnTransfer.addEventListener('click', function(e) {
  //because of form
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  // actually find the account object to which we want to transfer alright and so for that, we once again use defined method.
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  console.log(amount, receiverAcc);

  //clean Transfer money
  inputTransferAmount.value = inputTransferTo.value = "";

  //check the money
  if (amount > 0 &&
    //check receive account exist
    receiverAcc &&
    currentAccount.balance >= amount &&
    //here say if receive account exist and it is not equal with currentAccount username
    receiverAcc?.username !== currentAccount.username) {
    //doing the transfer
    currentAccount.movements.push(-amount)
    receiverAcc.movements.push(amount)

    //update UI
    updateUI(currentAccount)
  }
});

/////////////////////////////////////////////////////////////////////////
//LOAN

btnLoan.addEventListener("click", function(e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value)

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //add movement
    currentAccount.movements.push(amount)

    //Update UI
    updateUI(currentAccount)
  }
  inputLoanAmount.value = ""
})

//////////////////////////////////////////////////////////////////////////
//close account
//with find index method

btnClose.addEventListener("click", function(e) {
  e.preventDefault()

  if (currentAccount.username === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)) {
    //.indexOf(23)
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);

    //delete account
    accounts.splice(index, 1)

    //Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
})

