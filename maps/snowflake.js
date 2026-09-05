/*
    ============================================================
    LIMESPACE SNOWFLAKE
    VERSION 8.8

    Fixed:
    - 61 x 61 Snowflake layout
    - base terrain / biomes
    - six fixed player starts

    Procedural:
    - mountains
    - hills
    - forests
    - rainfall
    - rivers
    - floodplains
    - resources

    Steam-safe:
    - no /base-standard/ JavaScript imports
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


// ============================================================
// CONSTANTS
// ============================================================

const EXPECTED_FORMAT =
    "LIMESPACE_CIV7_MAP_DATA";

const SNOWFLAKE_WIDTH =
    61;

const SNOWFLAKE_HEIGHT =
    61;


// Terrain generation percentages.

const MOUNTAIN_CHANCE =
    6;

const HILL_CHANCE =
    28;

const FOREST_GRASSLAND_CHANCE =
    28;

const FOREST_PLAINS_CHANCE =
    20;

const RESOURCE_PLACEMENT_CHANCE =
    13;


// Protect starting regions.

const MOUNTAIN_START_BUFFER_SQ =
    9;

const HILL_START_BUFFER_SQ =
    4;


// ============================================================
// GAMEINFO LOOKUPS
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
            "Limespace Snowflake: terrain not found: " +
            terrainType
        );
    }


    return terrain.$index;
}


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

        throw new Error(
            "Limespace Snowflake: feature not found: " +
            featureType
        );
    }


    return feature.$index;
}


// Explicit lookups rather than relying on imported globals.

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
        "Limespace Snowflake V8.8 map init"
    );

    console.log(
        "Incoming dimensions: " +
        initParams.width +
        " x " +
        initParams.height
    );


    initParams.width =
        SNOWFLAKE_WIDTH;

    initParams.height =
        SNOWFLAKE_HEIGHT;


    initParams.wrapX =
        0;

    initParams.wrapY =
        0;

    initParams.WrapX =
        0;

    initParams.WrapY =
        0;


    console.log(
        "Requested dimensions: " +
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
// TILE HELPERS
// ============================================================

function getTile(
    x,
    y
) {

    const rows =
        LIMESPACE_SNOWFLAKE_MAP
            .terrainRows;


    if (
        !rows ||
        y < 0 ||
        y >= rows.length
    ) {

        return null;
    }


    const row =
        rows[y];


    if (
        !row ||
        x < 0 ||
        x >= row.length
    ) {

        return null;
    }


    return row[x];
}


function isLandTile(
    tile
) {

    if (
        !tile ||
        typeof tile.terrain !==
        "string"
    ) {

        return false;
    }


    return (

        tile.terrain !==
        "ocean" &&

        tile.terrain !==
        "coast"

    );
}


// ============================================================
// PLAYER START HELPERS
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

        return (
            LIMESPACE_SNOWFLAKE_MAP
                .playerStarts
        );
    }


    return FALLBACK_PLAYER_STARTS;
}


function distanceSquaredToNearestStart(
    x,
    y
) {

    const starts =
        getSnowflakePlayerStarts();


    let best =
        Number.MAX_SAFE_INTEGER;


    for (
        let i = 0;
        i < starts.length;
        i++
    ) {

        const dx =
            x -
            Number(
                starts[i].x
            );

        const dy =
            y -
            Number(
                starts[i].y
            );


        const distance =
            dx * dx +
            dy * dy;


        if (
            distance <
            best
        ) {

            best =
                distance;
        }
    }


    return best;
}


function isExactStart(
    x,
    y
) {

    const starts =
        getSnowflakePlayerStarts();


    for (
        let i = 0;
        i < starts.length;
        i++
    ) {

        if (

            Number(
                starts[i].x
            ) === x &&

            Number(
                starts[i].y
            ) === y

        ) {

            return true;
        }
    }


    return false;
}


// ============================================================
// BASE TERRAIN
// ============================================================

function applyExportedTile(
    x,
    y,
    terrainName
) {

    switch (
        terrainName
    ) {

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
// NEIGHBOUR TERRAIN COUNTER
// ============================================================

function countNearbyTerrain(
    x,
    y,
    terrainType,
    width,
    height
) {

    let count =
        0;


    for (
        let dy = -1;
        dy <= 1;
        dy++
    ) {

        for (
            let dx = -1;
            dx <= 1;
            dx++
        ) {

            if (
                dx === 0 &&
                dy === 0
            ) {

                continue;
            }


            const nx =
                x + dx;

            const ny =
                y + dy;


            if (

                nx < 0 ||
                ny < 0 ||
                nx >= width ||
                ny >= height

            ) {

                continue;
            }


            if (

                GameplayMap.getTerrainType(
                    nx,
                    ny
                ) === terrainType

            ) {

                count++;
            }
        }
    }


    return count;
}


// ============================================================
// MOUNTAINS
// ============================================================

function generateSnowflakeMountains(
    width,
    height
) {

    console.log(
        "Generating mountains..."
    );


    let placed =
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

            const tile =
                getTile(
                    x,
                    y
                );


            if (
                !isLandTile(
                    tile
                )
            ) {

                continue;
            }


            if (

                distanceSquaredToNearestStart(
                    x,
                    y
                ) <=
                MOUNTAIN_START_BUFFER_SQ

            ) {

                continue;
            }


            let chance =
                MOUNTAIN_CHANCE;


            const nearby =
                countNearbyTerrain(
                    x,
                    y,
                    MOUNTAIN_TERRAIN,
                    width,
                    height
                );


            if (
                nearby >= 1
            ) {

                chance +=
                    7;
            }


            if (
                nearby >= 2
            ) {

                chance +=
                    4;
            }


            const roll =
                TerrainBuilder.getRandomNumber(
                    100,
                    "Snowflake Mountain"
                );


            if (
                roll <
                chance
            ) {

                TerrainBuilder.setTerrainType(
                    x,
                    y,
                    MOUNTAIN_TERRAIN
                );


                placed++;
            }
        }
    }


    console.log(
        "Mountain placements requested: " +
        placed
    );


    return placed;
}


// ============================================================
// HILLS
// ============================================================

function generateSnowflakeHills(
    width,
    height
) {

    console.log(
        "=========================================="
    );

    console.log(
        "Generating Snowflake hills..."
    );


    let requested =
        0;


    /*
        First pass.

        We deliberately use an explicit TERRAIN_HILL index.

        The previous version used the imported hill constant,
        which appears not to have survived the map pipeline
        correctly on this custom map.
    */

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

            const tile =
                getTile(
                    x,
                    y
                );


            if (
                !isLandTile(
                    tile
                )
            ) {

                continue;
            }


            const existingTerrain =
                GameplayMap.getTerrainType(
                    x,
                    y
                );


            if (
                existingTerrain ===
                MOUNTAIN_TERRAIN
            ) {

                continue;
            }


            if (

                distanceSquaredToNearestStart(
                    x,
                    y
                ) <=
                HILL_START_BUFFER_SQ

            ) {

                continue;
            }


            let chance =
                HILL_CHANCE;


            // Make hills more common around mountains.

            const nearbyMountains =
                countNearbyTerrain(
                    x,
                    y,
                    MOUNTAIN_TERRAIN,
                    width,
                    height
                );


            const nearbyHills =
                countNearbyTerrain(
                    x,
                    y,
                    HILL_TERRAIN,
                    width,
                    height
                );


            if (
                nearbyMountains > 0
            ) {

                chance +=
                    12;
            }


            if (
                nearbyHills > 0
            ) {

                chance +=
                    7;
            }


            if (
                tile.terrain ===
                "plains"
            ) {

                chance +=
                    4;
            }


            if (
                tile.terrain ===
                "desert"
            ) {

                chance +=
                    3;
            }


            const roll =
                TerrainBuilder.getRandomNumber(
                    100,
                    "Snowflake Hill"
                );


            if (
                roll <
                chance
            ) {

                TerrainBuilder.setTerrainType(
                    x,
                    y,
                    HILL_TERRAIN
                );


                requested++;
            }
        }
    }


    // ========================================================
    // VERIFY ACTUAL HILLS
    // ========================================================

    let actual =
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

                GameplayMap.getTerrainType(
                    x,
                    y
                ) ===
                HILL_TERRAIN

            ) {

                actual++;
            }
        }
    }


    console.log(
        "Hill placements requested: " +
        requested
    );


    console.log(
        "Hills present immediately after placement: " +
        actual
    );


    /*
        Safety pass.

        If Civ VII somehow rejected every hill in the first
        pass, force a smaller deterministic population of hills.
    */

    if (
        actual === 0
    ) {

        console.log(
            "WARNING: no hills survived first pass."
        );

        console.log(
            "Running fallback hill pass..."
        );


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

                const tile =
                    getTile(
                        x,
                        y
                    );


                if (
                    !isLandTile(
                        tile
                    )
                ) {

                    continue;
                }


                if (

                    GameplayMap.getTerrainType(
                        x,
                        y
                    ) ===
                    MOUNTAIN_TERRAIN

                ) {

                    continue;
                }


                if (

                    distanceSquaredToNearestStart(
                        x,
                        y
                    ) <=
                    HILL_START_BUFFER_SQ

                ) {

                    continue;
                }


                /*
                    Deterministic distribution.

                    Roughly one in five eligible plots.
                */

                if (
                    (
                        x * 17 +
                        y * 31
                    ) %
                    5 !== 0
                ) {

                    continue;
                }


                TerrainBuilder.setTerrainType(
                    x,
                    y,
                    HILL_TERRAIN
                );
            }
        }


        actual =
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

                    GameplayMap.getTerrainType(
                        x,
                        y
                    ) ===
                    HILL_TERRAIN

                ) {

                    actual++;
                }
            }
        }


        console.log(
            "Hills after fallback pass: " +
            actual
        );
    }


    console.log(
        "=========================================="
    );


    return actual;
}


