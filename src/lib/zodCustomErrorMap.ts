
import { TranslationValues, useTranslations } from "next-intl";
import { z } from "zod";

const hasInclusiveType = [
  "inclusive",
  "inclusive_one",
  "inclusive_other",
  "inclusive_with_path",
  "inclusive_with_path_one",
  "inclusive_with_path_other",
  "not_inclusive",
  "not_inclusive_one",
  "not_inclusive_other",
  "not_inclusive_with_path",
  "not_inclusive_with_path_one",
  "not_inclusive_with_path_other",
].reverse();

export const createCustomErrorMap = (): z.ZodErrorMap => {
  return (issue, ctx) => {
    let key: any = "";

    const { code } = issue;
    switch (code) {
      case "too_big":
      case "too_small":
        const inclusiveType = Object.keys(issue).find(
          (item) => hasInclusiveType.indexOf(item) !== -1
        );
        key = `${issue.code}.${issue.type}.${inclusiveType}`;
        break;
      case "invalid_string":
        key = `${issue.code}.${issue.validation}`;
        break;
      default:
        key = issue.code;
    }

    return {
      message: `${key}||${JSON.stringify(issue)}`,
    };
  };
};
