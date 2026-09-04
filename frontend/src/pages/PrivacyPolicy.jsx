import './PrivacyPolicy.css'

export default function PrivacyPolicy() {
  return (
    <div className="privacy-policy">
      <div className="page">
        <section className="page-stub privacy-policy__card">
          <h1>Privacy Policy</h1>
          <p className="privacy-policy__updated">Last updated: September 4, 2026</p>

          <div className="privacy-policy__body">
            <p>
              FoodLoop (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the FoodLoop platform to
              connect surplus food donors, receivers, and volunteer drivers. This Privacy
              Policy explains how we collect, use, and protect personal information when
              you use our website and related services.
            </p>

            <h2>Information we collect</h2>
            <p>
              We may collect account details such as name, email address, phone number,
              organization information, pickup or delivery addresses, donation content,
              claim history, and usage data needed to operate matching and logistics
              features.
            </p>

            <h2>How we use information</h2>
            <p>
              We use personal information to create and manage accounts, facilitate
              donations and claims, coordinate pickups and deliveries, communicate
              service updates, improve platform safety, and comply with legal
              obligations.
            </p>

            <h2>Sharing</h2>
            <p>
              We share information only as needed to complete a donation loop — for
              example, sharing relevant pickup details with an assigned driver or
              verified receiver. We do not sell personal information.
            </p>

            <h2>Data retention & security</h2>
            <p>
              We retain information for as long as your account remains active or as
              required for operational, legal, or safety purposes. We apply reasonable
              administrative and technical safeguards, though no method of transmission
              over the internet is fully secure.
            </p>

            <h2>Your choices</h2>
            <p>
              You may request access, correction, or deletion of account information by
              contacting us. Some records related to completed donations may be retained
              where needed for transparency, audit, or legal reasons.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about this policy can be sent to{' '}
              <a href="mailto:foodloop@gmail.com">foodloop@gmail.com</a>.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
