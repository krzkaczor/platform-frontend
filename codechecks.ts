import { buildSize } from "codecheck-build-size";
import { codeChecks } from "codechecks";

// disabling faulty rules
// tslint:disable:no-useless-cast restrict-plus-operands
export async function main(): Promise<void> {
  await checkPackageLock();
  await checkSmartContractGitModules();

  await buildSize({
    files: [
      {
        path: "dist/*.vendors*.js",
        maxSize: "1000kB",
      },
      {
        path: "dist/*.main*.js",
        maxSize: "350kB",
      },
      {
        path: "dist/*.main*.css",
        maxSize: "60kB",
      },
      {
        path: "dist/*.vendors*.css",
        maxSize: "20kB",
      },
    ],
  });
}

async function checkPackageLock(): Promise<void> {
  if (!codeChecks.isPr()) {
    return;
  }
  const hasPackageLock = codeChecks.context.pr!.files.added.includes("package-lock.json");

  if (hasPackageLock) {
    await codeChecks.failure({
      name: "Package lock detected",
      shortDescription: "Do not use npm, use yarn instead.",
    });
  }
}

async function checkSmartContractGitModules(): Promise<void> {
  if (!codeChecks.isPr()) {
    return;
  }
  const updatesContracts = (
    codeChecks.context.pr!.meta.body + codeChecks.context.pr!.meta.title
  ).includes("#with-contracts");

  const hasContractSubmodule = codeChecks.context.pr!.files.changed.some(p =>
    p.includes("platform-contracts-artifacts/"),
  );

  if (hasContractSubmodule && !updatesContracts) {
    await codeChecks.failure({
      name: "Smart Contracts Submodule",
      shortDescription:
        "Detected platform-contracts-artifacts in your PR, most likely this is by mistake please push alone",
    });
  }
}
