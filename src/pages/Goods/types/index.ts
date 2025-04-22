export interface GoodsItem {
    id: string;
    type: string;
    name: string;
    characters: string[];
    price: number;
    images: string[];
    source?: string;
    productionDate?: Date;
    contributors?: Contributor[];
}

export interface Contributor {
    name: string;
    avatar?: string;
}