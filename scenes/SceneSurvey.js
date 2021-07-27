import * as React from "react";
import * as Strings from "~/common/strings";
import * as Styles from "~/common/styles";
import * as Actions from "~/common/actions";
import * as Events from "~/common/custom-events";

import WebsitePrototypeWrapper from "~/components/core/WebsitePrototypeWrapper";

import { SignUpPopover } from "~/components/core/Auth/components";
import { H5, P3 } from "~/components/system/components/Typography";
import { css } from "@emotion/react";
import { ButtonPrimary } from "~/components/system/components/Buttons";
import { useForm } from "~/common/hooks";
import { Input } from "~/components/system";

const TOOLS_OPTIONS = ["Dropbox", "Google Drive", "Are.na", "Pinterest", "Browser Bookmarks"];
const SLATE_USECASES = [
  "Personal Storage",
  "Public File Sharing",
  "Moodboarding",
  "Archiving",
  "Bookmarking",
];
const REFERRAL = ["Twitter", "IPFS/Filecoin Community", "From a friend"];

// NOTE(amine): form styles
const STYLES_FORM_WRAPPER = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

// NOTE(amine): input styles
const STYLES_SURVEY_INPUT = (theme) => css`
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 45px;
  border-radius: 8px;
  box-shadow: 0 0 0 1px ${theme.system.gray};
  background-color: transparent;
  & > input::placeholder {
    ${Styles.H5};
    color: ${theme.semantic.textGray};
    text-align: center;
    opacity: 1;
  }
`;

// NOTE(amine): checkbox styles
const STYLES_CHECKBOX_WRAPPER = (theme) => css`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 45px;
  border-radius: 8px;
  border: 1px solid ${theme.system.gray};
  background-color: transparent;
  transition: all 0.3s;
`;

const STYLES_CHECKBOX_SELECTED = (theme) => css`
  border: 1px solid ${theme.system.blue};
  background-color: ${theme.system.grayLight4};
`;

const STYLES_CHECKBOX_INPUT = css`
  position: absolute;
  z-index: 1;
  opacity: 0;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  ${Styles.HOVERABLE};
`;

export default function SceneSurvey() {
  const [step, setStep] = React.useState(1);
  const surveyResults = React.useRef({});

  if (step === 1) {
    return (
      <ToolsForm
        onSubmit={(value) => {
          surveyResults.current.tools = value.join(",");
          setStep(2);
        }}
      />
    );
  }

  if (step === 2) {
    return (
      <UsecasesForm
        onSubmit={(value) => {
          surveyResults.current.useCases = value.join(",");
          setStep(3);
        }}
      />
    );
  }

  return (
    <ReferralForm
      onSubmit={async (value) => {
        surveyResults.current.referrals = value.join(",");
        // call endpoint
        const response = await Actions.createSurvey(surveyResults.current);
        if (Events.hasError(response)) {
          return;
        }
      }}
    />
  );
}

const Checkbox = ({ touched, value, style, isSelected, ...props }) => {
  return (
    <div style={style} css={[STYLES_CHECKBOX_WRAPPER, isSelected && STYLES_CHECKBOX_SELECTED]}>
      <H5 color="textBlack">{value}</H5>
      <input value={value} css={STYLES_CHECKBOX_INPUT} type="checkbox" {...props} />
    </div>
  );
};

