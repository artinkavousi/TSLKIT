/**
 * Test Material Imports
 * 
 * Verify that all materials can be imported correctly
 */

// Test importing all materials
import * as Materials from './dist/index.js'

console.log('🧪 Testing Material Imports...\n')

// Check main exports
console.log('✅ Materials object:', typeof Materials)
console.log('✅ Total exports:', Object.keys(Materials).length)

// Test specific materials
const testMaterials = [
  'marble', 'wood', 'clouds', 'brain', 'cork',
  'crumpledFabric', 'satin', 'tigerFur', 'dalmatianSpots',
  'bricks', 'grid', 'circles', 'polkaDots', 'zebraLines',
  'concrete', 'caustics', 'rust', 'stars',
  'waterDrops', 'watermelon', 'caveArt', 'gasGiant',
  'planet', 'dysonSphere', 'darthMaul', 'scream',
  'camouflage', 'fordite', 'roughClay', 'staticNoise',
  'voronoiCells', 'turbulentSmoke', 'neonLights',
  'rotator', 'scaler', 'translator', 'melter'
]

let successCount = 0
let failCount = 0

console.log('\n📋 Testing Individual Materials:\n')

testMaterials.forEach(name => {
  if (Materials[name]) {
    console.log(`  ✅ ${name}`)
    successCount++
  } else {
    console.log(`  ❌ ${name} - NOT FOUND`)
    failCount++
  }
})

// Test utilities
console.log('\n🔧 Testing Utilities:\n')

const utilities = ['TSLFn', 'prepare', 'hsl', 'toHsl', 'matRotX', 'matRotY', 'matRotZ']

utilities.forEach(name => {
  if (Materials[name]) {
    console.log(`  ✅ ${name}`)
    successCount++
  } else {
    console.log(`  ❌ ${name} - NOT FOUND`)
    failCount++
  }
})

// Summary
console.log('\n' + '='.repeat(50))
console.log('📊 TEST SUMMARY:')
console.log('='.repeat(50))
console.log(`✅ Successful: ${successCount}`)
console.log(`❌ Failed: ${failCount}`)
console.log(`📦 Total Exports: ${Object.keys(Materials).length}`)

if (failCount === 0) {
  console.log('\n🎉 ALL TESTS PASSED! 🎉\n')
  process.exit(0)
} else {
  console.log('\n❌ SOME TESTS FAILED ❌\n')
  process.exit(1)
}

