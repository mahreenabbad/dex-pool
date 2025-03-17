import {
  Cl,
  principalToString,
  Pc,
  boolCV,
  cvToValue,
  principalCV,
  makeContractCall,
  standardPrincipalCV,
  stringAsciiCV,
  createStacksPrivateKey,
  makeRandomPrivKey,
  getPublicKey,
  makeContractDeploy,
  broadcastTransaction,
  contractPrincipalCV,
  uintCV,
  callReadOnlyFunction,
  PostConditionMode,
  bufferCVFromString,
  bufferCV,
  someCV,
  FungibleConditionCode,
  makeContractFungiblePostCondition,
  makeStandardSTXPostCondition,
  makeContractSTXPostCondition,
} from "@stacks/transactions";
// import { STACKS_TESTNET } from "@stacks/network";
import { readFileSync } from "fs";
import { generateWallet, generateNewAccount } from "@stacks/wallet-sdk";

const tokenXTrait = contractPrincipalCV(
  "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
  "token-x010"
);
const tokenYTrait = contractPrincipalCV(
  "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
  "token-y010"
);
// // PRIVATE KEY GENERATE
// async function keyGenerate() {
//   let wallet = await generateWallet({
//     secretKey:
//       "",
//     password: "",
//   });
//   wallet = generateNewAccount(wallet);
//   const account = wallet.accounts[0];
//   const privatK = account.stxPrivateKey;
//   console.log("private key", privatK);

//   console.log(wallet.accounts.length);
// }
// keyGenerate();
//account 1 = your private key
//account 2 =
//edge wallet
//your private key
/////////////////////////////////////////
// SMART_CONTRACT_ DEPLOY_TRANSACTION

// const txOptions = {
//   contractName: "amm-swap",
//   codeBody: readFileSync("contracts/amm-swap.clar").toString(),
//   senderKey:
//     "your private key",
//   network: "testnet",
// };

// // console.log(txOptions);
// async function deployContract() {
//   try {
//     // Create a deploy transaction
//     const transaction = await makeContractDeploy(txOptions);
//     // console.log(transaction);
//     // Broadcast the transaction
//     const broadcastResponse = await broadcastTransaction(
//       transaction,
//       txOptions.network
//     );
//     console.log("Broadcast Response:", broadcastResponse);
//   } catch (error) {
//     console.error("Error deploying contract:", error);
//   }
// }
// deployContract();
////////////////////////////////////////////////////////
//  get-total-supply function

// Define the function args (empty for read-only functions)
// const principal = principalCV(
//   "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV.amm-swap004"
// );
// const options = {
//   contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   contractName: "token-x010",
//   functionName: "get-balance",
//   functionArgs: [principal],
//   network: "testnet",
//   senderAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
// };
// // // console.log(options); // Call the read-only function using callReadOnlyFunction
// async function callTotalSupply() {
//   try {
//     const response = await callReadOnlyFunction(options);

//     // Convert the returned Clarity value to JavaScript value
//     const supply = cvToValue(response);
//     console.log("Total Supply :", supply);
//     //   const data = response.value.data;
//     //   console.log("Total supply of xtoken:", data.fee.value);
//   } catch (error) {
//     console.log("transaction error: ", error);
//   }
// }
// callTotalSupply();
/////////////////////////////////////////////////////////////

// Call mintFunction

// // mint -Function
// const recipientPrincipal = principalCV(
//   "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV"
// );

// const amount = Cl.uint(1000000000);
// const txOptions = {
//   contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   contractName: "token-y010",
//   functionName: "mint",
//   functionArgs: [
//     amount, // `amount` as a Clarity uint
//     recipientPrincipal, // `recipient` as a Clarity principal
//   ],

//   PostConditionMode: PostConditionMode.Allow,
//   senderKey:
//     "your private key",
//   network: "testnet",
// };

// // console.log("txOptions :", txOptions);

// async function minting() {
//   try {
//     // Create and broadcast the transaction
//     const transaction = await makeContractCall(txOptions);

