import Airtable from "airtable";
import { ASSIGNMENTS_TABLE, BASE_ID } from "./constants";
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN })

const baseId = BASE_ID;
const table = ASSIGNMENTS_TABLE.tableName;
// make sure this view is filtered for wallets = not null
const view = ASSIGNMENTS_TABLE.views.wallet;
const emailColumn = ASSIGNMENTS_TABLE.columns.email
const applicantRecordIdColumn = ASSIGNMENTS_TABLE.columns.applicantRecordId;
const base = airtable.base(baseId);
const tableRecordIdColumn = ASSIGNMENTS_TABLE.columns.idColumn;

export const retrieveDecisionRecord = async ({searcherEmail, applicationId}: {searcherEmail: string, applicationId: string}): Promise<string[]> => {
  const applicants: string[] = [];
  try {
    await base(table).select({
      view,
      filterByFormula: `AND(
        ({${emailColumn}} = '${searcherEmail}'),
        ({${applicantRecordIdColumn}} = '${applicationId}')
      )`
    }).eachPage((records, next) => {
      records.forEach(record => applicants.push(record.get(tableRecordIdColumn) as string));
      next();
    })
  } catch(error) {
    console.error(error);
    throw error;
  }
  return applicants.flat();
}