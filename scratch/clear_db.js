const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log("Clearing database...");

  // Arrays of models ordered from child to parent to avoid foreign key violations
  await prisma.grantProgressReport.deleteMany({});
  await prisma.beneficiary.deleteMany({});
  await prisma.financialMetric.deleteMany({});
  await prisma.grant.deleteMany({});
  
  await prisma.message.deleteMany({});
  await prisma.conversationParticipant.deleteMany({});
  await prisma.conversation.deleteMany({});
  
  await prisma.shortlistEntry.deleteMany({});
  await prisma.shortlist.deleteMany({});
  await prisma.pipelineEntry.deleteMany({});
  
  await prisma.rfpResponse.deleteMany({});
  await prisma.rfp.deleteMany({});
  
  await prisma.application.deleteMany({});
  await prisma.opportunity.deleteMany({});
  
  await prisma.dataRoomAccess.deleteMany({});
  await prisma.dataRoom.deleteMany({});
  
  await prisma.artefactReview.deleteMany({});
  await prisma.artefactCheck.deleteMany({});
  await prisma.artefact.deleteMany({});
  
  await prisma.certification.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.listing.deleteMany({});
  
  await prisma.cohortMembership.deleteMany({});
  await prisma.cohort.deleteMany({});
  
  await prisma.invoice.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.subscriptionPlan.deleteMany({});
  
  await prisma.enquiry.deleteMany({});
  await prisma.consultingRequest.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.auditEntry.deleteMany({});
  
  await prisma.entrepreneurProfile.deleteMany({});
  await prisma.funderProfile.deleteMany({});
  await prisma.corporateProfile.deleteMany({});
  
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.verificationToken.deleteMany({});

  const result = await prisma.user.deleteMany({
    where: {
      email: {
        not: 'fullstack@ambidexters.com'
      }
    }
  });

  console.log(`Deleted ${result.count} other users.`);
  console.log("Database cleared successfully, preserved super admin.");
}

clearDatabase()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
