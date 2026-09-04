/*
    ============================================================
    LIMESPACE SNOWFLAKE
    VERSION 8.5

    Browser map import + full Civ VII environment

    Includes:
    - Exact 61 x 61 custom Snowflake map
    - Browser-defined terrain / biomes
    - Browser-defined hills
    - Browser-defined mountains
    - Browser-defined forests
    - Civ VII rainfall
    - Civ VII rivers
    - Floodplains
    - Civ VII legal resources
    - Six exact player starts
    ============================================================
*/


// ============================================================
// IMPORTS
// ============================================================

import {

    g_FlatTerrain,

    g_CoastTerrain,
    g_OceanTerrain,

    g_GrasslandBiome,
    g_PlainsBiome,
    g_DesertBiome,
    g_TundraBiome,
    g_MarineBiome

} from "./map-globals.js";


import {

    LIMESPACE_SNOWFLAKE_MAP

} from "./snowflake-map-data.js";


/*
    Use Firaxis' own rainfall generator.

    We are not generating mountains/hills procedurally because
    those already exist in our browser JSON.
*/

import {

    buildRainfallMap

} from "/base-standard/maps/elevation-terrain-generator.js";


/*
    Use Firaxis' normal resource generator.

    This guarantees that the resources placed are legal for:

    - terrain
    - biome
    - age
    - land/water
    - resource rules
*/

import {

    generateResources

} from "/base-standard/maps/resource-generator.js";


// ============================================================
// CONSTANTS
// ============================================================

const EXPECTED_FORMAT =
    "LIMESPACE_CIV7_MAP_DATA";


const SNOWFLAKE_WIDTH =
    61;


const SNOWFLAKE_HEIGHT =
    61;


// ============================================================
// LOOK UP CIV VII TERRAIN TYPES
// ============================================================

function getTerrainIndex(
    terrainType
) {

    const terrain =
        GameInfo.Terrains.find(
            row =>
                row.TerrainType ===
                terrainType
        );


    if (
        !terrain
    ) {

        throw new Error(
            "Limespace Snowflake: Civ VII terrain not found: " +
            terrainType
        );
    }


    return terrain.$index;
}


const HILL_TERRAIN =
    getTerrainIndex(
        "TERRAIN_HILL"
    );


const MOUNTAIN_TERRAIN =
    getTerrainIndex(
        "TERRAIN_MOUNTAIN"
    );


const NAVIGABLE_RIVER_TERRAIN =
    getTerrainIndex(
        "TERRAIN_NAVIGABLE_RIVER"
    );


// ============================================================
// LOOK UP CIV VII FEATURES
// ============================================================

function getFeatureIndex(
    featureType
) {

    const feature =
        GameInfo.Features.find(
            row =>
                row.FeatureType ===
                featureType
        );


    if (
        !feature
    ) {

        console.log(
            "Snowflake warning: feature not found: " +
            featureType
        );

        return -1;
    }


    return feature.$index;
}


const FOREST_FEATURE =
    getFeatureIndex(
        "FEATURE_FOREST"
    );


// ============================================================
// FALLBACK PLAYER STARTS
// ============================================================

const FALLBACK_PLAYER_STARTS = [

    {
        player: 1,
        x: 44,
        y: 30
    },

    {
        player: 2,
        x: 37,
        y: 40
    },

    {
        player: 3,
        x: 23,
        y: 40
    },

    {
        player: 4,
        x: 16,
        y: 30
    },

    {
        player: 5,
        x: 23,
        y: 19
    },

    {
        player: 6,
        x: 37,
        y: 19
    }

];


// ============================================================
// MAP INITIALISATION
// ============================================================

function requestMapData(
    initParams
) {

    console.log(
        "=========================================="
    );


    console.log(
        "Limespace Snowflake V8.5 map init"
    );


    console.log(
        "Incoming dimensions: " +
        initParams.width +
        " x " +
        initParams.height
    );


    console.log(
        "Incoming map size ID: " +
        initParams.mapSize
    );


    // ========================================================
    // FORCE EXACT SNOWFLAKE DIMENSIONS
    // ========================================================

    initParams.width =
        SNOWFLAKE_WIDTH;


    initParams.height =
        SNOWFLAKE_HEIGHT;


    // ========================================================
    // DISABLE WRAPPING
    // ========================================================

    initParams.wrapX =
        0;


    initParams.wrapY =
        0;


    initParams.WrapX =
        0;


    initParams.WrapY =
        0;


    console.log(
        "Snowflake dimensions requested: " +
        initParams.width +
        " x " +
        initParams.height
    );


    console.log(
        "=========================================="
    );


    engine.call(
        "SetMapInitData",
        initParams
    );
}


