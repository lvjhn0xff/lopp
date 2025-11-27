import { test } from '@japa/runner'
import { ModelRegistry } from '#lopp'
import { spyOn } from 'tinyspy'
import env from '#start/env'
import testUtils from '@adonisjs/core/services/test_utils'
import RegistryTable from '../../app/lopp/models/RegistryTable.js'

test.group('ModelRegistry', () => {
  test('setScanLocation() - can set scan location', async ({ assert }) => {
    const mr = new ModelRegistry()
    const locations = { "foo" :  "bar" }
    mr.setScanLocations(locations)
    assert.strictEqual(mr.scanLocations, locations)
  })

  test('getCompleteModelMapping() - gets complete table mapping', async ({ assert }) => {
    const mr = new ModelRegistry()

    mr.scanLocations = {
      "./extras/test-models" : "#test-models", 
      "./extras/misc-models" : "#misc-models"
    } 

    const fullModelMapping = await mr.getCompleteModelMapping() 

    assert.deepEqual(Object.keys(fullModelMapping).length, 15)
    assert.isTrue("Device" in fullModelMapping)
    assert.isTrue("MiscModelA" in fullModelMapping)
  })

  test('loadTableMapping() - saves to object property', async ({ assert }) => {
    const mr = new ModelRegistry()

    mr.scanLocations = {
      "./extras/test-models" : "#test-models", 
      "./extras/misc-models" : "#misc-models"
    } 
    
    const fullModelMapping = ({ "foo" : "bar" });

    spyOn(
      mr, "getCompleteModelMapping", 
      async () => fullModelMapping
    ) 

    await mr.loadModelMapping()

    assert.deepEqual(mr.modelMapping, fullModelMapping)

  })


  test('reset() - clears registry contents', async ({ assert }) => {
    const mr = new ModelRegistry()
    
    let rowCount =
      (await RegistryTable.query().count("id", "total"))[0].$extras["total"]

    if(rowCount == 0) {
      await RegistryTable.create({ "modelName" : "User "})
      await RegistryTable.create({ "modelName" : "Country "})
      await RegistryTable.create({ "modelName" : "Profile "})
    }

    rowCount =
     (await RegistryTable.query().count("id", "total"))[0].$extras["total"]

    assert.notEqual(rowCount, 0)

    await mr.reset() 

    rowCount =
     (await RegistryTable.query().count("id", "total"))[0].$extras["total"]

    assert.deepEqual(rowCount, 0)
  })
  
  test('update() - create from blank state', async ({ assert }) => {
    const mr = new ModelRegistry() 

    mr.modelMapping = {
      "User" : "#/path/to/user", 
      "Country": "#/path/to/country", 
      "Profile" : "#/path/to/profile"
    }

    await mr.update() 

    const recordCount = 
      (await RegistryTable.query().count("id", "total"))[0].$extras["total"]
    
    assert.deepEqual(recordCount, 3)

    await RegistryTable.truncate()
  })


  test('update() - extend existing state', async ({ assert }) => {
    const mr = new ModelRegistry() 

    mr.modelMapping = {
      "User" : "#/path/to/user", 
      "Country": "#/path/to/country", 
      "Profile" : "#/path/to/profile"
    }

    await mr.update() 

    let recordCount = 
      (await RegistryTable.query().count("id", "total"))[0].$extras["total"]
    
    assert.deepEqual(recordCount, 3)

    mr.modelMapping = {
      "User" : "#/path/to/user", 
      "Country": "#/path/to/country", 
      "Profile" : "#/path/to/profile",
      "Post" : "#/path/to/post",
      "Comment" : "#/path/to/comment"
    }

    await mr.update() 

    recordCount = 
      (await RegistryTable.query().count("id", "total"))[0].$extras["total"]
    
    assert.deepEqual(recordCount, 5)

    await RegistryTable.truncate()

  })

  test('getModelCount() - count models in registry', async ({ assert }) => {
    const mr = new ModelRegistry() 

    mr.modelMapping = {
      "User" : "#/path/to/user", 
      "Country": "#/path/to/country", 
      "Profile" : "#/path/to/profile"
    }

    await mr.update() 

    let recordCount = await mr.getModelCount()

    assert.strictEqual(recordCount, 3)

    await RegistryTable.truncate()
  })

 
})