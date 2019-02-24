import { IBlKeyIndividual } from "../../../modules/eto-flow/interfaces/KeyIndividual";

export const selectActiveCarouselTab = (elements: any[]): number => {
  for (let element in elements) {
    const el = elements[parseInt(element, 10)];

    if (!el) {
      return 0;
    }

    if (el.members && el.members.length > 0 && el.members[0].name.length) {
      return parseInt(element, 10);
    }
  }

  return 0;
};

export const areThereIndividuals = (
  individuals: { members: IBlKeyIndividual[] } | undefined,
): individuals is { members: IBlKeyIndividual[] } => {
  return (
    !!individuals &&
    !!individuals.members &&
    !!individuals.members[0] &&
    // need to check whether name is not empty
    // due to the way key individuals form saved values in past
    !!individuals.members[0].name.length
  );
};
