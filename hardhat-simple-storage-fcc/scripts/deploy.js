//imports
const { ethers, run, network } = require("hardhat") // because package.json has ethers built in with hardhat

// async main

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
  console.log("Deploying contract...")
  const simpleStorage = await SimpleStorageFactory.deploy()
  await simpleStorage.deployed() //waits to make sure contract gets deployed
  console.log(`Deployed contact to: ${simpleStorage.address}`)
  // Since there is no "hardhat etherscan", meaning we can't verify the contract, we need to
  //check if we are on a live network or not
  if (network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    //if we are on rinkeby (chainId 4) and if we have an existing etherscan API key in our .env
    console.log("Waiting for block txes...")
    await simpleStorage.deployTransaction.wait(6) // we want to wait for tx confirmation
    await verify(simpleStorage.address, [])
  }

  const currentValue = await simpleStorage.retrieve()
  console.log(`Current value is: ${currentValue}`)

  //Update the current value
  const transactionResponse = await simpleStorage.store(7)
  await transactionResponse.wait(1)
  const updatedValue = await simpleStorage.retrieve()
  console.log(`Updated Value is: ${updatedValue}`)
}

const verify = async (contractAddress, args) => {
  console.log("Verifying contract...")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    //(e) is any error that the try section throws.
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!")
    } else {
      console.log(e)
    }
  }
}

//main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
