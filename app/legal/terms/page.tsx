export const metadata = { title: "Terms of Service · BHAF MarketBridge" };

export default function TermsPage() {
  return (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-700">Legal</p>
      <h1 className="font-serif text-3xl text-forest-900 md:text-4xl">Terms of Service</h1>
      <p className="text-xs text-charcoal-500">Effective from {new Date().getFullYear()}</p>

      <h2>1. Who we are</h2>
      <p>
        BHAF MarketBridge ("MarketBridge", "we", "us") is operated by BHAF Circular Academy &amp; Consulting Firm
        ("BHAF"). MarketBridge is the marketplace and impact infrastructure platform connecting African women-led
        businesses with funders, corporate partners and global market access.
      </p>

      <h2>2. Account eligibility</h2>
      <p>
        You must be at least 18 years old and capable of forming a binding contract. Business accounts must be
        created on behalf of an entity that is lawfully operating and that has authorised you to act on its behalf.
      </p>

      <h2>3. How we verify</h2>
      <p>
        Profiles, artefacts and listings are subject to BHAF verification. We may request documents such as business
        registration, tax certificates, director KYC and ESG evidence. We may use third-party screening providers
        for sanctions, PEP and identity checks. Verified status can be revoked if information is found to be
        inaccurate, misleading or out of date.
      </p>

      <h2>4. Acceptable use</h2>
      <p>You agree not to use MarketBridge to:</p>
      <ul>
        <li>Upload false, misleading, fraudulent or infringing content</li>
        <li>Misrepresent your identity or business</li>
        <li>Solicit users outside MarketBridge for fees that should be transacted on-platform</li>
        <li>Scrape or harvest data without express written permission</li>
        <li>Circumvent BHAF verification, audit logging or moderation</li>
      </ul>

      <h2>5. Fees</h2>
      <p>
        Entrepreneur accounts are free during the launch period. Corporate and funder tiers may have subscription
        or transaction fees. Where fees apply, they are disclosed before you commit.
      </p>

      <h2>6. Intellectual property</h2>
      <p>
        You retain ownership of content you upload. You grant MarketBridge a non-exclusive licence to host, display
        and share your content within the platform to the extent necessary to provide the service. BHAF logos,
        copy, designs and software belong to BHAF.
      </p>

      <h2>7. Liability</h2>
      <p>
        MarketBridge is provided "as is". To the maximum extent permitted by law, BHAF is not liable for indirect,
        incidental or consequential losses arising from your use of the platform or from transactions concluded
        between platform participants.
      </p>

      <h2>8. Termination</h2>
      <p>
        You can delete your account at any time from <a href="/settings">Settings</a>. We may suspend or terminate
        accounts that breach these Terms, applicable law, or BHAF policies.
      </p>

      <h2>9. Governing law</h2>
      <p>These Terms are governed by the laws of the Federal Republic of Nigeria, without regard to conflict of laws principles.</p>

      <h2>10. Contact</h2>
      <p>
        Questions about these Terms: <a href="mailto:legal@bhaf.example">legal@bhaf.example</a>.
      </p>

      <hr />
      <p className="text-xs text-charcoal-500">
        These Terms are a working draft for the MarketBridge MVP. BHAF will replace this version with a final draft
        prepared by counsel before public launch.
      </p>
    </>
  );
}
