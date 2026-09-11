export function simulateLiveData(buildings, updateStudents = false) {
  return buildings.map((building) => ({
    ...building,

    // Student count changes only when real attendance
    // integration is enabled.
    students: updateStudents
      ? Math.max(
          0,
          building.students +
            Math.floor(Math.random() * 11 - 5)
        )
      : building.students,

    // Simulated energy data
    energy: Math.min(
      100,
      Math.max(
        0,
        building.energy +
          Math.floor(Math.random() * 7 - 3)
      )
    ),

    // Simulated water data
    water: Math.min(
      100,
      Math.max(
        0,
        building.water +
          Math.floor(Math.random() * 5 - 2)
      )
    ),

    // Simulated temperature data
    temperature:
      Math.round(
        (building.temperature +
          (Math.random() * 2 - 1)) *
          10
      ) / 10,
  }));
}