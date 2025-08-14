// controllers/profileController.js (Backend)
const User = require('../models/User');
const FarmerProfile = require('../models/FarmerProfile'); // Assuming you have this model

// @desc    Get farmer profile
// @route   GET /api/farmers/profile/:id
// @access  Private
const getFarmerProfile = async (req, res) => {
  try {
    const farmerId = req.params.id;

    // Get farmer basic info
    const farmer = await User.findById(farmerId).select('-password');
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    // Get farmer profile data
    let profile = await FarmerProfile.findOne({ farmer: farmerId });

    if (!profile) {
      // Create default profile if doesn't exist
      profile = await FarmerProfile.create({
        farmer: farmerId,
        farmName: farmer.name,
        description: '',
        establishedYear: '',
        farmingPractices: [],
        businessHours: {
          monday: { open: '08:00', close: '18:00' },
          tuesday: { open: '08:00', close: '18:00' },
          wednesday: { open: '08:00', close: '18:00' },
          thursday: { open: '08:00', close: '18:00' },
          friday: { open: '08:00', close: '18:00' },
          saturday: { open: '08:00', close: '16:00' },
          sunday: { open: '', close: '' },
        },
        deliveryRadius: '',
        minOrderValue: '',
        paymentMethods: [],
      });
    }

    res.json({
      farmer,
      profile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update farmer profile
// @route   PUT /api/farmers/profile/:id
// @access  Private
const updateFarmerProfile = async (req, res) => {
  try {
    const farmerId = req.params.id;
    const profileData = req.body;

    // Check if user is authorized to update this profile
    if (req.user._id.toString() !== farmerId) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }

    // Update user basic info if provided
    const userUpdateData = {};
    if (profileData.phone) userUpdateData.phone = profileData.phone;
    if (profileData.email) userUpdateData.email = profileData.email;

    if (Object.keys(userUpdateData).length > 0) {
      await User.findByIdAndUpdate(farmerId, userUpdateData);
    }

    // Update or create farmer profile
    const profileUpdateData = {
      farmName: profileData.farmName,
      description: profileData.description,
      establishedYear: profileData.establishedYear,
      farmingPractices: profileData.farmingPractices || [],
      businessHours: profileData.businessHours,
      deliveryRadius: profileData.deliveryRadius,
      minOrderValue: profileData.minOrderValue,
      paymentMethods: profileData.paymentMethods || [],
    };

    let profile = await FarmerProfile.findOneAndUpdate(
      { farmer: farmerId },
      profileUpdateData,
      { new: true, upsert: true }
    );

    // Get updated farmer data
    const farmer = await User.findById(farmerId).select('-password');

    res.json({
      message: 'Profile updated successfully',
      farmer,
      profile,
    });
  } catch (error) {
    console.error(error);

    // Handle duplicate email error
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getFarmerProfile,
  updateFarmerProfile,
};
