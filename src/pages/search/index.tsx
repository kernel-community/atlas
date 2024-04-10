/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
/* eslint-disable @typescript-eslint/no-misused-promises */
import Main from "src/layout/Main";
import { type ReactNode, useEffect, useState } from "react";
import { useSearcherApplications } from "src/hooks/useSearcherApplications";
import { useRetrieveRecord } from "src/hooks/useRetrieveRecord";
import RetroButton from "src/components/RetroButton";
import { type Decision, useApplicationDecision, DECISIONS, DecisionToString } from "src/hooks/useApplicationDecision";
import { EXPRESSIONS_TABLE } from "src/server/airtable/constants";
import SmallButton from "src/components/SmallButton";
import { useUser } from "src/context/UserContext";

const SubmitDecisionSection = ({
  submitDecision,
  isSubmitting,
  decision
}: {
  submitDecision: (decision: Decision["value"]) => Promise<unknown>;
  decision?: string;
  isSubmitting: boolean;
}) => {
  const decisionString = DecisionToString[decision as Decision["value"]]
  const [selectedDecision, setSelectedDecision] = useState<Decision["value"]>("YES");
  return (
    <div className="p-3 mx-auto my-4 border-2 border-base-content rounded-md w-1/2 h-min-content">
        {/* IF decision hasn't been made / undecided */}
        {
          !decisionString &&
          <div className="form flex flex-col gap-3">
            <div className="flex flex-col gap-3 items-center">
            <div className="form-control">
              <label className="label cursor-pointer gap-3" onClick={() => setSelectedDecision(DECISIONS.yes.value)}>
                <input type="checkbox" name="checkbox" className="checkbox checkbox-primary h-12 w-12" checked={selectedDecision === DECISIONS.yes.value} />
                {/* <span className="label-text text-5xl">{DECISIONS.yes.label}</span> */}
              </label>
            </div>
            <RetroButton
              type="submit"
              onClick={() => submitDecision(selectedDecision)}
              isLoading={selectedDecision === DECISIONS.yes.value && isSubmitting}
            >
              Submit
            </RetroButton>
            </div>
            <div className="form-control mt-4 flex flex-row justify-end items-center">
              <label className="label cursor-pointer  gap-3" onClick={() => setSelectedDecision(DECISIONS.withdraw.value)}>
                <input type="checkbox" name="checkbox" className="checkbox checkbox-accent h-4 w-4" checked={selectedDecision===DECISIONS.withdraw.value} />
                <span className="label-text">{DECISIONS.withdraw.label}</span>
              </label>
              {
                selectedDecision===DECISIONS.withdraw.value &&
                <SmallButton className="btn-xs btn btn-primary" onClick={() => submitDecision(selectedDecision)} isLoading={isSubmitting}>
                  Submit
                </SmallButton>
              }
            </div>
          </div>
        }
        {/* IF decision has been made, mark as "undecided" */}
        {decisionString &&
          <div className="flex flex-col items-center gap-3">
            Your Decision: {decision}
            <SmallButton onClick={() => submitDecision(DECISIONS.undecided.value)} isLoading={isSubmitting}>
              {DECISIONS.undecided.label}
            </SmallButton>
          </div>
        }
    </div>
  )
}
const ApplicationColumns = EXPRESSIONS_TABLE.columns.application;
const AllApplicationColumns = Object.keys(ApplicationColumns);
type ApplicationQuestion = (keyof typeof ApplicationColumns);

export const Footer = ({
  prev, next
}: {prev: () => void, next:() => void}) => {
  return (
    <div className="flex flex-row gap-3 my-6 justify-between px-6">
      <RetroButton type="button" onClick={() => prev()}>PREV</RetroButton>
      <div className="hidden md:block">
      </div>
      <RetroButton type="button" onClick={() => next()}>NEXT</RetroButton>
    </div>
  )
}


