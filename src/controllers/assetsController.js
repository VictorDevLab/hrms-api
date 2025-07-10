const AssetsModel = require('../models/Asset')

const getAllAssets = async (req, res) => {
    try {
        const assets = await AssetsModel.find().lean()
        if (!assets || !assets.length) {
            return res.status(404).json({message:"No assets Found"})
        }
        res.status(200).json(assets);
    } catch(error) {
        console.error('Error fetching assets:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const createAsset = async (req, res) => {
    const { assetName, assetType, assignedTo, status, description, assetCode } = req.body;
    console.log("req body", req.body)

    if (!assetName || !assetType) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newAsset = new AssetsModel({
            assetName,
            assetType,
            assetCode,
            assignedTo,
            status,
            description
        });
        newAsset.assetCode = `ASSET-${Date.now()}`; 

        await newAsset.save();
        res.status(201).json(newAsset);
    } catch (error) {
        console.error('Error creating asset:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getAssetById = async (req, res) => {
    const assetId = req.params.id;
    try {
        const asset = await AssetsModel.findById(assetId).lean();
        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }
        res.status(200).json(asset);
    } catch(error) {
        console.error('Error fetching asset:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const updateAsset = async (req, res) => {
    const assetId = req.params.id;
    const { assetName, assetType, assignedTo, status, description } = req.body;
    if (!assetName || !assetType) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const updatedAsset = await AssetsModel.findByIdAndUpdate(
            assetId,
            { assetName, assetType, assignedTo, status, description },
            { new: true }
        ).lean();

        if (!updatedAsset) {
            return res.status(404).json({ message: 'Asset not found' });
        }
        res.status(200).json(updatedAsset);
    } catch(error) {
        console.error('Error updating asset:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getAllAssets,
    createAsset,
    getAssetById,
    updateAsset

}