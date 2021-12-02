// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract TaskContract {

  struct Task {
    uint256 id;
    string title;
    string description;
    bool done;
    uint256 createdAt;
  }

  mapping (uint256 => Task) public tasks;

  function createTask() {}

  //function toggleDone() {}

}
