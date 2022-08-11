import { Signer } from "@ethersproject/abstract-signer";
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import gamekeyList from "../../data/gamekey.json";
import ogList from "../../data/og.json";
import wlList from "../../data/wl.json";
import { EndGame } from "../../src/types/contracts/EndGame";
import { EndGame__factory } from "../../src/types/factories/contracts/EndGame__factory";
import { NodePair, generateMerkleTree, getMerkleProof } from "../../utils/merkle";
import { readContractAddress } from "../deploy/addresses/utils";
import { network } from "./../deploy/addresses/utils";

function jsonToArray(json: Record<string, unknown>): NodePair[] {
  const list: NodePair[] = [];
  for (const [key, value] of Object.entries(json)) {
    list.push({
      address: key,
      amount: Number(value),
    });
  }

  return list;
}

task("script:EndGame-setMerkleRoots").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const endGameAddress = readContractAddress("endGame");

  const factory: EndGame__factory = <EndGame__factory>await ethers.getContractFactory("EndGame", {
    signer: accounts[0],
  });

  const contract: EndGame = <EndGame>await factory.attach(endGameAddress);

  const gkTree = generateMerkleTree(jsonToArray(gamekeyList));
  const ogTree = generateMerkleTree(jsonToArray(ogList));
  const wlTree = generateMerkleTree(jsonToArray(wlList));

  try {
    const tx = await contract.setMerkleRoots([ogTree.getHexRoot(), gkTree.getHexRoot(), wlTree.getHexRoot()]);

    await tx.wait();
    console.log(`EndGame-setMerkleRoots done`, tx);
  } catch (e) {
    console.log("EndGame-setMerkleRoots error", e);
  }
});

task("script:EndGame-tryWLMint").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const accounts: Signer[] = await ethers.getSigners();
  const endGameAddress = readContractAddress("endGame");
  const signerAddress = await accounts[0].getAddress();

  if (network() === "mainnet") {
    console.log("EndGame-tryWLMint skipped on mainnet");
    return;
  }

  const factory: EndGame__factory = <EndGame__factory>await ethers.getContractFactory("EndGame", {
    signer: accounts[0],
  });

  const contract: EndGame = <EndGame>await factory.attach(endGameAddress);

  if (!(gamekeyList as Record<string, number>)[signerAddress]) {
    console.log("EndGame-tryWLMint skipped for non-gamekey holder address");
    return;
  }

  const tree = generateMerkleTree(jsonToArray(gamekeyList));
  const quantity = Number((gamekeyList as Record<string, number>)[signerAddress]);
  const proofs = getMerkleProof(tree, signerAddress, quantity);

  console.log("whitelistMint", tree.getHexRoot(), signerAddress, quantity, proofs);
  try {
    const tx = await contract.whitelistMint([
      {
        group: 1,
        quantity,
        proofs,
      },
    ]);

    await tx.wait();
    console.log(`EndGame-tryWLMint done`, tx);
  } catch (e) {
    console.log("EndGame-tryWLMint error", e);
  }
});
