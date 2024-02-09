import { SQLite } from "@telegraf/session/sqlite";
import { Scenes, session } from "telegraf";
import bot from "./bot";
import { PATH_SESSION_DB } from "./config";
import db from "./models/db";
import { devices, devicesScene } from "./scenes/devices";
import { start } from "./scenes/start";
import { subscribeWizard } from "./scenes/subscribe";
import { unsubscribeWizard } from "./scenes/unsubscribe";

const runApp = () => {
  const store = SQLite({
    filename: PATH_SESSION_DB
  });
  bot.use(
    session({
      store
    })
  );

  bot.telegram.setMyCommands([
    {
      command: "subscribe",
      description: "subscribe"
    },
    {
      command: "devices",
      description: "devices"
    }
  ]);

  const stage = new Scenes.Stage([
    subscribeWizard,
    unsubscribeWizard,
    devicesScene
  ]);

  bot.use(stage.middleware());

  start();
  devices();

  bot.command("subscribe", async (ctx) => {
    await ctx.scene.enter("subscribe");
  });
  bot.command("unsubscribe", async (ctx) => {
    await ctx.scene.enter("unsubscribe");
  });
  bot.command("devices", async (ctx) => {
    await ctx.scene.enter("devices");
  });

  bot.launch();
};

db.sequelize.sync().then(() => {
  runApp();
});