// ============================================================
// IMPORT BASE TERRAIN / BIOME
// ============================================================

function applyExportedTile(
    x,
    y,
    terrainName
) {

    switch (
        terrainName
    ) {

        // ====================================================
        // OCEAN
        // ====================================================

        case "ocean":

            TerrainBuilder.setTerrainType(
                x,
                y,
                g_OceanTerrain
            );


            TerrainBuilder.setBiomeType(
                x,
                y,
                g_MarineBiome
            );


            break;


        // ====================================================
        // COAST
        // ====================================================

        case "coast":

            TerrainBuilder.setTerrainType(
                x,
                y,
                g_CoastTerrain
            );


            TerrainBuilder.setBiomeType(
                x,
                y,
                g_MarineBiome
            );


            break;


        // ====================================================
        // GRASSLAND
        // ====================================================

        case "grassland":

            TerrainBuilder.setTerrainType(
                x,
                y,
                g_FlatTerrain
            );


            TerrainBuilder.setBiomeType(
                x,
                y,
                g_GrasslandBiome
            );


            break;


        // ====================================================
        // PLAINS
        // ====================================================

        case "plains":

            TerrainBuilder.setTerrainType(
                x,
                y,
                g_FlatTerrain
            );


            TerrainBuilder.setBiomeType(
                x,
                y,
                g_PlainsBiome
            );


            break;


        // ====================================================
        // DESERT
        // ====================================================

        case "desert":

            TerrainBuilder.setTerrainType(
                x,
                y,
                g_FlatTerrain
            );


            TerrainBuilder.setBiomeType(
                x,
                y,
                g_DesertBiome
            );


            break;


        // ====================================================
        // TUNDRA
        // ====================================================

        case "tundra":

            TerrainBuilder.setTerrainType(
                x,
                y,
                g_FlatTerrain
            );


            TerrainBuilder.setBiomeType(
                x,
                y,
                g_TundraBiome
            );


            break;


        // ====================================================
        // UNKNOWN
        // ====================================================

        default:

            throw new Error(

                "Limespace Snowflake: unknown terrain '" +
                terrainName +
                "' at " +
                x +
                "," +
                y

            );
    }
}


// ============================================================
// IMPORT JSON MOUNTAINS
// ============================================================

function importMountains(
    width,
    height
) {

    console.log(
        "Importing browser mountains..."
    );


    let count =
        0;


    for (
        let y = 0;
        y < height;
        y++
    ) {

        const row =
            LIMESPACE_SNOWFLAKE_MAP
                .terrainRows[y];


        for (
            let x = 0;
            x < width;
            x++
        ) {

            const tile =
                row[x];


            if (
                !tile.land
            ) {

                continue;
            }


            if (
                tile.elevation ===
                "mountain"
            ) {

                TerrainBuilder.setTerrainType(
                    x,
                    y,
                    MOUNTAIN_TERRAIN
                );


                count++;
            }
        }
    }


    console.log(
        "Browser mountains imported: " +
        count
    );


    return count;
}


// ============================================================
// IMPORT JSON HILLS
// ============================================================

function importHills(
    width,
    height
) {

    console.log(
        "Importing browser hills..."
    );


    let count =
        0;


    for (
        let y = 0;
        y < height;
        y++
    ) {

        const row =
            LIMESPACE_SNOWFLAKE_MAP
                .terrainRows[y];


        for (
            let x = 0;
            x < width;
            x++
        ) {

            const tile =
                row[x];


            if (
                !tile.land
            ) {

                continue;
            }


            if (
                tile.elevation ===
                "hill"
            ) {

                TerrainBuilder.setTerrainType(
                    x,
                    y,
                    HILL_TERRAIN
                );


                count++;
            }
        }
    }


    console.log(
        "Browser hills imported: " +
        count
    );


    return count;
}


// ============================================================
// IMPORT JSON FORESTS
// ============================================================

