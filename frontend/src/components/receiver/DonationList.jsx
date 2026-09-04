import React, { useState, useEffect } from 'react';
import { getActiveDonations, claimDonation } from '../../api/donationApi';
import ClaimModal from './ClaimModal';

const DonationList = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState(null); // { id, max, name }

  const fetchDonations = async () => {
    try {
      const res = await getActiveDonations();
      setDonations(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleClaim = async (donationId, quantity) => {
    try {
      const res = await claimDonation(donationId, quantity);
      // Update local state with new remaining quantity
      setDonations(prev =>
        prev.map(d =>
          d._id === donationId
            ? { ...d, remainingQuantity: res.data.donation.remainingQuantity }
            : d
        )
      );
      setSelectedDonation(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Claim failed');
    }
  };

  if (loading) return <p>Loading donations...</p>;

  return (
    <div>
      <h2>Available Donations</h2>
      {donations.length === 0 ? (
        <p>No active donations at the moment.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {donations.map((d) => (
            <div key={d._id} style={{ border: '1px solid #ddd', padding: '1rem', width: '250px' }}>
              <h3>{d.foodName}</h3>
              <p><strong>From:</strong> {d.donorId?.businessName || 'Unknown'}</p>
              <p><strong>Remaining:</strong> {d.remainingQuantity} {d.unit}</p>
              <p><strong>Expires:</strong> {d.expiryDate ? new Date(d.expiryDate).toLocaleDateString() : 'N/A'}</p>
              <button
                onClick={() =>
                  setSelectedDonation({
                    id: d._id,
                    max: d.remainingQuantity,
                    name: d.foodName
                  })
                }
                disabled={d.remainingQuantity === 0}
              >
                Claim
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedDonation && (
        <ClaimModal
          donation={selectedDonation}
          onConfirm={handleClaim}
          onCancel={() => setSelectedDonation(null)}
        />
      )}
    </div>
  );
};

export default DonationList;