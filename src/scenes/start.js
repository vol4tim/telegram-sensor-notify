import { Markup } from "telegraf";
import bot from "../bot";
import Profile from "../models/profile";

export function start() {
  bot.use(async (ctx, next) => {
    const profile = await Profile.findOne({
      where: { userId: ctx.from.id.toString() }
    });
    if (profile === null) {
      await Profile.create({
        userId: ctx.from.id.toString(),
        username: ctx.from.username,
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name
      });
    }
    await next();
  });

  bot.start(async (ctx) => {
    const profile = await Profile.findOne({
      where: { userId: ctx.from.id.toString() }
    });
    if (profile === null) {
      await Profile.create({
        userId: ctx.from.id.toString(),
        username: ctx.from.username,
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name
      });
    }
    return ctx.reply(
      "Welcome!",
      Markup.inlineKeyboard([Markup.button.callback("Subscribe", `subscribe`)])
    );
  });

  bot.action("subscribe", async (ctx) => {
    await ctx.scene.enter("subscribe");
  });
}
