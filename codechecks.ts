import { buildSize } from "codecheck-build-size";
import { codeChecks } from "codechecks";
import { join } from "path";

// tslint:disable-next-line
const exec = require("await-exec") as (cmd: string, opt: any) => Promise<void>;

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

  await visReg();

  await deploy(join(__dirname, "dist"));
}

async function visReg(): Promise<void> {
  const execOptions = { timeout: 300000, cwd: process.cwd(), log: true };
  await codeChecks.saveCollection("storybook-vis-reg", join(__dirname, "__screenshots__"));

  if (codeChecks.isPr()) {
    await codeChecks.getCollection("storybook-vis-reg", join(__dirname, ".reg/expected"));
    await exec("./node_modules/.bin/reg-suit compare", execOptions);

    await codeChecks.saveCollection("storybook-vis-reg-report", join(__dirname, ".reg"));

    const reportData = require("./.reg/out.json");
    await codeChecks.success({
      name: "Visual regression for Storybook",
      shortDescription: `Changed: ${reportData.failedItems.length}, New: ${
        reportData.newItems.length
      }, Deleted: ${reportData.deletedItems.length}`,
      detailsUrl: codeChecks.getArtifactLink("/storybook-vis-reg-report/index.html"),
    });
  }
}

async function deploy(path: string): Promise<void> {
  if (codeChecks.isPr()) {
    await codeChecks.saveCollection("build", path);
    await codeChecks.success({
      name: "Commit deployment",
      shortDescription: "Deployment for commit ready.",
      detailsUrl: codeChecks.getPageLink("/build/index.html", "index.html"),
    });
  }
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
