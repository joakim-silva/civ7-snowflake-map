/*
    ============================================================
    LIMESPACE SNOWFLAKE
    SYMMETRICAL FEATURE GENERATOR
    ============================================================

    Adds:

    - Forest
    - Rainforest
    - Taiga

    Uses deterministic geometric placement so the vegetation
    pattern repeats around all six Snowflake arms.
    ============================================================
*/


// ============================================================
// IMPORTS
// ============================================================

import {

    g_MountainTerrain,

    g_GrasslandBiome,
    g_PlainsBiome,
    g_TropicalBiome,
    g_TundraBiome,

    g_ForestFeature,
    g_RainforestFeature,
    g_TaigaFeature

} from "./map-globals.js";


// ============================================================
// LOCAL ANGLE INSIDE ONE 60-DEGREE SNOWFLAKE SECTOR
// ============================================================

function getLocalAngle(
    x,
    y
) {

    let angle =
        Math.atan2(
            y,
            x
        );


    if (
        angle < 0
    ) {

        angle +=
            Math.PI * 2;
    }


    const sectorSize =
        Math.PI / 3;


    let localAngle =
        angle %
        sectorSize;


    /*
        Mirror both halves of each 60-degree sector.

        This gives us symmetry not only between the
        six arms, but also across each individual arm.
    */

    if (
        localAngle >
        sectorSize / 2
    ) {

        localAngle =
            sectorSize -
            localAngle;
    }


    return localAngle;
}


// ============================================================
// CHOOSE FEATURE
// ============================================================

function chooseFeature(

    radius,
    localAngle,

    mapScale,

    biome,
    terrain,

    startRadius

) {

    const normalizedRadius =
        radius /
        mapScale;


    // ========================================================
    // NEVER PLACE VEGETATION ON MOUNTAINS
    // ========================================================

    if (
        terrain ===
        g_MountainTerrain
    ) {

        return -1;
    }


    // ========================================================
    // KEEP IMMEDIATE STARTING AREA OPEN
    // ========================================================

    const distanceFromStart =
        Math.abs(
            radius -
            startRadius
        );


    if (
        distanceFromStart <
        mapScale * 0.030
    ) {

        return -1;
    }


    // ========================================================
    // CENTRAL HUB FORESTS
    // ========================================================

    if (
        normalizedRadius >
            0.060 &&
        normalizedRadius <
            0.120
    ) {

        if (
            (
                biome ===
                    g_GrasslandBiome ||
                biome ===
                    g_PlainsBiome
            ) &&
            localAngle >
                0.12 &&
            localAngle <
                0.28
        ) {

            return g_ForestFeature;
        }
    }


    // ========================================================
    // INNER ARM FORESTS
    // ========================================================

    if (
        normalizedRadius >=
            0.120 &&
        normalizedRadius <
            0.185
    ) {

        if (
            biome ===
                g_GrasslandBiome ||
            biome ===
                g_PlainsBiome
        ) {

            if (
                localAngle <
                0.115
            ) {

                return g_ForestFeature;
            }


            if (
                localAngle >
                    0.205 &&
                localAngle <
                    0.300
            ) {

                return g_ForestFeature;
            }
        }
    }


    // ========================================================
    // MID ARM
    // ========================================================

    if (
        normalizedRadius >=
            0.185 &&
        normalizedRadius <
            0.260
    ) {

        // ====================================================
        // TROPICAL -> RAINFOREST
        // ====================================================

        if (
            biome ===
            g_TropicalBiome
        ) {

            if (
                localAngle >
                    0.115 &&
                localAngle <
                    0.300
            ) {

                return g_RainforestFeature;
            }
        }


        // ====================================================
        // GRASSLAND / PLAINS -> FOREST
        // ====================================================

        if (
            biome ===
                g_GrasslandBiome ||
            biome ===
                g_PlainsBiome
        ) {

            if (
                localAngle >
                    0.070 &&
                localAngle <
                    0.165
            ) {

                return g_ForestFeature;
            }
        }
    }


    // ========================================================
    // APPROACH TO STARTING RING
    // ========================================================

    if (
        normalizedRadius >=
            0.260 &&
        normalizedRadius <
            0.315
    ) {

        /*
            This region contains the civilization starts.

            The distanceFromStart check above keeps the city
            centre itself relatively clear, but forests can
            still appear around it.
        */

        if (
            biome ===
                g_GrasslandBiome ||
            biome ===
                g_PlainsBiome
        ) {

            if (
                localAngle >
                    0.15 &&
                localAngle <
                    0.30
            ) {

                return g_ForestFeature;
            }
        }


        if (
            biome ===
            g_TropicalBiome
        ) {

            if (
                localAngle >
                0.18
            ) {

                return g_RainforestFeature;
            }
        }
    }


    // ========================================================
    // OUTER ARM
    // ========================================================

    if (
        normalizedRadius >=
            0.315 &&
        normalizedRadius <
            0.370
    ) {

        if (
            biome ===
            g_TundraBiome
        ) {

            if (
                localAngle >
                0.090
            ) {

                return g_TaigaFeature;
            }
        }


        if (
            biome ===
                g_GrasslandBiome ||
            biome ===
                g_PlainsBiome
        ) {

            if (
                localAngle <
                0.150
            ) {

                return g_ForestFeature;
            }
        }
    }


    // ========================================================
    // VERY OUTER SNOWFLAKE TIPS
    // ========================================================

    if (
        normalizedRadius >=
        0.370
    ) {

        if (
            biome ===
            g_TundraBiome
        ) {

            if (
                localAngle >
                0.080
            ) {

                return g_TaigaFeature;
            }
        }


        if (
            biome ===
            g_GrasslandBiome
        ) {

            if (
                localAngle <
                0.180
            ) {

                return g_ForestFeature;
            }
        }


        if (
            biome ===
            g_TropicalBiome
        ) {

            if (
                localAngle >
                0.160
            ) {

                return g_RainforestFeature;
            }
        }
    }


    return -1;
}


