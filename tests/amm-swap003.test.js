import {
  Cl, //Provides utilities to create Clarity values (e.g., principal, uint, tuple)
  createStacksPrivateKey,
  cvToValue, // Converts Clarity values to JavaScript-readable formats.
  signMessageHashRsv, // Utility to sign a message hash using the RSV format, typically used for cryptographic signatures
} from "@stacks/transactions";
import { beforeEach, describe, expect, it } from "vitest";

// `simnet` is a "simulation network" - a local, testing Stacks node for running our tests
const accounts = simnet.getAccounts();

const contractOwner = accounts.get("wallet_1");
console.log("Expected contract owner:", contractOwner);
const user1 = accounts.get("wallet_2");
const user2 = accounts.get("wallet_3");

describe("swap contract", () => {
  // let contract;
  // // beforeEach(() => {
  // // });
  it("should return the pause status", async () => {
    const result = simnet.getDataVar("amm-swap003", "paused");
    expect(cvToValue(result)).toBe(false);
  });
  it("should return the correct MAX-IN-RATIO", async () => {
    const result = simnet.getDataVar("amm-swap003", "MAX-IN-RATIO");
    expect(result).toBeUint(5000000); // Equivalent to 5%
  });
  it("should return the correct MAX-OUT-RATIO", async () => {
    const result = simnet.getDataVar("amm-swap003", "MAX-OUT-RATIO");
    expect(result).toBeUint(5000000); // Equivalent to 5%
  });
  it("should return the correct switch threshold", async () => {
    const result = simnet.getDataVar("amm-swap003", "switch-threshold");
    expect(result).toBeUint(80000000);

    // it("should allow the contract owner to change the contract owner", () => {
    //   // Simulate changing the contract owner
    //   let owner1 = Cl.principal("ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM");
    //   let newOwner = Cl.principal("STXWGJQ101N1C1FYHK64TGTHN4793CHVKRW3ZGVV");
    //   const result = simnet.callPublicFn(
    //     "amm-swap003",
    //     "set-contract-owner",
    //     [newOwner],
    //     { sender: owner1 }
    //   );
    //   expect(cvToValue(result)).toBe(true); // Ensure the transaction was successful
    //   // Check that the contract owner has been updated
    //   const updatedOwner = simnet.getDataVar("amm-swap003", "contract-owner");
    //   console.log("Updated contract owner", updatedOwner);
    //   expect(cvToValue(updatedOwner)).toBe(newOwner);
    // });
    // it("should return the correct contract owner", async () => {
    //   contract = simnet.getContractSource("amm-swap003", {
    //     sender: accounts.get("wallet_1"),
    //   });
    //   let owner1 = accounts.get("wallet_1");
    //   console.log("sender:", owner1);
    //   expect(contract).toBeDefined();
    //   const result = simnet.getDataVar("amm-swap003", "contract-owner");
    //   console.log("Actual contract owner:", cvToValue(result));
    //   expect(cvToValue(result)).toBe(owner1);
    // });
    // it("should allow the owner to set a valid new switch threshold", async () => {
    //   const newThreshold = 50000000; // Example value less than ONE_8 (100,000,000)
    //   const result = await simnet.callPublicFn(
    //     "amm-swap002",
    //     "set-switch-threshold",
    //     [Cl.uint(newThreshold)],
    //     contractOwner
    //   );
    //   expect(cvToValue(result)).toBe(cvToValue(true));
    //   // Verify the updated value
    //   const updatedResult = simnet.getDataVar("amm-swap002", "switch-threshold");
    //   // console.log("Updated switch threshold:", cvToValue(updatedResult));
    //   expect(cvToValue(updatedResult)).toBeUint(newThreshold);
    // });
    // it("should fail to set a new threshold if it exceeds ONE_8", async () => {
    //   const invalidThreshold = 150000000; // Greater than ONE_8 (100,000,000)
    //   const result = await simnet.callPublicFunction(
    //     "amm-swap002",
    //     "set-switch-threshold",
    //     [Cl.uint(invalidThreshold)],
    //     contractOwner.secretKey
    //   );
    //   expect(result.success).toBe(false);
    //   expect(result.error.code).toBe("ERR-SWITCH-THRESHOLD-BIGGER-THAN-ONE");
    // });
    // it("should prevent a non-owner from setting the switch threshold", async () => {
    //   const newThreshold = 50000000;
    //   const result = await simnet.callPublicFunction(
    //     "amm-swap002",
    //     "set-switch-threshold",
    //     [Cl.uint(newThreshold)],
    //     nonOwner.secretKey
    //   );
    //   expect(result.success).toBe(false);
    //   expect(result.error.code).toBe("ERR-NOT-AUTHORIZED");
    // });
    //////////////////////////////////////test cases for pause //////////////////////////////////////////
    // it("should return the correct initial paused state", async () => {
    //   // Check the initial paused state is false
    //   const result = simnet.getDataVar("amm-swap002", "paused");
    //   expect(cvToValue(result)).toBe(false); // The initial state should be false
    // });
    // it("should allow the contract owner to pause the contract", async () => {
    //   // Simulate calling the pause function with true
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "pause",
    //     [Cl.bool(true)],
    //     { sender: contractOwner }
    //   );
    //   expect(cvToValue(result)).toBe(true); // Expect that the state was successfully changed to true
    //   // Check if paused state was updated
    //   const pausedState = simnet.getDataVar("amm-swap002", "paused");
    //   expect(cvToValue(pausedState)).toBe(true);
    // });
    // it("should allow the contract owner to unpause the contract", async () => {
    //   // First, pause the contract
    //   await simnet.callReadOnlyFn("amm-swap002", "pause", [Cl.bool(true)], {
    //     sender: contractOwner,
    //   });
    //   // Now unpause the contract
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "pause",
    //     [Cl.bool(false)],
    //     { sender: contractOwner }
    //   );
    //   expect(cvToValue(result)).toBe(true); // Expect that the state was successfully changed to false
    //   // Check if paused state was updated
    //   const pausedState = simnet.getDataVar("amm-swap002", "paused");
    //   expect(cvToValue(pausedState)).toBe(false);
    // });
    // it("should not allow a non-owner to pause the contract", async () => {
    //   // Attempt to pause the contract as a non-owner (user1)
    //   try {
    //     await simnet.callReadOnlyFn("amm-swap002", "pause", [Cl.bool(true)], {
    //       sender: user1,
    //     });
    //   } catch (e) {
    //     expect(e.message).toContain("ERR-OWNER-ONLY"); // Expect an error indicating the function can only be called by the owner
    //   }
    // });
    // it("should not allow a non-owner to unpause the contract", async () => {
    //   // First, ensure the contract is paused
    //   await simnet.callReadOnlyFn("amm-swap002", "pause", [Cl.bool(true)], {
    //     sender: contractOwner,
    //   });
    //   // Attempt to unpause the contract as a non-owner (user1)
    //   try {
    //     await simnet.callReadOnlyFn("amm-swap002", "pause", [Cl.bool(false)], {
    //       sender: user1,
    //     });
    //   } catch (e) {
    //     expect(e.message).toContain("ERR-OWNER-ONLY"); // Expect an error indicating the function can only be called by the owner
    //   }
    // });
    /////////////////////////////////////for contract owner //////////////////////////////////////
    //  it("should return the correct initial contract owner", async () => {
    //    // Check that the current contract owner is the expected one
    //    const result = simnet.getDataVar("amm-swap002", "contract-owner");
    //    expect(cvToValue(result)).toBe(contractOwner); // The initial owner should be contractOwner
    //  });
    //  it("should not allow a non-owner to change the contract owner", async () => {
    //    // Attempt to change the contract owner by a non-owner (user1)
    //    try {
    //      await simnet.callReadOnlyFn(
    //        "amm-swap002",
    //        "set-contract-owner",
    //        [Cl.principal(newOwner)],
    //        { sender: user1 }
    //      );
    //    } catch (e) {
    //      expect(e.message).toContain("ERR-NOT-AUTHORIZED"); // Expect an authorization error
    //    }
    //  });
    //  it("should not allow the current owner to set themselves as the new owner", async () => {
    //    // Attempt to set the current owner as the new contract owner
    //    try {
    //      await simnet.callReadOnlyFn(
    //        "amm-swap002",
    //        "set-contract-owner",
    //        [Cl.principal(contractOwner)],
    //        { sender: contractOwner }
    //      );
    //    } catch (e) {
    //      expect(e.message).toContain("ERR-NOT-AUTHORIZED"); // Expect an authorization error, as this action is redundant
    //    }
    //  });
    ////////////////////////////test cases for pools-data-map ///////////////////////////////
    // it("should correctly add a new pool to the pools-data-map", async () => {
    //   // Example pool data to add to the map
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   const factor = 100;
    //   const totalSupply = 1000;
    //   const balanceX = 500;
    //   const balanceY = 500;
    //   const feeRateX = 2; // 2% fee for token-X
    //   const feeRateY = 3; // 3% fee for token-Y
    //   const thresholdX = 50;
    //   const thresholdY = 50;
    //   // Add the pool to the map
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "add-pool", // Assuming there's a function for adding pools
    //     [
    //       Cl.principal(tokenX),
    //       Cl.principal(tokenY),
    //       Cl.uint(factor),
    //       Cl.uint(totalSupply),
    //       Cl.uint(balanceX),
    //       Cl.uint(balanceY),
    //       Cl.uint(feeRateX),
    //       Cl.uint(feeRateY),
    //       Cl.uint(thresholdX),
    //       Cl.uint(thresholdY),
    //     ],
    //     { sender: contractOwner }
    //   );
    //   expect(cvToValue(result)).toBe(true); // Ensure the pool was added successfully
    // });
    // it("should return the correct pool details from the pools-data-map", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   const factor = 100;
    //   // Retrieve pool data for the given token pair
    //   const poolData = simnet.getDataVar("amm-swap002", "pools-data-map", [
    //     Cl.principal(tokenX),
    //     Cl.principal(tokenY),
    //     Cl.uint(factor),
    //   ]);
    //   expect(poolData).toBeDefined(); // Ensure the pool data is not undefined
    //   const {
    //     totalSupply,
    //     balanceX,
    //     balanceY,
    //     poolOwner,
    //     feeRateX,
    //     feeRateY,
    //     thresholdX,
    //     thresholdY,
    //   } = poolData;
    //   // Verify the values in the pool data
    //   expect(totalSupply).toBe(1000);
    //   expect(balanceX).toBe(500);
    //   expect(balanceY).toBe(500);
    //   expect(poolOwner).toBe(contractOwner);
    //   expect(feeRateX).toBe(2);
    //   expect(feeRateY).toBe(3);
    //   expect(thresholdX).toBe(50);
    //   expect(thresholdY).toBe(50);
    // });
    // it("should only allow the pool owner to modify the pool data", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   const factor = 100;
    //   // Try to modify pool data by a non-owner (user1)
    //   try {
    //     await simnet.callReadOnlyFn(
    //       "amm-swap002",
    //       "set-pool-thresholds", // Assuming there's a function to modify thresholds
    //       [
    //         Cl.principal(tokenX),
    //         Cl.principal(tokenY),
    //         Cl.uint(factor),
    //         Cl.uint(100), // New threshold for token-x
    //         Cl.uint(100), // New threshold for token-y
    //       ],
    //       { sender: user1 } // Non-owner
    //     );
    //   } catch (e) {
    //     expect(e.message).toContain("ERR-NOT-AUTHORIZED"); // Expect authorization error
    //   }
    //   // Try to modify pool data by the owner (contractOwner)
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "set-pool-thresholds", // Assuming there's a function to modify thresholds
    //     [
    //       Cl.principal(tokenX),
    //       Cl.principal(tokenY),
    //       Cl.uint(factor),
    //       Cl.uint(100), // New threshold for token-x
    //       Cl.uint(100), // New threshold for token-y
    //     ],
    //     { sender: contractOwner } // Owner
    //   );
    //   expect(cvToValue(result)).toBe(true); // Ensure the modification was successful
    // });
    /////////////////////////////// for get-pool-details /////////////////////////////
    // it("should return the correct pool details when the pool exists", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   const factor = 100;
    //   // Add a pool to the pools-data-map (assuming there's an 'add-pool' function)
    //   const totalSupply = 1000;
    //   const balanceX = 500;
    //   const balanceY = 500;
    //   const feeRateX = 2; // 2% fee for token-X
    //   const feeRateY = 3; // 3% fee for token-Y
    //   const thresholdX = 50;
    //   const thresholdY = 50;
    //   // Add pool data
    //   await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "add-pool", // Assuming function for adding pool
    //     [
    //       Cl.principal(tokenX),
    //       Cl.principal(tokenY),
    //       Cl.uint(factor),
    //       Cl.uint(totalSupply),
    //       Cl.uint(balanceX),
    //       Cl.uint(balanceY),
    //       Cl.uint(feeRateX),
    //       Cl.uint(feeRateY),
    //       Cl.uint(thresholdX),
    //       Cl.uint(thresholdY),
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Retrieve pool details for the added pool
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "get-pool-details",
    //     [Cl.principal(tokenX), Cl.principal(tokenY), Cl.uint(factor)],
    //     { sender: contractOwner }
    //   );
    //   const poolDetails = cvToValue(result);
    //   expect(poolDetails).toBeDefined(); // Ensure pool data is returned
    //   expect(poolDetails.totalSupply).toBe(1000);
    //   expect(poolDetails.balanceX).toBe(500);
    //   expect(poolDetails.balanceY).toBe(500);
    //   expect(poolDetails.feeRateX).toBe(2);
    //   expect(poolDetails.feeRateY).toBe(3);
    //   expect(poolDetails.thresholdX).toBe(50);
    //   expect(poolDetails.thresholdY).toBe(50);
    // });
    // it("should return an error if the pool does not exist", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   const factor = 100;
    //   // Try to retrieve details of a pool that has not been added
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "get-pool-details",
    //     [Cl.principal(tokenX), Cl.principal(tokenY), Cl.uint(factor)],
    //     { sender: contractOwner }
    //   );
    //   // Expect an error as the pool does not exist
    //   expect(cvToValue(result)).toBe("ERR-INVALID-POOL");
    // });
    // it("should correctly identify if the pool exists using get-pool-exists", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   const factor = 100;
    //   // First, check for a pool that doesn't exist
    //   const existsBeforeAdding = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "get-pool-exists",
    //     [Cl.principal(tokenX), Cl.principal(tokenY), Cl.uint(factor)],
    //     { sender: contractOwner }
    //   );
    //   expect(cvToValue(existsBeforeAdding)).toBe(false); // Pool should not exist initially
    //   // Add a pool to the pools-data-map
    //   const totalSupply = 1000;
    //   const balanceX = 500;
    //   const balanceY = 500;
    //   const feeRateX = 2; // 2% fee for token-X
    //   const feeRateY = 3; // 3% fee for token-Y
    //   const thresholdX = 50;
    //   const thresholdY = 50;
    //   await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "add-pool", // Assuming function for adding pool
    //     [
    //       Cl.principal(tokenX),
    //       Cl.principal(tokenY),
    //       Cl.uint(factor),
    //       Cl.uint(totalSupply),
    //       Cl.uint(balanceX),
    //       Cl.uint(balanceY),
    //       Cl.uint(feeRateX),
    //       Cl.uint(feeRateY),
    //       Cl.uint(thresholdX),
    //       Cl.uint(thresholdY),
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Now, check if the pool exists
    //   const existsAfterAdding = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "get-pool-exists",
    //     [Cl.principal(tokenX), Cl.principal(tokenY), Cl.uint(factor)],
    //     { sender: contractOwner }
    //   );
    //   expect(cvToValue(existsAfterAdding)).toBe(true); // Pool should exist now
    // });
    //////////////////////////////// for get-balances /////////////////////////////////////////////////////
    // it("should return the correct balances when the pool exists", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   const factor = 100;
    //   // Add a pool to the pools-data-map (assuming there's an 'add-pool' function)
    //   const totalSupply = 1000;
    //   const balanceX = 500;
    //   const balanceY = 500;
    //   const feeRateX = 2; // 2% fee for token-X
    //   const feeRateY = 3; // 3% fee for token-Y
    //   const thresholdX = 50;
    //   const thresholdY = 50;
    //   // Add pool data
    //   await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "add-pool", // Assuming function for adding pool
    //     [
    //       Cl.principal(tokenX),
    //       Cl.principal(tokenY),
    //       Cl.uint(factor),
    //       Cl.uint(totalSupply),
    //       Cl.uint(balanceX),
    //       Cl.uint(balanceY),
    //       Cl.uint(feeRateX),
    //       Cl.uint(feeRateY),
    //       Cl.uint(thresholdX),
    //       Cl.uint(thresholdY),
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Retrieve pool balances for the added pool
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "get-balances",
    //     [Cl.principal(tokenX), Cl.principal(tokenY), Cl.uint(factor)],
    //     { sender: contractOwner }
    //   );
    //   const balances = cvToValue(result);
    //   expect(balances).toBeDefined(); // Ensure balances data is returned
    //   expect(balances.balanceX).toBe(500);
    //   expect(balances.balanceY).toBe(500);
    // });
    // it("should return an error if the pool does not exist", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   const factor = 100;
    //   // Try to retrieve balances for a pool that has not been added
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "get-balances",
    //     [Cl.principal(tokenX), Cl.principal(tokenY), Cl.uint(factor)],
    //     { sender: contractOwner }
    //   );
    //   // Expect an error as the pool does not exist
    //   expect(cvToValue(result)).toBe("ERR-INVALID-POOL");
    // });
    ///////////////////////////////// for get-price ///////////////////////////
    // it("should return the correct price when the pool exists", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   const factor = 100;
    //   // Add a pool to the pools-data-map (assuming there's an 'add-pool' function)
    //   const totalSupply = 1000;
    //   const balanceX = 500;
    //   const balanceY = 500;
    //   const feeRateX = 2; // 2% fee for token-X
    //   const feeRateY = 3; // 3% fee for token-Y
    //   const thresholdX = 50;
    //   const thresholdY = 50;
    //   // Add pool data
    //   await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "add-pool", // Assuming function for adding pool
    //     [
    //       Cl.principal(tokenX),
    //       Cl.principal(tokenY),
    //       Cl.uint(factor),
    //       Cl.uint(totalSupply),
    //       Cl.uint(balanceX),
    //       Cl.uint(balanceY),
    //       Cl.uint(feeRateX),
    //       Cl.uint(feeRateY),
    //       Cl.uint(thresholdX),
    //       Cl.uint(thresholdY),
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Retrieve price for the added pool
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "get-price",
    //     [Cl.principal(tokenX), Cl.principal(tokenY), Cl.uint(factor)],
    //     { sender: contractOwner }
    //   );
    //   const price = cvToValue(result);
    //   expect(price).toBeDefined(); // Ensure price data is returned
    //   expect(price).toBeGreaterThan(0); // The price should be greater than 0 for a valid pool
    // });
    // it("should return an error if the pool does not exist", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   const factor = 100;
    //   // Try to retrieve the price for a pool that has not been added
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "get-price",
    //     [Cl.principal(tokenX), Cl.principal(tokenY), Cl.uint(factor)],
    //     { sender: contractOwner }
    //   );
    //   // Expect an error as the pool does not exist
    //   expect(cvToValue(result)).toBe("ERR-INVALID-POOL");
    // });
    ////////////////////////////// for create-pool /////////////////////////////////////////
    // it("should throw an error when token-x and token-y are the same", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = tokenX; // Same token for both
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "create-pool",
    //     [
    //       Cl.ftTrait(tokenX), // token-x
    //       Cl.ftTrait(tokenY), // token-y (same as token-x)
    //       Cl.uint(100), // factor
    //       Cl.principal(contractOwner), // pool-owner
    //       Cl.uint(1000), // dx
    //       Cl.uint(1000), // dy
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Expect error: token-x and token-y must not be the same
    //   expect(cvToValue(result)).toBe("ERR-INVALID-TOKEN-PAIR");
    // });
    // it("should throw an error when factor is 0", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "create-pool",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY),
    //       Cl.uint(0), // Invalid factor value
    //       Cl.principal(contractOwner), // pool-owner
    //       Cl.uint(1000), // dx
    //       Cl.uint(1000), // dy
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Expect error: factor must be greater than 0
    //   expect(cvToValue(result)).toBe("ERR-INVALID-FACTOR");
    // });
    // it("should throw an error when the contract is paused", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   // Pause the contract (simulate paused state)
    //   await simnet.callReadOnlyFn("amm-swap002", "pause", [Cl.bool(true)], {
    //     sender: contractOwner,
    //   });
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "create-pool",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY),
    //       Cl.uint(100), // valid factor
    //       Cl.principal(contractOwner),
    //       Cl.uint(1000),
    //       Cl.uint(1000),
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Expect error: contract is paused
    //   expect(cvToValue(result)).toBe("ERR-PAUSED");
    // });
    // it("should throw an error when the caller is not authorized", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "create-pool",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY),
    //       Cl.uint(100), // valid factor
    //       Cl.principal(user1), // non-owner calling the function
    //       Cl.uint(1000),
    //       Cl.uint(1000),
    //     ],
    //     { sender: user1 }
    //   );
    //   // Expect error: not authorized
    //   expect(cvToValue(result)).toBe("ERR-NOT-AUTHORIZED");
    // });
    // it("should throw an error if the pool already exists", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   // First, create a pool
    //   await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "create-pool",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY),
    //       Cl.uint(100), // valid factor
    //       Cl.principal(contractOwner),
    //       Cl.uint(1000),
    //       Cl.uint(1000),
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Try to create the same pool again
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "create-pool",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY),
    //       Cl.uint(100), // valid factor
    //       Cl.principal(contractOwner),
    //       Cl.uint(1000),
    //       Cl.uint(1000),
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Expect error: pool already exists
    //   expect(cvToValue(result)).toBe("ERR-POOL-ALREADY-EXISTS");
    // });
    // it("should create a pool successfully", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "create-pool",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY),
    //       Cl.uint(100), // valid factor
    //       Cl.principal(contractOwner),
    //       Cl.uint(1000), // dx
    //       Cl.uint(1000), // dy
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Expect the pool to be created successfully
    //   expect(cvToValue(result)).toBe(true);
    // });
    //////////////////////////////////////// for add-to-position ////////////////////////////////////////
    // it("should throw an error when token-x and token-y are the same", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = tokenX; // Same token for both
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "add-to-position",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY), // Same token for both
    //       Cl.uint(100), // factor
    //       Cl.uint(1000), // dx
    //       Cl.uint(1000), // dy
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Expect error: token-x and token-y must not be the same
    //   expect(cvToValue(result)).toBe("ERR-INVALID-TOKEN-PAIR");
    // });
    // it("should throw an error when factor is 0", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "add-to-position",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY),
    //       Cl.uint(0), // Invalid factor value
    //       Cl.uint(1000), // dx
    //       Cl.uint(1000), // dy
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Expect error: factor must be greater than 0
    //   expect(cvToValue(result)).toBe("ERR-INVALID-FACTOR");
    // });
    // it("should throw an error when the contract is paused", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   // Pause the contract (simulate paused state)
    //   await simnet.callReadOnlyFn("amm-swap002", "pause", [Cl.bool(true)], {
    //     sender: contractOwner,
    //   });
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "add-to-position",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY),
    //       Cl.uint(100), // valid factor
    //       Cl.uint(1000), // dx
    //       Cl.uint(1000), // dy
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Expect error: contract is paused
    //   expect(cvToValue(result)).toBe("ERR-PAUSED");
    // });
    // it("should throw an error when the caller is not authorized", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "add-to-position",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY),
    //       Cl.uint(100), // valid factor
    //       Cl.uint(1000), // dx
    //       Cl.uint(1000), // dy
    //     ],
    //     { sender: user1 } // non-owner calling the function
    //   );
    //   // Expect error: not authorized
    //   expect(cvToValue(result)).toBe("ERR-NOT-AUTHORIZED");
    // });
    // it("should throw an error if dx or dy are not greater than 0", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "add-to-position",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY),
    //       Cl.uint(100), // valid factor
    //       Cl.uint(0), // dx = 0 (invalid)
    //       Cl.uint(1000), // dy
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Expect error: invalid liquidity
    //   expect(cvToValue(result)).toBe("ERR-INVALID-LIQUIDITY");
    // });
    // it("should throw an error if dy exceeds max-dy", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "add-to-position",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY),
    //       Cl.uint(100), // valid factor
    //       Cl.uint(1000), // dx
    //       Cl.uint(100000000), // dy exceeds max-dy
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Expect error: exceeds max slippage
    //   expect(cvToValue(result)).toBe("ERR-EXCEEDS-MAX-SLIPPAGE");
    // });
    // it("should throw an error if token transfers fail", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   // Simulate token transfer failure
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "add-to-position",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY),
    //       Cl.uint(100), // valid factor
    //       Cl.uint(1000), // dx
    //       Cl.uint(1000), // dy
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Expect transfer failure error
    //   expect(cvToValue(result)).toBe("transfer-x-failed-err");
    // });
    // it("should successfully add liquidity to the pool", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "add-to-position",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY),
    //       Cl.uint(100), // valid factor
    //       Cl.uint(1000), // dx
    //       Cl.uint(1000), // dy
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Expect the pool liquidity to be added successfully
    //   expect(cvToValue(result)).toEqual({
    //     supply: expect.any(Number),
    //     dx: 1000,
    //     dy: 1000,
    //   });
    // });
    ////////////////////////////////////// reduce-position /////////////////////////////////////////
    // it("should throw an error when token-x and token-y are the same", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = tokenX; // Same token for both
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "reduce-position",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY), // Same token for both
    //       Cl.uint(100), // valid factor
    //       Cl.uint(100), // percent
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Expect error: token-x and token-y must not be the same
    //   expect(cvToValue(result)).toBe("ERR-INVALID-TOKEN-PAIR");
    // });
    // it("should throw an error when factor is 0", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "reduce-position",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY),
    //       Cl.uint(0), // Invalid factor value
    //       Cl.uint(100), // percent
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Expect error: factor must be greater than 0
    //   expect(cvToValue(result)).toBe("ERR-INVALID-FACTOR");
    // });
    // it("should throw an error when the contract is paused", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   // Pause the contract (simulate paused state)
    //   await simnet.callReadOnlyFn("amm-swap002", "pause", [Cl.bool(true)], {
    //     sender: contractOwner,
    //   });
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "reduce-position",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY),
    //       Cl.uint(100), // valid factor
    //       Cl.uint(100), // percent
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Expect error: contract is paused
    //   expect(cvToValue(result)).toBe("ERR-PAUSED");
    // });
    // it("should throw an error when percent is greater than 100", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "reduce-position",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY),
    //       Cl.uint(100), // valid factor
    //       Cl.uint(200), // invalid percent > 100
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Expect error: percent greater than 1 (100%)
    //   expect(cvToValue(result)).toBe("ERR-PERCENT-GREATER-THAN-ONE");
    // });
    // it("should throw an error when the caller is not authorized", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "reduce-position",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY),
    //       Cl.uint(100), // valid factor
    //       Cl.uint(100), // percent
    //     ],
    //     { sender: user1 } // non-owner calling the function
    //   );
    //   // Expect error: not authorized
    //   expect(cvToValue(result)).toBe("ERR-NOT-AUTHORIZED");
    // });
    // it("should throw an error if token transfers fail", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   // Simulate token transfer failure
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "reduce-position",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY),
    //       Cl.uint(100), // valid factor
    //       Cl.uint(100), // percent
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Expect transfer failure error
    //   expect(cvToValue(result)).toBe("transfer-x-failed-err");
    // });
    // it("should successfully reduce liquidity in the pool", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "reduce-position",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY),
    //       Cl.uint(100), // valid factor
    //       Cl.uint(50), // percent (reducing 50%)
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Expect the liquidity to be reduced and pool updated successfully
    //   expect(cvToValue(result)).toEqual({
    //     dx: expect.any(Number),
    //     dy: expect.any(Number),
    //   });
    // });
    //////////////////////////////////////// swap-x-for-y /////////////////////////////////
    // it("should throw an error when token-x and token-y are the same", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = tokenX; // Same token for both
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "swap-x-for-y",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY), // Same token for both
    //       Cl.uint(100), // valid factor
    //       Cl.uint(10), // valid dx
    //       Cl.uint(5), // valid min-dy
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Expect error: token-x and token-y must not be the same
    //   expect(cvToValue(result)).toBe("ERR-INVALID-TOKEN-PAIR");
    // });
    // it("should throw an error when dx is 0 or less", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "swap-x-for-y",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY),
    //       Cl.uint(100), // valid factor
    //       Cl.uint(0), // invalid dx = 0
    //       Cl.uint(5), // valid min-dy
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Expect error: dx must be greater than 0
    //   expect(cvToValue(result)).toBe("ERR-INVALID-LIQUIDITY");
    // });
    // it("should throw an error when factor is 0", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "swap-x-for-y",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY),
    //       Cl.uint(0), // invalid factor
    //       Cl.uint(10), // valid dx
    //       Cl.uint(5), // valid min-dy
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Expect error: factor must be greater than 0
    //   expect(cvToValue(result)).toBe("ERR-INVALID-FACTOR");
    // });
    // it("should throw an error when the contract is paused", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   // Pause the contract (simulate paused state)
    //   await simnet.callReadOnlyFn("amm-swap002", "pause", [Cl.bool(true)], {
    //     sender: contractOwner,
    //   });
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "swap-x-for-y",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY),
    //       Cl.uint(100), // valid factor
    //       Cl.uint(10), // valid dx
    //       Cl.uint(5), // valid min-dy
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Expect error: contract is paused
    //   expect(cvToValue(result)).toBe("ERR-PAUSED");
    // });
    // it("should throw an error when dy exceeds max slippage", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "swap-x-for-y",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY),
    //       Cl.uint(100), // valid factor
    //       Cl.uint(10), // valid dx
    //       Cl.uint(20), // invalid min-dy (greater than calculated dy)
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Expect error: dy exceeds max slippage
    //   expect(cvToValue(result)).toBe("ERR-EXCEEDS-MAX-SLIPPAGE");
    // });
    // it("should throw an error if token-x transfer fails", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   // Simulate token-x transfer failure
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "swap-x-for-y",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY),
    //       Cl.uint(100), // valid factor
    //       Cl.uint(10), // valid dx
    //       Cl.uint(5), // valid min-dy
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Expect transfer failure error
    //   expect(cvToValue(result)).toBe("transfer-x-failed-err");
    // });
    // it("should throw an error if token-y transfer fails", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   // Simulate token-y transfer failure
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "swap-x-for-y",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY),
    //       Cl.uint(100), // valid factor
    //       Cl.uint(10), // valid dx
    //       Cl.uint(5), // valid min-dy
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Expect transfer failure error
    //   expect(cvToValue(result)).toBe("transfer-y-failed-err");
    // });
    // it("should successfully swap tokens and update pool balances", async () => {
    //   const tokenX = accounts.get("wallet_1");
    //   const tokenY = accounts.get("wallet_2");
    //   const result = await simnet.callReadOnlyFn(
    //     "amm-swap002",
    //     "swap-x-for-y",
    //     [
    //       Cl.ftTrait(tokenX),
    //       Cl.ftTrait(tokenY),
    //       Cl.uint(100), // valid factor
    //       Cl.uint(10), // valid dx
    //       Cl.uint(5), // valid min-dy
    //     ],
    //     { sender: contractOwner }
    //   );
    //   // Expect successful swap, returning the net fees (dx-net-fees) and dy
    //   expect(cvToValue(result)).toEqual({
    //     dx: expect.any(Number),
    //     dy: expect.any(Number),
    //   });
    // });
    //////////////////////////////////////// swap-y-for-x /////////////////////////////////
    //  it("fails when token-x and token-y are the same", async () => {
    //    const tx = await contractOwner.callFunction(
    //      "amm-swap002",
    //      "swap-y-for-x",
    //      [
    //        "token-x-trait",
    //        "token-x-trait", // Same token for both sides
    //        Cl.uint(100),
    //        Cl.uint(10),
    //        Cl.uint(5),
    //      ]
    //    );
    //    expect(tx.success).toBe(false);
    //    expect(tx.error).toBe("ERR u102"); // Ensure error is u102
    //  });
    //  it("fails when factor is 0", async () => {
    //    const tx = await contractOwner.callFunction(
    //      "amm-swap002",
    //      "swap-y-for-x",
    //      [
    //        "token-x-trait",
    //        "token-y-trait",
    //        Cl.uint(0), // Factor 0
    //        Cl.uint(10),
    //        Cl.uint(5),
    //      ]
    //    );
    //    expect(tx.success).toBe(false);
    //    expect(tx.error).toBe("ERR u66"); // Ensure error is u66
    //  });
    //  it("fails when dy is 0 or negative", async () => {
    //    const tx = await contractOwner.callFunction(
    //      "amm-swap002",
    //      "swap-y-for-x",
    //      [
    //        "token-x-trait",
    //        "token-y-trait",
    //        Cl.uint(100),
    //        Cl.uint(0), // dy 0
    //        Cl.uint(5),
    //      ]
    //    );
    //    expect(tx.success).toBe(false);
    //    expect(tx.error).toBe("ERR u101"); // Ensure error is u101
    //  });
    //  it("fails when min-dx is greater than calculated dx", async () => {
    //    const tx = await contractOwner.callFunction(
    //      "amm-swap002",
    //      "swap-y-for-x",
    //      [
    //        "token-x-trait",
    //        "token-y-trait",
    //        Cl.uint(100),
    //        Cl.uint(10),
    //        Cl.uint(15), // min-dx greater than dx
    //      ]
    //    );
    //    expect(tx.success).toBe(false);
    //    expect(tx.error).toBe("ERR-EXCEEDS-MAX-SLIPPAGE"); // Ensure error is slippage issue
    //  });
    //  it("successfully performs a swap if all conditions are met", async () => {
    //    const tx = await contractOwner.callFunction(
    //      "amm-swap002",
    //      "swap-y-for-x",
    //      [
    //        "token-x-trait",
    //        "token-y-trait",
    //        Cl.uint(100),
    //        Cl.uint(20),
    //        Cl.uint(5), // No slippage, valid conditions
    //      ]
    //    );
    //    expect(tx.success).toBe(true);
    //    expect(tx.receipt).toBeDefined(); // Verify the transaction was successful
    //  });
    //  it("transfers token-y from sender to vault", async () => {
    //    const tx = await user1.callFunction("amm-swap002", "swap-y-for-x", [
    //      "token-x-trait",
    //      "token-y-trait",
    //      Cl.uint(100),
    //      Cl.uint(20), // dy value
    //      Cl.uint(5), // min-dx
    //    ]);
    //    expect(tx.success).toBe(true);
    //    // Additional validation can be done by checking balances in the pool and sender
    //  });
    //  it("transfers token-x from vault to sender", async () => {
    //    const tx = await user1.callFunction("amm-swap002", "swap-y-for-x", [
    //      "token-x-trait",
    //      "token-y-trait",
    //      Cl.uint(100),
    //      Cl.uint(20), // dy value
    //      Cl.uint(5), // min-dx
    //    ]);
    //    expect(tx.success).toBe(true);
    //    // Additional validation can be done by checking balances in the pool and sender
    //  });
    //  it("updates the pool after a successful swap", async () => {
    //    const tx = await user1.callFunction("amm-swap002", "swap-y-for-x", [
    //      "token-x-trait",
    //      "token-y-trait",
    //      Cl.uint(100),
    //      Cl.uint(20), // dy value
    //      Cl.uint(5), // min-dx
    //    ]);
    //    const poolData = await simnet.getContractData(
    //      "amm-swap002",
    //      "pools-data-map"
    //    );
    //    expect(poolData).toHaveProperty("token-x");
    //    expect(poolData).toHaveProperty("token-y");
    //    expect(poolData).toHaveProperty("factor");
    //  });
    ////////////////////// get-threshold-x ///////////////////////////    set-threshold-x ////////////////////////
    // describe("Threshold-X Functions", () => {
    //   const tokenX = "token-x";
    //   const tokenY = "token-y";
    //   const factor = Cl.uint(1);
    //   describe("get-threshold-x", () => {
    //     it("returns the correct threshold-x for a valid pool", async () => {
    //       // Assume the pool is pre-set with threshold-x = 500
    //       const tx = await contractOwner.callReadOnlyFunction(
    //         "amm-swap002",
    //         "get-threshold-x",
    //         [Cl.principal(tokenX), Cl.principal(tokenY), factor]
    //       );
    //       expect(tx.success).toBe(true);
    //       expect(cvToValue(tx.returnValue)).toBe(500); // Ensure threshold-x is 500
    //     });
    //     it("fails for a non-existent pool", async () => {
    //       const tx = await contractOwner.callReadOnlyFunction(
    //         "amm-swap002",
    //         "get-threshold-x",
    //         [
    //           Cl.principal("non-existent-x"),
    //           Cl.principal("non-existent-y"),
    //           factor,
    //         ]
    //       );
    //       expect(tx.success).toBe(false);
    //       expect(tx.error).toBeDefined(); // Ensure the error is properly thrown
    //     });
    //   });
    //   describe("set-threshold-x", () => {
    //     const newThreshold = Cl.uint(600);
    //     it("allows the pool owner to set a new threshold-x", async () => {
    //       const tx = await contractOwner.callFunction(
    //         "amm-swap002",
    //         "set-threshold-x",
    //         [Cl.principal(tokenX), Cl.principal(tokenY), factor, newThreshold]
    //       );
    //       expect(tx.success).toBe(true);
    //       expect(tx.receipt).toBeDefined(); // Verify successful transaction
    //       // Verify the updated threshold-x
    //       const verifyTx = await contractOwner.callReadOnlyFunction(
    //         "amm-swap002",
    //         "get-threshold-x",
    //         [Cl.principal(tokenX), Cl.principal(tokenY), factor]
    //       );
    //       expect(cvToValue(verifyTx.returnValue)).toBe(600); // Ensure threshold-x is updated
    //     });
    //     it("fails if the caller is not the pool owner or contract owner", async () => {
    //       const tx = await user1.callFunction("amm-swap002", "set-threshold-x", [
    //         Cl.principal(tokenX),
    //         Cl.principal(tokenY),
    //         factor,
    //         newThreshold,
    //       ]);
    //       expect(tx.success).toBe(false);
    //       expect(tx.error).toBe("ERR-NOT-AUTHORIZED"); // Ensure unauthorized error is thrown
    //     });
    //     it("fails for a non-existent pool", async () => {
    //       const tx = await contractOwner.callFunction(
    //         "amm-swap002",
    //         "set-threshold-x",
    //         [
    //           Cl.principal("non-existent-x"),
    //           Cl.principal("non-existent-y"),
    //           factor,
    //           newThreshold,
    //         ]
    //       );
    //       expect(tx.success).toBe(false);
    //       expect(tx.error).toBeDefined(); // Ensure proper error is thrown
    //     });
    //     it("allows the contract owner to set a new threshold-x for the pool", async () => {
    //       const tx = await contractOwner.callFunction(
    //         "amm-swap002",
    //         "set-threshold-x",
    //         [Cl.principal(tokenX), Cl.principal(tokenY), factor, newThreshold]
    //       );
    //       expect(tx.success).toBe(true);
    //       // Verify the updated threshold-x
    //       const verifyTx = await contractOwner.callReadOnlyFunction(
    //         "amm-swap002",
    //         "get-threshold-x",
    //         [Cl.principal(tokenX), Cl.principal(tokenY), factor]
    //       );
    //       expect(cvToValue(verifyTx.returnValue)).toBe(600); // Ensure threshold-x is updated
    //     });
    //   });
  });
});
