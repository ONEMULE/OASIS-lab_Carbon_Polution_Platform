export const dataSources = [
  { id: "wrf-mcip", name: "WRF/MCIP", hasStations: true },
  { id: "meic", name: "MEIC", hasStations: false },
  { id: "megan", name: "MEGAN", hasStations: false },
  { id: "cmaq", name: "CMAQ", hasStations: true },
]

export const meicDepartments = ["AGRICULTURE", "INDUSTRY", "POWER", "RESIDENTIAL", "TRANSPORTATION"]

export const variables = {
  "wrf-mcip": ["温度", "风向", "风速"],
  meic: ["SO2", "NOx", "CO", "NMVOC", "NH3", "PM10", "PM2.5", "BC", "OC", "甲烷"],
  megan: ["ACET", "ALD2", "ALDX", "CH4", "CO", "ETH", "ETHA", "ETOH", "FORM", "GDAY", "IOLE", "ISOP", "KET", "MEOH", "NO", "NR", "OLE", "PAR", "PRPA", "TERP", "TOL", "XYL"],
  cmaq: ["CO", "SO2", "NOx", "O3", "PM10", "PM2.5"],
}

export const months = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `${i + 1}月`,
}))
