import { FhevmType } from "@fhevm/hardhat-plugin";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("identity:address", "Prints the EncryptedIdentity address").setAction(async function (_args: TaskArguments, hre) {
  const { deployments } = hre;
  const d = await deployments.get("EncryptedIdentity");
  console.log("EncryptedIdentity address is " + d.address);
});

task("identity:submit", "Submit or update your encrypted identity")
  .addParam("name", "Plain name (will be client-encrypted in frontend; here pass a placeholder)")
  .addParam("birth", "Birth year as integer")
  .addParam("country", "Country id as integer")
  .setAction(async function (args: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;
    await fhevm.initializeCLIApi();

    const d = await deployments.get("EncryptedIdentity");
    const [signer] = await ethers.getSigners();
    const c = await ethers.getContractAt("EncryptedIdentity", d.address);

    const birth = parseInt(args.birth);
    const country = parseInt(args.country);
    if (!Number.isInteger(birth) || !Number.isInteger(country)) throw new Error("Invalid numeric args");

    const enc = await fhevm
      .createEncryptedInput(d.address, signer.address)
      .addAddress(signer.address)
      .add32(birth)
      .add32(country)
      .encrypt();

    const tx = await c
      .connect(signer)
      .submitUser(String(args.name), enc.handles[0], enc.handles[1], enc.handles[2], enc.inputProof);
    console.log(`tx: ${tx.hash}`);
    await tx.wait();
    console.log("Submitted.");
  });

task("identity:read", "Reads your stored encrypted identity")
  .addOptionalParam("user", "User address to read; defaults to first signer")
  .setAction(async function (args: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;
    await fhevm.initializeCLIApi();
    const d = await deployments.get("EncryptedIdentity");
    const [signer] = await ethers.getSigners();
    const user = args.user ?? signer.address;
    const c = await ethers.getContractAt("EncryptedIdentity", d.address);

    const info = await c.getUserInfo(user);
    console.log("nameCiphertext:", info[0]);

    const decAddr = await fhevm.userDecryptEaddress(FhevmType.eaddress, info[1], d.address, signer);
    const decBirth = await fhevm.userDecryptEuint(FhevmType.euint32, info[2], d.address, signer);
    const decCountry = await fhevm.userDecryptEuint(FhevmType.euint32, info[3], d.address, signer);
    console.log({ decAddr, decBirth, decCountry });
  });

