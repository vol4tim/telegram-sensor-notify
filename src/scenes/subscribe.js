import { Markup, Scenes } from "telegraf";
import { addSubscribe } from "../models/subscribe";

const subscribeWizard = new Scenes.WizardScene(
  "subscribe",
  async (ctx) => {
    await ctx.reply(
      "Enter device ID",
      Markup.inlineKeyboard([Markup.button.callback("Cancel", "cancel")])
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (!ctx.message || !ctx.message.text) {
      await ctx.reply(
        "Error. Id incorrect",
        Markup.inlineKeyboard([Markup.button.callback("Cancel", "cancel")])
      );
      return;
    }

    await addSubscribe(ctx.from.id.toString(), ctx.message.text);

    await ctx.reply(
      `You have subscribed to the device \n# ${ctx.message.text}`
    );

    await ctx.scene.leave();
  }
);

subscribeWizard.action("cancel", async (ctx) => {
  return await ctx.scene.leave();
});

export { subscribeWizard };
