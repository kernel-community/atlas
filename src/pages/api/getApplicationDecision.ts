// update decsion on airtable
// given a searcher waller + application id -> get the "Decision" column
import { type NextApiRequest, type NextApiResponse } from "next";
import { pick } from "lodash";
import isInSearcherList from "src/server/utils/isInSearcherList";
import { retrieveDecisionRecord } from "src/server/airtable/retrieveDecisionRecord";


const getApplicationDecision = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, applicationId } = pick(req.body, ["email", "applicationId"]) as { email: string, applicationId: string };
  // fetch record id where searcher wallet = address and application id = applicationId
  const decisionRecord = await retrieveDecisionRecord({ searcherEmail: email, applicationId });
  res.status(200).json({ ok: true, data: { decisionRecord } });
}

export default getApplicationDecision;

