/* eslint-env mocha */
const expect = require('chai').expect
const SimpleStorage = artifacts.require('SimpleStorage.sol')

contract('SimpleStorage', (accounts) => {
  it('is deployed', async function () {
    expect(await SimpleStorage.deployed()).to.exist()
  })

  it('...should store the value 89.', async () => {
    const simpleStorageInstance = await SimpleStorage.deployed()

    // Set value of 89
    await simpleStorageInstance.set(89, {from: accounts[0]})

    // Get stored value
    const storedData = await simpleStorageInstance.get.call()

    expect(storedData.toNumber()).to.equal(89)
  })
})
