// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

// Define a library called CustomCounter
library CustomCounter {
    struct Counter {
        uint256 value; // Holds the counter value
    }

    // Returns the current value of the counter
    function current(Counter storage counter) internal view returns (uint256) {
        return counter.value;
    }

    // Increments the counter by 1
    function increment(Counter storage counter) internal {
        counter.value += 1;
    }

    // Decrements the counter by 1 (with underflow protection)
    function decrement(Counter storage counter) internal {
        require(counter.value > 0, "Counter: underflow");
        counter.value -= 1;
    }

    // Resets the counter to 0
    function reset(Counter storage counter) internal {
        counter.value = 0;
    }
}
