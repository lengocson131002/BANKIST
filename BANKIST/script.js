'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2021-08-17T12:01:20.894Z',
  ],
  pin: 1111,
  locale: 'en-US',
  currency: 'USD',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2021-08-13T10:51:36.790Z',
  ],
  pin: 2222,
  locale: 'pt-PT',
  currency: 'EUR',
};

// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

const accounts = [account1, account2];

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
const btnLogOut = document.querySelector('.log-out');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const announcement = document.querySelector('.announcement-box');
const close_announcement = document.querySelector('.close-announcement');
const fieldLogin = document.querySelector('.login');
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
//SUPPORT FUNCTIONS

const calcDayPassed = ((date1, date2) => Math.trunc(Math.abs((date2 - date1)) / (1000 * 60 * 60 * 24)));

const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
}

const formatMovementDate = function (date, locale) {
  const daysPassed = calcDayPassed(new Date(), date);
  if (daysPassed === 0) return `Today`;
  if (daysPassed === 1) return `Yesterday`;
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(locale).format(date);
}

const convertDateToString = function (time) {
  const day = `${time.getDate()}`.padStart(2, '0');
  const month = `${time.getMonth() + 1}`.padStart(2, '0');
  const year = time.getFullYear();
  const hour = `${time.getHours()}`.padStart(2, '0');
  const minute = `${time.getMinutes()}`.padStart(2, '0');
  return `${day}/${month}/${year} ${hour}:${minute}`;
}

const displayMovements = function (account, sorted = false) {
  containerMovements.innerHTML = '';
  // .textContent =  0;
  const movs = sorted ? account.movements.slice().sort((a, b) => a - b) : account.movements;
  movs.forEach(function (movement, index) {
    const movementType = movement > 0 ? `deposit` : `withdrawal`;
    const time = new Date(account.movementsDates[index]);
    const displayedDate = formatMovementDate(time, account.locale);
    const formattedMovement = formatCurrency(movement, account.locale, account.currency);
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${movementType}">${index + 1} ${movementType}</div>
      <div class="movements__date">${displayedDate}</div>
      <div class="movements__value">${formattedMovement}</div>
   </div>
   `;
    // containerMovements.innerHTML(html);
    containerMovements.insertAdjacentHTML('beforeend', html);
  });
  [...document.querySelectorAll('.movements__row')].forEach(function (row, index) {
    if (index % 2 === 0) {
      row.style.backgroundColor = '#ffec99';
    }
  });
}

//CREATE USERNAME

//Create Convention to set Username
const createUsername = function (acc) {
  return acc
    .split(' ')
    .map(word => word.slice(0, 1))
    .join('')
    .toLowerCase();
}
const createUsernames = function (accs) {
  accs.forEach(acc => {
    acc.username = createUsername(acc.owner);
  })
}

createUsernames(accounts);
// console.log(accounts);

//CALC AND PRINT BALANCE
const calcAndDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, curr) => acc + curr, 0);
  const formattedBallance = formatCurrency(account.balance, account.locale, account.currency);
  // console.log(typeof formattedBallance);
  labelBalance.textContent = `${formattedBallance}`;
}


//CALC AND PRINT SUMMARY
const calcAndDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${formatCurrency(incomes, account.locale, account.currency)}`;
  const outcomes = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${formatCurrency(Math.abs(outcomes), account.locale, account.currency)}`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * account.interestRate / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0)
  labelSumInterest.textContent = `${formatCurrency(interest, account.locale, account.currency)}`;
}

//UPDATE UI
const updateUI = function (currentAccount) {
  //diplay movements
  displayMovements(currentAccount, false);
  //display balance
  calcAndDisplayBalance(currentAccount);

  //display summary
  calcAndDisplaySummary(currentAccount);
}

//HIDE UI

const hideUI = function () {
  containerApp.classList.add('hidden');
  fieldLogin.classList.remove('hidden');
  btnLogOut.classList.add('hidden');
  labelWelcome.textContent = `Log in to get started`;
}
//Remove announcement :
close_announcement.addEventListener('click', function () {
  announcement.classList.add('hidden');
})

///////////////////////////////////////////////////////////
//ENVENT HANDLER

//LOGIN

// let minuteTimer = 5;
// let secondTimer = 59;
const startLogOutTimer = function (minute, second) {
  //5 mintutes  
  let time = 60;
  const tick = function () {
    if (time === 0) {
      clearInterval(timer);
      hideUI();
    }
    const minute = `${Math.trunc(time / 60)}`.padStart(2, '0');
    const sec = `${time % 60}`.padStart(2, '0');
    labelTimer.textContent = `${minute} : ${sec}`;
    time--
  }
  //call everysecond.
  //in each seconds, print the remaining time
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
  // 0 sec -> decrease the minute
  // 0 minute -> Hide ui
}

let currentAccount, timer;

btnLogin.addEventListener('click', function (event) {
  event.preventDefault();
  //Remove the previous timer
  if (timer) {
    clearInterval(timer);
  }
  timer = startLogOutTimer();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value.trim());

  if (currentAccount?.pin === Number(inputLoginPin.value)) {

    containerApp.classList.remove('hidden');
    //display UI and Message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]} `;

    updateUI(currentAccount);

    //clear input field
    fieldLogin.classList.add('hidden');
    inputLoginUsername.value = inputLoginPin.value = '';
    btnLogOut.classList.remove('hidden');

    //update Date
    const now = new Date();

    const locale = navigator.language;
    console.log(locale);
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      weekday: 'long'
    }
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);
  } else {
    announcement.classList.remove('hidden');
  }
})