function importFeatures(
    width,
    height
) {

    console.log(
        "Importing browser features..."
    );


    let forestCount =
        0;


    if (
        FOREST_FEATURE < 0
    ) {

        console.log(
            "Forest feature unavailable; skipping forests."
        );

        return {
            forests: 0
        };
    }


    for (
        let y = 0;
        y < height;
        y++
    ) {

        const row =
            LIMESPACE_SNOWFLAKE_MAP
                .terrainRows[y];


        for (
            let x = 0;
            x < width;
            x++
        ) {

            const tile =
                row[x];


            if (
                !tile.land
            ) {

                continue;
            }


            if (
                tile.feature !==
                "forest"
            ) {

                continue;
            }


            /*
                Do not place forest on a mountain.

                The browser editor normally avoids this anyway,
                but this protects Civ VII from an illegal
                combination.
            */

            if (
                tile.elevation ===
                "mountain"
            ) {

                console.log(
                    "Skipping forest on mountain at " +
                    x +
                    "," +
                    y
                );

                continue;
            }


            const featureParam = {

                Feature:
                    FOREST_FEATURE,

                Direction:
                    -1,

                Elevation:
                    0

            };


            TerrainBuilder.setFeatureType(
                x,
                y,
                featureParam
            );


            forestCount++;
        }
    }


    console.log(
        "Browser forests imported: " +
        forestCount
    );


    return {

        forests:
            forestCount

    };
}


// ============================================================
// GENERATE RIVERS
// ============================================================

function generateSnowflakeRivers(
    width,
    height
) {

    console.log(
        "=========================================="
    );


    console.log(
        "Generating Snowflake rivers..."
    );


    /*
        Firaxis continental maps use:

            modelRivers(5, 15, navigableRiverTerrain)

        We begin with the same conservative settings.

        Snowflake's arms are relatively narrow, so this is
        preferable to the much more aggressive archipelago
        value of 70.
    */

    TerrainBuilder.modelRivers(
        5,
        15,
        NAVIGABLE_RIVER_TERRAIN
    );


    // Let Civ VII reconcile river/terrain relationships.

    TerrainBuilder.validateAndFixTerrain();


    // Give modeled rivers their internal definitions/names.

    TerrainBuilder.defineNamedRivers();


    /*
        Add floodplains using Firaxis' normal continents-map
        settings.
    */

    TerrainBuilder.addFloodplains(
        4,
        10
    );


    // ========================================================
    // REPORT RESULT
    // ========================================================

    let ordinaryRiverTiles =
        0;


    let navigableRiverTiles =
        0;


    for (
        let y = 0;
        y < height;
        y++
    ) {

        for (
            let x = 0;
            x < width;
            x++
        ) {

            if (
                GameplayMap.isNavigableRiver(
                    x,
                    y
                )
            ) {

                navigableRiverTiles++;
            }

            else if (
                GameplayMap.isRiver(
                    x,
                    y
                )
            ) {

                ordinaryRiverTiles++;
            }
        }
    }


    console.log(
        "Ordinary river tiles: " +
        ordinaryRiverTiles
    );


    console.log(
        "Navigable river tiles: " +
        navigableRiverTiles
    );


    console.log(
        "=========================================="
    );


    return {

        ordinary:
            ordinaryRiverTiles,

        navigable:
            navigableRiverTiles

    };
}


// ============================================================
// GENERATE CIV VII RESOURCES
// ============================================================

function generateSnowflakeResources(
    width,
    height
) {

    console.log(
        "=========================================="
    );


    console.log(
        "Generating Civ VII resources..."
    );


    /*
        This uses Firaxis' own generator.

        The browser editor's resourceSlot data remains available
        in the JSON. For V8.5 we let Civ VII choose the actual
        legal resource types.

        A later version can make the JSON slots control the
        exact resource positions/categories.
    */

    generateResources(
        width,
        height
    );


    // ========================================================
    // COUNT RESOURCES
    // ========================================================

    let resourceCount =
        0;


    for (
        let y = 0;
        y < height;
        y++
    ) {

        for (
            let x = 0;
            x < width;
            x++
        ) {

            const resource =
                GameplayMap.getResourceType(
                    x,
                    y
                );


            if (
                resource !==
                ResourceTypes.NO_RESOURCE
            ) {

                resourceCount++;
            }
        }
    }


    console.log(
        "Resources placed: " +
        resourceCount
    );


    console.log(
        "=========================================="
    );


    return resourceCount;
}


