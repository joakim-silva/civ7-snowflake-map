/*
    ============================================================
    LIMESPACE SNOWFLAKE
    MAP GLOBALS
    ============================================================

    Includes the constants required by:

    - snowflake.js
    - snowflake-terrain.js
    - snowflake-features.js
    - elevation-terrain-generator.js
    ============================================================
*/


// ============================================================
// LOOKUP HELPERS
// ============================================================

function terrainIndex(type) {

    const entry =
        GameInfo.Terrains.find(
            terrain =>
                terrain.TerrainType === type
        );

    if (!entry) {

        throw new Error(
            "Limespace Snowflake: Could not find terrain: " +
            type
        );
    }

    return entry.$index;
}


function biomeIndex(type) {

    const entry =
        GameInfo.Biomes.find(
            biome =>
                biome.BiomeType === type
        );

    if (!entry) {

        throw new Error(
            "Limespace Snowflake: Could not find biome: " +
            type
        );
    }

    return entry.$index;
}


function featureIndex(type) {

    const entry =
        GameInfo.Features.find(
            feature =>
                feature.FeatureType === type
        );

    if (!entry) {

        throw new Error(
            "Limespace Snowflake: Could not find feature: " +
            type
        );
    }

    return entry.$index;
}


// ============================================================
// FRACTAL IDS
// ============================================================

/*
    These are the IDs used by Firaxis's
    elevation-terrain-generator.js.
*/

const g_LandmassFractal =
    0;


const g_MountainFractal =
    1;


const g_HillFractal =
    2;


// ============================================================
// TERRAIN
// ============================================================

const g_FlatTerrain =
    terrainIndex(
        "TERRAIN_FLAT"
    );


const g_HillTerrain =
    terrainIndex(
        "TERRAIN_HILL"
    );


const g_MountainTerrain =
    terrainIndex(
        "TERRAIN_MOUNTAIN"
    );


// ============================================================
// WATER / RIVERS
// ============================================================

const g_CoastTerrain =
    terrainIndex(
        "TERRAIN_COAST"
    );


const g_OceanTerrain =
    terrainIndex(
        "TERRAIN_OCEAN"
    );


const g_NavigableRiverTerrain =
    terrainIndex(
        "TERRAIN_NAVIGABLE_RIVER"
    );


// ============================================================
// BIOMES
// ============================================================

const g_GrasslandBiome =
    biomeIndex(
        "BIOME_GRASSLAND"
    );


const g_PlainsBiome =
    biomeIndex(
        "BIOME_PLAINS"
    );


const g_DesertBiome =
    biomeIndex(
        "BIOME_DESERT"
    );


const g_TropicalBiome =
    biomeIndex(
        "BIOME_TROPICAL"
    );


const g_TundraBiome =
    biomeIndex(
        "BIOME_TUNDRA"
    );


const g_MarineBiome =
    biomeIndex(
        "BIOME_MARINE"
    );


// ============================================================
// FEATURES
// ============================================================

const g_ForestFeature =
    featureIndex(
        "FEATURE_FOREST"
    );


const g_RainforestFeature =
    featureIndex(
        "FEATURE_RAINFOREST"
    );


const g_TaigaFeature =
    featureIndex(
        "FEATURE_TAIGA"
    );


// ============================================================
// FIRAXIS WATER SETTINGS
// ============================================================

const g_PolarWaterRows =
    2;


const g_OceanWaterColumns =
    4;


// ============================================================
// FIRAXIS RAINFALL SETTINGS
// ============================================================

/*
    Required by elevation-terrain-generator.js
    -> buildRainfallMap()
*/

const g_StandardRainfall =
    100;


const g_MountainTopIncrease =
    80;


const g_RainShadowDrop =
    -80;


const g_RainShadowIncreasePerHex =
    10;


// ============================================================
// OTHER STANDARD FIRAXIS MAP VALUES
// ============================================================

const g_FractalWeight =
    0.8;


const g_WaterPercent =
    20;


const g_RequiredBufferBetweenMajorStarts =
    6;


const g_DesiredBufferBetweenMajorStarts =
    12;


// ============================================================
// EXPORTS
// ============================================================

export {

    // Fractals

    g_LandmassFractal,
    g_MountainFractal,
    g_HillFractal,

    // Terrain

    g_FlatTerrain,
    g_HillTerrain,
    g_MountainTerrain,

    // Water / Rivers

    g_CoastTerrain,
    g_OceanTerrain,
    g_NavigableRiverTerrain,

    // Biomes

    g_GrasslandBiome,
    g_PlainsBiome,
    g_DesertBiome,
    g_TropicalBiome,
    g_TundraBiome,
    g_MarineBiome,

    // Features

    g_ForestFeature,
    g_RainforestFeature,
    g_TaigaFeature,

    // Water settings

    g_PolarWaterRows,
    g_OceanWaterColumns,

    // Rainfall

    g_StandardRainfall,
    g_MountainTopIncrease,
    g_RainShadowDrop,
    g_RainShadowIncreasePerHex,

    // Standard map values

    g_FractalWeight,
    g_WaterPercent,

    g_RequiredBufferBetweenMajorStarts,
    g_DesiredBufferBetweenMajorStarts

};