const axios = require('axios');
const log = require('../helper/log');
const api = require('../config.json').HOST_API;
const { DETECT_HOURS, TIMEOUT_CHANNEL_ID } = require('../config.json');
const getJsonUrl = "https://helia.misthost.net/api/getTimeoutJson";
const isRemindUrl = "https://helia.misthost.net/api/isRemindJson?orderId=";

class timeout {
    constructor(client) {
        this.client = client;
    }
    async detectIsRemind() {
        try {
            // 取得timeout.json
            let response = await axios.get(getJsonUrl, {
                headers: {
                    'Authorization': `Bearer ${api}`
                }
            });
            response = response.data;
            if (!response.status == 'success') return;

            // json轉換成array
            const order = Object.entries(response.json).map(([orderId, order]) => ({
                orderId,
                ...order
              }));

            for (let orderId of order) {
                // 檢查是否低於7天
                let currentDate = new Date();
                let timeoutDate = new Date(orderId.timeout);
                let diff = timeoutDate.getTime() - currentDate.getTime();
                // console.log(orderId.isRemind);

                if (orderId.isRemind == false & diff <= 604800000) {
                    // 發送訊息
                    const user = this.client.users.cache.get(orderId.userId);
                    // Log頻道
                    const logChannel = this.client.channels.cache.get(TIMEOUT_CHANNEL_ID);
                    // EmbedBuilder
                    const embed = log(`訂單編號: ${orderId.orderId}`, `到期時間: \`${orderId.timeout}\`\n**購買內容**\n\`\`\`CPU: ${orderId.orderInfo.cpu / 100} 核心\nRam: ${orderId.orderInfo.ram / 1024} GB\nDisk: ${orderId.orderInfo.disk / 1024} GB\nServers: ${orderId.orderInfo.servers} 個\`\`\``);

                    if (user) {
                        user.send(`您的購買的資源即將在 7 天後到期。`)
                            .then(() => {
                                user.send({ embeds: [embed] })
                            })
                            .catch(console.error);

                        const sendRemind = await axios.post(isRemindUrl + orderId.orderId, null, {
                            headers: {
                                'Authorization': `Bearer ${api}`
                            }
                        });
                        if (!sendRemind.data.status == 'success') console.log('訊息沒發送完成');
                    }
                    if (logChannel) {
                        logChannel.send(`<@${orderId.userId}> 訂單 7 天後到期。`)
                            .then(() => {
                                logChannel.send({ embeds: [embed] });
                            })
                            .catch(console.error);
                    }
                }
            };
        } catch (error) {
            console.error('Error retrieving or updating timeout data:', error);
        }
    }
    setInterval() {
        setInterval(() => {
            this.detectIsRemind();
        }, DETECT_HOURS * 60 * 60 * 1000);
    }
}

module.exports = timeout;