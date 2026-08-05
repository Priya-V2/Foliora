import { useCallback, useEffect, useRef, useState } from "react";
import resumeService from "@/services/resume.service";
import { useAppDispatch } from "@/store/hooks";
import { setParseError, setParseStatus, setResume } from "@/store/slices/resume.slice";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const PROCESSING_STAGES = [
  "Preparing Resume",
  "Extracting Information",
  "AI Processing",
  "Structuring Portfolio",
  "Saving Portfolio",
] as const;

const STAGE_INTERVAL_MS = 1800;

// There is no backend job queue or real-time channel behind POST
// /resume/parse - it's a single synchronous request. This hook advances the
// visible stage on a client-side timer while that request is in flight, and
// only ever reports "Completed" once the response actually comes back
// successfully. If the real request finishes before the timer reaches the
// last stage, the display holds on the last pre-completion stage until then.
export function useResumeParsing() {
  const dispatch = useAppDispatch();
  const [stageIndex, setStageIndex] = useState(0);
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing",
  );
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopStageTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startStageTimer = useCallback(() => {
    setStageIndex(0);
    timerRef.current = setInterval(() => {
      setStageIndex((current) =>
        current < PROCESSING_STAGES.length - 1 ? current + 1 : current,
      );
    }, STAGE_INTERVAL_MS);
  }, []);

  const run = useCallback(
    async (action: () => ReturnType<typeof resumeService.parseResume>) => {
      setStatus("processing");
      setError(null);
      dispatch(setParseStatus("processing"));
      dispatch(setParseError(null));
      startStageTimer();

      try {
        const resume = await action();
        stopStageTimer();
        setStageIndex(PROCESSING_STAGES.length - 1);
        setStatus("success");
        dispatch(setResume(resume));
        dispatch(setParseStatus("success"));
      } catch (err) {
        stopStageTimer();
        const message = getErrorMessage(
          err,
          "We could not process your resume. Please try again.",
        );
        setStatus("error");
        setError(message);
        dispatch(setParseStatus("error"));
        dispatch(setParseError(message));
      }
    },
    [dispatch, startStageTimer, stopStageTimer],
  );

  useEffect(() => {
    // Deferred via setTimeout so the initial setState calls inside run()
    // happen outside the effect's synchronous body (avoids cascading
    // renders on mount - see react-hooks/set-state-in-effect).
    const timeoutId = setTimeout(() => {
      void run(() => resumeService.parseResume());
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      stopStageTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retry = useCallback(() => {
    void run(() => resumeService.retryParse());
  }, [run]);

  return { stageIndex, status, error, retry };
}
