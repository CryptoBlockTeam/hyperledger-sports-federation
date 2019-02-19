/**
 * Initiate Network
 * @param {org.sports.participant.Genesis} body - Origins...
 * @transaction
 */
async function genesis(body) {
    const factory = getFactory();
    const currentParticipant = getCurrentParticipant(); console.log(currentParticipant);

    // Restrict transaction to NetworkAdmin only
    if (currentParticipant.getFullyQualifiedType() !== 'org.hyperledger.composer.system.NetworkAdmin') {
        throw new Error('You cannot create a Genesis transaction unless you are Moses of Egypt');
    }

    const NS = 'org.sports.participant';

    // Create a club with the given name
    const clubRegistry = await getParticipantRegistry(NS+'.SportsClub');
    let club = factory.newResource(NS, 'SportsClub', body.clubName);
    club.name = body.clubName;
    await clubRegistry.add(club);

    // Create an OrganizationMember participant    
    const memberRegistry = await getParticipantRegistry(NS + '.OrgaizationMember');
    let OrgMember = factory.newResource(NS, 'OrgaizationMember', 'moses');
    
    let adminName = currentParticipant.getIdentifier().charAt(0).toUpperCase() + currentParticipant.getIdentifier().slice(1);
    OrgMember.personID = 'moses';//adminName + '4' + club.name;
    OrgMember.firstName = body.memberFirstName;
    OrgMember.lastName = body.memberLastName;
    OrgMember.club = factory.newRelationship(NS, 'SportsClub', body.clubName);
    OrgMember.position = 'ADMINISTRATOR';
    OrgMember.level = 'AMATEUR';
    await memberRegistry.add(OrgMember);
    
    // Create SportsGuest participant
    // const guestRegistry = await getParticipantRegistry(NS + '.SportsGuest');
    // let guest = factory.newResource(NS, 'SportsGuest', 'guest');
    // guest.level = 'ROOKIE';
    // await guestRegistry.add(guest);

    // CREATE GUEST IDENTITY via Middleware call
    // ...

    // Emit an event
    const event = getFactory().newEvent('org.sports.participant', 'GenesisEvent');
    event.clubName = body.clubName;
    event.memberFirstName = body.memberFirstName;
    event.memberLastName = body.memberLastName
    emit(event);
}

/**
 * Expand Network: Authorize guest
 * @param {org.sports.club.GuestAssessment} body - The ass
 * @transaction
 */
async function guestAssessment(body) {
    const factory = getFactory();
    let currentParticipant = getCurrentParticipant(); console.log(currentParticipant);
    let currentIdentity = getCurrentIdentity();  console.log(currentIdentity);

    // TODO...
}

/**
 * Expand Network: Authorize participant
 * @param {org.sports.club.InitialMembershipApplication} stoneblock - The Genesis transaction of the chain
 * @transaction
 */
async function initialMembershipApplication(letter) {

}




/**
 * Update the application to show that it has been approved by a given person
 * @param {org.sports.club.ApproveMembership} approve - the Approve transaction
 * @transaction
 */
async function approveMembership(body) { // eslint-disable-line no-unused-vars
    const factory = getFactory();
    const namespace = 'org.sports.club';

    let app = body.memberAppication;

    if (app.status === 'CLOSED' || app.status === 'REJECTED') {
        throw new Error ('This membership application has already been closed');
    } else if (app.approval.length === 4) {
        throw new Error ('All four parties have already approved this membership application');
    } else if (app.approval.includes(body.approvingParty)) {
        throw new Error ('This person has already approved this membership application');
    } else if (body.approvingParty.getType() === 'OrgaizationMember') {
        app.approval.forEach((approvingParty) => {
            let clubApproved = false;
            try {
                clubApproved = approvingParty.getType() === 'OrgaizationMember' && approvingParty.club.getIdentifier() === body.approvingParty.club.getIdentifier();
            } catch (err) {
                // ignore error as they don't have rights to access that participant
            }
            if (clubApproved) {
                throw new Error('Your club has already approved of this request');
            }
        });
    }

    app.approval.push(factory.newRelationship(namespace, body.approvingParty.getType(), body.approvingParty.getIdentifier()));
    // update the status of the application if everyone has approved
    if (app.approval.length === 4) {
        app.status = 'APPROVED';
    }

    // update approval[]
    const assetRegistry = await getAssetRegistry(body.memberAppication.getFullyQualifiedType());
    await assetRegistry.update(app);

    // emit event
    const approveEvent = factory.newEvent(namespace, 'ApproveMembershipEvent');
    approveEvent.memberAppication = body.memberAppication;
    approveEvent.approvingParty = body.approvingParty;
    emit(approveEvent);
}

/**
 * Reject the application
 * @param {org.sports.club.RejectMembership} reject - the Reject transaction
 * @transaction
 */
async function rejectMembership(body) { // eslint-disable-line no-unused-vars
    const factory = getFactory();
    const namespace = 'org.sports.club';

    let app = body.memberAppication;

    if (app.status === 'CLOSED' || ж.status === 'REJECTED') {
        throw new Error('This membership application has already been closed');
    } else if (app.status === 'APPROVED') {
        throw new Error('This membership application has already been approved');
    } else {
        app.status = 'REJECTED';
        app.closeReason = body.closeReason;

        // update the status of the memberAppication
        const assetRegistry = await getAssetRegistry(app.getFullyQualifiedType());
        await assetRegistry.update(app);

        // emit event
        const rejectEvent = factory.newEvent(namespace, 'RejectEvent');
        rejectEvent.memberAppication = body.memberAppication;
        rejectEvent.closeReason = body.closeReason;
        emit(rejectEvent);
    }
}
