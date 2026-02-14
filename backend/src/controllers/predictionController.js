import Prediction from '../models/Prediction.js';
import { calculatePlacementProbability, getEligibilityBand } from '../utils/helpers.js';

export const createPrediction = async (req, res) => {
  try {
    const { studentId } = req.params;
    const predictionData = req.body;

    const prediction = new Prediction({
      studentId,
      ...predictionData,
      predictionDate: new Date(),
    });

    await prediction.save();
    res.status(201).json({ message: 'Prediction created', prediction });
  } catch (error) {
    res.status(500).json({ message: 'Error creating prediction', error: error.message });
  }
};

export const getPredictionsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const predictions = await Prediction.find({ studentId })
      .populate('studentId')
      .sort({ predictionDate: -1 });

    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching predictions', error: error.message });
  }
};

export const getLatestPrediction = async (req, res) => {
  try {
    const { studentId } = req.params;
    const prediction = await Prediction.findOne({ studentId })
      .populate('studentId')
      .sort({ predictionDate: -1 });

    if (!prediction) {
      return res.status(404).json({ message: 'No prediction found' });
    }

    res.json(prediction);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prediction', error: error.message });
  }
};

export const updatePrediction = async (req, res) => {
  try {
    const { predictionId } = req.params;
    const updateData = req.body;

    const prediction = await Prediction.findByIdAndUpdate(predictionId, updateData, { new: true });

    if (!prediction) {
      return res.status(404).json({ message: 'Prediction not found' });
    }

    res.json({ message: 'Prediction updated', prediction });
  } catch (error) {
    res.status(500).json({ message: 'Error updating prediction', error: error.message });
  }
};

export const deletePrediction = async (req, res) => {
  try {
    const { predictionId } = req.params;

    await Prediction.findByIdAndDelete(predictionId);
    res.json({ message: 'Prediction deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting prediction', error: error.message });
  }
};
