# Information Security Policy
**Money Ball — Personal Finance Application**
**Owner:** Ben Gillen, Founder & Developer
**Contact:** gillen.ben3@gmail.com
**Effective Date:** April 16, 2026
**Review Cycle:** Annually or upon significant change

---

## 1. Purpose and Scope

This Information Security Policy establishes the security practices and controls for Money Ball, a mobile personal finance application. It applies to all systems, data, and processes involved in the development, operation, and maintenance of the Money Ball application and its backend infrastructure.

---

## 2. Governance and Accountability

Money Ball is currently developed and operated by a single individual:

- **Name:** Ben Gillen
- **Title:** Founder & Developer
- **Email:** gillen.ben3@gmail.com

Ben Gillen is solely responsible for all information security decisions, implementation, monitoring, and incident response. This policy is reviewed at least annually and updated as the organization grows.

---

## 3. Access Control

### 3.1 Role-Based Access Control (RBAC)
Access to production systems, infrastructure, and sensitive data is restricted to authorized personnel only. As a single-developer organization, access is inherently limited to the Founder. No third-party contractors or employees currently have access to production systems.

### 3.2 Principle of Least Privilege
Access is granted only to the systems and data necessary to perform a given function. External services (e.g., Plaid, cloud hosting providers) are granted only the minimum required permissions via scoped API keys.

### 3.3 Multi-Factor Authentication (MFA)
MFA is enforced on all administrator and developer accounts that have access to critical systems, including:
- Cloud hosting provider accounts
- Plaid developer dashboard
- Version control (GitHub)
- Email accounts associated with the application

### 3.4 Credential Management
- API keys and secrets are stored in environment variables, never hardcoded in source code
- Secrets are rotated periodically and immediately upon any suspected compromise
- `.env` files and secrets are excluded from version control via `.gitignore`

---

## 4. Data Classification

| Classification | Description | Examples |
|---|---|---|
| Confidential | Sensitive consumer financial data | Bank account data, transaction history, Plaid tokens |
| Internal | Operational data | App analytics, logs |
| Public | Publicly available | Marketing materials, privacy policy |

---

## 5. Data Encryption

### 5.1 Encryption in Transit
All data transmitted between the Money Ball mobile application and backend servers is encrypted using TLS 1.2 or higher. All API calls to third-party services (including Plaid) are made over HTTPS.

### 5.2 Encryption at Rest
Consumer financial data received from the Plaid API is encrypted at rest using AES-256 encryption provided by the managed database/cloud service in use. Database-level encryption is enabled for all data stores containing consumer financial information.

---

## 6. Third-Party Vendors and Integrations

Third-party services used by Money Ball are evaluated for security practices prior to integration. Current third-party integrations include:

- **Plaid** — bank account linking and transaction data
- **Anthropic (Claude API)** — AI-powered financial advice features
- **Cloud hosting provider** — backend infrastructure

Each vendor relationship is governed by their respective terms of service, data processing agreements, and security standards.

---

## 7. Vulnerability and Patch Management

### 7.1 Dependency Audits
Dependencies are regularly audited using `npm audit` to identify and remediate known vulnerabilities in third-party packages. Critical vulnerabilities are patched promptly upon discovery.

### 7.2 Code Review
All production code changes are reviewed before deployment. As a single-developer organization, this involves manual review and testing against a staging environment prior to production release.

### 7.3 Security Testing
The application is tested for common vulnerabilities (OWASP Top 10) including injection attacks, authentication weaknesses, and insecure data exposure during development and prior to each release.

---

## 8. Incident Response

In the event of a suspected or confirmed security incident:

1. **Contain** — Immediately revoke compromised credentials, disable affected systems if necessary
2. **Assess** — Determine the scope and nature of the incident
3. **Notify** — Notify affected users and relevant parties (including Plaid) within 72 hours of confirmed breach, in compliance with applicable law
4. **Remediate** — Patch the root cause and restore secure operations
5. **Review** — Conduct a post-incident review and update policies as needed

**Security contact for incident reporting:** gillen.ben3@gmail.com

---

## 9. Data Retention and Deletion

Consumer data is retained only as long as necessary to provide the Money Ball service. Upon account deletion, consumer data is purged from production systems within 30 days. Detailed retention practices are described in the Money Ball Privacy Policy.

---

## 10. Physical Security

Development work is performed on password-protected devices with full-disk encryption enabled. Devices are locked when unattended.

---

## 11. Policy Review

This policy is reviewed annually or whenever significant changes occur to the application, infrastructure, or regulatory environment. Updates are documented with a revised effective date.

---

*Last updated: April 16, 2026*
