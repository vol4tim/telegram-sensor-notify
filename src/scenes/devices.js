import { escapers } from "@telegraf/entity";
import { Markup, Scenes } from "telegraf";
import bot from "../bot";
import Profile from "../models/profile";
import Subscribe, { findSubscribe, removeSubscribe } from "../models/subscribe";

const devicesScene = new Scenes.BaseScene("devices");
devicesScene.enter(async (ctx) => {
  const profile = await Profile.findOne({
    where: { userId: ctx.from.id.toString() }
  });
  const subscribes = await Subscribe.findAll({
    where: {
      profileId: profile.id
    }
  });

  if (subscribes.length) {
    for (const subscribe of subscribes) {
      const message = `${escapers.MarkdownV2(subscribe.deviceId)}`;
      await ctx.replyWithMarkdownV2(
        message,
        Markup.inlineKeyboard([
          Markup.button.callback("Unsubscribe", `unsubscribe-${subscribe.id}`)
        ])
      );
    }
  } else {
    await ctx.reply(`You have no tracked devices`);
  }
});

export { devicesScene };

export function devices() {
  // bot.command("devices", async (ctx) => {
  //   ctx.scene.enter("devices");
  // });
  bot.action(/^unsubscribe-(\d+)$/, async (ctx) => {
    await ctx.answerCbQuery();
    const id = ctx.match[1];
    const subscribe = await findSubscribe(id);
    if (subscribe) {
      await removeSubscribe(ctx.from.id.toString(), subscribe.deviceId);
      await ctx.deleteMessage();
      await ctx.reply(
        `You have unfollowed the device \n# ${subscribe.deviceId}`
      );
    } else {
      await ctx.reply(`Device not found`);
    }
  });
}
