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
        },
        {
            id: 9,
            name: '美軍豆乳冰',
            category: 'dessert',
            tags: ['甜點', '消暑', '冷氣開放', '有座位'],
            image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.5,
            reviewCount: 42,
            price: '$',
            address: '台中市西屯區福星路234號',
            coordinates: { lat: 24.177212, lng: 120.644123 },
            hours: '12:00 - 22:00',
            description: '濃郁有機豆乳冰與手工豆花，豆香十足，甜而不膩。',
            reviews: [
                {
                    id: 901,
                    user: '豆漿愛好者',
                    date: '2023-11-10',
                    ratings: {
                        price: 4,
                        portion: 4,
                        waitTime: 4,
                        sitability: 4
                    },
                    overallRating: 4.5,
                    comment: '豆乳冰香氣超濃！配料的手工芋圓跟紅豆也很棒，內用空間乾淨舒服。'
                }
            ]
        },
        {
            id: 10,
            name: '激旨燒鳥',
            category: 'snacks',
            tags: ['特色小吃', '排隊名店', '重口味', '有座位'],
            image: 'https://images.unsplash.com/photo-1519623286359-e9f3cbef015b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.7,
            reviewCount: 312,
            price: '$$',
            address: '台中市西屯區文華路150巷18號',
            coordinates: { lat: 24.180905, lng: 120.648192 },
            hours: '17:00 - 00:30',
            description: '逢甲超人氣日式串燒，現場有歌手駐唱，氛圍超棒，必點雞肉串。',
            reviews: [
                {
                    id: 1001,
                    user: '串燒大師',
                    date: '2023-12-01',
                    ratings: {
                        price: 3,
                        portion: 3,
                        waitTime: 2,
                        sitability: 5
                    },
                    overallRating: 4.7,
                    comment: '五花肉串麻糬超驚艷！現場駐唱唱歌很好聽，氣氛真的很像在日本居酒屋。'
                }
            ]
        },
        {
            id: 11,
            name: '阿華黑輪',
            category: 'snacks',
            tags: ['特色小吃', '傳統小吃', '銅板美食'],
            image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.3,
            reviewCount: 154,
            price: '$',
            address: '台中市西屯區文華路55號',
            coordinates: { lat: 24.178550, lng: 120.644820 },
            hours: '16:30 - 23:30',
            description: '逢甲老字號黑輪，湯頭清甜可免費無限續加，黑輪醬油獨特。',
            reviews: [
                {
                    id: 1101,
                    user: '湯控',
                    date: '2023-10-25',
                    ratings: {
                        price: 5,
                        portion: 4,
                        waitTime: 4,
                        sitability: 2
                    },
                    overallRating: 4.3,
                    comment: '黑輪湯超級好喝！冬天喝一碗全身都暖了，免費續湯真的太佛心。'
                }
            ]
        },
        {
            id: 12,
            name: '一心素食臭豆腐',
            category: 'snacks',
            tags: ['特色小吃', '排隊名店', '素食友善'],
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.4,
            reviewCount: 185,
            price: '$',
            address: '台中市西屯區福星路361號',
            coordinates: { lat: 24.179450, lng: 120.644910 },
            hours: '16:00 - 23:00',
            description: '外酥內嫩的現炸臭豆腐，搭配特製小黃瓜與泡菜，爽口不油膩。',
            reviews: [
                {
                    id: 1201,
                    user: '臭豆腐愛好者',
                    date: '2023-11-15',
                    ratings: {
                        price: 4,
                        portion: 4,
                        waitTime: 3,
                        sitability: 2
                    },
                    overallRating: 4.4,
                    comment: '豆腐塞滿小黃瓜絲跟醬汁，外皮炸得超酥，吃完非常清爽！'
                }
            ]
        },
        {
            id: 13,
            name: '官芝霖大腸包小腸',
            category: 'snacks',
            tags: ['特色小吃', '排隊名店', '銅板美食'],
            image: 'https://images.unsplash.com/photo-1585325701165-351af916e5ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.2,
            reviewCount: 295,
            price: '$',
            address: '台中市西屯區逢甲路20號',
            coordinates: { lat: 24.179210, lng: 120.645050 },
            hours: '12:00 - 01:00',
            description: '逢甲夜市指標性排隊美食，炭烤香氣逼人，蒜味與辣味醬料堪稱絕配。',
            reviews: [
                {
                    id: 1301,
                    user: '逢甲老饕',
                    date: '2023-09-20',
                    ratings: {
                        price: 4,
                        portion: 4,
                        waitTime: 2,
                        sitability: 1
                    },
                    overallRating: 4.2,
                    comment: '炭火香味十足，一定要加蒜頭跟酸菜，雖然每次都要排隊，但味道很經典。'
                }
            ]
        },
        {
            id: 14,
            name: '小二咖哩',
            category: 'bento',
            tags: ['便當快餐', '有座位', '冷氣開放', '平價首選'],
            image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.5,
            reviewCount: 96,
            price: '$$',
            address: '台中市西屯區逢甲路19巷10號',
            coordinates: { lat: 24.178120, lng: 120.646100 },
            hours: '11:00 - 20:30',
            description: '濃郁日式咖哩，炸豬排外酥內多汁，深受逢甲學生喜愛的平價美味。',
            reviews: [
                {
                    id: 1401,
                    user: '咖哩控學生',
                    date: '2023-12-12',
                    ratings: {
                        price: 5,
                        portion: 5,
                        waitTime: 4,
                        sitability: 4
                    },
                    overallRating: 4.5,
                    comment: '咖哩醬很濃郁微甜，豬排很厚而且炸得很酥脆，飯跟醬還可以免費續一次，CP值超高！'
                }
            ]
        },
        {
            id: 15,
            name: '日船章魚小丸子',
            category: 'snacks',
            tags: ['排隊名店', '特色小吃', '銅板美食'],
            image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.6,
            reviewCount: 412,
            price: '$',
            address: '台中市西屯區文華路13號',
            coordinates: { lat: 24.179700, lng: 120.645200 },
            hours: '15:00 - 01:00',
            description: '逢甲夜市最著名的地標美食之一，外皮焦脆、內餡軟嫩的章魚燒，柴魚片與芥末醬堪稱完美。',
            reviews: [
                {
                    id: 1501,
                    user: '章魚燒愛好者',
                    date: '2024-01-10',
                    ratings: {
                        price: 4,
                        portion: 4,
                        waitTime: 3,
                        sitability: 1
                    },
                    overallRating: 4.6,
                    comment: '每次來都必買！芥末醬很夠味，章魚塊也算大。現做剛起鍋超燙，吃的時候要小心。'
                }
            ]
        },
        {
            id: 16,
            name: '大甲芋頭城',
            category: 'dessert',
            tags: ['傳統小吃', '甜點冰品', '排隊名店', '有座位'],
            image: 'https://images.unsplash.com/photo-1600718374662-0483d2b9da44?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.5,
            reviewCount: 204,
            price: '$',
            address: '台中市西屯區福星路461巷2-2號',
            coordinates: { lat: 24.179900, lng: 120.645400 },
            hours: '13:00 - 00:00',
            description: '軟綿香甜的蜜芋頭與手工芋圓，是芋頭控來逢甲絕對不能錯過的朝聖甜品。',
            reviews: [
                {
                    id: 1601,
                    user: '蜜芋頭粉',
                    date: '2024-01-15',
                    ratings: {
                        price: 4,
                        portion: 5,
                        waitTime: 4,
                        sitability: 3
                    },
                    overallRating: 4.5,
                    comment: '芋頭燉得非常綿密入味，手工芋圓很有嚼勁。強烈推薦芋頭牛奶冰或是熱的芋頭西米露！'
                }
            ]
        },
        {
            id: 17,
            name: '86碳烤雞排',
            category: 'snacks',
            tags: ['特色小吃', '銅板美食', '重口味'],
            image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.3,
            reviewCount: 180,
            price: '$',
            address: '台中市西屯區逢甲路20巷',
            coordinates: { lat: 24.179500, lng: 120.645300 },
            hours: '16:00 - 01:30',
            description: '先炸後烤的超大雞排，刷上甜鹹的特製炭烤醬汁，香氣四溢、多汁美味。',
            reviews: [
                {
                    id: 1701,
                    user: '雞排狂熱者',
                    date: '2024-02-01',
                    ratings: {
                        price: 4,
                        portion: 5,
                        waitTime: 3,
                        sitability: 1
                    },
                    overallRating: 4.3,
                    comment: '碳烤醬甜甜鹹鹹的非常入味，肉質不會乾柴。份量蠻大的，吃一份就很有飽足感。'
                }
            ]
        },
        {
            id: 18,
            name: '梅香小吃',
            category: 'bento',
            tags: ['便當快餐', '老店', '平價首選', '有座位'],
            image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.4,
            reviewCount: 165,
            price: '$',
            address: '台中市西屯區逢甲路26號',
            coordinates: { lat: 24.178200, lng: 120.645800 },
            hours: '11:00 - 20:00',
            description: '逢甲老字號學餐，最出名的招牌是胡椒飯與辣椒飯，平價又美味，深受代代學生喜愛。',
            reviews: [
                {
                    id: 1801,
                    user: '資深逢甲校友',
                    date: '2024-02-05',
                    ratings: {
                        price: 5,
                        portion: 4,
                        waitTime: 4,
                        sitability: 3
                    },
                    overallRating: 4.4,
                    comment: '回憶中的味道！胡椒飯的胡椒香氣超級下飯，便宜又大碗，學生時代幾乎每週都來吃。'
                }
            ]
        },
        {
            id: 19,
            name: '得正 Oolong Tea Project',
            category: 'drinks',
            tags: ['熱門飲料', '連鎖', '快速'],
            image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.6,
            reviewCount: 132,
            price: '$',
            address: '台中市西屯區福星路382號',
            coordinates: { lat: 24.177500, lng: 120.645000 },
            hours: '10:00 - 22:00',
            description: '主打烏龍茶系列的超人氣手搖飲，茶香清雅，推薦焙烏龍鮮奶茶與焙烏龍茶凍。',
            reviews: [
                {
                    id: 1901,
                    user: '每天一杯手搖',
                    date: '2024-02-12',
                    ratings: {
                        price: 4,
                        portion: 4,
                        waitTime: 4,
                        sitability: 1
                    },
                    overallRating: 4.6,
                    comment: '得正的烏龍茶凍真的超級讚，吃起來很有茶香，搭配焙烏龍鮮奶茶微糖微冰最對味！'
                }
            ]
        },
        {
            id: 20,
            name: '李記蒸餃',
            category: 'noodles',
            tags: ['麵食水餃', '有座位', '傳統小吃', '平價首選'],
            image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.2,
            reviewCount: 95,
            price: '$',
            address: '台中市西屯區文華路162巷',
            coordinates: { lat: 24.181200, lng: 120.646500 },
            hours: '11:00 - 01:30',
            description: '平價又好吃的現包現蒸蒸餃，皮薄餡多，也是許多同學吃宵夜與晚餐的經典去處。',
            reviews: [
                {
                    id: 2001,
                    user: '宵夜通',
                    date: '2024-02-18',
                    ratings: {
                        price: 5,
                        portion: 4,
                        waitTime: 4,
                        sitability: 3
                    },
                    overallRating: 4.2,
                    comment: '蒸餃皮薄且多汁，一籠非常便宜！酸辣湯也很夠味，宵夜吃這個非常罪惡但很滿足。'
                }
            ]
        },
        {
            id: 21,
            name: '築間幸福鍋物 (台中逢甲店)',
            category: 'hotpot',
            tags: ['有座位', '冷氣開放', '聚餐', '宵夜首選'],
            image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.7,
            reviewCount: 288,
            price: '$$$',
            address: '台中市西屯區逢甲路路段',
            coordinates: { lat: 24.175500, lng: 120.647000 },
            hours: '11:00 - 04:00',
            description: '精緻的個人石頭火鍋，提供豐富的自助吧蔬菜吃到飽，營業至凌晨四點是夜貓子聚會首選。',
            reviews: [
                {
                    id: 2101,
                    user: '火鍋控小智',
                    date: '2024-02-22',
                    ratings: {
                        price: 3,
                        portion: 5,
                        waitTime: 4,
                        sitability: 5
                    },
                    overallRating: 4.7,
                    comment: '自助蔬菜吧配料選擇很多，食材新鮮，石頭火鍋的湯底非常香。開到很晚真的很方便！'
                }
            ]
        },
        {
            id: 22,
            name: '阿三哥擔仔麵',
            category: 'noodles',
            tags: ['傳統小吃', '有座位', '平價首選'],
            image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.1,
            reviewCount: 78,
            price: '$',
            address: '台中市西屯區文華路段',
            coordinates: { lat: 24.178500, lng: 120.645600 },
            hours: '17:00 - 02:00',
            description: '傳統的擔仔麵、滷肉飯與豐富的黑白切小菜，老實樸實的美味，溫暖夜晚晚歸學子的胃。',
            reviews: [
                {
                    id: 2201,
                    user: '夜讀生',
                    date: '2024-03-01',
                    ratings: {
                        price: 5,
                        portion: 4,
                        waitTime: 5,
                        sitability: 3
                    },
                    overallRating: 4.1,
                    comment: '經典的擔仔麵，加點大蒜更香。滷肉飯跟滷大腸也很推薦，價格實在。'
                }
            ]
        },
        {
            id: 23,
            name: '甲文青茶飲飲料 (逢甲創始店)',
            category: 'drinks',
            tags: ['手搖飲料', '熱門飲料', '快速'],
            image: 'https://images.unsplash.com/photo-1597839219216-a773cb2473e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.3,
            reviewCount: 92,
            price: '$',
            address: '台中市西屯區福星路427號',
            coordinates: { lat: 24.179300, lng: 120.645100 },
            hours: '10:00 - 22:00',
            description: '充滿文青風格的特色手搖飲，主打招牌雷蒙首選（檸檬系列飲料），口感清爽解渴。',
            reviews: [
                {
                    id: 2301,
                    user: '檸檬控',
                    date: '2024-03-05',
                    ratings: {
                        price: 4,
                        portion: 4,
                        waitTime: 4,
                        sitability: 1
                    },
                    overallRating: 4.3,
                    comment: '半熟檸檬青茶超級好喝！酸甜度剛好，很適合逛完夜市買一杯解膩，店面裝潢也很有特色。'
                }
            ]
        },
        {
            id: 24,
            name: '逢甲冰菓室',
            category: 'dessert',
            tags: ['甜點冰品', '有座位', '冷氣開放', '排隊名店'],
            image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.6,
            reviewCount: 148,
            price: '$$',
            address: '台中市西屯區逢甲路180號',
            coordinates: { lat: 24.179800, lng: 120.644900 },
            hours: '12:00 - 23:00',
            description: '主打復古文青風格，以整顆哈密瓜或鳳梨製成的巨無霸創意水果冰淇淋聞名，視覺與味覺的雙重享受。',
            reviews: [
                {
                    id: 2401,
                    user: '冰品狂熱者',
                    date: '2024-03-10',
                    ratings: {
                        price: 3,
                        portion: 5,
                        waitTime: 3,
                        sitability: 4
                    },
                    overallRating: 4.6,
                    comment: '哈密瓜雪花冰超吸睛！一整半顆哈密瓜加上一球球的果肉和冰淇淋，拍照發 IG 超好看，味道也很天然甜。'
                }
            ]
        },
        {
            id: 25,
            name: '金享綠豆沙牛乳',
            category: 'drinks',
            tags: ['手搖飲料', '排隊名店', '傳統小吃'],
            image: 'https://images.unsplash.com/photo-1553787499-6f9133860278?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.4,
            reviewCount: 110,
            price: '$',
            address: '台中市西屯區逢甲路19巷',
            coordinates: { lat: 24.179100, lng: 120.644700 },
            hours: '12:00 - 22:30',
            description: '逢甲老牌排隊綠豆沙，口感極度細緻綿密，濃郁綠豆香氣混合香醇鮮乳，是逛街消暑極品。',
            reviews: [
                {
                    id: 2501,
                    user: '綠豆沙粉',
                    date: '2024-03-12',
                    ratings: {
                        price: 5,
                        portion: 4,
                        waitTime: 3,
                        sitability: 1
                    },
                    overallRating: 4.4,
                    comment: '綠豆沙非常綿密完全吃不到冰沙顆粒，配上鮮乳超級順口！每次來逢甲都一定要排隊買一杯。'
                }
            ]
        },
        {
            id: 26,
            name: '朴大哥的韓式炸雞',
            category: 'snacks',
            tags: ['有座位', '聚餐', '重口味', '冷氣開放'],
            image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.5,
            reviewCount: 224,
            price: '$$',
            address: '台中市西屯區逢甲路20巷28弄5號',
            coordinates: { lat: 24.180200, lng: 120.648000 },
            hours: '17:00 - 01:30',
            description: '全台第一家韓式炸雞店，由韓國人親自經營。招牌紅醬與黑醬炸雞甜辣多汁，適合三五好友聚會。',
            reviews: [
                {
                    id: 2601,
                    user: '韓流熱愛者',
                    date: '2024-03-15',
                    ratings: {
                        price: 3,
                        portion: 4,
                        waitTime: 4,
                        sitability: 5
                    },
                    overallRating: 4.5,
                    comment: '招牌黑醬炸雞非常好吃，醬汁裹得很均勻，雞肉很嫩。內用可以點啤酒搭配（未成年請勿飲酒），氣氛超嗨。'
                }
            ]
        },
        {
            id: 27,
            name: '赤鬼炙燒牛排 (逢甲店)',
            category: 'bento',
            tags: ['聚餐', '有座位', '冷氣開放', '排隊名店'],
            image: 'https://images.unsplash.com/photo-1544025162-811114cd354a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.4,
            reviewCount: 310,
            price: '$$$',
            address: '台中市西屯區文華路11號',
            coordinates: { lat: 24.177000, lng: 120.646000 },
            hours: '11:00 - 22:30',
            description: '台灣知名連鎖平價炙燒牛排，精緻奢華的內部裝潢，提供美味爆漿餐包與無限自助湯品。',
            reviews: [
                {
                    id: 2701,
                    user: '牛排狂人',
                    date: '2024-03-20',
                    ratings: {
                        price: 4,
                        portion: 4,
                        waitTime: 4,
                        sitability: 4
                    },
                    overallRating: 4.4,
                    comment: '沙朗牛排肉質有嚼勁，黑胡椒醬非常夠味。餐包一定要趁熱吃，會爆漿！羅宋湯也是料多實在。'
                }
            ]
        },
        {
            id: 28,
            name: '重慶川辣酸辣粉',
            category: 'noodles',
            tags: ['重口味', '有座位', '平價首選', '冷氣開放'],
            image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.3,
            reviewCount: 115,
            price: '$',
            address: '台中市西屯區文華路路段',
            coordinates: { lat: 24.180500, lng: 120.645700 },
            hours: '11:00 - 21:00',
            description: '正宗重慶口味酸辣粉，紅薯粉條香Q有彈性，酸辣交織、香氣撲鼻，嗜辣者必吃。',
            reviews: [
                {
                    id: 2801,
                    user: '嗜辣星人',
                    date: '2024-03-22',
                    ratings: {
                        price: 5,
                        portion: 4,
                        waitTime: 4,
                        sitability: 3
                    },
                    overallRating: 4.3,
                    comment: '酸度跟辣度都可以調整，點中辣酸辣過癮！紅薯粉條非常彈牙。內用空間稍微小了點。'
                }
            ]
        },
        {
            id: 29,
            name: '馬崗豆花 (逢甲店)',
            category: 'dessert',
            tags: ['甜點冰品', '傳統小吃', '有座位'],
            image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.5,
            reviewCount: 88,
            price: '$',
            address: '台中市西屯區福星路',
            coordinates: { lat: 24.175000, lng: 120.648000 },
            hours: '10:00 - 22:30',
            description: '台中在地老字號手工豆花，豆花質地細緻、入口即化，糖水清甜，亦可搭配香濃豆漿。',
            reviews: [
                {
                    id: 2901,
                    user: '豆花收藏家',
                    date: '2024-03-25',
                    ratings: {
                        price: 4,
                        portion: 4,
                        waitTime: 4,
                        sitability: 4
                    },
                    overallRating: 4.5,
                    comment: '傳統的古早味豆花，口感非常綿密。配料的花生跟芋圓也煮得很好吃，糖水喝起來不會太甜膩。'
                }
            ]
        },
        {
            id: 30,
            name: '徐師傅麻辣鴨血臭豆腐',
            category: 'hotpot',
            tags: ['重口味', '有座位', '冷氣開放', '平價火鍋'],
            image: 'https://images.unsplash.com/photo-1547928576-a4a33237eceb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.4,
            reviewCount: 142,
            price: '$$',
            address: '台中市西屯區福星路',
            coordinates: { lat: 24.179400, lng: 120.645000 },
            hours: '16:30 - 00:30',
            description: '香辣濃育的鴨血豆腐煲，鴨血滑嫩入味、臭豆腐吸飽湯汁，是很多學生晚餐與宵夜的熱門選擇。',
            reviews: [
                {
                    id: 3001,
                    user: '鴨血控',
                    date: '2024-03-28',
                    ratings: {
                        price: 4,
                        portion: 5,
                        waitTime: 4,
                        sitability: 3
                    },
                    overallRating: 4.4,
                    comment: '鴨血非常嫩且非常入味，豆腐咬下去會噴汁！平價個人煲還有加麵，吃得很飽。'
                }
            ]
        },
        {
            id: 31,
            name: '小胖鮮鍋 (逢甲店)',
            category: 'hotpot',
            tags: ['有座位', '冷氣開放', '聚餐', '高價精緻'],
            image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.8,
            reviewCount: 156,
            price: '$$$',
            address: '台中市西屯區河南路二段',
            coordinates: { lat: 24.176500, lng: 120.647500 },
            hours: '11:30 - 23:00',
            description: '高品質海鮮與頂級肉品火鍋，食材極度新鮮，內用環境寬敞精緻，並有明治冰淇淋無限享用。',
            reviews: [
                {
                    id: 3101,
                    user: '海鮮大師',
                    date: '2024-04-01',
                    ratings: {
                        price: 3,
                        portion: 4,
                        waitTime: 4,
                        sitability: 5
                    },
                    overallRating: 4.8,
                    comment: '海鮮盤超級新鮮，蛤蜊超大顆還是活的！肉質也很棒。內用飲料吧跟冰淇淋種類很多，聚餐首選。'
                }
            ]
        },
        {
            id: 32,
            name: '黑輪美 (逢甲店)',
            category: 'snacks',
            tags: ['特色小吃', '排隊名店', '有座位'],
            image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            rating: 4.3,
            reviewCount: 98,
            price: '$',
            address: '台中市西屯區文華路10-11號',
            coordinates: { lat: 24.180100, lng: 120.646800 },
            hours: '14:00 - 23:00',
            description: '主打創意「炸黑輪」與關東煮，將黑輪炸得外酥內軟，刷上獨特醬汁，十分美味特別。',
            reviews: [
                {
                    id: 3201,
                    user: '炸物愛好者',
                    date: '2024-04-05',
                    ratings: {
                        price: 4,
                        portion: 4,
                        waitTime: 4,
                        sitability: 3
                    },
                    overallRating: 4.3,
                    comment: '第一次吃炸的黑輪！外皮超酥脆，特製黑輪醬微甜微辣非常搭，價格也很劃算，大推！'
                }
            ]
        }
    ]
};
