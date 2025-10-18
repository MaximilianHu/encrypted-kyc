import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { EncryptedIdentity, EncryptedIdentity__factory } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

describe("EncryptedIdentity", function () {
  let alice: HardhatEthersSigner;
  let bob: HardhatEthersSigner;
  let contract: EncryptedIdentity;
  let addr: string;

  before(async function () {
    const signers = await ethers.getSigners();
    [alice, bob] = [signers[0], signers[1]];
  });

  beforeEach(async function () {
    if (!fhevm.isMock) {
      console.warn("This test runs only on local FHEVM mock");
      this.skip();
    }
    const factory = (await ethers.getContractFactory("EncryptedIdentity")) as EncryptedIdentity__factory;
    contract = (await factory.deploy()) as EncryptedIdentity;
    addr = await contract.getAddress();
  });

  it("submit and read back encrypted info", async function () {
    const nameCiphertext = "enc::<dummy>";

    const enc = await fhevm
      .createEncryptedInput(addr, alice.address)
      .addAddress(alice.address)
      .add32(1990)
      .add32(86)
      .encrypt();

    await (await contract.connect(alice).submitUser(nameCiphertext, enc.handles[0], enc.handles[1], enc.handles[2], enc.inputProof)).wait();

    const has = await contract.hasUser(alice.address);
    expect(has).to.eq(true);

    const info = await contract.getUserInfo(alice.address);
    expect(info[0]).to.eq(nameCiphertext);

    const decBirth = await fhevm.userDecryptEuint(FhevmType.euint32, info[2], addr, alice);
    const decCountry = await fhevm.userDecryptEuint(FhevmType.euint32, info[3], addr, alice);

    expect(Number(decBirth)).to.eq(1990);
    expect(Number(decCountry)).to.eq(86);
  });
});
