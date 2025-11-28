import { test } from '@japa/runner'
import { LoppHelpers } from '#lopp/core/helpers'

test.group('LoppHelpers', () => {
  test('listAllFiles()', async ({ assert }) => {
    const fileList = LoppHelpers.listAllFiles("./extras/test-models") 
    assert.strictEqual(fileList.length, 16) 
    assert.include(fileList, "devices/desktop_device.ts")
    assert.include(fileList, "device.ts")
  })

  test('trimCurrentDirectory() - trimmed', ({ assert }) => {
    assert.strictEqual(
      LoppHelpers.trimCurrentDirectory("./hello-there"), 
      "hello-there"
    )
  })

  test('trimCurrentDirectory() - not-trimmed', ({ assert }) => {
    assert.strictEqual(
      LoppHelpers.trimCurrentDirectory("hello-there"), 
      "hello-there"
    )
  })

  test('trimCurrentDirectory() - replaced', ({ assert }) => {
    assert.strictEqual(
      LoppHelpers.replaceWithJSExtension("hello-there.ts"), 
      "hello-there.js"
    )
  })
  
  test('removeExtension() - removed', ({ assert }) => {
    assert.strictEqual(
      LoppHelpers.removeExtension("hello-there.ts", ".ts"), 
      "hello-there"
    )
  })

  test('removeExtension() - not-removed', ({ assert }) => {
    assert.strictEqual(
      LoppHelpers.removeExtension("hello-there.ts", ".js"), 
      "hello-there.ts"
    )
  })

  test('filterByFileExtension() - removes some files', ({ assert }) => {
    const locations = [
      "file1.ts",
      "file2.js",
      "file3.js",
      "file4.ts"
    ]; 
    const filteredLocations = LoppHelpers.filterByFileExtension(locations, ".ts")
    assert.lengthOf(filteredLocations, 2)
    assert.deepEqual(filteredLocations, ["file1.ts", "file4.ts"])
  })


  test('mapFilesToModel()- can map properly', async ({ assert }) => {
    const fileList = [ 
      "devices/desktop_device.ts", 
      "device.ts" 
    ]; 
    const location = "#test-models" 
    const modelMapping = await LoppHelpers.mapFilesToModels(fileList, location)

    assert.deepEqual(modelMapping, {
      "DesktopDevice" : "#test-models/devices/desktop_device",
      "Device": "#test-models/device", 
    })
  })
})