//     // console.log("Transaction:", transaction);
//     const response = await broadcastTransaction(transaction, "testnet");
//     console.log("Response:", response);
//   } catch (error) {
//     console.log("Transaction Error:", error);
//   }
// }
// minting();
///////////////////////////////////
//  Pause -function
// const txOptions = {
//   contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   contractName: "amm-swap02",
//   functionName: "pause",
//   functionArgs: [boolCV(false)], // Pass the new paused value as a boolean
//   senderKey:
//     "your private key",
//   network: "testnet",
//   postConditionMode: PostConditionMode.Allow,
// };
// // console.log("txOptions :", txOptions);
// async function pauseFunction() {
//   try {
//     // Create and broadcast the transaction
//     const transaction = await makeContractCall(txOptions);

//     // console.log("Transaction:", transaction);
//     const response = await broadcastTransaction(transaction, "testnet");
//     console.log("Response:", response);
//   } catch (error) {
//     console.log("Transaction Error:", error);
//   }
// }
// pauseFunction();

/////////////////////////////////////////////////////////
// is-paused -- read only function
// async function isPaused() {
//   const pauseStatus = {
//     contractAddress: "SPXWGJQ101N1C1FYHK64TGTHN4793CHVKTJAT7VQ",
//     contractName: "amm-swap003",
//     functionName: "is-paused",
//     functionArgs: [],
//     network: "mainnet",
//     senderAddress: "SPXWGJQ101N1C1FYHK64TGTHN4793CHVKTJAT7VQ",
//   };
//   //   console.log("isPaused:", pauseStatus);

//   try {
//     const result = await callReadOnlyFunction(pauseStatus);
//     const pausedValue = cvToValue(result);
//     console.log("get pause status:", pausedValue);
//   } catch (error) {
//     console.error("Error fetching balances:", error);
//   }
// }
// isPaused();
///////////////////////////////////////////////////
//get-contract-owner

// async function isOwner() {
//   const tx = {
//     contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//     contractName: "amm-swap003",
//     functionName: "get-contract-owner",
//     functionArgs: [],
//     network: "testnet",
//     senderAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   };
//   //   console.log("tx:", tx);

//   try {
//     const result = await callReadOnlyFunction(tx);
//     const pausedValue = cvToValue(result);
//     console.log("get owner:", pausedValue);
//   } catch (error) {
//     console.error("Error fetching balances:", error);
//   }
// }
// isOwner();
////////////////////////////////////////
// CREATE_Pool FUNCTION
// const factor = Cl.uint(1);
// const dx = Cl.uint(200000000);
// const dy = Cl.uint(200000000);
// const maxDy = someCV(Cl.uint(5000000));
// // console.log("factor", factor);

// const poolOwner = principalCV("STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV");

// const txOptions = {
//   contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   contractName: "amm-swap005",
//   functionName: "create-pool",
//   functionArgs: [
//     tokenXTrait,
//     tokenYTrait,
//     factor,
//     poolOwner, // Principal of the pool owner
//     dx, // Initial amount of token X
//     dy, // Initial amount of token Y
//   ],
//   // postConditions: [postCondition, postCondition1],
//   PostConditionMode: PostConditionMode.Allow,
//   senderKey:
//     "your private key", // Replace with the private key of the contract owner
//   network: "testnet",

//   fee: 2000n,
//   //   postConditions: [], // Define post conditions if required
//   postConditionMode: PostConditionMode.Allow,
//   validateWithAbi: true, // Validate the transaction against the contract's ABI
// };

// // console.log("txOptions", txOptions);
// // console.log("Function Args:", txOptions.functionArgs);
// async function callCreatePool() {
//   try {
//     const transaction = await makeContractCall(txOptions);
//     // console.log("Transaction", transaction);
//     // Broadcast the transaction
//     const broadcastResponse = await broadcastTransaction(
//       transaction,
//       "testnet"
//     );
//     console.log("Transaction Response:", broadcastResponse);
//   } catch (error) {
//     console.error("Error during transaction execution:", error);
//   }
// }
// callCreatePool();
///////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////

//ADD_TO_POSITION  FUNCTION

// Define contract principals for token traits

// define post conditions