// ============================================================
// RAINFALL
// ============================================================

function buildSnowflakeRainfallMap(
    width,
    height
) {

    console.log(
        "Building rainfall..."
    );


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

            const tile =
                getTile(
                    x,
                    y
                );


            if (
                !isLandTile(
                    tile
                )
            ) {

                continue;
            }


            let rainfall =
                100;


            switch (
                tile.terrain
            ) {

                case "grassland":

                    rainfall =
                        125;

                    break;


                case "plains":

                    rainfall =
                        95;

                    break;


                case "desert":

                    rainfall =
                        35;

                    break;


                case "tundra":

                    rainfall =
                        70;

                    break;
            }


            const terrain =
                GameplayMap.getTerrainType(
                    x,
                    y
                );


            if (
                terrain ===
                MOUNTAIN_TERRAIN
            ) {

                rainfall +=
                    25;
            }


            if (
                terrain ===
                HILL_TERRAIN
            ) {

                rainfall +=
                    10;
            }


            rainfall +=

                TerrainBuilder.getRandomNumber(
                    31,
                    "Snowflake Rain"
                ) -

                15;


            if (
                rainfall < 5
            ) {

                rainfall =
                    5;
            }


            TerrainBuilder.setRainfall(
                x,
                y,
                rainfall
            );
        }
    }
}


