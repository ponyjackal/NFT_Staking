import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { RewardsNFT } from "../../src/types/contracts/RewardsNFT";
import { RewardsNFT__factory } from "../../src/types/factories/contracts/RewardsNFT__factory";
import { ZERO_ADDRESS, readContractAddress, writeContractAddress } from "./addresses/utils";
import cArguments from "./arguments/rewardsNFT";

task("deploy:RewardsNFT").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();

  const factory: RewardsNFT__factory = <RewardsNFT__factory>await ethers.getContractFactory("RewardsNFT", accounts[0]);

  const contract: RewardsNFT = <RewardsNFT>await factory.deploy(ZERO_ADDRESS, cArguments.TOKEN_URI);
  await contract.deployed();

  writeContractAddress("rewardsNFT", contract.address);
  console.log("RewardsNFT deployed to: ", contract.address);
});

task("verify:RewardsNFT").setAction(async function (taskArguments: TaskArguments, { run }) {
  const address = readContractAddress("rewardsNFT");

  await run("verify:verify", {
    address,
    constructorArguments: [ZERO_ADDRESS, cArguments.TOKEN_URI],
  });
});