//LOG OUT

btnLogOut.addEventListener('click', hideUI);

//TRANSFER 
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiver = accounts.find(acc => acc.username === inputTransferTo.value);

  // CHECK
  if (amount > 0
    && amount <= currentAccount.balance
    && receiver
    && receiver.username !== currentAccount.username) {
    //Doing the transfer
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiver.movements.push(amount);
    receiver.movementsDates.push(new Date().toISOString());

    //Update UI
    updateUI(currentAccount);

    //Clear inputfield
    inputTransferAmount.value = '';
    inputTransferTo.value = '';

    //reset the timer
    clearInterval(timer);
    timer = startLogOutTimer();
  };
})

//CLOSE ACCOUNT
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {

    //clear input fields
    inputCloseUsername.value = inputClosePin.value = '';
    hideUI();
    //Delete account
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    accounts.splice(index, 1);
    document.querySelector('.header').scrollIntoView({ behavior: 'smooth' });
  } else {
    announcement.classList.remove('hidden');
  }
})

//LOAN 
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  if (loanAmount > 0 && currentAccount.movements.some(mov => mov >= (0.1 * loanAmount))) {
    setTimeout(function () {
      currentAccount.movements.push(loanAmount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      inputLoanAmount.value = '';
      //reset the timer 
      clearInterval(timer);
      timer = startLogOutTimer();

    }, 2000);


  }
})

//SORT
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});



//FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.classList.remove('hidden');


//Experimenting API ()

//SORT ARRAY 

//SORT string
// const owners = ['a;', 's', 'e', 't'];
// console.log(owners.sort());
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// movements.sort((a, b) => a - b)

// console.log(movements);
// console.log(containerMovements.innerHTML);

