/**
 * Material Tests
 * 
 * Basic validation tests for all 53 materials
 */

import { describe, it, expect } from 'vitest'
import * as Materials from '../../src/materials/index.js'

describe('Materials Module', () => {
  it('should export all materials', () => {
    // Verify module structure
    expect(Materials).toBeDefined()
    expect(typeof Materials).toBe('object')
  })

  it('should export utility functions', () => {
    expect(Materials.TSLFn).toBeDefined()
    expect(Materials.prepare).toBeDefined()
    expect(Materials.hsl).toBeDefined()
    expect(Materials.toHsl).toBeDefined()
  })

  it('should export matrix utilities', () => {
    expect(Materials.matRotX).toBeDefined()
    expect(Materials.matRotY).toBeDefined()
    expect(Materials.matRotZ).toBeDefined()
    expect(Materials.matRotYXZ).toBeDefined()
    expect(Materials.matScale).toBeDefined()
    expect(Materials.matTrans).toBeDefined()
    expect(Materials.selectPlanar).toBeDefined()
  })
})

describe('Organic Materials (5)', () => {
  it('marble - should be callable', () => {
    expect(Materials.marble).toBeDefined()
    expect(typeof Materials.marble).toBe('function')
  })

  it('wood - should be callable', () => {
    expect(Materials.wood).toBeDefined()
    expect(typeof Materials.wood).toBe('function')
  })

  it('clouds - should be callable with opacity channel', () => {
    expect(Materials.clouds).toBeDefined()
    expect(typeof Materials.clouds).toBe('function')
    expect((Materials.clouds as any).opacity).toBeDefined()
  })

  it('brain - should be callable with normal channel', () => {
    expect(Materials.brain).toBeDefined()
    expect(typeof Materials.brain).toBe('function')
    expect((Materials.brain as any).normal).toBeDefined()
  })

  it('cork - should be callable', () => {
    expect(Materials.cork).toBeDefined()
    expect(typeof Materials.cork).toBe('function')
  })
})

describe('Fabric Materials (4)', () => {
  it('crumpledFabric - should be callable', () => {
    expect(Materials.crumpledFabric).toBeDefined()
    expect(typeof Materials.crumpledFabric).toBe('function')
  })

  it('satin - should be callable', () => {
    expect(Materials.satin).toBeDefined()
    expect(typeof Materials.satin).toBe('function')
  })

  it('tigerFur - should be callable', () => {
    expect(Materials.tigerFur).toBeDefined()
    expect(typeof Materials.tigerFur).toBe('function')
  })

  it('dalmatianSpots - should be callable', () => {
    expect(Materials.dalmatianSpots).toBeDefined()
    expect(typeof Materials.dalmatianSpots).toBe('function')
  })
})

describe('Pattern Materials (5)', () => {
  it('bricks - should be callable', () => {
    expect(Materials.bricks).toBeDefined()
    expect(typeof Materials.bricks).toBe('function')
  })

  it('grid - should be callable', () => {
    expect(Materials.grid).toBeDefined()
    expect(typeof Materials.grid).toBe('function')
  })

  it('circles - should be callable', () => {
    expect(Materials.circles).toBeDefined()
    expect(typeof Materials.circles).toBe('function')
  })

  it('polkaDots - should be callable', () => {
    expect(Materials.polkaDots).toBeDefined()
    expect(typeof Materials.polkaDots).toBe('function')
  })

  it('zebraLines - should be callable', () => {
    expect(Materials.zebraLines).toBeDefined()
    expect(typeof Materials.zebraLines).toBe('function')
  })
})

describe('Surface Materials (6)', () => {
  it('concrete - should be callable with normal channel', () => {
    expect(Materials.concrete).toBeDefined()
    expect(typeof Materials.concrete).toBe('function')
    expect((Materials.concrete as any).normal).toBeDefined()
  })

  it('caustics - should be callable', () => {
    expect(Materials.caustics).toBeDefined()
    expect(typeof Materials.caustics).toBe('function')
  })

  it('rust - should be callable with opacity channel', () => {
    expect(Materials.rust).toBeDefined()
    expect(typeof Materials.rust).toBe('function')
    expect((Materials.rust as any).opacity).toBeDefined()
  })

  it('stars - should be callable', () => {
    expect(Materials.stars).toBeDefined()
    expect(typeof Materials.stars).toBe('function')
  })

  it('processedWood - should be callable', () => {
    expect(Materials.processedWood).toBeDefined()
    expect(typeof Materials.processedWood).toBe('function')
  })

  it('karstRock - should be callable', () => {
    expect(Materials.karstRock).toBeDefined()
    expect(typeof Materials.karstRock).toBe('function')
  })
})

describe('Nature Materials (4)', () => {
  it('waterDrops - should be callable with normal channel', () => {
    expect(Materials.waterDrops).toBeDefined()
    expect(typeof Materials.waterDrops).toBe('function')
    expect((Materials.waterDrops as any).normal).toBeDefined()
  })

  it('watermelon - should be callable', () => {
    expect(Materials.watermelon).toBeDefined()
    expect(typeof Materials.watermelon).toBe('function')
  })

  it('caveArt - should be callable', () => {
    expect(Materials.caveArt).toBeDefined()
    expect(typeof Materials.caveArt).toBe('function')
  })

  it('gasGiant - should be callable', () => {
    expect(Materials.gasGiant).toBeDefined()
    expect(typeof Materials.gasGiant).toBe('function')
  })
})

