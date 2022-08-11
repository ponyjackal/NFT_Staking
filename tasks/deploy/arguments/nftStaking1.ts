import { readContractAddress } from "../addresses/utils";

const REWARDS_TOKEN_ADDRESS = readContractAddress("rewardsToken");
const STAKE_NFT_ADDRESS = readContractAddress("stakeNFT");
const LOCK_PERIOD = 60 * 10;

const values = {
  REWARDS_TOKEN_ADDRESS,
  STAKE_NFT_ADDRESS,
  LOCK_PERIOD,
} as const;

export default values;