// ============================================================
// RIVERS
// ============================================================

function generateSnowflakeRivers(
    width,
    height
) {

    console.log(
        "Generating rivers..."
    );


    TerrainBuilder.modelRivers(
        5,
        15,
        NAVIGABLE_RIVER_TERRAIN
    );


    TerrainBuilder.validateAndFixTerrain();


    TerrainBuilder.defineNamedRivers();


    TerrainBuilder.addFloodplains(
        4,
        10
    );


    let normal =
        0;

    let navigable =
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

                navigable++;
            }

            else if (
                GameplayMap.isRiver(
                    x,
                    y
                )
            ) {

                normal++;
            }
        }
    }


    return {

        normal:
            normal,

        navigable:
            navigable

    };
}


// ============================================================
// FORESTS
// ============================================================

function generateSnowflakeForests(
    width,
    height
) {

    console.log(
        "Generating forests..."
    );


    let placed =
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

            const tile =
                getTile(
                    x,
                    y
                );


            if (
                !isLandTile(
                    tile
                )
            ) {

                continue;
            }


            if (

                tile.terrain !==
                "grassland" &&

                tile.terrain !==
                "plains"

            ) {

                continue;
            }


            const terrain =
                GameplayMap.getTerrainType(
                    x,
                    y
                );


            if (
                terrain ===
                MOUNTAIN_TERRAIN
            ) {

                continue;
            }


            if (
                isExactStart(
                    x,
                    y
                )
            ) {

                continue;
            }


            let chance =

                tile.terrain ===
                "grassland"

                ? FOREST_GRASSLAND_CHANCE

                : FOREST_PLAINS_CHANCE;


            if (
                GameplayMap.isRiver(
                    x,
                    y
                )
            ) {

                chance +=
                    7;
            }


            const roll =
                TerrainBuilder.getRandomNumber(
                    100,
                    "Snowflake Forest"
                );


            if (
                roll >=
                chance
            ) {

                continue;
            }


            TerrainBuilder.setFeatureType(
                x,
                y,
                {
                    Feature:
                        FOREST_FEATURE,

                    Direction:
                        -1,

                    Elevation:
                        0
                }
            );


            placed++;
        }
    }


    console.log(
        "Forests generated: " +
        placed
    );


    return placed;
}


