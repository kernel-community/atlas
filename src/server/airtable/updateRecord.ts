// given record id and column name and value
// update
import Airtable from "airtable";
import { BASE_ID } from "./constants";
const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN,
});
const baseId = BASE_ID;
const base = airtable.base(baseId);

export const updateRecord = async ({
  recordId,
  columnName,
  value,
  table,
}: {
  recordId: string;
  columnName: string;
  value: string | undefined;
  table: string;
}) => {
  let response;
  try {
    response = await base(table).update([
      {
        id: recordId,
        fields: {
          [columnName]: value,
        },
      },
    ]);
  } catch (err) {
    console.error(err);
    throw err;
  }

  return response;
};
