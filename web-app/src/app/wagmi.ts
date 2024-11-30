import { ETH_CHAINS } from "@/lib/constants";
import {
  http,
  cookieStorage,
  createConfig,
  createStorage,
  Config,
} from "wagmi";
import { injected } from "wagmi/connectors";

const INFURA_API_KEY = process.env.NEXT_PUBLIC_INFURA_API_KEY || "";
const SEPOLIA_INFURA_RPC_ENDPOINT = `https://sepolia.infura.io/v3/${INFURA_API_KEY}`;
const HOLESKY_INFURA_RPC_ENDPOINT = `https://holesky.infura.io/v3/${INFURA_API_KEY}`;
const HARDHAT_LOCALHOST_RPC_ENDPOINT = "http://127.0.0.1:8545";

const { mainnet, holesky, sepolia, hardhat_localhost } = ETH_CHAINS;
const chains = [mainnet, holesky, sepolia, hardhat_localhost] as const;
const connectors = [injected()];
const storage = createStorage({ storage: cookieStorage || localStorage });
const transports = {
  [mainnet.id]: http(),
  [sepolia.id]: http(SEPOLIA_INFURA_RPC_ENDPOINT),
  [holesky.id]: http(HOLESKY_INFURA_RPC_ENDPOINT),
  [hardhat_localhost.id]: http(HARDHAT_LOCALHOST_RPC_ENDPOINT),
};

let config: Config;

export function getConfig() {
  if (!config) {
    console.log("Creating Wagmi config");
    config = createConfig({
      chains,
      connectors,
      storage,
      ssr: true,
      transports,
    });
  }
  console.log("Using cached Wagmi config");
  return config;
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
