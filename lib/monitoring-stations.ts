export interface MonitoringStation {
  id: string
  name: string
  city: string
  region: string
  coordinates: [number, number] // [纬度, 经度]
  type: "urban" | "suburban" | "industrial" | "background"
  status: "active" | "maintenance" | "offline"
  establishedDate: string
  description: string
}

// 中国主要环境监测站点数据
export const monitoringStations: MonitoringStation[] = [
  // 长三角城市群
  {
    id: "sh_001",
    name: "上海徐家汇站",
    city: "上海",
    region: "长三角城市群",
    coordinates: [31.1993, 121.4337],
    type: "urban",
    status: "active",
    establishedDate: "2010-01-01",
    description: "上海市中心城区代表性监测站点",
  },
  {
    id: "sh_002",
    name: "上海浦东站",
    city: "上海",
    region: "长三角城市群",
    coordinates: [31.2222, 121.5333],
    type: "urban",
    status: "active",
    establishedDate: "2012-03-15",
    description: "浦东新区环境质量监测站",
  },
  {
    id: "nj_001",
    name: "南京鼓楼站",
    city: "南京",
    region: "长三角城市群",
    coordinates: [32.0603, 118.7969],
    type: "urban",
    status: "active",
    establishedDate: "2009-06-01",
    description: "南京市区环境监测中心站",
  },
  {
    id: "hz_001",
    name: "杭州西湖站",
    city: "杭州",
    region: "长三角城市群",
    coordinates: [30.2741, 120.1551],
    type: "urban",
    status: "active",
    establishedDate: "2011-04-20",
    description: "杭州西湖风景区监测站",
  },
  {
    id: "sz_001",
    name: "苏州工业园区站",
    city: "苏州",
    region: "长三角城市群",
    coordinates: [31.3017, 120.5954],
    type: "industrial",
    status: "active",
    establishedDate: "2013-08-10",
    description: "苏州工业园区环境监测站",
  },

  // 珠三角城市群
  {
    id: "gz_001",
    name: "广州天河站",
    city: "广州",
    region: "珠三角城市群",
    coordinates: [23.1167, 113.3333],
    type: "urban",
    status: "active",
    establishedDate: "2008-12-01",
    description: "广州市天河区环境监测站",
  },
  {
    id: "sz_002",
    name: "深圳南山站",
    city: "深圳",
    region: "珠三角城市群",
    coordinates: [22.5333, 113.9333],
    type: "urban",
    status: "active",
    establishedDate: "2010-05-15",
    description: "深圳南山科技园区监测站",
  },
  {
    id: "dg_001",
    name: "东莞松山湖站",
    city: "东莞",
    region: "珠三角城市群",
    coordinates: [22.9167, 113.8833],
    type: "suburban",
    status: "active",
    establishedDate: "2014-02-28",
    description: "东莞松山湖高新区监测站",
  },

  // 京津冀城市群
  {
    id: "bj_001",
    name: "北京朝阳站",
    city: "北京",
    region: "京津冀城市群",
    coordinates: [39.9289, 116.4883],
    type: "urban",
    status: "active",
    establishedDate: "2007-01-01",
    description: "北京市朝阳区环境监测站",
  },
  {
    id: "bj_002",
    name: "北京海淀站",
    city: "北京",
    region: "京津冀城市群",
    coordinates: [39.9889, 116.3147],
    type: "urban",
    status: "active",
    establishedDate: "2008-03-01",
    description: "北京海淀区科技园区监测站",
  },
  {
    id: "tj_001",
    name: "天津滨海站",
    city: "天津",
    region: "京津冀城市群",
    coordinates: [39.0458, 117.7917],
    type: "industrial",
    status: "active",
    establishedDate: "2009-07-15",
    description: "天津滨海新区环境监测站",
  },
  {
    id: "sjz_001",
    name: "石家庄裕华站",
    city: "石家庄",
    region: "京津冀城市群",
    coordinates: [38.0428, 114.5149],
    type: "urban",
    status: "active",
    establishedDate: "2011-09-01",
    description: "石家庄市裕华区监测站",
  },

  // 成渝城市群
  {
    id: "cd_001",
    name: "成都锦江站",
    city: "成都",
    region: "成渝城市群",
    coordinates: [30.6667, 104.0833],
    type: "urban",
    status: "active",
    establishedDate: "2010-11-01",
    description: "成都市锦江区环境监测站",
  },
  {
    id: "cq_001",
    name: "重庆渝中站",
    city: "重庆",
    region: "成渝城市群",
    coordinates: [29.5583, 106.5833],
    type: "urban",
    status: "active",
    establishedDate: "2009-04-15",
    description: "重庆市渝中区环境监测站",
  },

  // 中原城市群
  {
    id: "zz_001",
    name: "郑州金水站",
    city: "郑州",
    region: "中原城市群",
    coordinates: [34.7581, 113.6642],
    type: "urban",
    status: "active",
    establishedDate: "2012-01-20",
    description: "郑州市金水区环境监测站",
  },
  {
    id: "ly_001",
    name: "洛阳涧西站",
    city: "洛阳",
    region: "中原城市群",
    coordinates: [34.6197, 112.4542],
    type: "urban",
    status: "active",
    establishedDate: "2013-05-10",
    description: "洛阳市涧西区环境监测站",
  },

  // 山东半岛城市群
  {
    id: "jn_001",
    name: "济南历下站",
    city: "济南",
    region: "山东半岛城市群",
    coordinates: [36.6667, 117.0],
    type: "urban",
    status: "active",
    establishedDate: "2011-08-01",
    description: "济南市历下区环境监测站",
  },
  {
    id: "qd_001",
    name: "青岛市南站",
    city: "青岛",
    region: "山东半岛城市群",
    coordinates: [36.0986, 120.3719],
    type: "urban",
    status: "active",
    establishedDate: "2010-06-15",
    description: "青岛市市南区环境监测站",
  },
  {
    id: "yt_001",
    name: "烟台芝罘站",
    city: "烟台",
    region: "山东半岛城市群",
    coordinates: [37.5365, 121.39],
    type: "urban",
    status: "active",
    establishedDate: "2012-10-01",
    description: "烟台市芝罘区环境监测站",
  },
]

// 根据站点ID获取站点信息
export function getStationById(id: string): MonitoringStation | undefined {
  return monitoringStations.find((station) => station.id === id)
}

// 根据区域获取站点列表
export function getStationsByRegion(region: string): MonitoringStation[] {
  return monitoringStations.filter((station) => station.region === region)
}

// 根据城市获取站点列表
export function getStationsByCity(city: string): MonitoringStation[] {
  return monitoringStations.filter((station) => station.city === city)
}

// 获取活跃状态的站点
export function getActiveStations(): MonitoringStation[] {
  return monitoringStations.filter((station) => station.status === "active")
}
