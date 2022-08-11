import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { NFTStaking1 } from "../../src/types/contracts/NFTStaking1";
import { NFTStaking1__factory } from "../../src/types/factories/contracts/NFTStaking1__factory";
import { ZERO_ADDRESS, readContractAddress, writeContractAddress } from "./addresses/utils";
import cArguments from "./arguments/nftStaking1";

task("deploy:NFTStaking1").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();

  const factory: NFTStaking1__factory = <NFTStaking1__factory>await ethers.getContractFactory("EndGame", accounts[0]);

  const contract: NFTStaking1 = <NFTStaking1>await factory.deploy(ZERO_ADDRESS, "");
  await contract.deployed();

  writeContractAddress("nftStaking1", contract.address);
  console.log("NFTStaking1 deployed to: ", contract.address);
});

task("verify:NFTStaking1").setAction(async function (taskArguments: TaskArguments, { run }) {
  const address = readContractAddress("nftStaking1");

  await run("verify:verify", {
    address,
    constructorArguments: [ZERO_ADDRESS, ""],
  });
});
