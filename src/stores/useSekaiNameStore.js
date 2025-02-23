import {defineStore} from "pinia";

export const useSekaiNameStore = defineStore('sekaiName', {
    state: () => ({
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
    }),
    actions: {
        getSekaiName() {
            return this.sekaiName
        },
        getBandName() {
            return this.bandName
        }
    }
})