// ============================================================
// PLAYER START DATA
// ============================================================

function getSnowflakePlayerStarts() {

    if (

        Array.isArray(
            LIMESPACE_SNOWFLAKE_MAP
                .playerStarts
        ) &&

        LIMESPACE_SNOWFLAKE_MAP
            .playerStarts
            .length >= 6

    ) {

        console.log(
            "Using player starts from browser export."
        );


        return (
            LIMESPACE_SNOWFLAKE_MAP
                .playerStarts
        );
    }


    console.log(
        "Browser export has no valid playerStarts array."
    );


    console.log(
        "Using V8.5 fallback Snowflake starts."
    );


    return FALLBACK_PLAYER_STARTS;
}


// ============================================================
// ASSIGN EXACT PLAYER STARTS
// ============================================================

function assignSnowflakePlayerStarts(
    width,
    height
) {

    console.log(
        "=========================================="
    );


    console.log(
        "Assigning fixed Snowflake player starts..."
    );


    const configuredStarts =
        getSnowflakePlayerStarts();


    const aliveMajorIds =
        Players.getAliveMajorIds();


    if (
        !Array.isArray(
            aliveMajorIds
        )
    ) {

        throw new Error(

            "Limespace Snowflake: " +
            "Players.getAliveMajorIds() did not return an array."

        );
    }


    console.log(
        "Alive major players: " +
        aliveMajorIds.length
    );


    if (
        aliveMajorIds.length >
        configuredStarts.length
    ) {

        throw new Error(

            "Limespace Snowflake supports " +
            configuredStarts.length +
            " fixed major starts, but Civ VII has " +
            aliveMajorIds.length +
            " alive major players."

        );
    }


    const assignedStarts =
        [];


    for (
        let i = 0;
        i < aliveMajorIds.length;
        i++
    ) {

        const playerId =
            aliveMajorIds[i];


        const start =
            configuredStarts[i];


        const x =
            Number(
                start.x
            );


        const y =
            Number(
                start.y
            );


        // ====================================================
        // VALIDATE
        // ====================================================

        if (

            !Number.isInteger(x) ||
            !Number.isInteger(y)

        ) {

            throw new Error(

                "Limespace Snowflake: invalid start coordinate " +
                "for arm " +
                (i + 1)

            );
        }


        if (

            x < 0 ||
            x >= width ||
            y < 0 ||
            y >= height

        ) {

            throw new Error(

                "Limespace Snowflake: start " +
                (i + 1) +
                " outside map at " +
                x +
                "," +
                y

            );
        }


        const plotIndex =
            y * width + x;


        StartPositioner.setStartPosition(
            plotIndex,
            playerId
        );


        assignedStarts.push(
            plotIndex
        );


        console.log(

            "Player " +
            playerId +
            " -> arm " +
            (i + 1) +
            " at (" +
            x +
            ", " +
            y +
            "), plot=" +
            plotIndex

        );
    }


    console.log(
        "Fixed player starts assigned: " +
        assignedStarts.length
    );


    console.log(
        "=========================================="
    );


    return assignedStarts;
}


// ============================================================
// VERIFY STARTS
// ============================================================

function verifySnowflakePlayerStarts() {

    const aliveMajorIds =
        Players.getAliveMajorIds();


    console.log(
        "Verifying Snowflake starts..."
    );


    for (
        let i = 0;
        i < aliveMajorIds.length;
        i++
    ) {

        const playerId =
            aliveMajorIds[i];


        const plotIndex =
            StartPositioner.getStartPosition(
                playerId
            );


        if (
            plotIndex === -1
        ) {

            throw new Error(

                "Limespace Snowflake: player " +
                playerId +
                " has no starting plot."

            );
        }


        const x =
            plotIndex %
            GameplayMap.getGridWidth();


        const y =
            Math.floor(

                plotIndex /
                GameplayMap.getGridWidth()

            );


        console.log(

            "Verified player " +
            playerId +
            " start: (" +
            x +
            ", " +
            y +
            ")"

        );
    }
}


// ============================================================
// GENERATE MAP
// ============================================================

