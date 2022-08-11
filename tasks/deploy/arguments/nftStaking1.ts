import { readContractAddress } from "../addresses/utils";

const REWARDS_TOKEN_ADDRESS = readContractAddress("rewardsToken");

const values = {
  REWARDS_TOKEN_ADDRESS,
} as const;

export default values;
