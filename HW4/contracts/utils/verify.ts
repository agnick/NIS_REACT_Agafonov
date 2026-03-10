import { run } from "hardhat";

export async function verify(contractAddress: string, args: unknown[]) {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
    console.log("Contract verified!");
  } catch (e: unknown) {
    const error = e as Error;
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.error(`Verification failed: ${error.message}`);
    }
  }
}
