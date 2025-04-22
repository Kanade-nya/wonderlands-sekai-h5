import type { GoodsItem } from '../types';

export const sampleData: GoodsItem[] = [
  {
    id: '1',
    type: '徽章',
    name: '初音未来 2023 生日徽章',
    characters: ['初音未来'],
    price: 39.9,
    images: [
      'https://img.alicdn.com/imgextra/i3/2200590254409/O1CN01hhRdAf1h6zmGJZXXW_!!2200590254409.jpg',
      'https://img.alicdn.com/imgextra/i1/2200590254409/O1CN01hhRdAf1h6zmGJZXXW_!!2200590254409-0-picasso.jpg'
    ],
    source: 'https://example.com/miku',
    productionDate: new Date('2023-08-31'),
    contributors: [
      { name: '设计师A', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { name: '设计师B' }
    ]
  },
  {
    id: '2',
    type: '亚克力',
    name: '洛天依 立牌',
    characters: ['洛天依'],
    price: 59.9,
    images: [
      'https://img.alicdn.com/imgextra/i4/2206428403825/O1CN01Yx3xnO1OVKLDmJzjd_!!2206428403825.jpg',
      'https://img.alicdn.com/imgextra/i1/2206428403825/O1CN01Yx3xnO1OVKLDmJzjd_!!2206428403825-0-picasso.jpg'
    ]
  },
  {
    id: '3',
    type: '徽章',
    name: '镜音双子 联动徽章',
    characters: ['镜音铃', '镜音连'],
    price: 49.9,
    images: [
      'https://img.alicdn.com/imgextra/i1/2200590254409/O1CN01hhRdAf1h6zmGJZXXW_!!2200590254409-0-picasso.jpg',
      'https://img.alicdn.com/imgextra/i3/2200590254409/O1CN01hhRdAf1h6zmGJZXXW_!!2200590254409.jpg'
    ],
    contributors: [
      { name: '设计师C', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' }
    ]
  },
  {
    id: '4',
    type: '手办',
    name: '东方Project 博丽灵梦 手办',
    characters: ['博丽灵梦'],
    price: 299.9,
    images: [
      'https://img.alicdn.com/imgextra/i1/2206428403825/O1CN01Yx3xnO1OVKLDmJzjd_!!2206428403825-0-picasso.jpg',
      'https://img.alicdn.com/imgextra/i4/2206428403825/O1CN01Yx3xnO1OVKLDmJzjd_!!2206428403825.jpg'
    ],
    productionDate: new Date('2023-05-15')
  },
  {
    id: '5',
    type: '挂画',
    name: 'VOCALOID 家族 挂画',
    characters: ['初音未来', '镜音铃', '镜音连', '巡音流歌'],
    price: 79.9,
    images: [
      'https://img.alicdn.com/imgextra/i3/2200590254409/O1CN01hhRdAf1h6zmGJZXXW_!!2200590254409.jpg',
      'https://img.alicdn.com/imgextra/i1/2200590254409/O1CN01hhRdAf1h6zmGJZXXW_!!2200590254409-0-picasso.jpg'
    ],
    contributors: [
      { name: '画师D', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' }
    ]
  },
  {
    id: '6',
    type: '钥匙扣',
    name: '东方Project 角色系列钥匙扣',
    characters: ['博丽灵梦', '雾雨魔理沙', '十六夜咲夜'],
    price: 29.9,
    images: [
      'https://img.alicdn.com/imgextra/i4/2206428403825/O1CN01Yx3xnO1OVKLDmJzjd_!!2206428403825.jpg',
      'https://img.alicdn.com/imgextra/i1/2206428403825/O1CN01Yx3xnO1OVKLDmJzjd_!!2206428403825-0-picasso.jpg'
    ]
  }
];