export default function Home() {
  const [applicantIndex, setApplicantIndex] = useState<number>(0);
  const { applicants, refetchSearcherApplications } = useSearcherApplications();

  const currentApplicationId = applicants[applicantIndex]?.id;
  const {fetchedUser: user} = useUser();

  const { applicationDecisionId, updateDecision, isUpdatingDecision, fetchDecision } = useApplicationDecision({ applicationId: currentApplicationId, email: user.email });
  const currentApplicationDecisionId = applicationDecisionId ? applicationDecisionId[0]: undefined;
  const { application } = useRetrieveRecord({ id: currentApplicationId });
  const { application: decisionRecord, refetchRetrieveRecord } = useRetrieveRecord({ id: currentApplicationDecisionId });
  const applicationDecision = decisionRecord?.fields.DECISION as Decision["value"];
  const totalApplicants = applicants.length - 1;

  const [touched, setTouched] = useState<boolean>(false);
  const {isSearcher} = user;
  const submitDecision = async (decision: Decision["value"]) => {
    await updateDecision(decision);
    await refetchSearcherApplications();
    await fetchDecision();
    await refetchRetrieveRecord();
  }
  useEffect(() => {
    // do nothing if touched = false
    if (!touched) return;
    // do nothing if touched and application already decided for
    if (touched && applicationDecision !== undefined) return;
    // if touched = true
    async function markUndecided() {
      // update decision to undecided
      await submitDecision(DECISIONS.undecided.value)
    }
    void markUndecided();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [touched]);


  const nextApplicantIndex = () => setApplicantIndex((curr) =>  {
    if (curr === totalApplicants) {
      return 0;
    }
    return ++curr;
  })

  const prevApplicantIndex = () => setApplicantIndex((curr) =>  {
    if (curr === 0) {
      return totalApplicants;
    }
    return --curr;
  })


  const [expandQuestion, setExpandQuestion] = useState<ApplicationQuestion | undefined>("name");

  const toggleExpandQuestion = (question: ApplicationQuestion) => {
    setExpandQuestion((ques) => {
      if (ques === question) {
        return undefined;
      }
      return question;
    })
    setTouched(true);
  }

  const [expandAll, setExpandAll] = useState<boolean>(true);
  const toggleExpandAllQuestions = () => {
    setExpandAll((curr) => !curr);
    setTouched(true);
  }

  const getApplicationField = (field: ApplicationQuestion) => {
    return application?.fields[ApplicationColumns[field].default]
  }

  const parseForHyperlinks = (txt: string | undefined): ReactNode => {
    if (!txt) return <div></div>;
    const URL_REGEX = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    return txt
    .split(" ")
    .map((part, key) =>
      URL_REGEX.test(part) ? <a href={part.startsWith("https") ? part : `https://${part}`} key={key} className="underline" target="_blank">{part} </a> : part + " "
    );
  }

  if (!isSearcher) {
    return (
      <Main>
        <div className="text-4xl font-playfair p-6">
          You are not a Searcher
        </div>
      </Main>
    )
  }
  if (user?.isSignedIn && applicants.length < 1) {
    return (
      <Main>
        <div className="text-4xl font-playfair p-6">
          You do not have any applications assigned yet.
        </div>
      </Main>
    )
  }

  return (
    <Main>
      <div className="grid md:grid-cols-3 grid-cols-1 h-full">
        <div className="bg-base-200 overflow-y-auto md:block hidden">
        {/* list of all applicants */}
        <div>
          {applicants.map((applicant, key) => {
            return (
              <div key={key}
                className={
                  `
                    py-6
                    px-2
                    border-primary-content
                    cursor-pointer
                    rounded-md
                    m-2
                    hover:bg-neutral
                    hover:text-neutral-content
                    ${applicantIndex === key ? `bg-neutral text-neutral-content` : ``}
                  `
                }
                onClick={() => setApplicantIndex(key)}
              >
                <div>
                  {applicant.name}
                </div>
                {DecisionToString[applicant.searcherDecision as Decision["value"]] && <div>
                  Your Decision: {DecisionToString[applicant.searcherDecision as Decision["value"]]}
                </div>}
                <div>
                </div>
              </div>
            )
          })}
        </div>
        </div>
        <div className="bg-base-100 col-span-2 overflow-y-auto">
          {
            AllApplicationColumns.map((question, key) => {
              if (!getApplicationField(question as ApplicationQuestion)) return null;
              if (question as ApplicationQuestion === "name") {
                return (
                  <div key={key} className="p-4 flex flex-row justify-between items-center">
                    <div className="text-[3em] font-playfair">
                      {getApplicationField(question as  ApplicationQuestion)?.toString()}
                    </div>
                    <div className="flex flex-row gap-3 items-center">
                      <p className="font-medium">Expand All</p>
                      <input type="checkbox" className="toggle" checked={expandAll} onChange={() => toggleExpandAllQuestions()} />
                    </div>
                  </div>
                )
              }
              if (question as ApplicationQuestion === "uploads") {
                const files = getApplicationField(question as ApplicationQuestion) as unknown as Array<{
                  url: string,
                  filename: string,
                  height: number,
                  size: number,
                  thumbnails: {
                    full: {
                      url: string,
                      height: number,
                      width: string
                    },
                    large: {
                      url: string,
                      height: number,
                      width: string
                    },
                    small: {
                      url: string,
                      height: number,
                      width: string
                    }
                  },
                  type: string,
                  width: number
                }>;
                return (
                  <div className={`
                    collapse collapse-plus rounded-none border-b-2 border-primary-content
                    ${expandAll ? `collapse-open` : ``}
                  `} key={key}>
                    <input type="radio" name="my-accordion-2" checked={expandQuestion === question} onClick={() => toggleExpandQuestion(question as ApplicationQuestion)} />
                    <div className="collapse-title text-xl font-miriam">
                      {ApplicationColumns[question as ApplicationQuestion].label}
                    </div>
                    <div className="collapse-content min-w-full">
                      <p className="min-w-full overflow-x-auto">
                        <div className="flex flex-row gap-6">
                          {
                            files.map((f, k) => {
                              return (
                                <a className="cursor-pointer hover:border-2 hover:border-black" href={f.url} target="_blank" key={k}>
                                  <img src={f.thumbnails.small.url} width={f.thumbnails.small.width} height={f.thumbnails.small.height} alt="thumbnail for uploaded file" />
                                </a>
                              )
                            })
                          }
                        </div>
                      </p>
                    </div>
                  </div>
                )
              }
              return (
                <div className={`
                    collapse collapse-plus rounded-none border-b-2 border-primary-content
                    ${expandAll ? `collapse-open` : ``}
                  `} key={key}>
                  <input type="radio" name="my-accordion-2" checked={expandQuestion === question} onClick={() => toggleExpandQuestion(question as ApplicationQuestion)} />
                  <div className="collapse-title text-xl font-miriam">
                    {ApplicationColumns[question as ApplicationQuestion].label}
                  </div>
                  <div className="collapse-content min-w-full">
                    <p className="min-w-full overflow-x-auto">
                      {parseForHyperlinks(getApplicationField(question as ApplicationQuestion)?.toString())}
                    </p>
                  </div>
              </div>
              )
            })
          }
          <SubmitDecisionSection
            submitDecision={submitDecision}
            decision={applicationDecision}
            isSubmitting={isUpdatingDecision}
          />
        </div>
        <div className="md:col-span-3 shadow-xl border-2 border-primary-content">
          <Footer next={nextApplicantIndex} prev={prevApplicantIndex} />
        </div>
      </div>
    </Main>
  );
}
