import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { NFTStaking1 } from "../../src/types/contracts/NFTStaking1";
import { NFTStaking1__factory } from "../../src/types/factories/contracts/NFTStaking1__factory";
import { readContractAddress, writeContractAddress } from "./addresses/utils";
import cArguments from "./arguments/nftStaking1";

task("deploy:NFTStaking1").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();

  const factory: NFTStaking1__factory = <NFTStaking1__factory>(
    await ethers.getContractFactory("NFTStaking1", accounts[0])
  );

  const contract: NFTStaking1 = <NFTStaking1>(
    await factory.deploy(cArguments.STAKE_NFT_ADDRESS, cArguments.REWARDS_TOKEN_ADDRESS, cArguments.LOCK_PERIOD)
  );
  await contract.deployed();

  writeContractAddress("nftStaking1", contract.address);
  console.log("NFTStaking1 deployed to: ", contract.address);
});

task("verify:NFTStaking1").setAction(async function (taskArguments: TaskArguments, { run }) {
  const address = readContractAddress("nftStaking1");

  await run("verify:verify", {
    address,
    constructorArguments: [cArguments.STAKE_NFT_ADDRESS, cArguments.REWARDS_TOKEN_ADDRESS, cArguments.LOCK_PERIOD],
  });
});
