import { useEffect, useState } from "react";

import block1Image from "../assets/block1.png";
import block2Image from "../assets/block2.png";
import block3Image from "../assets/block3.jpg";
import block4Image from "../assets/block4.png";
import grietLogo from "../assets/griet_logo.png";

const blockInfo = {
    B1: {
        name: "Block 1",
        departments: "CSE",
        image: block1Image,
    },

    B2: {
        name: "Block 2",
        departments: "AIML • DS • CSBS",
        image: block2Image,
    },

    B3: {
        name: "Block 3",
        departments: "IT • Humanities • Administration",
        image: block3Image,
    },

    B4: {
        name: "Block 4",
        departments: "ECE • EEE • Civil • Mechanical",
        image: block4Image,
    },
};

export default function AIInsights({
    buildings = [],
    selectedBuilding,
    darkMode,
}) {
    const [selectedIds, setSelectedIds] = useState([]);

    /*
     * Convert the existing building data
     * into B1, B2, B3 and B4.
     */
    const allBlocks = ["B1", "B2", "B3", "B4"].map(
        (blockId, index) => {
            const building = buildings[index] || {};

            return {
                ...building,
                id: blockId,
                name: blockInfo[blockId].name,
                departments:
                    blockInfo[blockId].departments,
                image: blockInfo[blockId].image,
            };
        }
    );

    /*
     * When a block is clicked from the campus map,
     * select that block.
     *
     * This does NOT reset the selection when live
     * student/energy/water data changes.
     */
    useEffect(() => {
        if (!selectedBuilding) return;

        let id = selectedBuilding.id;

        if (typeof id === "number") {
            id = `B${id}`;
        }

        if (
            typeof id === "string" &&
            ["1", "2", "3", "4"].includes(id)
        ) {
            id = `B${id}`;
        }

        if (
            ["B1", "B2", "B3", "B4"].includes(id)
        ) {
            setSelectedIds((previous) => {
                if (previous.includes(id)) {
                    return previous;
                }

                return [...previous, id];
            });
        }
    }, [selectedBuilding?.id]);

    /*
     * Multiple checkbox selection
     */
    const handleCheckboxChange = (blockId) => {
        setSelectedIds((previous) => {
            if (previous.includes(blockId)) {
                return previous.filter(
                    (id) => id !== blockId
                );
            }

            return [...previous, blockId];
        });
    };

    /*
     * Select / Clear all
     */
    const handleSelectAll = () => {
        if (selectedIds.length === 4) {
            setSelectedIds([]);
        } else {
            setSelectedIds([
                "B1",
                "B2",
                "B3",
                "B4",
            ]);
        }
    };

    /*
     * Selected blocks
     */
    const visibleBlocks = allBlocks.filter((block) =>
        selectedIds.includes(block.id)
    );

    /*
     * Convert energy/water into a valid percentage
     */
    const getPercentage = (value) => {
        const number = parseFloat(
            String(value ?? "0").replace("%", "")
        );

        if (Number.isNaN(number)) {
            return 0;
        }

        return Math.max(
            0,
            Math.min(100, number)
        );
    };

    return (
        <div className="space-y-6">

            {/* ==========================================
                HEADER
            ========================================== */}

            <div
                className={`
                    relative
                    overflow-hidden
                    rounded-3xl
                    border
                    p-6
                    transition-colors
                    duration-300
                    ${
                        darkMode
                            ? "bg-slate-900 border-slate-700"
                            : "bg-white border-slate-200"
                    }
                `}
            >
                <div
                    className={`
                        absolute
                        right-6
                        top-1/2
                        -translate-y-1/2
                        ${
                            darkMode
                                ? "opacity-10"
                                : "opacity-[0.08]"
                        }
                    `}
                >
                    <img
                        src={grietLogo}
                        alt="GRIET"
                        className="w-32 h-32 object-contain"
                    />
                </div>

                <div className="relative z-10">

                    <h2
                        className="
                            text-2xl
                            font-bold
                            text-cyan-400
                        "
                    >
                        🤖 AI Insights
                    </h2>

                    <p
                        className={`
                            mt-2
                            ${
                                darkMode
                                    ? "text-slate-400"
                                    : "text-slate-500"
                            }
                        `}
                    >
                        Select blocks to view live AI analysis
                    </p>

                </div>
            </div>


            {/* ==========================================
                SELECT BLOCKS
            ========================================== */}

            <div
                className={`
                    rounded-3xl
                    border
                    p-6
                    transition-colors
                    duration-300
                    ${
                        darkMode
                            ? "bg-slate-900 border-slate-700"
                            : "bg-white border-slate-200"
                    }
                `}
            >

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        mb-5
                    "
                >

                    <div>

                        <h3
                            className={`
                                text-xl
                                font-bold
                                ${
                                    darkMode
                                        ? "text-white"
                                        : "text-slate-900"
                                }
                            `}
                        >
                            Select Blocks
                        </h3>

                        <p
                            className={`
                                mt-1
                                ${
                                    darkMode
                                        ? "text-slate-400"
                                        : "text-slate-500"
                                }
                            `}
                        >
                            Choose one or more blocks
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={handleSelectAll}
                        className="
                            px-4
                            py-2
                            rounded-xl
                            border
                            border-cyan-500
                            text-cyan-400
                            hover:bg-cyan-500/10
                            transition
                        "
                    >
                        {selectedIds.length === 4
                            ? "Clear All"
                            : "Select All"}
                    </button>

                </div>


                {/* ======================================
                    CHECKBOXES
                ====================================== */}

                <div
                    className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        lg:grid-cols-4
                        gap-4
                    "
                >

                    {allBlocks.map((block) => {

                        const checked =
                            selectedIds.includes(
                                block.id
                            );

                        return (
                            <label
                                key={block.id}
                                className={`
                                    flex
                                    items-center
                                    gap-3
                                    p-4
                                    rounded-2xl
                                    border
                                    cursor-pointer
                                    transition-all

                                    ${
                                        checked
                                            ? "bg-cyan-500/20 border-cyan-400"
                                            : darkMode
                                                ? "bg-slate-800 border-slate-700 hover:border-cyan-500"
                                                : "bg-slate-50 border-slate-200 hover:border-cyan-500"
                                    }
                                `}
                            >

                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() =>
                                        handleCheckboxChange(
                                            block.id
                                        )
                                    }
                                    className="
                                        w-5
                                        h-5
                                        accent-cyan-400
                                        cursor-pointer
                                    "
                                />

                                <div>

                                    <p
                                        className={`
                                            font-bold
                                            ${
                                                checked
                                                    ? "text-cyan-400"
                                                    : darkMode
                                                        ? "text-white"
                                                        : "text-slate-900"
                                            }
                                        `}
                                    >
                                        {block.id}
                                    </p>

                                    <p
                                        className={`
                                            text-xs
                                            ${
                                                darkMode
                                                    ? "text-slate-400"
                                                    : "text-slate-500"
                                            }
                                        `}
                                    >
                                        {block.departments}
                                    </p>

                                </div>

                            </label>
                        );
                    })}

                </div>

            </div>


            {/* ==========================================
                NO BLOCK
            ========================================== */}

            {visibleBlocks.length === 0 && (
                <div
                    className={`
                        border
                        rounded-3xl
                        p-16
                        text-center
                        transition-colors
                        duration-300
                        ${
                            darkMode
                                ? "bg-slate-900 border-slate-700"
                                : "bg-white border-slate-200"
                        }
                    `}
                >

                    <div className="text-6xl mb-5">
                        🤖
                    </div>

                    <h3
                        className={`
                            text-2xl
                            font-bold
                            ${
                                darkMode
                                    ? "text-white"
                                    : "text-slate-900"
                            }
                        `}
                    >
                        No Block Selected
                    </h3>

                    <p
                        className={`
                            mt-2
                            ${
                                darkMode
                                    ? "text-slate-400"
                                    : "text-slate-500"
                            }
                        `}
                    >
                        Select B1, B2, B3 or B4 above
                        to view AI analysis.
                    </p>

                </div>
            )}


            {/* ==========================================
                SELECTED BLOCKS
            ========================================== */}

            <div
                className="
                    grid
                    grid-cols-1
                    xl:grid-cols-2
                    gap-6
                "
            >

                {visibleBlocks.map((block) => {

                    const energy =
                        getPercentage(block.energy);

                    const water =
                        getPercentage(block.water);

                    return (
                        <div
                            key={block.id}
                            className={`
                                rounded-3xl
                                border
                                overflow-hidden
                                transition-colors
                                duration-300
                                ${
                                    darkMode
                                        ? "bg-slate-900 border-slate-700"
                                        : "bg-white border-slate-200"
                                }
                            `}
                        >

                            {/* ==================================
                                BLOCK IMAGE
                            ================================== */}

                            <div
                                className="
                                    relative
                                    h-56
                                    overflow-hidden
                                "
                            >

                                <img
                                    src={block.image}
                                    alt={`${block.name} GRIET`}
                                    className="
                                        w-full
                                        h-full
                                        object-cover
                                        transition-transform
                                        duration-700
                                        hover:scale-105
                                    "
                                />

                                {/* Image overlay */}

                                <div
                                    className="
                                        absolute
                                        inset-0
                                        bg-gradient-to-t
                                        from-slate-950
                                        via-slate-950/30
                                        to-transparent
                                    "
                                />

                                {/* Block name */}

                                <div
                                    className="
                                        absolute
                                        bottom-4
                                        left-5
                                    "
                                >

                                    <p
                                        className="
                                            text-cyan-300
                                            text-sm
                                            font-semibold
                                        "
                                    >GRIET INTELLIGENT CAMPUS
                                    </p>

                                    <h2
                                        className="
                                            text-3xl
                                            font-bold
                                            text-white
                                        "
                                    >
                                        {block.id}
                                    </h2>

                                </div>

                            </div>


                            {/* ==================================
                                CONTENT
                            ================================== */}

                            <div className="p-6">

                                <div className="mb-6">

                                    <h3
                                        className={`
                                            text-xl
                                            font-bold
                                            ${
                                                darkMode
                                                    ? "text-white"
                                                    : "text-slate-900"
                                            }
                                        `}
                                    >
                                        {block.name}
                                    </h3>

                                    <p
                                        className={`
                                            mt-1
                                            ${
                                                darkMode
                                                    ? "text-slate-400"
                                                    : "text-slate-500"
                                            }
                                        `}
                                    >
                                        {block.departments}
                                    </p>

                                </div>


                                {/* STUDENTS */}

                                <div
                                    className={`
                                        rounded-2xl
                                        p-5
                                        transition-colors
                                        duration-300
                                        ${
                                            darkMode
                                                ? "bg-slate-800"
                                                : "bg-slate-100"
                                        }
                                    `}
                                >

                                    <p
                                        className={`
                                            text-sm
                                            ${
                                                darkMode
                                                    ? "text-gray-400"
                                                    : "text-slate-600"
                                            }
                                        `}
                                    >
                                        Students Present Today
                                    </p>

                                    <h3
                                        className="
                                            text-4xl
                                            font-bold
                                            text-cyan-400
                                            mt-2
                                        "
                                    >
                                        {block.students ?? 0}
                                    </h3>

                                    <p
                                        className={`
                                            text-xs
                                            mt-2
                                            ${
                                                darkMode
                                                    ? "text-slate-500"
                                                    : "text-slate-500"
                                            }
                                        `}
                                    >
                                        Daily validated count
                                    </p>

                                </div>


                                {/* ENERGY */}

                                <div
                                    className={`
                                        rounded-2xl
                                        p-5
                                        mt-4
                                        transition-colors
                                        duration-300
                                        ${
                                            darkMode
                                                ? "bg-slate-800"
                                                : "bg-slate-100"
                                        }
                                    `}
                                >

                                    <div
                                        className="
                                            flex
                                            justify-between
                                            mb-2
                                        "
                                    >

                                        <span
                                            className={
                                                darkMode
                                                    ? "text-white"
                                                    : "text-slate-800"
                                            }
                                        >
                                            ⚡ Energy
                                        </span>

                                        <span
                                            className="
                                                text-yellow-400
                                                font-bold
                                            "
                                        >
                                            {block.energy ?? 0}
                                        </span>

                                    </div>

                                    <div
                                        className={`
                                            w-full
                                            h-3
                                            rounded-full
                                            ${
                                                darkMode
                                                    ? "bg-slate-700"
                                                    : "bg-slate-300"
                                            }
                                        `}
                                    >

                                        <div
                                            className="
                                                h-full
                                                bg-yellow-400
                                                rounded-full
                                                transition-all
                                                duration-500
                                            "
                                            style={{
                                                width:
                                                    `${energy}%`,
                                            }}
                                        />

                                    </div>

                                </div>


                                {/* WATER */}

                                <div
                                    className={`
                                        rounded-2xl
                                        p-5
                                        mt-4
                                        transition-colors
                                        duration-300
                                        ${
                                            darkMode
                                                ? "bg-slate-800"
                                                : "bg-slate-100"
                                        }
                                    `}
                                >

                                    <div
                                        className="
                                            flex
                                            justify-between
                                            mb-2
                                        "
                                    >

                                        <span
                                            className={
                                                darkMode
                                                    ? "text-white"
                                                    : "text-slate-800"
                                            }
                                        >
                                            💧 Water
                                        </span>

                                        <span
                                            className="
                                                text-blue-400
                                                font-bold
                                            "
                                        >
                                            {block.water ?? 0}
                                        </span>

                                    </div>

                                    <div
                                        className={`
                                            w-full
                                            h-3
                                            rounded-full
                                            ${
                                                darkMode
                                                    ? "bg-slate-700"
                                                    : "bg-slate-300"
                                            }
                                        `}
                                    >

                                        <div
                                            className="
                                                h-full
                                                bg-blue-500
                                                rounded-full
                                            "
                                            style={{
                                                width:
                                                    `${water}%`,
                                            }}
                                        />

                                    </div>

                                </div>


                                {/* AI PREDICTION */}

                                <div
                                    className={`
                                        rounded-2xl
                                        p-5
                                        mt-4
                                        transition-colors
                                        duration-300
                                        ${
                                            darkMode
                                                ? "bg-slate-800"
                                                : "bg-slate-100"
                                        }
                                    `}
                                >

                                    <h3
                                        className="
                                            text-green-400
                                            font-semibold
                                            mb-3
                                        "
                                    >
                                        🤖 AI Prediction
                                    </h3>

                                    <p
                                        className={`
                                            leading-relaxed
                                            ${
                                                darkMode
                                                    ? "text-gray-300"
                                                    : "text-slate-700"
                                            }
                                        `}
                                    >
                                        {block.ai ||
                                            "AI is monitoring this block. Current activity appears normal."}
                                    </p>

                                </div>


                                {/* AI RECOMMENDATION */}

                                <div
                                    className="
                                        bg-cyan-500/10
                                        border
                                        border-cyan-500
                                        rounded-2xl
                                        p-5
                                        mt-4
                                    "
                                >

                                    <h3
                                        className="
                                            text-cyan-400
                                            font-semibold
                                        "
                                    >
                                        💡 AI Recommendation
                                    </h3>

                                    <p
                                        className={`
                                            mt-2
                                            ${
                                                darkMode
                                                    ? "text-gray-300"
                                                    : "text-slate-700"
                                            }
                                        `}
                                    >
                                        {block.recommendation ||
                                            "No immediate action required. Continue monitoring the block."}
                                    </p>

                                </div>

                            </div>

                        </div>
                    );
                })}

            </div>

        </div>
    );
}