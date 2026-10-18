import fs from 'fs';

const schemaPath = 'prisma/schema.prisma';
let schema = fs.readFileSync(schemaPath, 'utf8');

// Add relation to Grant
schema = schema.replace(
  'progressReports GrantProgressReport[]',
  'progressReports GrantProgressReport[]\n  messages        GrantMessage[]'
);

// Add GrantMessage model
schema += `
model GrantMessage {
  id             String   @id @default(cuid())
  grantId        String
  senderId       String
  receiverId     String
  subject        String
  message        String   @db.Text
  attachmentUrl  String?
  createdAt      DateTime @default(now())

  grant Grant @relation(fields: [grantId], references: [id], onDelete: Cascade)
  sender User @relation("GrantMessageSender", fields: [senderId], references: [id], onDelete: Cascade)
  receiver User @relation("GrantMessageReceiver", fields: [receiverId], references: [id], onDelete: Cascade)

  @@index([grantId])
  @@index([senderId])
  @@index([receiverId])
}
`;

// Add relations to User
schema = schema.replace(
  'grantsFunded                 Grant[]                   @relation("FunderGrants")',
  'grantsFunded                 Grant[]                   @relation("FunderGrants")\n  grantMessagesSent            GrantMessage[]            @relation("GrantMessageSender")\n  grantMessagesReceived        GrantMessage[]            @relation("GrantMessageReceiver")'
);

fs.writeFileSync(schemaPath, schema);
