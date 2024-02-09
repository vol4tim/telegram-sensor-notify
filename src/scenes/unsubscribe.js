import { Markup, Scenes } from "telegraf";
import { removeSubscribe } from "../models/subscribe";

const unsubscribeWizard = new Scenes.WizardScene(
  "unsubscribe",
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

    await removeSubscribe(ctx.from.id.toString(), ctx.message.text);

    await ctx.reply(`You have unfollowed the device \n# ${ctx.message.text}`);

    await ctx.scene.leave();
  }
);

unsubscribeWizard.action("cancel", async (ctx) => {
  return await ctx.scene.leave();
});

export { unsubscribeWizard };