// const postCondition = Pc.principal("STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV")
//   .willSendGte(100000000)
//   .ft("STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV.token-x010", "xtoken");
// const postCondition1 = Pc.principal("STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV")
//   .willSendGte(100000000)
//   .ft("STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV.token-y010", "ytoken");

// const dx = Cl.uint(100000000);
// const maxDy = someCV(Cl.uint(100000000));
// const factor = Cl.uint(1);
// const txOptions = {
//   contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   contractName: "amm-swap003",
//   functionName: "add-to-position",
//   functionArgs: [
//     tokenXTrait,
//     tokenYTrait,
//     factor,
//     dx, // `amount` as a Clarity uint
//     maxDy,
//   ],
//   postConditions: [postCondition, postCondition1],
//   PostConditionMode: PostConditionMode.Allow,
//   senderKey:
//     "your private key",

//   network: "testnet",
//   fee: 20000n,
//   validateWithAbi: true,
// };

// // console.log("txOptions :", txOptions);
// async function callAddtoPosition() {
//   try {
//     // Create and broadcast the transaction

//     const transaction = await makeContractCall(txOptions);
//     // console.log("Transaction:", transaction);
//     const response = await broadcastTransaction(transaction, "testnet");
//     console.log("Response:", response);
//     // console.log("Function Args:", txOptions.functionArgs);
//   } catch (error) {
//     console.error("Error during transaction execution:", error);
//   }
// }
// callAddtoPosition();
//////////////////////////////////////////////////////////

//SWAP- X_to_Y FUNCTION CALL
// define post conditions

// const factor = Cl.uint(1);
// const dx = Cl.uint(5000000); // Example amount for token-x
// const minDy = someCV(Cl.uint(300));

// const options = {
//   contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV", // Your contract address
//   contractName: "amm-swap005", // Your contract name
//   functionName: "swap-x-for-y", // Function name to call
//   functionArgs: [
//     tokenXTrait,
//     tokenYTrait,
//     factor,
//     dx, // Amount of token-x
//     minDy, // Minimum amount of token-y expected
//   ],
//   // Use Stacks Testnet
//   senderKey:
//     "your private key",
//   network: "testnet",
//   fee: 200000n,

//   //   postConditions: [postCondition, postCondition1], // Define post conditions if required
//   postConditionMode: PostConditionMode.Allow,
//   validateWithAbi: true, // library compares your provided function arguments (functionArgs) against the ABI of the specified function.
// };
// // console.log("options :", options);
// async function swapTokens() {
//   try {
//     // Create the transaction
//     const transaction = await makeContractCall(options);

//     // Broadcast the transaction to the Stacks blockchain
//     const response = await broadcastTransaction(transaction, "testnet");
//     console.log("Transaction Response:", response);
//   } catch (error) {
//     console.error("Error during the transaction:", error);
//   }
// }

// swapTokens();
///////////////////////////////////////
// //SWAP_Y_FOR_X FUNCTION CALL

// const factor = Cl.uint(1);
// const dy = Cl.uint(5000000); // Example amount for token-x
// const minDx = someCV(Cl.uint(3000));

// const options = {
//   contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV", // Your contract address
//   contractName: "amm-swap005", // Your contract name
//   functionName: "swap-y-for-x", // Function name to call
//   functionArgs: [
//     tokenXTrait,
//     tokenYTrait,
//     factor,
//     dy, // Amount of token-x
//     minDx, // Minimum amount of token-y expected
//   ],

//   senderKey:
//     "your private key",
//   network: "testnet",
//   fee: 2000n,

//   postConditionMode: PostConditionMode.Allow,
//   validateWithAbi: true, // library compares your provided function arguments (functionArgs) against the ABI of the specified function.
// };
// // console.log("options :", options);
// async function swapTokens() {
//   try {
//     // Create the transaction
//     const transaction = await makeContractCall(options);

//     // Broadcast the transaction to the Stacks blockchain
//     const response = await broadcastTransaction(transaction, "testnet");
//     console.log("Transaction Response:", response);
//   } catch (error) {
//     console.error("Error during the transaction:", error);
//   }
// }