/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${ i + 1 }: You deposited ${ movement } `);
  } else {
    console.log(`Movement ${ i + 1 }: You withdrew ${ Math.abs(movement) } `);
  }
}
console.log('------------ FOREACH --------------')

movements.forEach(function (movement, index, array) {
  if (movement > 0) {
    console.log(`Movement ${ index + 1 }: You deposited ${ movement } `);
  } else {
    console.log(`Movement ${ index + 1 }: You withdrew ${ Math.abs(movement) } `);
  }
});
*/

// 0: function(200)
// 1: function(450)


/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];


// //SLICE 
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -2));
// console.log(arr.slice());
// console.log(...arr);

// //SPLICE --> mutate the array
// console.log(arr.splice(2));
// arr.splice(-1);
// console.log(arr);

// //REVERSE
// arr = ['a', 'b', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g'];
// console.log(arr2.reverse());


// //CONCAT 
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log(...arr, ...arr2);

// //JOIN 

// console.log(letters.join('-'));
// console.log(letters.entries().next());


//CODING CHALLENGE 1
// let dogsJulia = [3, 5, 2, 12, 7];
// let dogsKate = [4, 1, 15, 8, 3];
// const checkDog = function (dogsJulia, dogsKate) {
//   //Practice 1
//   const dogsJuliaCopy = dogsJulia.slice(1, -2);
//   console.log(dogsJuliaCopy);
//   const bothDogs = dogsJuliaCopy.concat(dogsKate);
//   bothDogs.forEach(function (dog, index) {
//     const state = dog >= 3 ? 'an adult' : 'still a puppy';
//     console.log(`Dog number ${ index + 1 } is ${ state } `);
//   })
// }

// checkDog(dogsJulia, dogsKate);


// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const eurToUSD = 1.18;
// const movementsUSD = movements.map(mov => mov * eurToUSD);
// console.log(movements);
// console.log(movementsUSD);

// const movementsDescrib = movements.map((movement, index) =>
//   `Movement ${ index + 1 }: You ${ movement > 0 ? `deposited` : `withdrew` } ${ Math.abs(movement) } `);
// console.log(movementsDescrib);


//FILTER

// const deposits = movements.filter(mov => mov > 0);
// const withdraws = movements.filter(mov => mov < 0);
// console.log(movements)
// console.log(deposits);
// console.log(withdraws);

//REDUCE
// console.log(movements);

// //accumulator : --> SNOWBALL
// const balance = movements.reduce(function (acc, curr, i, arr) {
//   console.log(`Iterator ${ 1 }: ${ acc } `);
//   return acc + curr;
// }, 0)

// // const balance1 = movements.reduce(((acc, curr) => acc + curr), 10);
// // console.log(balance1);

// console.log(balance);

// //MAXIMUM VALUE:
// const max = movements.reduce((acc, curr) => {
//   return acc > Math.abs(curr) ? acc : Math.abs(curr);
// }, movements[0]);
// console.log(max);

//CODING CHALLENGE 
// let dogsJulia = [3, 5, 2, 12, 7];
// const calcAverageHumanAge = function (dogAges) {
//   return dogAges.map(dogAge => {
//     return dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4;
//   })
// }
// const filterDogAge = function (dogAges) {
//   const humanAge = calcAverageHumanAge(dogAges);
//   return dogAges.filter((element, index) => (element + 18) >= humanAge[index]);
// }

// const averageOfAdultDogs = function (dogAges) {
//   const adultDogs = dogAges.filter(dogAge => dogAge >= 3);
//   return adultDogs.reduce((avg, dogAge) => avg + dogAge, 0) / adultDogs.length;
// }


// console.log(averageOfAdultDogs(dogsJulia));
// console.log(filterDogAge(dogsJulia));

// console.log(calcAverageHumanAge(dogsJulia));

//CHAINING METHODS

// const eurToUSD = 1.18;
// const totalDepositeInmovementsToUSD = movements.filter(mov => mov > 0).map(mov => mov * eurToUSD).reduce((total, mov) =>
//   total + mov, 0
// )
// console.log(totalDepositeInmovementsToUSD);



// const anyDeposit = movements.every(mov => mov > -1000);
// console.log(anyDeposit);

// //separate callback
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

//FLAT and FLATMAP

// const arr = [[1, 2, 3], [4, [5, 6]], 7, 8];

// console.log(arr.flat(2));
// // const accountMovements = accounts.map(acc => acc.movements);
// // const allMovements = accountMovements.flat();
// // const overalBalance = allMovements.reduce((acc, mov) => acc + mov, 0);

// // const overalBalance = accounts
// //   .map(acc => acc.movements)
// //   .flat()
// //   .reduce((acc, mov) => acc + mov);

// const overalBalance = accounts.flatMap(acc => acc.movements).reduce((acc, mov) => acc + mov);
// console.log(overalBalance);


//CREATING AND FILLING AN ARRAY
// const arr = [1, 2, 3, 4, 5, 6];
// arr.fill(23, 4, 5);
// const newArray = new Array(7);
// newArray.fill(1, 3, 5);
// console.log(arr);

// //ARRAY.from

// const y = Array.from({ length: 7 }, () => 1);
// console.log(y)

// const z = Array.from({ length: 7 }, (cur, i) => i + 1);
// console.log(z)


// labelBalance.addEventListener('click', function () {
//   const movementUI = Array.from(document.querySelectorAll('.movements__value'), (el => Number(el.textContent.replace('€', ''))));
//   console.log(movementUI);
// })

//CODING CHALLENGE 4 

// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];

// dogs.forEach(dog => {
//   dog.recommendedFood = (dog.weight ** 0.75 * 28).toFixed(2);
// })
// console.log(dogs);
// // console.log(3.513.toFixed(2));

// const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));

// const checkProportion = function (dog) {
//   if (dog.curFood < 1.1 * dog.recommendedFood) {
//     console.log('LOW');
//   } else if (dog.curFood > 0.9 * dog.recommendedFood) {
//     console.log('HIGH')
//   } else {
//     console.log('NICE');
//   }
// }
// console.log(sarahDog);
// checkProportion(sarahDog)


// //EAT TOO MUCH

// const ownersEatTooMuch = dogs
//   .filter(dog => dog.curFood > 1.1 * dog.recommendedFood)
//   .map(dog => dog.owners)
//   .flat();
// console.log(ownersEatTooMuch);
// const ownersEatTooLittle = dogs
//   .filter(dog => dog.curFood < 0.9 * dog.recommendedFood)
//   .map(dog => dog.owners)
//   .flat();
// console.log(ownersEatTooLittle);

// const status = function () {
//   const owners = ownersEatTooMuch.join(' and ');
//   return `${ owners } 's dog eat too much`;
// };

