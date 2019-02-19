/**
 * Update the LOC to show that it has been approved by a given person
 * @param {org.sports.federation.ApproveLicense} approve - the Approve transaction
 * @transaction
 */
async function approveLicense(body) { // eslint-disable-line no-unused-vars
    const factory = getFactory();
    const namespace = 'org.sports.federation';

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
    // update the status of the letter if everyone has approved
    if (app.approval.length === 4) {
        app.status = 'APPROVED';
    }

    // update approval[]
    const assetRegistry = await getAssetRegistry(body.memberAppication.getFullyQualifiedType());
    await assetRegistry.update(app);

    // emit event
    const approveEvent = factory.newEvent(namespace, 'ApproveEvent');
    approveEvent.memberAppication = body.memberAppication;
    approveEvent.approvingParty = body.approvingParty;
    emit(approveEvent);
}