// swapTokens();

////////////////////////////////////////
// REDUCE - POSITION  function call
// const factor = Cl.uint(1);
// const percent = uintCV(2);

// const options = {
//   contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV", // Your contract address
//   contractName: "amm-swap004", // Your contract name
//   functionName: "reduce-position", // Function name to call
//   functionArgs: [tokenXTrait, tokenYTrait, factor, percent],
//   // Use Stacks Testnet
//   senderKey:
//     "your private key",
//   network: "testnet",
//   fee: 2000n,

//   //   postConditions: [postCondition, postCondition1], // Define post conditions if required
//   postConditionMode: PostConditionMode.Allow,
//   validateWithAbi: true, // library compares your provided function arguments (functionArgs) against the ABI of the specified function.
// };
// // console.log("options :", options);
// async function reducePosition() {
//   try {
//     // Create the transaction
//     const transaction = await makeContractCall(options);

//     // Broadcast the transaction to the Stacks blockchain
//     const response = await broadcastTransaction(transaction, "testnet");
//     console.log("Transaction Response:", response);
//   } catch (error) {
//     console.error("Error during the transaction:", error);
//   }
// }

// reducePosition();
////////////////////////////////////////
//////////////////////////////////////////////////////
// define post conditions
// const postCondition = Pc.principal("STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV")
//   .willSendGte(1000000000)
//   .ft("STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV.token-x010", "xtoken");
// const postCondition1 = Pc.principal("STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV")
//   .willSendGte(1000000000)
//   .ft("STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV.token-y010", "ytoken");
// const poolOwner = standardPrincipalCV(
//   "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV"
// );
//////////////////////////////////////////////////////////
// GET POOL DETAILS
// const factor = Cl.uint(1);

// const txOptions = {
//   contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   contractName: "amm-swap004",
//   functionName: "get-pool-details",
//   functionArgs: [tokenXTrait, tokenYTrait, factor],
//   // postConditions: [postCondition, postCondition1],
//   PostConditionMode: PostConditionMode.Allow,
//   senderAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV", // Replace with the private key of the contract owner
//   network: "testnet",
// };

// console.log("txOptions", txOptions);
// console.log("Function Args:", txOptions.functionArgs);
// async function callDetails() {
//   try {
//     const result = await callReadOnlyFunction(txOptions);
//     const data = result.value.data;
//     // const pausedValue = cvToValue(result);
//     console.log("get pool details:", {
//       balanceX: data["balance-x"].value, // Decoded value of balance-x
//       balanceY: data["balance-y"].value, // Decoded value of balance-y
//       feeRateX: data["fee-rate-x"].value, // Decoded value of fee-rate-x
//       feeRateY: data["fee-rate-y"].value, // Decoded value of fee-rate-y
//       poolOwner: data["pool-owner"]
//         ? principalToString(data["pool-owner"])
//         : null, // Decoded principal of pool-owner
//       thresholdX: data["threshold-x"].value, // Decoded value of threshold-x
//       thresholdY: data["threshold-y"].value, // Decoded value of threshold-y
//       totalSupply: data["total-supply"].value,
//     });
//   } catch (error) {
//     console.error("Error fetching balances:", error);
//   }
// }
// callDetails();
///////////////////////////////////////////
//GET BALANCEs,

// const factor = Cl.uint(1);

// const txOptions = {
//   contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   contractName: "amm-swap005",
//   functionName: "get-balances",
//   functionArgs: [tokenXTrait, tokenYTrait, factor],
//   // postConditions: [postCondition, postCondition1],
//   PostConditionMode: PostConditionMode.Allow,
//   senderAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   network: "testnet",
// };

// // console.log("txOptions", txOptions);
// // console.log("Function Args:", txOptions.functionArgs);
// async function callDetails() {
//   try {
//     const result = await callReadOnlyFunction(txOptions);
//     const balance = result.value.data;
//     // const pausedValue = cvToValue(result);
//     console.log("Balances : ", {
//       balanceX: balance["balance-x"].value, // Decoded value of balance-x
//       balanceY: balance["balance-y"].value, // Decoded value of balance-y
//     });
//   } catch (error) {
//     console.error("Error fetching balances:", error);
//   }
// }
// callDetails();
///////////////////////////////////////////////////////
//get-price function
// const factor = Cl.uint(1);