// console.log(status());

// const isEatWell = dogs.some(dog => dog.curFood <= 1.1 * dog.recommendedFood && dog.curFood >= 0.9 * dog.recommendedFood);


// console.log(isEatWell);

// const sortedByRecommendedFood = dogs.sort((a, b) => a.recommendedFood - b.recommendedFood);
// console.log(sortedByRecommendedFood);


///LECTURES

// BASE  10  0 => 9
// console.log(1 / 3);
// console.log(+'23');

// //parsing 

// //check if value is NaN
// console.log(Number.parseInt('20px', 10));

// console.log(Number.parseFloat('2.5 rem'))
// console.log(Number.isFinite(23 / 0));

// console.log(Number.isInteger(0))

// console.log(8 ** (1 / 3));
// console.log(Math.max(3, 4, 5, 6, '23px'));
// console.log(Math.PI * Number.parseFloat('10px') ** 2);
// console.log(Math.trunc(Math.random() * 6 + 1));

// const randomInt = (min, max) => Math.trunc(Math.random() * (max - min + 1) + min);
// console.log(randomInt(3, 7));

// //Rounding integer
// console.log(Math.trunc(23.3));
// console.log(Math.round(23.5));
// console.log(Math.ceil(23.3));
// console.log((23.908).toFixed(0));


// console.log(8 % 3);

// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);

// console.log(323224424232332324242424242424n)
// console.log(BigInt(3232244242323))

// const huge = 242442343424242423444n;
// const num = 2;
// console.log(BigInt(num) + huge);
// console.log(20n > 13)


//DATE

// const now = new Date();
// console.log(now);

// console.log(new Date('August 02 2002'));
// console.log(new Date(account1.movementsDates[0]));
// console.log(new Date(2002, 10, 5, 15, 20, 9));
// console.log(new Date(0));
//console.log(new Date(3 * 24 * 60 * 60 * 1000));

// const future = new Date(2020, 10, 19, 4, 8, 9);
// console.log(future);
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.toISOString());
// console.log(future.getTime());
// console.log(new Date(future.getTime()));


// const future = new Date(2021, 10, 2, 23, 4);
// console.log(+future);


// const day1 = calcDayPassed(new Date(2037, 3, 12), new Date(2037, 3, 1));
// console.log(day1);

//NUMBER FORMAT
// const num = 3882324.23;
// const options = {
//   style: 'currency',
//   unit: 'percent',
//   currency: 'USD',
//   useGrouping: false,
// }
// console.log('US: ', new Intl.NumberFormat('en-US', options).format(num));
// console.log(
//   navigator.language,
//   new Intl.NumberFormat(navigator.language).format(num)
// );
// const ingredients = ['olives', 'spinach']
// const timer = setTimeout((ing1, ing2) => { console.log(`Here is your pizza ${ing1} and ${ing2}`) }, 3000, ...ingredients);
// console.log('Waiting ...');

// if (ingredients.includes('olives'))
//   clearTimeout(timer);


//setTimeout

// setInterval(function () {
//   const now = new Date();
//   console.log(now);
// }, 3000)