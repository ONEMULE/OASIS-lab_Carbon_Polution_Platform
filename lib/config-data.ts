export const dataSources = [
  { id: "wrf-mcip", name: "WRF/MCIP", hasStations: true },
  { id: "meic", name: "MEIC", hasStations: false },
  { id: "megan", name: "MEGAN", hasStations: false },
  { id: "cmaq", name: "CMAQ", hasStations: true },
]

export const meicDepartments = ["固定燃烧", "工业过程", "移动源", "溶剂使用", "农业"]

export const variables = {
  "wrf-mcip": ["温度", "风向", "风速"],
  meic: ["SO2", "NOx", "CO", "NMVOC", "NH3", "PM10", "PM2.5", "BC", "OC", "甲烷"],
  megan: ["BVOCs", "排放速率", "碳排放量"],
  cmaq: ["CO", "SO2", "NOx", "O3", "PM10", "PM2.5"],
}

export const months = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `${i + 1}月`,
}))
