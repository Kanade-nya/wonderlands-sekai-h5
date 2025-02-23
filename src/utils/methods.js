// export const baseUrl = 'http://103.153.100.130:5050'
export const baseUrl = 'https://wonderlands-sekai.space'
export const imageUrl = 'https://img.wonderlands-sekai.space'
// export  const baseUrl = 'http://192.168.3.194:5000'

export const ACCOUNT_ID = '7a0c96ad44cdb5138ab8b11a11658303'
export const treeToList = (tree) => {
    let list = []
    for (let item of tree) {
        // console.log(item)
        list.push({name: item.name, id: item.id})
        if (item.children.length !== 0) {
            list.push(...treeToList(item.children))
        }
    }
    return list
}

export const splitTeamAndCharacter = (tree) => {
    let teamList = [], characterList = [];
    for (let item of tree) {
        // console.log(item)
        teamList.push({name: item.name, id: item.id, avatar: item.avatar})
        for (let item_child of item.children) {
            characterList.push({name: item_child.name, id: item_child.id, avatar: item_child.avatar})
        }
    }
    return [teamList, characterList]
}


export const characterColors = [
    {
        name: '星乃一歌',
        color: '#33AAEE'
    },
    {
        name: '天马咲希',
        color: '#FFDD44'
    },
    {
        name: '望月穗波',
        color: '#EE6666',
    },
    {
        name: '日野森志步',
        color: '#BBDD22'
    },
    {
        name: '花里实乃理',
        color: '#FFCCAA'
    },
    {
        name: '桐谷遥',
        color: '#99CCFF'
    },
    {
        name: '桃井爱莉',
        color: '#FFAACC'
    },
    {
        name: '日野森雫',
        color: '#99EEDD'
    },
    {
        name: '小豆泽心羽',
        color: '#FF6699'
    },
    {
        name: '白石杏',
        color: '#00BBDD'
    },
    {
        name: '东云彰人',
        color: '#FF7722'
    },
    {
        name: '青柳冬弥',
        color: '#0077DD'
    },
    {
        name: '天马司',
        color: '#FFBB00'
    },
    {
        name: '凤笑梦',
        color: '#FF66BB'
    },
    {
        name: '草薙宁宁',
        color: '#33DD99'
    },
    {
        name: '神代类',
        color: '#BB88EE'
    },
    {
        name: '宵崎奏',
        color: '#BB6688'
    },
    {
        name: '朝比奈真冬',
        color: '#8888CC'
    },
    {
        name: '东云绘名',
        color: '#CCAA88'
    },
    {
        name: '晓山瑞希',
        color: '#DDAACC'
    },
    {
        name: '初音未来',
        color: '#33CCBB'
    },
    {
        name: '镜音铃',
        color: '#FFCC11'
    },
    {
        name: '镜音连',
        color: '#FFEE11'
    },
    {
        name: '巡音流歌',
        color: '#FFBBCC'
    },
    {
        name: 'MEIKO',
        color: '#DD4444'
    },
    {
        name: 'KAITO',
        color: '#3366CC'
    },
    {
        name: 'Leo/need',
        color: '#4455DD'
    },
    {
        name: 'MORE MORE JUMP!',
        color: '#88DD44'
    },
    {
        name: 'Vivid BAD SQUAD',
        color: '#EE1166'
    },
    {
        name: 'Wonderlands×Showtime',
        color: '#FF9900'
    },
    {
        name: '25時、ナイトコードで。',
        color: '#884499'
    },
    {
        name: 'VIRTUAL SINGER',
        color: '#33CCBB'
    },
    {
        name: '其他',
        color: '#66BABC'
    }

]

export const characterBand = {
    sekaiName: [
        '星乃一歌',
        '天马咲希',
        '望月穗波',
        '日野森志步',
        '花里实乃理',
        '桐谷遥',
        '桃井爱莉',
        '日野森雫',
        '小豆泽心羽',
        '白石杏',
        '东云彰人',
        '青柳冬弥',
        '天马司',
        '凤笑梦',
        '草薙宁宁',
        '神代类',
        '宵崎奏',
        '朝比奈真冬',
        '东云绘名',
        '晓山瑞希',
        '初音未来',
        '镜音铃',
        '镜音连',
        '巡音流歌',
        'MEIKO',
        'KAITO',
    ],
    bandName: [
        'Leo/need',
        'MORE MORE JUMP!',
        'Vivid BAD SQUAD',
        'Wonderlands×Showtime',
        '25時、ナイトコードで。',
        'VIRTUAL SINGER',
        '其他'
    ]
}