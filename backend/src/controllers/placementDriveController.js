import PlacementDrive from '../models/PlacementDrive.js';

export const createPlacementDrive = async (req, res) => {
  try {
    const driveData = req.body;

    const drive = new PlacementDrive(driveData);
    await drive.save();

    res.status(201).json({ message: 'Placement drive created', drive });
  } catch (error) {
    res.status(500).json({ message: 'Error creating placement drive', error: error.message });
  }
};

export const getAllPlacementDrives = async (req, res) => {
  try {
    const drives = await PlacementDrive.find()
      .sort({ driveDate: -1 });

    res.json(drives);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching placement drives', error: error.message });
  }
};

export const getPlacementDriveById = async (req, res) => {
  try {
    const { driveId } = req.params;
    const drive = await PlacementDrive.findById(driveId);

    if (!drive) {
      return res.status(404).json({ message: 'Placement drive not found' });
    }

    res.json(drive);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching placement drive', error: error.message });
  }
};

export const updatePlacementDrive = async (req, res) => {
  try {
    const { driveId } = req.params;
    const updateData = req.body;

    const drive = await PlacementDrive.findByIdAndUpdate(driveId, updateData, { new: true });

    if (!drive) {
      return res.status(404).json({ message: 'Placement drive not found' });
    }

    res.json({ message: 'Placement drive updated', drive });
  } catch (error) {
    res.status(500).json({ message: 'Error updating placement drive', error: error.message });
  }
};

export const deletePlacementDrive = async (req, res) => {
  try {
    const { driveId } = req.params;

    await PlacementDrive.findByIdAndDelete(driveId);
    res.json({ message: 'Placement drive deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting placement drive', error: error.message });
  }
};

export const getUpcomingDrives = async (req, res) => {
  try {
    const drives = await PlacementDrive.find({
      status: 'upcoming',
      driveDate: { $gte: new Date() },
    })
      .sort({ driveDate: 1 });

    res.json(drives);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming drives', error: error.message });
  }
};

export const getDrivesByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const drives = await PlacementDrive.find({ companyId })
      .sort({ driveDate: -1 });

    res.json(drives);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching drives by company', error: error.message });
  }
};


