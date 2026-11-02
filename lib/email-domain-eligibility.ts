import { EmailDatasetInitializationError, type EmailEligibilityOutcome } from "./email-eligibility.ts";

type DomainDatasets = {
  isDisposableEmail(email: string): boolean;
};

/**
 * Shares one initialization promise across concurrent requests. Dataset imports are
 * server-only dynamic imports, so the lists are emitted with the Node route and are
 * never included in the browser bundle. Injecting the raw exports avoids runtime
 * filesystem paths that can be lost in serverless function packaging.
 */
export function createEmailDomainEligibilityChecker(
  loadDatasets: () => Promise<DomainDatasets>,
) {
  let datasetsPromise: Promise<DomainDatasets> | undefined;

  return async function checkEmailEligibility(email: string): Promise<EmailEligibilityOutcome> {
    datasetsPromise ??= loadDatasets().catch(() => {
      throw new EmailDatasetInitializationError();
    });

    let datasets: DomainDatasets;
    try {
      datasets = await datasetsPromise;
    } catch {
      throw new EmailDatasetInitializationError();
    }

    // Personal providers (Gmail, Yahoo, Outlook…) are welcome; only temporary inboxes are refused.
    return datasets.isDisposableEmail(email) ? "disposable" : "eligible";
  };
}

async function loadPackagedDatasets(): Promise<DomainDatasets> {
  const [disposableApi, disposableDomainList] = await Promise.all([
    import("@visulima/disposable-email-domains"),
    import("@visulima/disposable-email-domains/domains"),
  ]);

  disposableApi.setDomains(disposableDomainList.default);

  if (!disposableApi.isListLoaded()) {
    throw new Error("A domain dataset was not registered.");
  }

  return { isDisposableEmail: disposableApi.isDisposableEmail };
}

export const checkEmailEligibility = createEmailDomainEligibilityChecker(loadPackagedDatasets);
