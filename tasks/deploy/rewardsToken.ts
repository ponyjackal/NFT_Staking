import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { RewardsToken } from "../../src/types/contracts/RewardsToken";
import { RewardsToken__factory } from "../../src/types/factories/contracts/RewardsToken__factory";
import { ZERO_ADDRESS, readContractAddress, writeContractAddress } from "./addresses/utils";

task("deploy:RewardsToken").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();

  const factory: RewardsToken__factory = <RewardsToken__factory>(
    await ethers.getContractFactory("RewardsToken", accounts[0])
  );

  const contract: RewardsToken = <RewardsToken>await factory.deploy(ZERO_ADDRESS);
  await contract.deployed();

  writeContractAddress("rewardsToken", contract.address);
  console.log("RewardsToken deployed to: ", contract.address);
});

task("verify:RewardsToken").setAction(async function (taskArguments: TaskArguments, { run }) {
  const address = readContractAddress("rewardsToken");

  await run("verify:verify", {
    address,
    constructorArguments: [ZERO_ADDRESS],
  });
});
