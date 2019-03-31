import { codechecks } from "@codechecks/client";
import { join } from "path";

// tslint:disable-next-line
const exec = require("await-exec") as (cmd: string, opt: any) => Promise<void>;

// disabling faulty rules
// tslint:disable:no-useless-cast restrict-plus-operands
export async function main(): Promise<void> {
  await checkPackageLock();
  await checkSmartContractGitModules();

  await visReg();
  await deploy(join(__dirname, "dist"));
}

async function visReg(): Promise<void> {
  const execOptions = { timeout: 300000, cwd: process.cwd(), log: true };
  await codechecks.saveCollection("storybook-vis-reg", join(__dirname, "__screenshots__"));

  if (codechecks.isPr()) {
    await codechecks.getCollection("storybook-vis-reg", join(__dirname, ".reg/expected"));
    await exec("./node_modules/.bin/reg-suit compare", execOptions);

    await codechecks.saveCollection("storybook-vis-reg-report", join(__dirname, ".reg"));

    const reportData = require("./.reg/out.json");
    await codechecks.success({
      name: "Visual regression for Storybook",
      shortDescription: `Changed: ${reportData.failedItems.length}, New: ${
        reportData.newItems.length
      }, Deleted: ${reportData.deletedItems.length}`,
      detailsUrl: codechecks.getArtifactLink("/storybook-vis-reg-report/index.html"),
    });
  }
}

async function deploy(path: string): Promise<void> {
  if (codechecks.isPr()) {
    await codechecks.saveCollection("build", path);
    await codechecks.success({
      name: "Commit deployment",
      shortDescription: "Deployment for commit ready.",
      detailsUrl: codechecks.getPageLink("build", "index.html"),
    });
  }
}

async function checkPackageLock(): Promise<void> {
  if (!codechecks.isPr()) {
    return;
  }
  const hasPackageLock = codechecks.context.pr!.files.added.includes("package-lock.json");

  if (hasPackageLock) {
    await codechecks.failure({
      name: "Package lock detected",
      shortDescription: "Do not use npm, use yarn instead.",
    });
  }
}

async function checkSmartContractGitModules(): Promise<void> {
  if (!codechecks.isPr()) {
    return;
  }
  const updatesContracts = (
    codechecks.context.pr!.meta.body + codechecks.context.pr!.meta.title
  ).includes("#with-contracts");

  const hasContractSubmodule = codechecks.context.pr!.files.changed.some(p =>
    p.includes("platform-contracts-artifacts/"),
  );

  if (hasContractSubmodule && !updatesContracts) {
    await codechecks.failure({
      name: "Smart Contracts Submodule",
      shortDescription:
        "Detected platform-contracts-artifacts in your PR, most likely this is by mistake please push alone",
    });
  }
}
