const router = require('express').Router();
const auth = require('../middleware/auth');
const { verifyDonor, verifyReceiver } = require('../middleware/roleCheck');
const {
  createDonation,
  getActiveDonations,
  claimDonation,
  getDonorDonations   // <-- new function
} = require('../controllers/donationController');

// ----- Routes -----

// Donor: Create a new donation
router.post('/', auth, verifyDonor, createDonation);

// Donor: Get their own donations
router.get('/mine', auth, verifyDonor, getDonorDonations);

// Receiver: Get all active donations
router.get('/', auth, verifyReceiver, getActiveDonations);

// Receiver: Claim a donation (must be after /mine)
router.put('/:id/claim', auth, verifyReceiver, claimDonation);

module.exports = router;