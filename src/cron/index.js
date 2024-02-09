import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import bot from "../bot";
import { config } from "../config";
import Profile from "../models/profile";
import Subscribe from "../models/subscribe";

dayjs.extend(customParseFormat);

export async function cron() {
  const start = dayjs().subtract("24", "hour");
  const end = dayjs();
  const current = dayjs().subtract(config.sleep_hour, "hour");

  try {
    const result = (
      await axios.get(
        `${config.roseman}/api/sensor/last/` + start.unix() + "/" + end.unix()
      )
    ).data.result;

    const sensors = Object.entries(result).reduce(function (result, item) {
      result[item[0]] = item[1][0].timestamp;
      return result;
    }, {});

    const subscribes = await Subscribe.findAll();
    for (const item of subscribes) {
      const profile = await Profile.findOne({
        where: { id: item.profileId }
      });
      if (!sensors[item.deviceId]) {
        await bot.telegram.sendMessage(
          profile.userId,
          `Check your device ${item.deviceId}`
        );
      } else if (
        sensors[item.deviceId] &&
        sensors[item.deviceId] < current.unix()
      ) {
        await bot.telegram.sendMessage(
          profile.userId,
          `The latest data from # ${item.deviceId} was ${dayjs.unix(sensors[item.deviceId]).format("DD.MM.YYYY HH.mm.ss")}`
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
}
