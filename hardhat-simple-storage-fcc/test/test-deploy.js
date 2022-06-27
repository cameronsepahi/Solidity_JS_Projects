const { ethers } = require("hardhat")
const { expect, assert } = require("chai")

// describe("SimpleStorage", () => {}) //Effectively the same as line2, but line2 is better practice
describe("SimpleStorage", function () {
  //initializes vars inside of beforeEach such that they are accessible throughout describe()
  let simpleStorageFactory, simpleStorage
  beforeEach(async function () {
    //defines what the file does before we run our tests (i.e. first deploys contracts)
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
    simpleStorage = await simpleStorageFactory.deploy()
  })

  it("Should start with a favorite number of 0", async function () {
    const currentValue = await simpleStorage.retrieve()
    const expectedValue = "0"
    // assert
    // expect
    assert.equal(currentValue.toString(), expectedValue)
    // expect(currentValue.toString()).to.equal(expectedValue)
  })
  it("Should update when we call store", async function () {
    const expectedValue = "7"
    const transactionResponse = await simpleStorage.store(expectedValue)
    await transactionResponse.wait(1)

    const currentValue = await simpleStorage.retrieve()
    assert.equal(currentValue.toString(), expectedValue)
  })
  it("addPerson.people should equal the designated favoriteName & favoriteNumber", async function () {
    const expectedName = "Cameron"
    const expectedFavoriteNumber = "5"

    const addingPerson = await simpleStorage.addPerson(
      expectedName,
      expectedFavoriteNumber
    )
    await addingPerson.wait(1)
    const { favoriteNumber, name } = await simpleStorage.people(0)
    assert.equal(name, expectedName)
    assert.equal(favoriteNumber, expectedFavoriteNumber)
  })
})