function generateMap() {

    console.log(
        "=========================================="
    );


    console.log(
        "Generating Limespace Snowflake V8.5"
    );


    console.log(
        "Terrain + Elevation + Forests + Rivers + Resources"
    );


    console.log(
        "=========================================="
    );


    // ========================================================
    // VALIDATE EXPORT
    // ========================================================

    if (
        !LIMESPACE_SNOWFLAKE_MAP
    ) {

        throw new Error(

            "Limespace Snowflake: " +
            "LIMESPACE_SNOWFLAKE_MAP is missing."

        );
    }


    if (

        LIMESPACE_SNOWFLAKE_MAP.format !==
        EXPECTED_FORMAT

    ) {

        throw new Error(

            "Limespace Snowflake: invalid map format. " +

            "Expected '" +
            EXPECTED_FORMAT +

            "', received '" +
            LIMESPACE_SNOWFLAKE_MAP.format +
            "'."

        );
    }


    // ========================================================
    // DIMENSIONS
    // ========================================================

    const width =
        GameplayMap.getGridWidth();


    const height =
        GameplayMap.getGridHeight();


    const exportWidth =
        LIMESPACE_SNOWFLAKE_MAP.width;


    const exportHeight =
        LIMESPACE_SNOWFLAKE_MAP.height;


    console.log(
        "Civ VII dimensions: " +
        width +
        " x " +
        height
    );


    console.log(
        "Export dimensions: " +
        exportWidth +
        " x " +
        exportHeight
    );


    if (

        width !== exportWidth ||
        height !== exportHeight

    ) {

        throw new Error(

            "Limespace Snowflake: map dimension mismatch. " +

            "Civ VII = " +
            width +
            "x" +
            height +

            ", export = " +
            exportWidth +
            "x" +
            exportHeight

        );
    }


    console.log(
        "Map dimensions match."
    );


    // ========================================================
    // TERRAIN ROW VALIDATION
    // ========================================================

    if (

        !Array.isArray(
            LIMESPACE_SNOWFLAKE_MAP
                .terrainRows
        )

    ) {

        throw new Error(

            "Limespace Snowflake: terrainRows missing."

        );
    }


    if (

        LIMESPACE_SNOWFLAKE_MAP
            .terrainRows
            .length !== height

    ) {

        throw new Error(

            "Limespace Snowflake: terrainRows height mismatch."

        );
    }


    // ========================================================
    // TERRAIN COUNTERS
    // ========================================================

    const counts = {

        ocean: 0,

        coast: 0,

        grassland: 0,

        plains: 0,

        desert: 0,

        tundra: 0

    };


    let totalTiles =
        0;


    // ========================================================
    // STAGE 1
    // IMPORT BASE TERRAIN AND BIOMES
    // ========================================================

    console.log(
        "Importing browser terrain..."
    );


    for (
        let y = 0;
        y < height;
        y++
    ) {

        const row =
            LIMESPACE_SNOWFLAKE_MAP
                .terrainRows[y];


        if (
            !Array.isArray(row)
        ) {

            throw new Error(

                "Limespace Snowflake: terrain row " +
                y +
                " missing."

            );
        }


        if (
            row.length !== width
        ) {

            throw new Error(

                "Limespace Snowflake: terrain row " +
                y +
                " width=" +
                row.length +
                ", expected=" +
                width

            );
        }


        for (
            let x = 0;
            x < width;
            x++
        ) {

            const tile =
                row[x];


            if (
                !tile
            ) {

                throw new Error(

                    "Limespace Snowflake: missing tile at " +
                    x +
                    "," +
                    y

                );
            }


            if (

                tile.x !== x ||
                tile.y !== y

            ) {

                throw new Error(

                    "Limespace Snowflake: coordinate mismatch at " +
                    x +
                    "," +
                    y

                );
            }


            if (
                typeof tile.terrain !==
                "string"
            ) {

                throw new Error(

                    "Limespace Snowflake: no terrain string at " +
                    x +
                    "," +
                    y

                );
            }


            applyExportedTile(
                x,
                y,
                tile.terrain
            );


            if (

                Object.prototype
                    .hasOwnProperty
                    .call(
                        counts,
                        tile.terrain
                    )

            ) {

                counts[
                    tile.terrain
                ]++;
            }


            totalTiles++;
        }
    }


    console.log(
        "Base terrain import complete."
    );


    console.log(
        "Ocean: " +
        counts.ocean
    );


    console.log(
        "Coast: " +
        counts.coast
    );


    console.log(
        "Grassland: " +
        counts.grassland
    );


    console.log(
        "Plains: " +
        counts.plains
    );


    console.log(
        "Desert: " +
        counts.desert
    );


    console.log(
        "Tundra: " +
        counts.tundra
    );


    console.log(
        "Total tiles: " +
        totalTiles
    );


    // ========================================================
    // TILE COUNT CHECK
    // ========================================================

    const expectedTileCount =
        width *
        height;


    if (
        totalTiles !==
        expectedTileCount
    ) {

        throw new Error(

            "Limespace Snowflake: imported " +
            totalTiles +
            " tiles, expected " +
            expectedTileCount

        );
    }


    if (
        totalTiles !==
        3721
    ) {

        throw new Error(

            "Limespace Snowflake: expected 3721 tiles, got " +
            totalTiles

        );
    }


    // ========================================================
    // STAGE 2
    // INITIAL TERRAIN GEOMETRY
    // ========================================================

    console.log(
        "Validating base terrain..."
    );


    TerrainBuilder.validateAndFixTerrain();


    console.log(
        "Recalculating areas..."
    );


    AreaBuilder.recalculateAreas();


    console.log(
        "Stamping continents..."
    );


    TerrainBuilder.stampContinents();


    // ========================================================
    // STAGE 3
    // JSON MOUNTAINS
    // ========================================================

    const mountainCount =
        importMountains(
            width,
            height
        );


    // ========================================================
    // STAGE 4
    // BUILD ELEVATION
    // ========================================================

    console.log(
        "Building Civ VII elevation data..."
    );


    TerrainBuilder.buildElevation();


    // ========================================================
    // STAGE 5
    // JSON HILLS
    // ========================================================

    const hillCount =
        importHills(
            width,
            height
        );


    // ========================================================
    // STAGE 6
    // RAINFALL
    // ========================================================

    console.log(
        "Building rainfall map..."
    );


    buildRainfallMap(
        width,
        height
    );


    // ========================================================
    // STAGE 7
    // RIVERS
    // ========================================================

    const riverStats =
        generateSnowflakeRivers(
            width,
            height
        );


    // ========================================================
    // STAGE 8
    // JSON FORESTS
    // ========================================================

    const featureStats =
        importFeatures(
            width,
            height
        );


    // ========================================================
    // STAGE 9
    // FINAL TERRAIN VALIDATION
    // ========================================================

    console.log(
        "Final terrain validation..."
    );


    TerrainBuilder.validateAndFixTerrain();


    console.log(
        "Recalculating final map areas..."
    );


    AreaBuilder.recalculateAreas();


    // ========================================================
    // STAGE 10
    // WATER DATA
    // ========================================================

    console.log(
        "Storing water data..."
    );


    TerrainBuilder.storeWaterData();


    // ========================================================
    // STAGE 11
    // RESOURCES
    // ========================================================

    const resourceCount =
        generateSnowflakeResources(
            width,
            height
        );


    // ========================================================
    // STAGE 12
    // FERTILITY
    // ========================================================

    console.log(
        "Recalculating fertility..."
    );


    FertilityBuilder.recalculate();


    // ========================================================
    // STAGE 13
    // FIXED SIX PLAYER STARTS
    // ========================================================

    const startPositions =
        assignSnowflakePlayerStarts(
            width,
            height
        );


    verifySnowflakePlayerStarts();


    // ========================================================
    // FINAL REPORT
    // ========================================================

    console.log(
        "=========================================="
    );


    console.log(
        "Limespace Snowflake V8.5 complete"
    );


    console.log(
        "Grid: " +
        width +
        " x " +
        height
    );


    console.log(
        "Tiles: " +
        totalTiles
    );


    console.log(
        "Mountains: " +
        mountainCount
    );


    console.log(
        "Hills: " +
        hillCount
    );


    console.log(
        "Forests: " +
        featureStats.forests
    );


    console.log(
        "Ordinary rivers: " +
        riverStats.ordinary
    );


    console.log(
        "Navigable rivers: " +
        riverStats.navigable
    );


    console.log(
        "Resources: " +
        resourceCount
    );


    console.log(
        "Major starts: " +
        startPositions.length
    );


    console.log(
        "=========================================="
    );
}


// ============================================================
// CIV VII EVENTS
// ============================================================

engine.on(
    "RequestMapInitData",
    requestMapData
);


engine.on(
    "GenerateMap",
    generateMap
);


console.log(
    "Loaded Limespace Snowflake V8.5"
);