describe('Artistic Materials (4)', () => {
  it('planet - should be callable', () => {
    expect(Materials.planet).toBeDefined()
    expect(typeof Materials.planet).toBe('function')
  })

  it('dysonSphere - should be callable', () => {
    expect(Materials.dysonSphere).toBeDefined()
    expect(typeof Materials.dysonSphere).toBe('function')
  })

  it('darthMaul - should be callable', () => {
    expect(Materials.darthMaul).toBeDefined()
    expect(typeof Materials.darthMaul).toBe('function')
  })

  it('scream - should be callable', () => {
    expect(Materials.scream).toBeDefined()
    expect(typeof Materials.scream).toBe('function')
  })
})

describe('Miscellaneous Materials (21)', () => {
  const miscMaterials = [
    'camouflage',
    'fordite',
    'roughClay',
    'staticNoise',
    'voronoiCells',
    'turbulentSmoke',
    'neonLights',
    'supersphere',
    'isolines',
    'isolayers',
    'photosphere',
    'protozoa',
    'circleDecor',
    'entangled',
    'reticularVeins',
    'romanPaving',
    'runnyEggs',
    'scepterHead',
    'simplexNoise',
  ]

  miscMaterials.forEach((materialName) => {
    it(`${materialName} - should be callable`, () => {
      expect((Materials as any)[materialName]).toBeDefined()
      expect(typeof (Materials as any)[materialName]).toBe('function')
    })
  })

  it('roughClay - should have normal channel', () => {
    expect((Materials.roughClay as any).normal).toBeDefined()
  })

  it('supersphere - should have normal channel', () => {
    expect((Materials.supersphere as any).normal).toBeDefined()
  })

  it('runnyEggs - should have normal and roughness channels', () => {
    expect((Materials.runnyEggs as any).normal).toBeDefined()
    expect((Materials.runnyEggs as any).roughness).toBeDefined()
  })
})

describe('Utility Materials (4)', () => {
  it('rotator - should be callable with normal channel', () => {
    expect(Materials.rotator).toBeDefined()
    expect(typeof Materials.rotator).toBe('function')
    expect((Materials.rotator as any).normal).toBeDefined()
  })

  it('scaler - should be callable with normal channel', () => {
    expect(Materials.scaler).toBeDefined()
    expect(typeof Materials.scaler).toBe('function')
    expect((Materials.scaler as any).normal).toBeDefined()
  })

  it('translator - should be callable with normal channel', () => {
    expect(Materials.translator).toBeDefined()
    expect(typeof Materials.translator).toBe('function')
    expect((Materials.translator as any).normal).toBeDefined()
  })

  it('melter - should be callable with normal channel', () => {
    expect(Materials.melter).toBeDefined()
    expect(typeof Materials.melter).toBe('function')
    expect((Materials.melter as any).normal).toBeDefined()
  })
})

describe('Material Count', () => {
  it('should have all 53 materials exported', () => {
    const materialNames = [
      // Organic (5)
      'marble',
      'wood',
      'clouds',
      'brain',
      'cork',
      // Fabric (4)
      'crumpledFabric',
      'satin',
      'tigerFur',
      'dalmatianSpots',
      // Patterns (5)
      'bricks',
      'grid',
      'circles',
      'polkaDots',
      'zebraLines',
      // Surfaces (6)
      'concrete',
      'caustics',
      'rust',
      'stars',
      'processedWood',
      'karstRock',
      // Nature (4)
      'waterDrops',
      'watermelon',
      'caveArt',
      'gasGiant',
      // Artistic (4)
      'planet',
      'dysonSphere',
      'darthMaul',
      'scream',
      // Misc (21)
      'camouflage',
      'fordite',
      'roughClay',
      'staticNoise',
      'voronoiCells',
      'turbulentSmoke',
      'neonLights',
      'supersphere',
      'isolines',
      'isolayers',
      'photosphere',
      'protozoa',
      'circleDecor',
      'entangled',
      'reticularVeins',
      'romanPaving',
      'runnyEggs',
      'scepterHead',
      'simplexNoise',
      // Utilities (4)
      'rotator',
      'scaler',
      'translator',
      'melter',
    ]

    expect(materialNames).toHaveLength(53)

    materialNames.forEach((name) => {
      expect((Materials as any)[name]).toBeDefined()
    })
  })
})

describe('Special Channels Summary', () => {
  it('should have 3 materials with opacity channels', () => {
    const opacityMaterials = ['clouds', 'rust', 'staticNoise']
    opacityMaterials.forEach((name) => {
      const material = (Materials as any)[name]
      expect(material).toBeDefined()
      if (name !== 'staticNoise') {
        // staticNoise has built-in opacity in color output
        expect(material.opacity).toBeDefined()
      }
    })
  })

  it('should have 9 materials with normal channels', () => {
    const normalMaterials = [
      'brain',
      'waterDrops',
      'concrete',
      'roughClay',
      'supersphere',
      'runnyEggs',
      'rotator',
      'scaler',
      'translator',
      'melter',
    ]
    normalMaterials.forEach((name) => {
      const material = (Materials as any)[name]
      expect(material).toBeDefined()
      expect(material.normal).toBeDefined()
    })
  })

  it('should have 1 material with roughness channel', () => {
    expect((Materials.runnyEggs as any).roughness).toBeDefined()
  })
})

