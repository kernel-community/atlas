// fetch all records from https://airtable.com/appYaT73RTzmoKIrq/tblWJoEbUvBNuI7za/viwyOE4wFq6es9a7B?blocks=hide
// check if currently connected acc is inthe list

import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import { type Applicant } from "src/@types";


export const useSearcherApplications = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const {refetch: refetchSearcherApplications} = useQuery(
    [`user-searcher-applications`],
    async () => {
      await axios.post<{ ok: boolean, data: {
        applicants: Applicant[]
      } }>(`/api/searcherApplications`, {
        headers: { "Content-Type": "application/json" },
      })
      .then((v) => {
        setApplicants(v.data.data.applicants);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
    },
    {
      enabled: false
    }
  );

  return { applicants, loading, error, refetchSearcherApplications }
}

