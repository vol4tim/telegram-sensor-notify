import db from "./db";
import Profile from "./profile";

const Subscribe = db.sequelize.define("subscribe", {
  profileId: {
    type: db.Sequelize.INTEGER
  },
  deviceId: {
    type: db.Sequelize.STRING
  }
});

export async function addSubscribe(userId, id) {
  const profile = await Profile.findOne({ where: { userId: userId } });
  const subscribe = await Subscribe.create({
    profileId: profile.id,
    deviceId: id
  });
  return subscribe.id;
}
export async function removeSubscribe(userId, id) {
  const profile = await Profile.findOne({ where: { userId: userId } });
  await Subscribe.destroy({
    where: {
      profileId: profile.id,
      deviceId: id
    }
  });
}
export async function findSubscribe(id) {
  return await Subscribe.findOne({ where: { id: id } });
}

export default Subscribe;
