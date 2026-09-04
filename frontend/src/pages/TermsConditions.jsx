import './TermsConditions.css'

export default function TermsConditions() {
  return (
    <div className="terms-conditions">
      <div className="page">
        <section className="page-stub terms-conditions__card">
          <h1>Terms & Conditions</h1>
          <p className="terms-conditions__updated">Last updated: September 4, 2026</p>

          <div className="terms-conditions__body">
            <p>
              By accessing or using FoodLoop, you agree to these Terms & Conditions. If
              you do not agree, please do not use the platform.
            </p>

            <h2>Platform purpose</h2>
            <p>
              FoodLoop helps donors list surplus food, receivers claim available
              surplus, and drivers support redistribution. FoodLoop is a coordination
              tool and does not itself prepare, store, or sell food.
            </p>

            <h2>Accounts & eligibility</h2>
            <p>
              You are responsible for providing accurate registration details, keeping
              login credentials secure, and ensuring your organization is authorized to
              donate or receive surplus food under applicable local rules.
            </p>

            <h2>Food safety responsibilities</h2>
            <p>
              Donors must only list food that is safe, correctly described, and within
              suitable handling windows. Receivers and drivers must handle claimed
              items responsibly. FoodLoop does not guarantee the condition of any
              donated item.
            </p>

            <h2>Acceptable use</h2>
            <p>
              You agree not to misuse the platform, post misleading listings, harass
              other users, attempt unauthorized access, or use FoodLoop for unlawful
              purposes.
            </p>

            <h2>Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, FoodLoop and its contributors are
              not liable for indirect or consequential damages arising from use of the
              service, including issues related to food quality, delayed pickups, or
              third-party conduct.
            </p>

            <h2>Changes</h2>
            <p>
              We may update these terms from time to time. Continued use of FoodLoop
              after changes become effective constitutes acceptance of the revised
              terms.
            </p>

            <h2>Contact</h2>
            <p>
              For questions about these terms, email{' '}
              <a href="mailto:foodloop@gmail.com">foodloop@gmail.com</a>.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
