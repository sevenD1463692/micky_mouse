const mockData = {
    categories: [
        { id: 'all', name: '全部', icon: 'ph-squares-four' },
        { id: 'bento', name: '便當快餐', icon: 'ph-bowl-food' },
        { id: 'noodles', name: '麵食水餃', icon: 'ph-bowl-steam' },
        { id: 'hotpot', name: '鍋物料理', icon: 'ph-cooking-pot' },
        { id: 'drinks', name: '手搖飲料', icon: 'ph-coffee' },
        { id: 'snacks', name: '特色小吃', icon: 'ph-hamburger' },
        { id: 'dessert', name: '甜點冰品', icon: 'ph-ice-cream' }
    ],
    restaurants: [
        {
            id: 1,
            name: '明倫蛋餅',
            category: 'snacks',
            tags: ['排隊名店', '傳統小吃', '銅板美食'],
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.5,
            reviewCount: 128,
            price: '$',
            address: '台中市西屯區福星路546號',
            coordinates: { lat: 24.179611, lng: 120.645167 },
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
                    overallRating: 4.5,
                    comment: '真的很好吃，但是每次都要排隊排超久！建議平日去買。完全沒有座位，就是邊走邊吃。'
                }
            ]
        },
        {
            id: 2,
            name: '刁民酸菜魚',
            category: 'hotpot',
            tags: ['聚餐', '重口味', '冷氣開放', '有座位'],
            image: 'https://images.unsplash.com/photo-1544025162-811114cd354a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.8,
            reviewCount: 356,
            price: '$$$',
            address: '台中市西屯區福星路591號',
            coordinates: { lat: 24.179944, lng: 120.645833 },
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
                    overallRating: 4.8,
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
            coordinates: { lat: 24.176889, lng: 120.643361 },
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
                    overallRating: 4.2,
                    comment: '出杯速度很快！熟成紅茶加白玉很好喝，逛街必買。無內用座位。'
                }
            ]
        },
        {
            id: 4,
            name: '那個鍋',
            category: 'hotpot',
            tags: ['平價火鍋', '白飯吃到飽', '麻辣', '冷氣開放', '有座位'],
            image: 'https://images.unsplash.com/photo-1626804475297-41609ea0d4eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.4,
            reviewCount: 210,
            price: '$$',
            address: '台中市西屯區福星路522號',
            coordinates: { lat: 24.178917, lng: 120.644611 },
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
                    overallRating: 4.4,
                    comment: '麵可以無限續加真的太神了，月底沒錢都來吃這家，環境也不錯可以坐滿久的。'
                }
            ]
        },
        {
            id: 5,
            name: '尊品原汁牛肉麵',
            category: 'noodles',
            tags: ['麵食', '牛肉麵', '有座位', '冷氣開放', '平價首選'],
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.3,
            reviewCount: 145,
            price: '$$',
            address: '台中市西屯區文華路127巷15號',
            hours: '11:00 - 21:00',
            description: '道地川味牛肉麵，肉質大塊軟嫩，湯頭濃郁，內用環境整潔冷氣開放。',
            reviews: [
                {
                    id: 501,
                    user: '牛肉麵狂熱者',
                    date: '2023-12-10',
                    ratings: {
                        price: 4,
                        portion: 5,
                        waitTime: 4,
                        sitability: 4
                    },
                    overallRating: 4.3,
                    comment: '紅燒湯頭非常讚，牛肉大塊且燉得很軟爛！內用環境舒服且有冷氣。'
                }
            ]
        },
        {
            id: 6,
            name: '魚心便當',
            category: 'bento',
            tags: ['便當', '平價首選', '快速'],
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.1,
            reviewCount: 76,
            price: '$',
            address: '台中市西屯區文華路10-5號',
            hours: '10:30 - 19:30',
            description: '傳統手作排骨便當與雞腿便當，配菜豐富，百元有找的超高CP值學餐選擇。',
            reviews: [
                {
                    id: 601,
                    user: '小資學生',
                    date: '2023-11-28',
                    ratings: {
                        price: 5,
                        portion: 4,
                        waitTime: 5,
                        sitability: 2
                    },
                    overallRating: 4.1,
                    comment: '排骨炸得很酥脆，配菜可以自己選三樣，百元內解決一餐非常划算，出餐也快。'
                }
            ]
        },
        {
            id: 7,
            name: '大碗公冰甜品',
            category: 'dessert',
            tags: ['甜點', '大份量', '有座位', '冷氣開放'],
            image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.6,
            reviewCount: 112,
            price: '$$',
            address: '台中市西屯區逢甲路92號',
            hours: '12:00 - 22:30',
            description: '以超大碗公黑糖剉冰聞名，適合三五好友挑戰多人份水果冰，夏天消暑聖地。',
            reviews: [
                {
                    id: 701,
                    user: '甜點胃',
                    date: '2023-08-15',
                    ratings: {
                        price: 4,
                        portion: 5,
                        waitTime: 4,
                        sitability: 4
                    },
                    overallRating: 4.6,
                    comment: '芒果牛奶冰超大碗！芒果給得很慷慨，煉乳跟黑糖的比例剛剛好，夏天吃超爽。'
                }
            ]
        },
        {
            id: 8,
            name: '溫家地瓜球',
            category: 'snacks',
            tags: ['夜市小吃', '排隊名店', '傳統小吃', '銅板美食'],
            image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.4,
            reviewCount: 198,
            price: '$',
            address: '台中市西屯區文華路99-2號',
            hours: '16:00 - 23:00',
            description: '逢甲夜市老字號地瓜球，外酥內Q、香氣十足，每次路過都是大排長龍。',
            reviews: [
                {
                    id: 801,
                    user: '夜市達人',
                    date: '2023-09-05',
                    ratings: {
                        price: 5,
                        portion: 4,
                        waitTime: 2,
                        sitability: 1
                    },
                    overallRating: 4.4,
                    comment: '剛起鍋的最好吃，非常酥脆而且很有嚼勁。排隊人潮多但老闆動作很快。'
                }
            ]
        }
    ]
};
