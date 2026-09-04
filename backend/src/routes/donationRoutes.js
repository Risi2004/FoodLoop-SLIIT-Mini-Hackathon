const router = require('express').Router();
const auth = require('../middleware/auth');
const { verifyDonor, verifyReceiver } = require('../middleware/roleCheck');
const {
  createDonation,
  getActiveDonations,
  claimDonation,
  getDonorDonations,
  updateDonation,
  deleteDonation
} = require('../controllers/donationController');

// ----- Donor routes -----
router.post('/', auth, verifyDonor, createDonation);
router.get('/mine', auth, verifyDonor, getDonorDonations);
router.put('/:id', auth, verifyDonor, updateDonation);
router.delete('/:id', auth, verifyDonor, deleteDonation);

// ----- Receiver routes -----
router.get('/', auth, verifyReceiver, getActiveDonations);
router.put('/:id/claim', auth, verifyReceiver, claimDonation);

module.exports = router;