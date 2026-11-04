import { EmailDatasetInitializationError, type EmailEligibilityOutcome } from "./email-eligibility.ts";

type DomainDatasets = {
  isDisposableEmail(email: string): boolean;
  isFreeEmail(email: string): boolean;
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

    // A temporary provider is the more specific policy outcome if lists overlap.
    if (datasets.isDisposableEmail(email)) return "disposable";
    if (datasets.isFreeEmail(email)) return "free";
    return "eligible";
  };
}

async function loadPackagedDatasets(): Promise<DomainDatasets> {
  const [disposableApi, disposableDomainList, freeApi, freeDomainList] = await Promise.all([
    import("@visulima/disposable-email-domains"),
    import("@visulima/disposable-email-domains/domains"),
    import("@visulima/free-email-domains"),
    import("@visulima/free-email-domains/domains", { with: { type: "json" } }),
  ]);

  disposableApi.setDomains(disposableDomainList.default);
  // The package ships JSON as its default export; its declaration uses export=.
  freeApi.setDomains((freeDomainList as unknown as { default: string[] }).default);

  if (!disposableApi.isListLoaded() || !freeApi.isListLoaded()) {
    throw new Error("A domain dataset was not registered.");
  }

  return {
    isDisposableEmail: disposableApi.isDisposableEmail,
    isFreeEmail: freeApi.isFreeEmail,
  };
}

export const checkEmailEligibility = createEmailDomainEligibilityChecker(loadPackagedDatasets);