// const txOptions = {
//   contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   contractName: "amm-swap005",
//   functionName: "get-price",
//   functionArgs: [tokenXTrait, tokenYTrait, factor],
//   // postConditions: [postCondition, postCondition1],
//   PostConditionMode: PostConditionMode.Allow,
//   senderAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   network: "testnet",
// };

// // console.log("txOptions", txOptions);
// // console.log("Function Args:", txOptions.functionArgs);
// async function callDetails() {
//   try {
//     const result = await callReadOnlyFunction(txOptions);
//     const price = cvToValue(result);
//     console.log("Price: ", price);
//   } catch (error) {
//     console.error("Error fetching balances:", error);
//   }
// }
// callDetails();
///////////////////////////////////////////////////////
//get- threshold.
// const factor = Cl.uint(1);

// const txOptions = {
//   contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   contractName: "amm-swap005",
//   functionName: "get-threshold-y",
//   functionArgs: [tokenXTrait, tokenYTrait, factor],
//   // postConditions: [postCondition, postCondition1],
//   PostConditionMode: PostConditionMode.Allow,
//   senderAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   network: "testnet",
// };

// // console.log("txOptions", txOptions);
// // console.log("Function Args:", txOptions.functionArgs);
// async function callDetails() {
//   try {
//     const result = await callReadOnlyFunction(txOptions);
//     const price = cvToValue(result);
//     console.log("Price: ", price);
//   } catch (error) {
//     console.error("Error fetching balances:", error);
//   }
// }
// callDetails();
/////////////////////////////////////////////////////////////////////

//set threshold
// const factor = Cl.uint(1);
// const newThreshold = Cl.uint(500);

// const txOptions = {
//   contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   contractName: "amm-swap005",
//   functionName: "set-threshold-y",
//   functionArgs: [tokenXTrait, tokenYTrait, factor, newThreshold],
//   // postConditions: [postCondition, postCondition1],
//   PostConditionMode: PostConditionMode.Allow,
//   senderKey:
//     "your private key",
//   network: "testnet",
//   fee: 2000n,
// };

// // console.log("txOptions", txOptions);
// // console.log("Function Args:", txOptions.functionArgs);
// async function callDetails() {
//   try {
//     const transaction = await makeContractCall(txOptions);
//     const result = await broadcastTransaction(transaction, "testnet");
//     console.log("Price: ", result);
//   } catch (error) {
//     console.error("Error fetching balances:", error);
//   }
// }
// callDetails();
/////////////////////////////////////////////////////////////////
//get-fee-rate-x and y

// const factor = Cl.uint(1);

// const txOptions = {
//   contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   contractName: "amm-swap005",
//   functionName: "get-fee-rate-y",
//   functionArgs: [tokenXTrait, tokenYTrait, factor],
//   // postConditions: [postCondition, postCondition1],
//   PostConditionMode: PostConditionMode.Allow,
//   senderAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   network: "testnet",
// };

// // console.log("txOptions", txOptions);
// // console.log("Function Args:", txOptions.functionArgs);
// async function callDetails() {
//   try {
//     const result = await callReadOnlyFunction(txOptions);
//     const price = cvToValue(result);
//     console.log("Price: ", price);
//   } catch (error) {
//     console.error("Error fetching balances:", error);
//   }
// }
// callDetails();
////////////////////////////////////////////////////////////////////
//set-fee-rate-x function
// const factor = Cl.uint(1);
// const feeRateX = Cl.uint(1);

// const txOptions = {
//   contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   contractName: "amm-swap005",
//   functionName: "set-fee-rate-y",
//   functionArgs: [tokenXTrait, tokenYTrait, factor, feeRateX],
//   // postConditions: [postCondition, postCondition1],
//   PostConditionMode: PostConditionMode.Allow,
//   senderKey:
//     "your private key",
//   network: "testnet",
//   fee: 2000n,
// };

