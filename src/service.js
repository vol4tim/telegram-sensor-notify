import { cron } from "./cron";
import db from "./models/db";

(async function () {
  await db.sequelize.sync();
  await cron();
  process.exit(0);
})();
