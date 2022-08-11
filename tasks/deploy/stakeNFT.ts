import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { StakeNFT } from "../../src/types/contracts/StakeNFT";
import { StakeNFT__factory } from "../../src/types/factories/contracts/StakeNFT__factory";
import { readContractAddress, writeContractAddress } from "./addresses/utils";
import cArguments from "./arguments/stakeNFT";

task("deploy:StakeNFT").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();

  const factory: StakeNFT__factory = <StakeNFT__factory>await ethers.getContractFactory("StakeNFT", accounts[0]);

  const contract: StakeNFT = <StakeNFT>await factory.deploy(cArguments.TOKEN_URI);
  await contract.deployed();

  writeContractAddress("stakeNFT", contract.address);
  console.log("StakeNFT deployed to: ", contract.address);
});

task("verify:StakeNFT").setAction(async function (taskArguments: TaskArguments, { run }) {
  const address = readContractAddress("stakeNFT");

  await run("verify:verify", {
    address,
    constructorArguments: [cArguments.TOKEN_URI],
  });
});
