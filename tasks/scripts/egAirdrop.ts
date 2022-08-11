import { Signer } from "@ethersproject/abstract-signer";
import * as fs from "fs";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import * as path from "path";

import disperseTokenId from "../../data/disperseTokenId.json";
import { EGAirdrop } from "../../src/types/contracts/EGAirdrop";
import { EGAirdrop__factory } from "../../src/types/factories/contracts/EGAirdrop__factory";
import { readContractAddress } from "../deploy/addresses/utils";

function getDisperseList() {
  const rawData = fs.readFileSync(path.join(__dirname, `../../data/disperseList.csv`));
  const lines = rawData.toString().split("\n");

  const receivers: string[] = [];
  const amounts: number[] = [];
  for (let i = 1; i < lines.length; i++) {
    const currentline = lines[i].split(",");
    receivers.push(currentline[0]);
    amounts.push(+currentline[1]);
  }

  return { receivers, amounts };
}

task("script:EGAirdrop-disperseToken").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const egAirdropAddress = readContractAddress("egAirdrop");
  const signerAddress = await accounts[0].getAddress();

  const factory: EGAirdrop__factory = <EGAirdrop__factory>await ethers.getContractFactory("EGAirdrop", {
    signer: accounts[0],
  });

  const contract: EGAirdrop = <EGAirdrop>await factory.attach(egAirdropAddress);

  const { receivers, amounts } = getDisperseList();
  const startTokenId: number = disperseTokenId["startId"] || 1;

  console.log("disperseToken", signerAddress, receivers, amounts, startTokenId);
  try {
    const tx = await contract.disperseToken(receivers, amounts, startTokenId);

    await tx.wait();
    console.log(`EGAirdrop-disperseToken done`, tx);
  } catch (e) {
    console.log("EGAirdrop-disperseToken error", e);
  }
});
