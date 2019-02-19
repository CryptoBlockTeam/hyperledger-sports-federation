# Hyperledger Fabric - Real Life Case Study

The main purpose of this article is to demonstrate a business model solution of a realistic type of an example problem – A sports federation. Consider the following structure:

![Example Sports Federation Interaction Model](../mindmaps/Sports-Federation-0.9-wm.png)

### 1. **Description of the Business Problem**: 

A simple hierarchy of autonomous sports clubs needs to operate by pre-defined rules, permissions and in accordance to one another to form a consortium, called Federation. 
As single administrative role representatives on a club level could come to an abuse of power, unattended growth of the consortium can lead to overpowering group decisions, 
even beyond the reach of the internal statutes.

### 2. **Blockchain MVP Use-Case Description**: 

Participants on a personal level (athletes) can only perform a specific set of operations regarding their sports Club, in the form of transactions. 
The club itself is also a participant in the Federation network. 
Only administrative personel out of the same club can use the club's identity to perform operations regarding other clubs of the same federation.
Initially, athletes can either (1) create a club or (3) apply to be assigned to not more than one of the existing clubs. 
Club members in a specific administrative role can either (2) associate a guest, (4) Accept or (4) Reject an existing athlete's application to join. 
From within a club members can either (6) apply for a Federation License, (7) request a club transfer, or (8) resign to a *Guest* level.

### 3. **Types of Assets and Description**:

  - `MembershipApplication` is an asset, once created is deemed payable by its `ApplicationStatus` 
  - `TransferApplication` is an asset, once created is deemed payable by its `ApplicationStatus` 
  - `LicenseApplication` is an asset, once created is deemed payable by its `ApplicationStatus` 

### 4. **List of Participants / Roles**

  - `SportsGuest` is a single common identity that outsiders can use to access the private network
  - `SportsPlayer` is the regular identity for most participants use to connect 
  - `OrgaizationMember` is a club's administrative identity that is used to manage participants up to this level
  - `SportsClub` is the club's identity role that is only used on behalf of the BN
  - `SportsFederation` is the federation's identity role that is only used on behalf of the BN


### 5. **Description of Transactions**

  - `Genesis` is the only transaction that a `SportsGuest` can initiate and is responsible for creating a `SportsClub` participant and an `OrgaizationMember` identity;
    This transaction can only be executed once by the particular `SportsGuest` identity

  - `GuestAssessment` associates the `SportsGuest` identity with a specific, unique (**passport**) account, intended to act as a sort of an *invitation* for unknown clients to become authorized with the chain;

  - `InitialMembershipApplication` creates `MembershipApplication` asset pending approval & payment, and a new `SportsPlayer` participant and associates a **passport** account (the last one  associated with the `SportsGuest` identity) to the corresponding identity card for that participant;

  - `ApproveMembership` & `RejectMembership`  change the `status` of a `MembershipApplication` depending on the **payment status** of the asset


  - `ApproveLicense` & `RejectLicense` change the `status` of a `LicenseApplication` depending on the **payment status** of the asset

  - `InitialLicenseApplication` creates a `LicenseApplication` asset pending approval & payment, and can only be executed by `SportsPlayer` participants;

  - `TransferApplication` creates a `TransferApplication` asset pending approval & payment, and can only be executed by `SportsPlayer` participants;

  - `ResignApplication` destroys a given `SportsPlayer` identity, giving the associated **Passport** account the ability to associate with the `SportsGuest` identity again


* * * 

> *The idea was originally borrowed from a real-life scenario in the field of Table Soccer.*