const ToolsForm = ({ onSubmit }) => {
  const { getFieldProps, getFormProps, values } = useForm({
    initialValues: { tools: [], other: "" },
    onSubmit: ({ tools, other }) => {
      const value = [...tools];
      if (!Strings.isEmpty(other)) {
        value.push(other);
      }
      onSubmit(value);
    },
  });

  const isCheckBoxSelected = (fieldValue) => values.tools.some((item) => item === fieldValue);

  return (
    <div>
      <SignUpPopover title="What do you currently use for saving things on the web?">
        <form css={STYLES_FORM_WRAPPER} {...getFormProps()}>
          <H5
            style={{ marginTop: 24 }}
            css={(theme) => css({ color: theme.semantic.textGrayDark })}
          >
            Select all that apply
          </H5>
          {TOOLS_OPTIONS.map((item, i) => (
            <Checkbox
              key={i}
              style={{ marginTop: 12 }}
              type="checkbox"
              isSelected={isCheckBoxSelected(item)}
              {...getFieldProps("tools", { type: "checkbox" })}
              value={item}
            />
          ))}
          <Input
            inputCss={STYLES_SURVEY_INPUT}
            style={{ marginTop: 12 }}
            placeholder="Others"
            type="text"
            {...getFieldProps("other")}
          />
          <ButtonPrimary type="submit" style={{ marginTop: 24 }}>
            Next
          </ButtonPrimary>
          <P3 style={{ marginTop: 12 }} color="textBlack">
            1/3
          </P3>
        </form>
      </SignUpPopover>
    </div>
  );
};

const UsecasesForm = ({ onSubmit }) => {
  const { getFieldProps, getFormProps, values } = useForm({
    initialValues: { tools: [], other: "" },
    onSubmit: ({ tools, other }) => {
      const value = [...tools];
      if (!Strings.isEmpty(other)) {
        value.push(other);
      }
      onSubmit(value);
    },
  });

  const isCheckBoxSelected = (fieldValue) => values.tools.some((item) => item === fieldValue);

  return (
    <div>
      <SignUpPopover title="What are you interested in using Slate for?">
        <form css={STYLES_FORM_WRAPPER} {...getFormProps()}>
          <H5 style={{ marginTop: 24 }} color="textGrayDark">
            Select all that apply
          </H5>
          {SLATE_USECASES.map((item, i) => (
            <Checkbox
              key={i}
              style={{ marginTop: 12 }}
              type="checkbox"
              isSelected={isCheckBoxSelected(item)}
              {...getFieldProps("tools", { type: "checkbox" })}
              value={item}
            />
          ))}
          <Input
            inputCss={STYLES_SURVEY_INPUT}
            style={{ marginTop: 12 }}
            placeholder="Others"
            type="text"
            {...getFieldProps("other")}
          />
          <ButtonPrimary type="submit" style={{ marginTop: 24 }}>
            Next
          </ButtonPrimary>
          <P3 style={{ marginTop: 12 }} color="textBlack">
            2/3
          </P3>
        </form>
      </SignUpPopover>
    </div>
  );
};

const ReferralForm = ({ onSubmit }) => {
  const { getFieldProps, getFormProps, isSubmitting, values } = useForm({
    initialValues: { referrals: [], other: "" },
    onSubmit: async ({ referrals, other }) => {
      const value = [...referrals];
      if (!Strings.isEmpty(other)) {
        value.push(other);
      }
      await onSubmit(value);
    },
  });

  const isCheckBoxSelected = (fieldValue) => values.referrals.some((item) => item === fieldValue);

  return (
    <div>
      <SignUpPopover title="How did you find out about Slate?">
        <form css={STYLES_FORM_WRAPPER} {...getFormProps()}>
          <H5 style={{ marginTop: 24 }} color="textGrayDark">
            Select all that apply
          </H5>
          {REFERRAL.map((item, i) => (
            <Checkbox
              key={i}
              style={{ marginTop: 12 }}
              type="checkbox"
              isSelected={isCheckBoxSelected(item)}
              {...getFieldProps("referrals", { type: "checkbox" })}
              value={item}
            />
          ))}
          <Input
            inputCss={STYLES_SURVEY_INPUT}
            style={{ marginTop: 12 }}
            placeholder="Others"
            type="text"
            {...getFieldProps("other")}
          />
          <ButtonPrimary type="submit" loading={isSubmitting} style={{ marginTop: 24 }}>
            Next
          </ButtonPrimary>
          <P3 style={{ marginTop: 12 }} color="textBlack">
            3/3
          </P3>
        </form>
      </SignUpPopover>
    </div>
  );
};
