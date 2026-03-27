const Group = require("../models/Group");
const User = require("../models/User");

// CREATE GROUP
exports.createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;

    if (!name) {
      return res.status(400).json({ msg: "Group name required" });
    }

    let memberIds = [];

    //  emails → userIds
    if (members && members.length > 0) {
      const users = await User.find({
        email: { $in: members },
      });

      memberIds = users.map((u) => u._id);
    }

    //  add creator + remove duplicates
    const allMembers = [...new Set([...memberIds, req.user.id])];

    const group = await Group.create({
      name,
      createdBy: req.user.id,
      members: allMembers,
    });

    res.json(group);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};
//  GET MY GROUP (MISSING FUNCTION )
exports.getMyGroup = async (req, res) => {
  try {
    const group = await Group.findOne({
      members: req.user.id,
    }).populate("members");

    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching group" });
  }
};