// ============================================================
// RESOURCE HELPERS
// ============================================================

function getAvailableResourceIndices() {

    const indices =
        [];


    const generated =
        ResourceBuilder.getGeneratedMapResources(
            3
        );


    if (
        !generated
    ) {

        return indices;
    }


    for (
        let i = 0;
        i < generated.length;
        i++
    ) {

        const resource =
            GameInfo.Resources.lookup(
                generated[i]
            );


        if (
            resource
        ) {

            indices.push(
                resource.$index
            );
        }
    }


    return indices;
}


function hasNearbyResource(
    x,
    y,
    width,
    height
) {

    for (
        let dy = -1;
        dy <= 1;
        dy++
    ) {

        for (
            let dx = -1;
            dx <= 1;
            dx++
        ) {

            if (
                dx === 0 &&
                dy === 0
            ) {

                continue;
            }


            const nx =
                x + dx;

            const ny =
                y + dy;


            if (

                nx < 0 ||
                ny < 0 ||
                nx >= width ||
                ny >= height

            ) {

                continue;
            }


            if (

                GameplayMap.getResourceType(
                    nx,
                    ny
                ) !==
                ResourceTypes.NO_RESOURCE

            ) {

                return true;
            }
        }
    }


    return false;
}


// ============================================================
// RESOURCES
// ============================================================

function generateSnowflakeResources(
    width,
    height
) {

    console.log(
        "Generating resources..."
    );


    const resources =
        getAvailableResourceIndices();


    let placed =
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

            const roll =
                TerrainBuilder.getRandomNumber(
                    100,
                    "Snowflake Resource Density"
                );


            if (
                roll >=
                RESOURCE_PLACEMENT_CHANCE
            ) {

                continue;
            }


            if (
                hasNearbyResource(
                    x,
                    y,
                    width,
                    height
                )
            ) {

                continue;
            }


            const legal =
                [];


            for (
                let i = 0;
                i < resources.length;
                i++
            ) {

                if (

                    ResourceBuilder.canHaveResource(
                        x,
                        y,
                        resources[i],
                        false
                    )

                ) {

                    legal.push(
                        resources[i]
                    );
                }
            }


            if (
                legal.length === 0
            ) {

                continue;
            }


            const choice =
                TerrainBuilder.getRandomNumber(
                    legal.length,
                    "Snowflake Resource Choice"
                );


            ResourceBuilder.setResourceType(
                x,
                y,
                legal[
                    choice
                ]
            );


            placed++;
        }
    }


    console.log(
        "Resources generated: " +
        placed
    );


    return placed;
}


// ============================================================
// PLAYER STARTS
// ============================================================

function assignSnowflakePlayerStarts(
    width,
    height
) {

    const starts =
        getSnowflakePlayerStarts();


    const players =
        Players.getAliveMajorIds();


    if (
        players.length >
        starts.length
    ) {

        throw new Error(

            "Limespace Snowflake supports only " +
            starts.length +
            " major players."

        );
    }


    const result =
        [];


    for (
        let i = 0;
        i < players.length;
        i++
    ) {

        const x =
            Number(
                starts[i].x
            );

        const y =
            Number(
                starts[i].y
            );


        if (

            x < 0 ||
            y < 0 ||
            x >= width ||
            y >= height

        ) {

            throw new Error(

                "Invalid Snowflake start position: " +
                x +
                "," +
                y

            );
        }


        const plot =
            y *
            width +
            x;


        StartPositioner.setStartPosition(
            plot,
            players[i]
        );


        result.push(
            plot
        );


        console.log(

            "Player " +
            players[i] +
            " start = (" +
            x +
            "," +
            y +
            ")"

        );
    }


    return result;
}


// ============================================================
// FINAL HILL VERIFICATION
// ============================================================

function countFinalHills(
    width,
    height
) {

    let hills =
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

                GameplayMap.getTerrainType(
                    x,
                    y
                ) ===
                HILL_TERRAIN

            ) {

                hills++;
            }
        }
    }


    return hills;
}


// ============================================================
// GENERATE MAP
// ============================================================

