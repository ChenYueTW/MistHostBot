const { EmbedBuilder } = require('discord.js');
const { WEATHER_API, EARTHQUAKE_CHANNEL_ID } = require('../config.json');
const { color } = require('../helper/earthquakeColor.json');
const url = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/E-A0015-001?Authorization=' + WEATHER_API;
const axios = require('axios');
let lastEarthquakeData = null;
let intervalId = null;

class earthquake {
    constructor(client) {
        this.client = client;
    }
    async isEarthquake() {
        if (EARTHQUAKE_CHANNEL_ID == '') return;
        try {
            const response = await axios.get(url);
            const earthquakeData = response.data.records.Earthquake[0];

            if (!lastEarthquakeData) {
                lastEarthquakeData = earthquakeData;
            }

            if (JSON.stringify(lastEarthquakeData) !== JSON.stringify(earthquakeData)) {
                lastEarthquakeData = earthquakeData;
                const earthquakeInfo = earthquakeData.EarthquakeInfo;
                const earthquakeIntensity = earthquakeData.Intensity.ShakingArea;

                // 日期切分
                const dataArray = `${earthquakeInfo.OriginTime}`.split(' ');
                const data = dataArray[0].replace(/-/g, '/');
                const time = dataArray[1];
                // 震源切分
                const locationArray = `${earthquakeInfo.Epicenter.Location}`.split(' ');
                const locationOccur = locationArray[0]                       // 發生位置
                const locationDistance = locationArray[2] + locationArray[4] // 距離
                const lieIn = locationArray[5]                               // 鄰近地區
                // 說明切分
                const content = earthquakeData.ReportContent.substring(11).split('，').join('\n').replace(/。/g, '');
                const remark = earthquakeData.ReportRemark.replace(/。/g, '');

                const embed = new EmbedBuilder()
                    .setTitle(`${earthquakeData.ReportType}`)
                    .setAuthor({ name: `${remark}` })
                    .setURL(`${earthquakeData.Web}`)
                    .setDescription(`${content}`)
                    .setImage(`${earthquakeData.ReportImageURI}`)
                    .setColor(color[0][`${earthquakeData.ReportColor}`])
                    .setFooter({ text: 'MistHost．託管服務' })
                    .addFields(
                        { name: `地震編號`, value: `${earthquakeData.EarthquakeNo}`, inline: true },
                        { name: `發生時間`, value: `**${data}**\n\`${time}\``, inline: true },
                        { name: `地震深度`, value: `__${earthquakeInfo.FocalDepth}__公里`, inline: true },
                        { name: `發生位置`, value: `**${locationOccur}**\n__${locationDistance}__\n${lieIn}`, inline: true },
                        { name: `經緯度`, value: `${earthquakeInfo.Epicenter.EpicenterLatitude}, ${earthquakeInfo.Epicenter.EpicenterLongitude}`, inline: true },
                        { name: `${earthquakeInfo.EarthquakeMagnitude.MagnitudeType}`, value: `${earthquakeInfo.EarthquakeMagnitude.MagnitudeValue}`, inline: true },
                        { name: '\u200B', value: '\u200B' },
                    );

                for (let i = 11; i > 0; i --) {
                    for (let county of earthquakeIntensity) {
                        const maxAreaIntensity = county.AreaDesc;
                        const areaIntensity = county.AreaIntensity;

                        if (maxAreaIntensity.includes('最大震度') && areaIntensity.replace('級', '') == i) {
                            const area = county.CountyName.split('、').join('\n');

                            embed.addFields({
                                name: `${maxAreaIntensity}`, value: `${area}`, inline: true
                            });
                        }
                    }
                }
                const channel = this.client.channels.cache.get(EARTHQUAKE_CHANNEL_ID);
                if (channel) {
                    channel.send({ embeds: [embed] });
                }
            }
        } catch (error) {
            console.error('Error fetching earthquake data:', error);
        }
    }
    setInterval(interval) {
        clearInterval(intervalId);
        intervalId = setInterval(() => {
            this.isEarthquake();
        }, interval * 60 * 1000);
    }
}
module.exports = earthquake;