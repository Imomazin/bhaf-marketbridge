export const metadata = { title: "Privacy Policy · BHAF MarketBridge" };

export default function PrivacyPage() {
  return (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Legal</p>
      <h1 className="font-serif text-3xl text-forest-900 md:text-4xl">Privacy Policy</h1>
      <p className="text-xs text-charcoal-500">Effective from {new Date().getFullYear()}</p>

      <h2>1. What this notice covers</h2>
      <p>
        This Privacy Policy explains how BHAF Circular Academy &amp; Consulting Firm ("BHAF") collects, uses and
        protects personal data when you use BHAF MarketBridge. It is written to comply with the GDPR, the Nigeria
        Data Protection Act (NDPA) 2023, the Kenya Data Protection Act 2019 and South Africa's POPIA.
      </p>

      <h2>2. Data we collect</h2>
      <ul>
        <li><strong>Account data</strong>: name, email, role, password hash, locale.</li>
        <li><strong>Profile data</strong>: business details, products, certifications, ESG activity.</li>
        <li><strong>Artefacts</strong>: documents you upload for verification.</li>
        <li><strong>Usage data</strong>: pages viewed, actions taken, audit-trail entries.</li>
        <li><strong>Technical data</strong>: IP address, browser, device, region.</li>
      </ul>

      <h2>3. How we use it</h2>
      <ul>
        <li>To operate the platform and verify accounts and artefacts</li>
        <li>To route enquiries between entrepreneurs, funders and corporate partners</li>
        <li>To produce aggregate impact reporting (using anonymised data)</li>
        <li>To prevent fraud, abuse and platform misuse</li>
        <li>To comply with legal obligations</li>
      </ul>

      <h2>4. Lawful bases</h2>
      <p>
        We process personal data on the bases of: <em>contract</em> (to provide the service you signed up for),
        <em> legitimate interests</em> (operating the platform, security and audit), <em>consent</em> (where required,
        e.g. marketing emails) and <em>legal obligation</em> (compliance with regulators).
      </p>

      <h2>5. Sharing</h2>
      <p>We share personal data only:</p>
      <ul>
        <li>With your verified profile information to other platform users when you publish a profile or listing</li>
        <li>With service providers (database, email, file storage, AI assistant) bound by data processing agreements</li>
        <li>With BHAF programme partners only with your consent or as part of opportunities you apply to</li>
        <li>When required by law or to protect rights, safety or property</li>
      </ul>

      <h2>6. International transfers</h2>
      <p>
        Personal data may be processed outside your country of residence by our service providers. Where data leaves
        the EEA, the UK, or African jurisdictions with specific data residency requirements, we use Standard
        Contractual Clauses or equivalent safeguards.
      </p>

      <h2>7. Retention</h2>
      <p>
        Account data is retained until you delete your account, after which it is soft-deleted for 30 days and then
        hard-deleted (except where law requires longer retention, e.g. financial records).
      </p>

      <h2>8. Your rights</h2>
      <p>You can, at any time from <a href="/settings">Settings</a>:</p>
      <ul>
        <li><strong>Access</strong> your data (download a JSON export)</li>
        <li><strong>Rectify</strong> profile information</li>
        <li><strong>Delete</strong> your account</li>
        <li><strong>Restrict</strong> processing by suspending your account</li>
        <li><strong>Object</strong> to processing where legitimate interest is the lawful basis</li>
        <li><strong>Withdraw consent</strong> to marketing communications</li>
      </ul>

      <h2>9. Security</h2>
      <p>
        We store passwords hashed with bcrypt, log all sensitive actions in a tamper-evident audit chain, encrypt
        data in transit, and apply ISO 27001-aligned controls to our operating environment.
      </p>

      <h2>10. Contact</h2>
      <p>
        Data Protection Officer: <a href="mailto:dpo@bhaf.example">dpo@bhaf.example</a>.
      </p>

      <hr />
      <p className="text-xs text-charcoal-500">
        This Privacy Notice is a working draft for the MarketBridge MVP. BHAF will replace this version with a
        final draft prepared by counsel before public launch.
      </p>
    </>
  );
}
