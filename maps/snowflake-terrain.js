/*
    ============================================================
    LIMESPACE SNOWFLAKE
    SYMMETRICAL TERRAIN GENERATOR
    ============================================================

    This file controls:

    - Grassland
    - Plains
    - Tropical terrain
    - Small desert regions
    - Tundra
    - Hills
    - Mountains

    The maths uses six-fold rotational symmetry.

    Therefore every snowflake arm receives the same
    terrain pattern rotated around the centre.
*/


import {

    g_FlatTerrain,
    g_HillTerrain,
    g_MountainTerrain,

    g_GrasslandBiome,
    g_PlainsBiome,
    g_DesertBiome,
    g_TropicalBiome,
    g_TundraBiome,
    g_MarineBiome

} from "./map-globals.js";


// ============================================================
// NORMALISE ANGLE TO ONE 60 DEGREE SECTOR
// ============================================================

function getSectorAngle(
    x,
    y
) {

    let angle =
        Math.atan2(
            y,
            x
        );


    if (angle < 0) {

        angle +=
            Math.PI * 2;
    }


    const sectorSize =
        Math.PI / 3;


    /*
        Angle within one repeating
        60-degree snowflake sector.
    */

    let localAngle =
        angle % sectorSize;


    /*
        Mirror each half of the sector.

        This gives even stronger symmetry
        around each snowflake arm.
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
// BIOME SELECTION
// ============================================================

function chooseBiome(
    radius,
    localAngle,
    mapScale
) {

    const r =
        radius /
        mapScale;


    /*
        Central hub:
        mostly fertile grassland.
    */

    if (
        r < 0.10
    ) {

        return g_GrasslandBiome;
    }


    /*
        Inner ring:
        grassland and plains.
    */

    if (
        r < 0.17
    ) {

        if (
            localAngle <
            0.15
        ) {

            return g_PlainsBiome;
        }

        return g_GrasslandBiome;
    }


    /*
        Middle arms:
        mixture of grassland,
        plains and tropical terrain.
    */

    if (
        r < 0.28
    ) {

        if (
            localAngle <
            0.10
        ) {

            return g_GrasslandBiome;
        }


        if (
            localAngle <
            0.25
        ) {

            return g_PlainsBiome;
        }


        return g_TropicalBiome;
    }


    /*
        Outer arm region.
    */

    if (
        r < 0.34
    ) {

        if (
            localAngle <
            0.10
        ) {

            return g_PlainsBiome;
        }


        if (
            localAngle <
            0.20
        ) {

            return g_GrasslandBiome;
        }


        /*
            Small dry patch.

            We keep desert limited because
            we do not want another all-desert map.
        */

        if (
            localAngle <
            0.27
        ) {

            return g_DesertBiome;
        }


        return g_GrasslandBiome;
    }


    /*
        Very ends of the arms:
        some cooler terrain.
    */

    if (
        localAngle <
        0.16
    ) {

        return g_PlainsBiome;
    }


    return g_TundraBiome;
}


// ============================================================
// ELEVATION SELECTION
// ============================================================

function chooseTerrainElevation(
    radius,
    localAngle,
    mapScale,
    distanceFromStart
) {

    const r =
        radius /
        mapScale;


    /*
        Protect the starting zones.

        Nobody should begin on a mountain
        or be trapped by mountain tiles.
    */

    if (
        distanceFromStart <
        mapScale * 0.075
    ) {

        return g_FlatTerrain;
    }


    /*
        Mountain ring around the centre.

        This makes the contested centre
        geographically important.
    */

    if (
        r > 0.115 &&
        r < 0.145 &&
        localAngle < 0.11
    ) {

        return g_MountainTerrain;
    }


    /*
        Mountain ridges farther along
        each of the six arms.
    */

    if (
        r > 0.31 &&
        r < 0.38 &&
        localAngle < 0.09
    ) {

        return g_MountainTerrain;
    }


    /*
        Hills around mountain areas.
    */

    if (
        r > 0.095 &&
        r < 0.17 &&
        localAngle < 0.22
    ) {

        return g_HillTerrain;
    }


    if (
        r > 0.20 &&
        r < 0.27 &&
        localAngle > 0.16 &&
        localAngle < 0.26
    ) {

        return g_HillTerrain;
    }


    if (
        r > 0.29 &&
        localAngle < 0.18
    ) {

        return g_HillTerrain;
    }


    return g_FlatTerrain;
}


// ============================================================
// APPLY TERRAIN
// ============================================================

function applySnowflakeTerrain(
    width,
    height,
    landMask,
    tileToCartesian,
    mapScale,
    startRadius
) {

    console.log(
        "Applying symmetrical Snowflake terrain..."
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

            /*
                Water gets the marine biome.
            */

            if (
                !landMask[y][x]
            ) {

                TerrainBuilder.setBiomeType(
                    x,
                    y,
                    g_MarineBiome
                );

                continue;
            }


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
                getSectorAngle(
                    point.x,
                    point.y
                );


            // ====================================================
            // DISTANCE FROM NEAREST STARTING RING
            // ====================================================

            const distanceFromStart =
                Math.abs(
                    radius -
                    startRadius
                );


            // ====================================================
            // BIOME
            // ====================================================

            const biome =
                chooseBiome(
                    radius,
                    localAngle,
                    mapScale
                );


            TerrainBuilder.setBiomeType(
                x,
                y,
                biome
            );


            // ====================================================
            // HILLS / MOUNTAINS / FLAT
            // ====================================================

            const terrain =
                chooseTerrainElevation(
                    radius,
                    localAngle,
                    mapScale,
                    distanceFromStart
                );


            TerrainBuilder.setTerrainType(
                x,
                y,
                terrain
            );
        }
    }


    console.log(
        "Snowflake terrain complete."
    );
}


export {
    applySnowflakeTerrain
};