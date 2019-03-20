import { codeChecks } from "codechecks";

export async function main(): Promise<void> {
  checkPackageLock();
  checkSmartContractGitModules();
}

function checkPackageLock() {
  if (!codeChecks.isPr()) {
    return;
  }
  const hasPackageLock = codeChecks.context.pr.files.added.includes("package-lock.json");

  if (hasPackageLock) {
    codeChecks.failure({
      name: "Package lock detected",
      shortDescription: "Do not use npm, use yarn instead.",
    });
  }
}

function checkSmartContractGitModules() {
  if (!codeChecks.isPr()) {
    return;
  }
  const updatesContracts = (
    codeChecks.context.pr.meta.body + codeChecks.context.pr.meta.title
  ).includes("#with-contracts");

  const hasContractSubmodule = codeChecks.context.pr.files.changed.some(p =>
    p.includes("platform-contracts-artifacts/"),
  );

  if (hasContractSubmodule && !updatesContracts) {
    codeChecks.failure({
      name: "Smart Contracts Submodule",
      shortDescription:
        "Detected platform-contracts-artifacts in your PR, most likely this is by mistake please push alone",
    });
  }
}