function generateMap() {

    console.log(
        "=========================================="
    );

    console.log(
        "Generating Limespace Snowflake V8.8"
    );

    console.log(
        "=========================================="
    );


    if (
        !LIMESPACE_SNOWFLAKE_MAP
    ) {

        throw new Error(
            "Snowflake map data missing."
        );
    }


    if (

        LIMESPACE_SNOWFLAKE_MAP.format !==
        EXPECTED_FORMAT

    ) {

        throw new Error(
            "Invalid Snowflake map format."
        );
    }


    const width =
        GameplayMap.getGridWidth();


    const height =
        GameplayMap.getGridHeight();


    if (

        width !==
        LIMESPACE_SNOWFLAKE_MAP.width ||

        height !==
        LIMESPACE_SNOWFLAKE_MAP.height

    ) {

        throw new Error(

            "Snowflake map dimension mismatch: " +

            width +
            "x" +
            height

        );
    }


    // ========================================================
    // BASE MAP
    // ========================================================

    let tileCount =
        0;


    for (
        let y = 0;
        y < height;
        y++
    ) {

        const row =
            LIMESPACE_SNOWFLAKE_MAP
                .terrainRows[y];


        if (
            !row ||
            row.length !== width
        ) {

            throw new Error(
                "Invalid Snowflake row " +
                y
            );
        }


        for (
            let x = 0;
            x < width;
            x++
        ) {

            const tile =
                row[x];


            applyExportedTile(
                x,
                y,
                tile.terrain
            );


            tileCount++;
        }
    }


    console.log(
        "Base tiles loaded: " +
        tileCount
    );


    // ========================================================
    // INITIAL MAP DATA
    // ========================================================

    TerrainBuilder.validateAndFixTerrain();

    AreaBuilder.recalculateAreas();

    TerrainBuilder.stampContinents();


    // ========================================================
    // MOUNTAINS
    // ========================================================

    const mountains =
        generateSnowflakeMountains(
            width,
            height
        );


    /*
        Civ VII normally builds elevation after mountain
        generation.
    */

    TerrainBuilder.buildElevation();


    // ========================================================
    // HILLS
    // ========================================================

    const hillsInitially =
        generateSnowflakeHills(
            width,
            height
        );


    /*
        Important change in V8.8:

        rebuild elevation after our custom hill pass.

        This gives Civ VII another opportunity to synchronize
        the visual/elevation state of the terrain with the
        TERRAIN_HILL assignments.
    */

    TerrainBuilder.buildElevation();


    const hillsAfterElevation =
        countFinalHills(
            width,
            height
        );


    console.log(
        "Hills before elevation rebuild: " +
        hillsInitially
    );

    console.log(
        "Hills after elevation rebuild: " +
        hillsAfterElevation
    );


    // ========================================================
    // RAINFALL
    // ========================================================

    buildSnowflakeRainfallMap(
        width,
        height
    );


    // ========================================================
    // RIVERS
    // ========================================================

    const rivers =
        generateSnowflakeRivers(
            width,
            height
        );


    // ========================================================
    // FORESTS
    // ========================================================

    const forests =
        generateSnowflakeForests(
            width,
            height
        );


    // ========================================================
    // FINAL TERRAIN STATE
    // ========================================================

    AreaBuilder.recalculateAreas();

    TerrainBuilder.storeWaterData();


    // ========================================================
    // RESOURCES
    // ========================================================

    const resources =
        generateSnowflakeResources(
            width,
            height
        );


    // ========================================================
    // FERTILITY
    // ========================================================

    FertilityBuilder.recalculate();


    // ========================================================
    // STARTING POSITIONS
    // ========================================================

    const starts =
        assignSnowflakePlayerStarts(
            width,
            height
        );


    // ========================================================
    // FINAL HILL CHECK
    // ========================================================

    const finalHills =
        countFinalHills(
            width,
            height
        );


    // ========================================================
    // REPORT
    // ========================================================

    console.log(
        "=========================================="
    );

    console.log(
        "Limespace Snowflake V8.8 COMPLETE"
    );

    console.log(
        "Grid: " +
        width +
        " x " +
        height
    );

    console.log(
        "Mountains requested: " +
        mountains
    );

    console.log(
        "Hills originally generated: " +
        hillsInitially
    );

    console.log(
        "FINAL HILLS PRESENT: " +
        finalHills
    );

    console.log(
        "Forests: " +
        forests
    );

    console.log(
        "Normal river tiles: " +
        rivers.normal
    );

    console.log(
        "Navigable river tiles: " +
        rivers.navigable
    );

    console.log(
        "Resources: " +
        resources
    );

    console.log(
        "Major starts: " +
        starts.length
    );

    console.log(
        "=========================================="
    );
}


// ============================================================
// EVENTS
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
    "Loaded Limespace Snowflake V8.8"
);