// ============================================================
// APPLY SNOWFLAKE FEATURES
// ============================================================

function applySnowflakeFeatures(

    width,
    height,

    landMask,

    tileToCartesian,

    mapScale,

    startRadius

) {

    console.log(
        "=========================================="
    );


    console.log(
        "Applying Limespace Snowflake vegetation"
    );


    console.log(
        "=========================================="
    );


    let forestCount =
        0;


    let rainforestCount =
        0;


    let taigaCount =
        0;


    let rejectedCount =
        0;


    let candidateCount =
        0;


    // ========================================================
    // LOOP THROUGH MAP
    // ========================================================

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

            // =================================================
            // ONLY USE SNOWFLAKE LAND
            // =================================================

            if (
                !landMask[y][x]
            ) {

                continue;
            }


            // =================================================
            // READ TERRAIN
            // =================================================

            const terrain =
                GameplayMap.getTerrainType(
                    x,
                    y
                );


            // =================================================
            // NO MOUNTAINS
            // =================================================

            if (
                terrain ===
                g_MountainTerrain
            ) {

                continue;
            }


            // =================================================
            // READ BIOME
            // =================================================

            const biome =
                GameplayMap.getBiomeType(
                    x,
                    y
                );


            // =================================================
            // POSITION RELATIVE TO SNOWFLAKE CENTRE
            // =================================================

            const point =
                tileToCartesian(
                    x,
                    y
                );


            const radius =
                Math.sqrt(
                    point.x * point.x +
                    point.y * point.y
                );


            const localAngle =
                getLocalAngle(
                    point.x,
                    point.y
                );


            // =================================================
            // CHOOSE DESIRED FEATURE
            // =================================================

            const feature =
                chooseFeature(

                    radius,
                    localAngle,

                    mapScale,

                    biome,
                    terrain,

                    startRadius
                );


            // =================================================
            // NO FEATURE FOR THIS TILE
            // =================================================

            if (
                feature < 0
            ) {

                continue;
            }


            candidateCount++;


            // =================================================
            // ASK CIV VII WHETHER THE FEATURE IS VALID
            // =================================================

            if (
                !TerrainBuilder.canHaveFeature(
                    x,
                    y,
                    feature
                )
            ) {

                rejectedCount++;

                continue;
            }


            // =================================================
            // FIRAXIS FEATURE PARAMETER OBJECT
            // =================================================

            const featureParam = {

                Feature:
                    feature,

                Direction:
                    -1,

                Elevation:
                    0

            };


            // =================================================
            // PLACE FEATURE
            // =================================================

            TerrainBuilder.setFeatureType(
                x,
                y,
                featureParam
            );


            // =================================================
            // DEBUG COUNTERS
            // =================================================

            if (
                feature ===
                g_ForestFeature
            ) {

                forestCount++;
            }


            else if (
                feature ===
                g_RainforestFeature
            ) {

                rainforestCount++;
            }


            else if (
                feature ===
                g_TaigaFeature
            ) {

                taigaCount++;
            }
        }
    }


    // ========================================================
    // DEBUG OUTPUT
    // ========================================================

    console.log(
        "Feature candidates: " +
        candidateCount
    );


    console.log(
        "Feature placements rejected by Civ VII: " +
        rejectedCount
    );


    console.log(
        "Forest tiles placed: " +
        forestCount
    );


    console.log(
        "Rainforest tiles placed: " +
        rainforestCount
    );


    console.log(
        "Taiga tiles placed: " +
        taigaCount
    );


    console.log(
        "Total vegetation tiles placed: " +
        (
            forestCount +
            rainforestCount +
            taigaCount
        )
    );


    console.log(
        "=========================================="
    );


    console.log(
        "Snowflake vegetation complete"
    );


    console.log(
        "=========================================="
    );
}


// ============================================================
// EXPORT
// ============================================================

export {

    applySnowflakeFeatures

};