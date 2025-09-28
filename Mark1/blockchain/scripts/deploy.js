import pkg from 'hardhat';
const { ethers } = pkg;
async function main() {
  const Registry = await ethers.getContractFactory('CertificateRegistry');
  const registry = await Registry.deploy();
  await registry.waitForDeployment();
  console.log('Registry deployed at:', await registry.getAddress());
}
main().catch((e) => { console.error(e); process.exitCode = 1; });
