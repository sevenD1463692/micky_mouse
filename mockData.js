const mockData = {
    categories: [
        { id: 'all', name: '全部', icon: 'ph-squares-four' },
        { id: 'street-food', name: '夜市小吃', icon: 'ph-hamburger' },
        { id: 'drinks', name: '手搖飲料', icon: 'ph-coffee' },
        { id: 'restaurant', name: '餐廳聚餐', icon: 'ph-storefront' },
        { id: 'dessert', name: '甜點冰品', icon: 'ph-ice-cream' }
    ],
    restaurants: [
        {
            id: 1,
            name: '明倫蛋餅',
            category: 'street-food',
            tags: ['排隊名店', '傳統小吃', '宵夜'],
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.5,
            reviewCount: 128,
            price: '$',
            address: '台中市西屯區福星路546號',
            hours: '15:00 - 01:00',
            description: '逢甲夜市必吃美食，獨特甜麵醬搭配軟Q蛋餅皮，讓人一口接一口。',
            reviews: [
                {
                    id: 101,
                    user: '美食達人',
                    date: '2023-10-15',
                    ratings: {
                        price: 4,
                        portion: 3,
                        waitTime: 2,
                        sitability: 1
                    },
                    comment: '真的很好吃，但是每次都要排隊排超久！建議平日去買。完全沒有座位，就是邊走邊吃。'
                }
            ]
        },
        {
            id: 2,
            name: '刁民酸菜魚',
            category: 'restaurant',
            tags: ['聚餐', '重口味', '冷氣開放'],
            image: 'https://images.unsplash.com/photo-1544025162-811114cd354a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.8,
            reviewCount: 356,
            price: '$$$',
            address: '台中市西屯區福星路591號',
            hours: '11:30 - 02:00',
            description: '超人氣酸菜魚，份量十足，酸爽開胃，是同學聚餐的首選。',
            reviews: [
                {
                    id: 201,
                    user: '逢甲資工系草',
                    date: '2023-11-02',
                    ratings: {
                        price: 3,
                        portion: 5,
                        waitTime: 1,
                        sitability: 5
                    },
                    comment: '冷氣很涼，座位很舒服，份量兩個人吃一份剛好。唯一缺點是沒預約的話要等1-2小時。'
                }
            ]
        },
        {
            id: 3,
            name: '可不可熟成紅茶',
            category: 'drinks',
            tags: ['連鎖', '解渴', '快速'],
            image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.2,
            reviewCount: 89,
            price: '$',
            address: '台中市西屯區福星路427號',
            hours: '10:00 - 23:00',
            description: '經典熟成紅茶，逛夜市解膩的最佳搭配。',
            reviews: [
                {
                    id: 301,
                    user: '奶茶控',
                    date: '2023-11-20',
                    ratings: {
                        price: 4,
                        portion: 4,
                        waitTime: 5,
                        sitability: 1
                    },
                    comment: '出杯速度很快！熟成紅茶加白玉很好喝，逛街必買。無內用座位。'
                }
            ]
        },
        {
            id: 4,
            name: '那個鍋',
            category: 'restaurant',
            tags: ['平價火鍋', '白飯吃到飽', '麻辣'],
            image: 'https://images.unsplash.com/photo-1626804475297-41609ea0d4eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.4,
            reviewCount: 210,
            price: '$$',
            address: '台中市西屯區福星路522號',
            hours: '11:30 - 23:00',
            description: 'CP值極高的個人麻辣鍋，白飯與那個麵吃到飽，學生最愛。',
            reviews: [
                {
                    id: 401,
                    user: '大胃王',
                    date: '2023-12-05',
                    ratings: {
                        price: 5,
                        portion: 5,
                        waitTime: 4,
                        sitability: 4
                    },
                    comment: '麵可以無限續加真的太神了，月底沒錢都來吃這家，環境也不錯可以坐滿久的。'
                }
            ]
        }
    ]
};
