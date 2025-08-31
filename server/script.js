// function calculate (num) {
//     for(let i=0 ; i<num ; i++){
//         if(i % 3 === 0 && i % 5 === 0) console.log(i)
//     }
// }
// calculate(20)

// ----------------------------------------------------

// function fibonnacci (num){
//     let a = 0;
//     let b = 1;
//     console.log(a);
//     console.log(b);
//     let c;

//     for(let i=2 ; i<num ; i++){
//         let c = a+b;
//         console.log(c);
//         a = b;
//         b = c;
//     }

// }
// fibonnacci( 10 )

// ------------------------------------------------------
// let arr1 = [1, 2, 3, 5, 1, 3];
// let arr2 = [3, 6, 6, 8, 9, 6, 9, 5];
// let newArr = [...arr1, ...arr2];

// let dupArr = [];

// for (let i = 0; i < newArr.length; i++) {
//   if (!dupArr.includes(newArr[i])) {
//     dupArr.push(newArr[i]);
//   }
// }

// for (let i = 0; i < dupArr.length; i++) {
//   for (let j = 0; j < dupArr.length - 1; j++) {
//     if (dupArr[j] < dupArr[j + 1]) {
//       let temp = dupArr[j];
//       dupArr[j] = dupArr[j + 1];
//       dupArr[j + 1] = temp;
//     }
//   }
// }

// console.log(dupArr);

// // 8. Random Integer
// // Description: Create a function that generates a random integer between two specified numbers
// // (inclusive).
// // Example: randomInteger(1, 10) could return any number from 1 to 10.

// let randomInteger = (a, b) => Math.floor(Math.random() * (b - a + 1) + a);

// console.log(randomInteger(1, 10));

// 10. Reverse Words
// Description: Create a function that reverses the order of words in a given string.
// Example: reverseWords("Hello world") should return "world Hello".

// let word = "hello world";
// let rev = "";
// let dup = "";

// for (let i = word.length - 1; i >= 0; i--) {
//     if (word[i] !== " ") {
//       dup += word[i];
//   }
  
// }
// console.log(rev);


// let arr = [];
// for (let i = 0; i < 3; i++) {
//   arr[i] = function () {
//     console.log(i);
//   };
// }




