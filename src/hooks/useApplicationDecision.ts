import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
export type Decision = {
  value: "YES" | "NO" | "UNDECIDED" | "WITHDRAW",
  label: string;
};

export const DECISIONS = {
  "yes": {
    value: "YES" as Decision["value"],
    label: "Accept Application"
  },
  "no": {
    value: "NO" as Decision["value"],
    label: "Reject Application"
  },
  "undecided": {
    value: "UNDECIDED" as Decision["value"],
    label: "Remove decision?"
  },
  "withdraw": {
    value: "WITHDRAW" as Decision["value"],
    label: "I know the candidate"
  }
}

export const DecisionToString = {
  "YES": "Yes",
  "NO": undefined,
  "UNDECIDED": undefined,
  "WITHDRAW": "Withdrew Decision (I know the person)"
}

export const useApplicationDecision = ({ applicationId }: { applicationId: string | undefined }) => {
  const [applicationDecisionId, setApplicationDecisionId] = useState<string[]>();

  const{ isError, isLoading: loading, refetch: fetchDecision } = useQuery(
    [`decision-${applicationId}`],
    async () => {
      const res = await axios.post<{ ok: boolean, data: {decisionRecord: string[]} }>(`/api/getApplicationDecision`, { applicationId }, {
          headers: { "Content-Type": "application/json" },
        })
        setApplicationDecisionId(res.data.data.decisionRecord);
                return res;
      },
    {
      enabled: !!(applicationId),
      notifyOnChangeProps: ["data"]
    }
  );

  const [isUpdatingDecision, setIsUpdatingDecision] = useState<boolean>(false);
  const [isUpdateDecisionError, setIsUpdateDecisionError] = useState<boolean>(false);

  const updateDecision = async (decision: Decision["value"]) => {
    setIsUpdatingDecision(true);
    setIsUpdateDecisionError(false);
    try {
      const res = await axios.post<{ ok: boolean, data: {response: string[]} }>(`/api/updateApplicationDecision`, { applicationId, decision }, {
        headers: { "Content-Type": "application/json" },
      })
      setIsUpdatingDecision(false);
      return res;
    } catch (err) {
      setIsUpdatingDecision(false);
      setIsUpdateDecisionError(true);
      console.log(err);
      return;
    }
  }

  return {
    applicationDecisionId,
    loading,
    isError,
    updateDecision,
    isUpdateDecisionError,
    isUpdatingDecision,
    fetchDecision
  }
}

