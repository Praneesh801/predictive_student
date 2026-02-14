import Skills from '../models/Skills.js';

export const createOrUpdateSkills = async (req, res) => {
  try {
    const { studentId } = req.params;
    const skillData = req.body;

    let skills = await Skills.findOne({ studentId });

    if (skills) {
      skills = Object.assign(skills, skillData);
      skills.updatedAt = new Date();
      await skills.save();
    } else {
      skills = new Skills({ studentId, ...skillData });
      await skills.save();
    }

    res.status(200).json({ message: 'Skills updated', skills });
  } catch (error) {
    res.status(500).json({ message: 'Error updating skills', error: error.message });
  }
};

export const getSkillsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const skills = await Skills.findOne({ studentId }).populate('studentId');

    if (!skills) {
      return res.status(404).json({ message: 'Skills not found' });
    }

    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skills', error: error.message });
  }
};

export const deleteSkills = async (req, res) => {
  try {
    const { studentId } = req.params;
    await Skills.deleteOne({ studentId });

    res.json({ message: 'Skills deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting skills', error: error.message });
  }
};
