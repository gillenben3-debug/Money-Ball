# Data Retention and Deletion Policy
**Money Ball — Personal Finance Application**
**Owner:** Ben Gillen, Founder & Developer
**Contact:** gillen.ben3@gmail.com
**Effective Date:** April 16, 2026
**Review Cycle:** Annually or upon significant regulatory change

---

## 1. Purpose

This policy defines how Money Ball collects, retains, and deletes consumer data in compliance with applicable data privacy laws, including the California Consumer Privacy Act (CCPA) and other relevant regulations. It ensures that data is kept no longer than necessary and that consumers can exercise their right to deletion.

---

## 2. Scope

This policy applies to all personal and financial data collected by the Money Ball application, including data received from Plaid (bank account data, transactions, balances) and data provided directly by users (account information, AI Advisor interactions).

---

## 3. Data Retention Schedule

| Data Category | Retention Period | Basis |
|---|---|---|
| User account information (name, email) | Duration of active account + 30 days post-deletion | Service provision |
| Financial account data (Plaid) | Duration of active account + 30 days post-deletion | Service provision |
| Transaction history | Duration of active account + 30 days post-deletion | Service provision |
| AI Advisor conversation history | Duration of active account + 30 days post-deletion | Service provision |
| App usage and analytics data | 12 months rolling | Service improvement |
| Security and access logs | 12 months rolling | Security monitoring |
| Encrypted backups | Up to 90 days after account deletion | Disaster recovery |

---

## 4. Data Deletion Procedures

### 4.1 User-Initiated Deletion
When a user deletes their Money Ball account:
- All personal and financial data is marked for deletion immediately
- Production data is permanently deleted within **30 days**
- Encrypted backup copies are purged within **90 days**
- Plaid access tokens associated with the account are immediately revoked via the Plaid API

### 4.2 Disconnecting a Bank Account
When a user disconnects a linked bank account (without full account deletion):
- The associated Plaid access token is immediately revoked
- Cached transaction and balance data for that account is deleted within 30 days
- Historical data used for in-app analytics is anonymized or deleted

### 4.3 Deletion Requests
Users may submit a data deletion request at any time by contacting:
- **Email:** gillen.ben3@gmail.com

Requests will be acknowledged within 5 business days and fulfilled within 30 days.

---

## 5. Legal Holds and Exceptions

Data may be retained beyond the standard retention periods in the following circumstances:
- Legal obligation (e.g., court order, regulatory requirement)
- Active dispute or litigation
- Fraud investigation

In such cases, only the data relevant to the legal matter will be retained, and it will be deleted as soon as the hold is lifted.

---

## 6. Third-Party Data Processors

Money Ball uses Plaid as a third-party data processor. Plaid maintains its own data retention and deletion practices as described in the [Plaid Privacy Policy](https://plaid.com/legal/#privacy-policy). Upon account deletion, Money Ball revokes all Plaid access tokens, limiting Plaid's ability to access the user's financial data going forward.

---

## 7. Policy Review

This policy is reviewed annually and updated to reflect changes in:
- Applicable data privacy laws and regulations
- Application features or data collection practices
- Third-party processor agreements

---

## 8. Contact

For questions about this policy or to submit a data deletion request:

**Ben Gillen**
Founder, Money Ball
gillen.ben3@gmail.com

---

*Last updated: April 16, 2026*
