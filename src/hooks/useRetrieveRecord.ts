import { type FieldSet, type Record } from "airtable";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
type Application = Record<FieldSet>;
export const useRetrieveRecord = ({id}: {id: string | undefined}) => {
  const [application, setApplication] = useState<Application>();

  const{ isError, isLoading: loading, refetch: refetchRetrieveRecord } = useQuery(
    [`application-${id}`],
    async () => {
      const res = await axios.post<{ ok: boolean, data: {application: Record<FieldSet>} }>(`/api/getRecord`, { id }, {
        headers: { "Content-Type": "application/json" },
      })
      setApplication(res.data.data.application);
      return res;
    },
    {
      enabled: !!(id),
      notifyOnChangeProps: ["data"]
    }
  );
  return { application, loading, isError, refetchRetrieveRecord }
}