// // console.log("txOptions", txOptions);
// // console.log("Function Args:", txOptions.functionArgs);
// async function callDetails() {
//   try {
//     const transaction = await makeContractCall(txOptions);
//     const result = await broadcastTransaction(transaction, "testnet");
//     console.log("Price: ", result);
//   } catch (error) {
//     console.error("Error fetching balances:", error);
//   }
// }
// callDetails();
//////////////////////////////////////////////////
//get-pool-owner
// const factor = Cl.uint(1);
// const txOptions = {
//   contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   contractName: "amm-swap005",
//   functionName: "get-pool-owner",
//   functionArgs: [tokenXTrait, tokenYTrait, factor],
//   // postConditions: [postCondition, postCondition1],
//   PostConditionMode: PostConditionMode.Allow,
//   senderAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   network: "testnet",
// };

// // console.log("txOptions", txOptions);
// // console.log("Function Args:", txOptions.functionArgs);
// async function callDetails() {
//   try {
//     const result = await callReadOnlyFunction(txOptions);
//     const price = cvToValue(result);
//     console.log("Price: ", price);
//   } catch (error) {
//     console.error("Error fetching balances:", error);
//   }
// }
// callDetails();
////////////////////////////////////////////////////////////
//set-pool-owner -only contract owner can call ths function
// const factor = Cl.uint(1);
// const newOwner = principalCV("STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV");

// const txOptions = {
//   contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   contractName: "amm-swap005",
//   functionName: "set-pool-owner",
//   functionArgs: [tokenXTrait, tokenYTrait, factor, newOwner],
//   // postConditions: [postCondition, postCondition1],
//   PostConditionMode: PostConditionMode.Allow,
//   senderKey:
//     "your private key",
//   network: "testnet",
//   fee: 20000n,
// };

// // console.log("txOptions", txOptions);
// // console.log("Function Args:", txOptions.functionArgs);
// async function callDetails() {
//   try {
//     const transaction = await makeContractCall(txOptions);
//     const result = await broadcastTransaction(transaction, "testnet");
//     console.log("result: ", result);
//   } catch (error) {
//     console.error("Error fetching balances:", error);
//   }
// }
// callDetails();
//////////////////////////////////////////////////////////////////////////////
//  get-x-given-y , get-y-given-x , get-y-in-given-x-out,
// const factor = Cl.uint(1);
// const dx = Cl.uint(1000000);
// const txOptions = {
//   contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   contractName: "amm-swap005",
//   functionName: "get-x-in-given-y-out",
//   functionArgs: [tokenXTrait, tokenYTrait, factor, dx],
//   // postConditions: [postCondition, postCondition1],
//   PostConditionMode: PostConditionMode.Allow,
//   senderAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   network: "testnet",
// };

// // console.log("txOptions", txOptions);
// // console.log("Function Args:", txOptions.functionArgs);
// async function callDetails() {
//   try {
//     const result = await callReadOnlyFunction(txOptions);
//     const price = cvToValue(result);
//     console.log("Price: ", price);
//   } catch (error) {
//     console.error("Error fetching balances:", error);
//   }
// }
// callDetails();
//////////////////////////////////////////
//get-x-given-price  ,

// const factor = Cl.uint(1);
// // const dx = Cl.uint(1000000);
// // const dy = Cl.uint(100);
// const price = Cl.uint(10000);
// const txOptions = {
//   contractAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   contractName: "amm-swap005",
//   functionName: "get-x-given-price",
//   functionArgs: [tokenXTrait, tokenYTrait, factor, price],
//   // postConditions: [postCondition, postCondition1],
//   PostConditionMode: PostConditionMode.Allow,
//   senderAddress: "STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV",
//   network: "testnet",
// };

// // console.log("txOptions", txOptions);
// // console.log("Function Args:", txOptions.functionArgs);
// async function callDetails() {
//   try {
//     const result = await callReadOnlyFunction(txOptions);
//     const price = cvToValue(result);
//     console.log("Price: ", price);
//   } catch (error) {
//     console.error("Error fetching balances:", error);
//   }
// }
// callDetails();
